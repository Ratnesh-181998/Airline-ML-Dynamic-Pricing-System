"""
SageMaker Model Deployment Script

This script deploys a trained XGBoost model to a SageMaker real-time endpoint
with auto-scaling configuration.

Features:
- Deploy model to SageMaker endpoint
- Configure auto-scaling (2-10 instances)
- Set up CloudWatch alarms
- Test endpoint with sample predictions

Author: Ratnesh ML Engineering Team
Date: 2024-01-20
"""

import boto3
import sagemaker
from sagemaker.xgboost import XGBoostModel
from sagemaker.predictor import Predictor
from sagemaker.serializers import CSVSerializer
from sagemaker.deserializers import JSONDeserializer
import json
import time


class PricePredictionEndpoint:
    """Class to manage SageMaker endpoint deployment and inference"""
    
    def __init__(self, model_data_s3_uri, role_arn, endpoint_name='price-prediction-endpoint'):
        """
        Initialize endpoint manager
        
        Args:
            model_data_s3_uri: S3 URI of trained model artifacts (model.tar.gz)
            role_arn: IAM role ARN for SageMaker
            endpoint_name: Name for the endpoint
        """
        self.model_data_s3_uri = model_data_s3_uri
        self.role_arn = role_arn
        self.endpoint_name = endpoint_name
        self.sagemaker_session = sagemaker.Session()
        self.region = self.sagemaker_session.boto_region_name
        
        # Boto3 clients
        self.sagemaker_client = boto3.client('sagemaker')
        self.autoscaling_client = boto3.client('application-autoscaling')
        self.cloudwatch_client = boto3.client('cloudwatch')
    
    def deploy_endpoint(self, instance_type='ml.m5.large', initial_instance_count=2):
        """
        Deploy model to SageMaker endpoint
        
        Args:
            instance_type: EC2 instance type for endpoint
            initial_instance_count: Initial number of instances
        
        Returns:
            Predictor object for making predictions
        """
        print(f"Deploying model to endpoint: {self.endpoint_name}")
        
        # Get XGBoost container image
        container = sagemaker.image_uris.retrieve(
            framework='xgboost',
            region=self.region,
            version='1.5-1'
        )
        
        # Create XGBoost model
        xgb_model = XGBoostModel(
            model_data=self.model_data_s3_uri,
            role=self.role_arn,
            image_uri=container,
            framework_version='1.5-1',
            sagemaker_session=self.sagemaker_session
        )
        
        # Deploy endpoint
        predictor = xgb_model.deploy(
            initial_instance_count=initial_instance_count,
            instance_type=instance_type,
            endpoint_name=self.endpoint_name,
            serializer=CSVSerializer(),
            deserializer=JSONDeserializer()
        )
        
        print(f"Endpoint deployed successfully: {self.endpoint_name}")
        return predictor
    
    def configure_autoscaling(self, min_capacity=2, max_capacity=10, target_value=70.0):
        """
        Configure auto-scaling for the endpoint
        
        Args:
            min_capacity: Minimum number of instances
            max_capacity: Maximum number of instances
            target_value: Target metric value (invocations per instance)
        """
        print("Configuring auto-scaling...")
        
        # Resource ID for the endpoint variant
        resource_id = f'endpoint/{self.endpoint_name}/variant/AllTraffic'
        
        # Register scalable target
        response = self.autoscaling_client.register_scalable_target(
            ServiceNamespace='sagemaker',
            ResourceId=resource_id,
            ScalableDimension='sagemaker:variant:DesiredInstanceCount',
            MinCapacity=min_capacity,
            MaxCapacity=max_capacity
        )
        
        print(f"Registered scalable target: {response}")
        
        # Define scaling policy
        response = self.autoscaling_client.put_scaling_policy(
            PolicyName=f'{self.endpoint_name}-scaling-policy',
            ServiceNamespace='sagemaker',
            ResourceId=resource_id,
            ScalableDimension='sagemaker:variant:DesiredInstanceCount',
            PolicyType='TargetTrackingScaling',
            TargetTrackingScalingPolicyConfiguration={
                'TargetValue': target_value,
                'PredefinedMetricSpecification': {
                    'PredefinedMetricType': 'SageMakerVariantInvocationsPerInstance'
                },
                'ScaleInCooldown': 300,  # 5 minutes
                'ScaleOutCooldown': 60   # 1 minute
            }
        )
        
        print(f"Auto-scaling policy created: {response}")
    
    def create_cloudwatch_alarms(self):
        """Create CloudWatch alarms for endpoint monitoring"""
        print("Creating CloudWatch alarms...")
        
        # Alarm for high latency
        self.cloudwatch_client.put_metric_alarm(
            AlarmName=f'{self.endpoint_name}-high-latency',
            ComparisonOperator='GreaterThanThreshold',
            EvaluationPeriods=2,
            MetricName='ModelLatency',
            Namespace='AWS/SageMaker',
            Period=60,
            Statistic='Average',
            Threshold=200.0,  # 200ms
            ActionsEnabled=True,
            AlarmDescription='Alert when endpoint latency exceeds 200ms',
            Dimensions=[
                {
                    'Name': 'EndpointName',
                    'Value': self.endpoint_name
                },
                {
                    'Name': 'VariantName',
                    'Value': 'AllTraffic'
                }
            ]
        )
        
        # Alarm for high error rate
        self.cloudwatch_client.put_metric_alarm(
            AlarmName=f'{self.endpoint_name}-high-errors',
            ComparisonOperator='GreaterThanThreshold',
            EvaluationPeriods=1,
            MetricName='ModelInvocation4XXErrors',
            Namespace='AWS/SageMaker',
            Period=60,
            Statistic='Sum',
            Threshold=10.0,
            ActionsEnabled=True,
            AlarmDescription='Alert when endpoint has more than 10 4XX errors',
            Dimensions=[
                {
                    'Name': 'EndpointName',
                    'Value': self.endpoint_name
                },
                {
                    'Name': 'VariantName',
                    'Value': 'AllTraffic'
                }
            ]
        )
        
        print("CloudWatch alarms created successfully!")
    
    def predict(self, features):
        """
        Make prediction using the endpoint
        
        Args:
            features: List or array of feature values
        
        Returns:
            Predicted price
        """
        predictor = Predictor(
            endpoint_name=self.endpoint_name,
            sagemaker_session=self.sagemaker_session,
            serializer=CSVSerializer(),
            deserializer=JSONDeserializer()
        )
        
        # Make prediction
        result = predictor.predict(features)
        return result
    
    def delete_endpoint(self):
        """Delete the endpoint"""
        print(f"Deleting endpoint: {self.endpoint_name}")
        self.sagemaker_client.delete_endpoint(EndpointName=self.endpoint_name)
        print("Endpoint deleted successfully!")


