#!/bin/bash

# ============================================================================
# AWS Resource Setup Script for Airline Ticket Shopping System
# 
# This script sets up all necessary AWS resources for the project:
# - S3 buckets
# - Kinesis streams
# - Glue databases and jobs
# - SageMaker resources
# - IAM roles
#
# Usage: bash setup_aws_resources.sh <environment>
# Example: bash setup_aws_resources.sh dev
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="airline-ticket-shopping"
ENVIRONMENT="${1:-dev}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Airline Ticket Shopping System${NC}"
echo -e "${GREEN}AWS Resource Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Project: ${YELLOW}${PROJECT_NAME}${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Region: ${YELLOW}${AWS_REGION}${NC}"
echo -e "Account ID: ${YELLOW}${AWS_ACCOUNT_ID}${NC}"
echo ""

# ============================================================================
# Step 1: Deploy Kinesis Stack
# ============================================================================
echo -e "${GREEN}[1/5] Deploying Kinesis Stack...${NC}"

aws cloudformation deploy \
    --template-file infrastructure/cloudformation/kinesis_stack.yaml \
    --stack-name "${PROJECT_NAME}-kinesis-${ENVIRONMENT}" \
    --parameter-overrides \
        ProjectName="${PROJECT_NAME}" \
        Environment="${ENVIRONMENT}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "${AWS_REGION}"

# Get outputs
DATA_LAKE_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "${PROJECT_NAME}-kinesis-${ENVIRONMENT}" \
    --query "Stacks[0].Outputs[?OutputKey=='DataLakeBucketName'].OutputValue" \
    --output text \
    --region "${AWS_REGION}")

KINESIS_STREAM=$(aws cloudformation describe-stacks \
    --stack-name "${PROJECT_NAME}-kinesis-${ENVIRONMENT}" \
    --query "Stacks[0].Outputs[?OutputKey=='KinesisStreamName'].OutputValue" \
    --output text \
    --region "${AWS_REGION}")

echo -e "${GREEN}✓ Kinesis stack deployed${NC}"
echo -e "  Data Lake Bucket: ${YELLOW}${DATA_LAKE_BUCKET}${NC}"
echo -e "  Kinesis Stream: ${YELLOW}${KINESIS_STREAM}${NC}"
echo ""

# ============================================================================
# Step 2: Upload Scripts to S3
# ============================================================================
echo -e "${GREEN}[2/5] Uploading scripts to S3...${NC}"

# Upload Glue ETL script
aws s3 cp src/processing/glue_etl_job.py \
    "s3://${DATA_LAKE_BUCKET}/scripts/glue_etl_job.py" \
    --region "${AWS_REGION}"

# Package and upload Lambda function
cd src/processing
zip lambda_trigger.zip lambda_trigger.py
aws s3 cp lambda_trigger.zip \
    "s3://${DATA_LAKE_BUCKET}/lambda/lambda_trigger.zip" \
    --region "${AWS_REGION}"
rm lambda_trigger.zip
cd ../..

echo -e "${GREEN}✓ Scripts uploaded to S3${NC}"
echo ""

# ============================================================================
# Step 3: Deploy Glue Stack
# ============================================================================
echo -e "${GREEN}[3/5] Deploying Glue Stack...${NC}"

aws cloudformation deploy \
    --template-file infrastructure/cloudformation/glue_stack.yaml \
    --stack-name "${PROJECT_NAME}-glue-${ENVIRONMENT}" \
    --parameter-overrides \
        ProjectName="${PROJECT_NAME}" \
        Environment="${ENVIRONMENT}" \
        DataLakeBucket="${DATA_LAKE_BUCKET}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "${AWS_REGION}"

# Get outputs
GLUE_JOB_NAME=$(aws cloudformation describe-stacks \
    --stack-name "${PROJECT_NAME}-glue-${ENVIRONMENT}" \
    --query "Stacks[0].Outputs[?OutputKey=='GlueETLJobName'].OutputValue" \
    --output text \
    --region "${AWS_REGION}")

echo -e "${GREEN}✓ Glue stack deployed${NC}"
echo -e "  Glue Job: ${YELLOW}${GLUE_JOB_NAME}${NC}"
echo ""

# ============================================================================
# Step 4: Create Sample Data Directories
# ============================================================================
echo -e "${GREEN}[4/5] Creating S3 directory structure...${NC}"

# Create empty marker files to establish directory structure
touch .empty
aws s3 cp .empty "s3://${DATA_LAKE_BUCKET}/raw/.empty" --region "${AWS_REGION}"
aws s3 cp .empty "s3://${DATA_LAKE_BUCKET}/curated/.empty" --region "${AWS_REGION}"
aws s3 cp .empty "s3://${DATA_LAKE_BUCKET}/models/.empty" --region "${AWS_REGION}"
aws s3 cp .empty "s3://${DATA_LAKE_BUCKET}/temp/.empty" --region "${AWS_REGION}"
aws s3 cp .empty "s3://${DATA_LAKE_BUCKET}/spark-logs/.empty" --region "${AWS_REGION}"
rm .empty

echo -e "${GREEN}✓ S3 directory structure created${NC}"
echo ""

# ============================================================================
# Step 5: Configure S3 Event Notification
# ============================================================================
echo -e "${GREEN}[5/5] Configuring S3 event notifications...${NC}"

LAMBDA_ARN=$(aws cloudformation describe-stacks \
    --stack-name "${PROJECT_NAME}-glue-${ENVIRONMENT}" \
    --query "Stacks[0].Outputs[?OutputKey=='GlueTriggerLambdaArn'].OutputValue" \
    --output text \
    --region "${AWS_REGION}")

# Create notification configuration
cat > /tmp/s3-notification.json <<EOF
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "${LAMBDA_ARN}",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "raw/"
            },
            {
              "Name": "suffix",
              "Value": ".json"
            }
          ]
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-notification-configuration \
    --bucket "${DATA_LAKE_BUCKET}" \
    --notification-configuration file:///tmp/s3-notification.json \
    --region "${AWS_REGION}"

rm /tmp/s3-notification.json

echo -e "${GREEN}✓ S3 event notifications configured${NC}"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Resources Created:${NC}"
echo -e "  • Kinesis Stream: ${KINESIS_STREAM}"
echo -e "  • S3 Data Lake: ${DATA_LAKE_BUCKET}"
echo -e "  • Glue ETL Job: ${GLUE_JOB_NAME}"
echo -e "  • Lambda Trigger: ${LAMBDA_ARN}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Test data ingestion:"
echo -e "     ${GREEN}python src/ingestion/kinesis_producer.py --stream-name ${KINESIS_STREAM} --num-records 100${NC}"
echo ""
echo -e "  2. Monitor Glue job:"
echo -e "     ${GREEN}aws glue get-job-run --job-name ${GLUE_JOB_NAME} --run-id <run-id>${NC}"
echo ""
echo -e "  3. Query data with Athena:"
echo -e "     ${GREEN}SELECT * FROM ${PROJECT_NAME}_curated_db_${ENVIRONMENT}.flight_searches_curated LIMIT 10;${NC}"
echo ""
