"""
AWS Lambda Function - S3 Event Trigger for Glue ETL

This Lambda function is triggered when new data arrives in the S3 raw data bucket.
It starts the AWS Glue ETL job to process the data.

Trigger: S3 PUT events
Action: Start Glue ETL job

Author: Ratnesh Data Engineering Team
Date: 2024-01-20
"""

import json
import boto3
import os
from datetime import datetime

# Initialize AWS clients
glue_client = boto3.client('glue')
s3_client = boto3.client('s3')

# Environment variables
GLUE_JOB_NAME = os.environ.get('GLUE_JOB_NAME', 'airline-data-etl')
OUTPUT_BUCKET = os.environ.get('OUTPUT_BUCKET', 'airline-data-lake')


def lambda_handler(event, context):
    """
    Lambda handler function
    
    Args:
        event: S3 event notification
        context: Lambda context
    
    Returns:
        Response with status code and message
    """
    print(f"Received event: {json.dumps(event)}")
    
    try:
        # Extract S3 bucket and key from event
        for record in event['Records']:
            bucket = record['s3']['bucket']['name']
            key = record['s3']['object']['key']
            
            print(f"Processing file: s3://{bucket}/{key}")
            
            # Check if file is in the raw data path
            if 'raw/' not in key:
                print(f"Skipping file (not in raw/ path): {key}")
                continue
            
            # Check if file is JSON or GZIP
            if not (key.endswith('.json') or key.endswith('.json.gz')):
                print(f"Skipping file (not JSON): {key}")
                continue
            
            # Extract date partitions from key
            # Expected format: raw/year=2024/month=01/day=20/hour=10/data.json.gz
            parts = key.split('/')
            date_partitions = {}
            
            for part in parts:
                if '=' in part:
                    k, v = part.split('=')
                    date_partitions[k] = v
            
            # Construct output path
            output_path = f"s3://{OUTPUT_BUCKET}/curated/flight_searches/"
            if date_partitions:
                for k in ['year', 'month', 'day']:
                    if k in date_partitions:
                        output_path += f"{k}={date_partitions[k]}/"
            
            # Start Glue ETL job
            response = start_glue_job(
                input_path=f"s3://{bucket}/{key}",
                output_path=output_path
            )
            
            print(f"Glue job started: {response}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Glue ETL job triggered successfully',
                'timestamp': datetime.utcnow().isoformat()
            })
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            })
        }


def start_glue_job(input_path, output_path):
    """
    Start AWS Glue ETL job
    
    Args:
        input_path: S3 path to input data
        output_path: S3 path for output data
    
    Returns:
        Glue job run response
    """
    try:
        response = glue_client.start_job_run(
            JobName=GLUE_JOB_NAME,
            Arguments={
                '--S3_INPUT_PATH': input_path,
                '--S3_OUTPUT_PATH': output_path,
                '--enable-metrics': 'true',
                '--enable-continuous-cloudwatch-log': 'true'
            }
        )
        
        job_run_id = response['JobRunId']
        print(f"Started Glue job: {GLUE_JOB_NAME}, Run ID: {job_run_id}")
        
        return {
            'job_name': GLUE_JOB_NAME,
            'job_run_id': job_run_id,
            'input_path': input_path,
            'output_path': output_path
        }
    
    except Exception as e:
        print(f"Error starting Glue job: {str(e)}")
        raise


def get_file_size(bucket, key):
    """Get file size in bytes"""
    try:
        response = s3_client.head_object(Bucket=bucket, Key=key)
        return response['ContentLength']
    except Exception as e:
        print(f"Error getting file size: {str(e)}")
        return 0