def main():
    """Main deployment function"""
    
    # Configuration
    MODEL_DATA_S3_URI = 's3://airline-data-lake/models/price_prediction/v1/model.tar.gz'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/SageMakerRole'
    ENDPOINT_NAME = 'price-prediction-endpoint'
    
    # Initialize endpoint manager
    endpoint_manager = PricePredictionEndpoint(
        model_data_s3_uri=MODEL_DATA_S3_URI,
        role_arn=ROLE_ARN,
        endpoint_name=ENDPOINT_NAME
    )
    
    # Deploy endpoint
    predictor = endpoint_manager.deploy_endpoint(
        instance_type='ml.m5.large',
        initial_instance_count=2
    )
    
    # Configure auto-scaling
    endpoint_manager.configure_autoscaling(
        min_capacity=2,
        max_capacity=10,
        target_value=70.0
    )
    
    # Create CloudWatch alarms
    endpoint_manager.create_cloudwatch_alarms()
    
    # Test endpoint with sample prediction
    print("\nTesting endpoint with sample data...")
    
    # Sample features (should match training data format)
    sample_features = [
        [30, 1, 1500, 320.0, 15.5, 0, 1, 0]  # Example feature values
    ]
    
    prediction = endpoint_manager.predict(sample_features)
    print(f"Sample prediction: ${prediction[0]:.2f}")
    
    print("\nDeployment completed successfully!")
    print(f"Endpoint name: {ENDPOINT_NAME}")
    print(f"Endpoint ARN: arn:aws:sagemaker:{endpoint_manager.region}:123456789012:endpoint/{ENDPOINT_NAME}")


if __name__ == '__main__':
    main()
