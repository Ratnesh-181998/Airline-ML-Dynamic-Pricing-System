# Airline Ticket Shopping System - Detailed System Design

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Requirements](#requirements)
3. [Data Acquisition](#data-acquisition)
4. [Data Processing Pipeline](#data-processing-pipeline)
5. [Feature Engineering](#feature-engineering)
6. [Machine Learning Models](#machine-learning-models)
7. [Model Training & Evaluation](#model-training--evaluation)
8. [Model Deployment](#model-deployment)
9. [System Architecture](#system-architecture)
10. [Scalability & Performance](#scalability--performance)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Cost Optimization](#cost-optimization)

---

## 1. Problem Statement

### Business Context
Airlines, travel agencies, and market analysts need **real-time data processing** capabilities to:
- Optimize ticket pricing dynamically
- Forecast demand accurately
- Analyze market trends
- Provide personalized recommendations

### Technical Challenges
1. **High Volume Data Ingestion**: ~10TB of continuously streamed data
2. **Real-Time Processing**: Low-latency transformations and predictions
3. **Data Complexity**: Multiple formats (JSON, XML, structured, unstructured)
4. **Scalability**: Handle varying loads without manual intervention

### Key Use Cases
1. **Dynamic Price Optimization**
   - Adjust prices based on demand surges
   - Monitor competitor pricing
   - Analyze user search patterns

2. **Demand Forecasting**
   - Predict booking volumes for specific routes
   - Classify search volume (High/Medium/Low)
   - Optimize supply chain and airport capacity

3. **Market Trend Analysis**
   - Identify popular routes
   - Detect peak travel times
   - Track emerging destinations

4. **Personalized Recommendations**
   - Tailored flight options based on user behavior
   - Context-aware suggestions (location, device, time)

5. **Anomaly Detection**
   - Identify unusual price spikes
   - Detect market disruptions

---

## 2. Requirements

### Functional Requirements
- **FR1**: Ingest real-time flight data from multiple sources (GDS, APIs, metasearch engines)
- **FR2**: Process and transform semi-structured data (JSON/XML) into structured formats
- **FR3**: Store raw and curated data in a scalable data lake
- **FR4**: Train ML models for price prediction, demand forecasting, and anomaly detection
- **FR5**: Deploy models for real-time and batch inference
- **FR6**: Provide APIs for accessing predictions
- **FR7**: Monitor system and model performance

### Non-Functional Requirements
- **NFR1**: **Latency**: Real-time predictions < 100ms
- **NFR2**: **Throughput**: Handle 10,000+ requests/second
- **NFR3**: **Availability**: 99.9% uptime
- **NFR4**: **Scalability**: Auto-scale based on load
- **NFR5**: **Data Retention**: Raw data for 90 days, curated data for 2 years
- **NFR6**: **Security**: Encryption at rest and in transit
- **NFR7**: **Cost Efficiency**: Serverless architecture to minimize costs

---

## 3. Data Acquisition

### Data Sources

#### 3.1 Global Distribution Systems (GDS)
- **Examples**: Sabre, Amadeus, Travelport
- **Data**: Flight schedules, pricing, availability
- **Format**: XML, JSON
- **Frequency**: Real-time updates

#### 3.2 Airline APIs
- **Examples**: Air India API, Lufthansa API
- **Data**: Flight details, pricing, seat availability
- **Format**: JSON
- **Frequency**: Real-time

#### 3.3 Metasearch Engines
- **Examples**: Kayak, Skyscanner, Google Flights
- **Data**: Aggregated pricing, user search patterns
- **Format**: JSON
- **Frequency**: Real-time

### Data Types

#### 3.4 Semi-Structured Data (JSON/XML)
```json
{
  "timestamp": "2024-01-20T10:30:00Z",
  "search_id": "unique_search_123",
  "user_id": "anon_user_456",
  "origin_airport": "SFO",
  "destination_airport": "JFK",
  "departure_date": "2024-02-22",
  "return_date": "2024-03-01",
  "number_of_passengers": 1,
  "currency": "USD",
  "price_offers": [
    {
      "airline": "AA",
      "flight_number": "AA123",
      "price": 300.50,
      "stops": 0
    },
    {
      "airline": "UA",
      "flight_number": "UA456",
      "price": 285.00,
      "stops": 1
    }
  ],
  "user_location": {
    "ip_address": "x.x.x.x",
    "country": "US"
  },
  "device_info": {
    "user_agent": "Mozilla/...",
    "platform": "Web"
  }
}
```

#### 3.5 Structured Data
- Flight number, origin, destination, date, time
- Price, cabin class, number of passengers

#### 3.6 Unstructured Data
- Search queries (text)
- IP addresses
- User agent strings

---

## 4. Data Processing Pipeline

### 4.1 Ingestion Layer

#### Amazon Kinesis Data Streams
- **Purpose**: Real-time data ingestion
- **Configuration**:
  - Shard count: Auto-scaling based on throughput
  - Retention: 24 hours (configurable up to 365 days)
- **Producers**: GDS APIs, Airline APIs, Metasearch engines

#### Amazon Kinesis Data Firehose
- **Purpose**: Load streaming data into S3
- **Configuration**:
  - Buffer size: 5 MB
  - Buffer interval: 60 seconds
  - Compression: GZIP
- **Destination**: S3 Raw Data Lake

### 4.2 Storage Layer

#### S3 Data Lake Architecture
```
s3://airline-data-lake/
├── raw/                          # Raw data from Kinesis Firehose
│   ├── year=2024/
│   │   ├── month=01/
│   │   │   ├── day=20/
│   │   │   │   ├── hour=10/
│   │   │   │   │   └── data.json.gz
│   │   │   │   └── hour=11/
│   │   │   └── day=21/
│   │   └── month=02/
│   └── year=2025/
│
├── curated/                      # Processed data (Parquet)
│   ├── flight_searches/
│   │   ├── year=2024/
│   │   │   └── month=01/
│   │   │       └── day=20/
│   │   │           └── part-00000.parquet
│   ├── price_offers/
│   └── user_context/
│
└── models/                       # Trained model artifacts
    ├── price_prediction/
    │   └── v1/
    │       └── model.tar.gz
    └── demand_forecasting/
```

### 4.3 Processing Layer

#### AWS Lambda (Event-Driven Triggers)
- **Trigger**: S3 PUT events on raw data
- **Function**: Lightweight transformations, trigger Glue jobs
- **Configuration**:
  - Memory: 512 MB
  - Timeout: 5 minutes
  - Concurrency: Auto-scaling

**Example Lambda Function**:
```python
import json
import boto3

glue_client = boto3.client('glue')

def lambda_handler(event, context):
    # Extract S3 bucket and key from event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    # Trigger Glue ETL job
    response = glue_client.start_job_run(
        JobName='airline-data-etl',
        Arguments={
            '--S3_INPUT_PATH': f's3://{bucket}/{key}',
            '--S3_OUTPUT_PATH': 's3://airline-data-lake/curated/'
        }
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Glue job started: {response["JobRunId"]}')
    }
```

#### AWS Glue Crawler
- **Purpose**: Discover schema and create metadata in Glue Data Catalog
- **Schedule**: Hourly or event-driven
- **Output**: Tables in Glue Data Catalog

#### AWS Glue ETL Jobs (PySpark)
- **Purpose**: Complex data transformations
- **Tasks**:
  1. Read raw data from S3 using Glue Data Catalog
  2. Flatten nested JSON structures (e.g., `price_offers` array)
  3. Handle missing values
  4. Data type conversions
  5. Feature engineering
  6. Write to curated S3 in Parquet format

**Example Glue ETL Script** (see next section for full code)

### 4.4 Data Transformation Steps

#### Step 1: Read Raw Data
```python
from pyspark.sql import SparkSession
from awsglue.context import GlueContext

# Initialize Glue context
glueContext = GlueContext(SparkContext.getOrCreate())
spark = glueContext.spark_session

# Read from Glue Data Catalog
raw_data_dyf = glueContext.create_dynamic_frame.from_catalog(
    database="airline_raw_db",
    table_name="flight_searches"
)

# Convert to Spark DataFrame
raw_data_df = raw_data_dyf.toDF()
```

#### Step 2: Flatten Nested Structures
```python
from pyspark.sql.functions import explode, col

# Explode price_offers array
flattened_df = raw_data_df.select(
    col("search_id"),
    col("timestamp"),
    col("origin_airport"),
    col("destination_airport"),
    col("departure_date"),
    explode("price_offers").alias("price_offer")
).select(
    col("search_id"),
    col("timestamp"),
    col("origin_airport"),
    col("destination_airport"),
    col("departure_date"),
    col("price_offer.airline").alias("airline"),
    col("price_offer.flight_number").alias("flight_number"),
    col("price_offer.price").alias("price"),
    col("price_offer.stops").alias("stops")
)
```

#### Step 3: Data Cleaning
```python
from pyspark.sql.functions import when, isnan, isnull

# Handle missing values
cleaned_df = flattened_df.fillna({
    'stops': 0,
    'price': flattened_df.agg({'price': 'mean'}).collect()[0][0]
})

# Remove duplicates
cleaned_df = cleaned_df.dropDuplicates(['search_id', 'flight_number'])

# Data type conversions
from pyspark.sql.types import DoubleType, IntegerType
cleaned_df = cleaned_df.withColumn('price', col('price').cast(DoubleType()))
cleaned_df = cleaned_df.withColumn('stops', col('stops').cast(IntegerType()))
```

#### Step 4: Write to Curated Data Lake
```python
# Write to S3 in Parquet format
curated_s3_path = "s3://airline-data-lake/curated/flight_searches/"

cleaned_df.write.mode("overwrite").parquet(curated_s3_path)

print("Glue ETL job completed successfully!")
```

---

## 5. Feature Engineering

### 5.1 Flight-Specific Features
- **Origin Airport** (PNR): Categorical
- **Destination Airport**: Categorical
- **Departure Date**: Date
- **Return Date**: Date (nullable)
- **Day of Week**: Derived from departure date
- **Week of Year**: Derived from departure date
- **Month**: Derived from departure date
- **Season**: Derived (Winter, Spring, Summer, Fall)
- **Number of Stops**: Integer
- **Duration of Flight**: Derived (hours)
- **Airline**: Categorical
- **Flight Number**: Categorical

### 5.2 Transaction Features
- **Price**: Continuous (target for regression)
- **Currency**: Categorical
- **Cabin Class**: Categorical (Economy, Business, First)
- **Number of Passengers**: Integer

### 5.3 Contextual Features
- **User Location**: IP address geolocation
- **Device Type**: Mobile, Desktop, Tablet
- **Browser**: Chrome, Safari, Firefox, etc.
- **Operating System**: Windows, macOS, iOS, Android
- **Timestamp**: Date and time of search

### 5.4 Derived Features
- **Route Popularity**: Count of searches for origin-destination pair
- **Price Volatility**: Standard deviation of prices for a route
- **Search Volume**: Number of searches in last 24 hours (demand indicator)
- **Competitor Price Difference**: Your airline price - Average competitor price
- **Days Until Departure**: Departure date - Search date
- **Is Weekend**: Boolean (Saturday/Sunday)
- **Is Holiday**: Boolean (based on holiday calendar)
- **Historical Average Price**: Average price for route in last 30 days

### 5.5 Feature Engineering Code
```python
from pyspark.sql.functions import col, datediff, current_date, dayofweek, weekofyear, month
from pyspark.sql.functions import when, count, avg, stddev
from pyspark.sql.window import Window

# Days until departure
df = df.withColumn('days_until_departure', 
                   datediff(col('departure_date'), current_date()))

# Day of week, week of year, month
df = df.withColumn('day_of_week', dayofweek(col('departure_date')))
df = df.withColumn('week_of_year', weekofyear(col('departure_date')))
df = df.withColumn('month', month(col('departure_date')))

# Is weekend
df = df.withColumn('is_weekend', 
                   when(col('day_of_week').isin([1, 7]), 1).otherwise(0))

# Route popularity (count of searches)
window_spec = Window.partitionBy('origin_airport', 'destination_airport')
df = df.withColumn('route_popularity', count('search_id').over(window_spec))

# Price volatility (standard deviation)
df = df.withColumn('price_volatility', stddev('price').over(window_spec))

# Historical average price
df = df.withColumn('historical_avg_price', avg('price').over(window_spec))

# Competitor price difference
df = df.withColumn('competitor_price_diff', 
                   col('price') - col('historical_avg_price'))
```

---

## 6. Machine Learning Models

### 6.1 Model Selection Strategy

#### Linear Models
- **Pros**: Simple, interpretable, fast
- **Cons**: Limited ability to capture non-linear relationships
- **Use Case**: Baseline models

#### Tree-Based Models (XGBoost, LightGBM)
- **Pros**: High performance, handles non-linearity, robust to outliers
- **Cons**: Less interpretable (mitigated with SHAP)
- **Use Case**: Primary models for price prediction and demand forecasting

#### Neural Networks
- **Pros**: Capture complex patterns, automatic feature engineering
- **Cons**: Requires more data, less interpretable, slower training
- **Use Case**: Advanced personalization and recommendation systems

### 6.2 Model Tasks

#### Task 1: Price Prediction (Regression)
- **Objective**: Predict flight ticket price
- **Algorithm**: XGBoost Regressor
- **Features**: Origin, destination, date, competitor prices, route popularity, days until departure
- **Target**: Price (continuous)
- **Metrics**: RMSE, MAE, R²

#### Task 2: Demand Forecasting
##### Classification Approach
- **Objective**: Classify search volume (High/Medium/Low)
- **Algorithm**: XGBoost Classifier
- **Features**: Route, date, historical search volume, seasonality
- **Target**: Search volume category
- **Metrics**: Accuracy, F1-score, Precision, Recall

##### Regression Approach
- **Objective**: Predict number of bookings
- **Algorithm**: LightGBM Regressor
- **Features**: Route, date, price, competitor prices, historical bookings
- **Target**: Number of bookings (continuous)
- **Metrics**: RMSE, MAE

#### Task 3: Anomaly Detection (Unsupervised)
- **Objective**: Identify unusual price spikes or market disruptions
- **Algorithm**: Isolation Forest
- **Features**: Price, price volatility, competitor prices, search volume
- **Output**: Anomaly score (higher = more anomalous)
- **Use Case**: Alert system for pricing teams

#### Task 4: Personalized Recommendations
- **Objective**: Recommend flights based on user preferences
- **Algorithm**: Collaborative Filtering or Neural Network
- **Features**: User location, device type, browsing history, booking history
- **Output**: Ranked list of flight options

---

## 7. Model Training & Evaluation

### 7.1 Data Preparation (SageMaker)

#### Load Engineered Features from S3
```python
import boto3
import pandas as pd
from sklearn.model_selection import train_test_split

s3_client = boto3.client('s3')

# Load data from S3
bucket = 'airline-data-lake'
key = 'curated/flight_searches/features.parquet'

obj = s3_client.get_object(Bucket=bucket, Key=key)
df = pd.read_parquet(obj['Body'])

# Split data
X = df.drop(['price'], axis=1)
y = df['price']

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
```

#### Save to S3 for SageMaker
```python
# Save train/val/test sets to S3
train_df = pd.concat([X_train, y_train], axis=1)
val_df = pd.concat([X_val, y_val], axis=1)
test_df = pd.concat([X_test, y_test], axis=1)

train_df.to_csv('s3://airline-data-lake/ml/train.csv', index=False)
val_df.to_csv('s3://airline-data-lake/ml/val.csv', index=False)
test_df.to_csv('s3://airline-data-lake/ml/test.csv', index=False)
```

### 7.2 Model Training (SageMaker Training Job)

#### XGBoost Training Script
```python
import sagemaker
from sagemaker.xgboost import XGBoost

# Initialize SageMaker session
sagemaker_session = sagemaker.Session()
role = 'arn:aws:iam::123456789012:role/SageMakerRole'

# Define XGBoost estimator
xgb_estimator = XGBoost(
    entry_point='train_xgboost.py',
    role=role,
    instance_count=1,
    instance_type='ml.m5.xlarge',
    framework_version='1.5-1',
    hyperparameters={
        'objective': 'reg:squarederror',
        'num_round': 100,
        'max_depth': 6,
        'eta': 0.3,
        'subsample': 0.8,
        'colsample_bytree': 0.8
    }
)

# Train model
xgb_estimator.fit({
    'train': 's3://airline-data-lake/ml/train.csv',
    'validation': 's3://airline-data-lake/ml/val.csv'
})
```

### 7.3 Hyperparameter Tuning (Bayesian Optimization)

```python
from sagemaker.tuner import HyperparameterTuner, IntegerParameter, ContinuousParameter

# Define hyperparameter ranges
hyperparameter_ranges = {
    'max_depth': IntegerParameter(3, 10),
    'eta': ContinuousParameter(0.01, 0.3),
    'subsample': ContinuousParameter(0.5, 1.0),
    'colsample_bytree': ContinuousParameter(0.5, 1.0),
    'num_round': IntegerParameter(50, 200)
}

# Define tuning strategy
tuner = HyperparameterTuner(
    xgb_estimator,
    objective_metric_name='validation:rmse',
    objective_type='Minimize',
    hyperparameter_ranges=hyperparameter_ranges,
    strategy='Bayesian',
    max_jobs=20,
    max_parallel_jobs=3
)

# Launch tuning job
tuner.fit({
    'train': 's3://airline-data-lake/ml/train.csv',
    'validation': 's3://airline-data-lake/ml/val.csv'
})

# Get best hyperparameters
best_training_job = tuner.best_training_job()
print(f'Best training job: {best_training_job}')
```

### 7.4 Model Evaluation

#### Metrics for Regression (Price Prediction)
```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# Load test data
test_df = pd.read_csv('s3://airline-data-lake/ml/test.csv')
X_test = test_df.drop(['price'], axis=1)
y_test = test_df['price']

# Get predictions from SageMaker endpoint
predictor = xgb_estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large'
)

y_pred = predictor.predict(X_test.values)

# Calculate metrics
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'RMSE: {rmse:.2f}')
print(f'MAE: {mae:.2f}')
print(f'R²: {r2:.4f}')
```

#### Model Explainability (SHAP)
```python
import shap

# Load trained model
model = xgb_estimator.model_data

# Create SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Visualize feature importance
shap.summary_plot(shap_values, X_test, plot_type="bar")
```

---

## 8. Model Deployment

### 8.1 Real-Time Inference (SageMaker Endpoint)

#### Use Case
- User searches for a flight → instant price prediction
- Low latency required (< 100ms)

#### Deployment Configuration
```python
from sagemaker.model import Model
from sagemaker.predictor import Predictor

# Create model
model = Model(
    model_data='s3://airline-data-lake/models/price_prediction/v1/model.tar.gz',
    role=role,
    image_uri='<xgboost-container-uri>',
    name='price-prediction-model-v1'
)

# Deploy endpoint
predictor = model.deploy(
    initial_instance_count=2,
    instance_type='ml.m5.large',
    endpoint_name='price-prediction-endpoint'
)
```

#### Auto-Scaling Configuration
```python
import boto3

client = boto3.client('application-autoscaling')

# Register scalable target
response = client.register_scalable_target(
    ServiceNamespace='sagemaker',
    ResourceId=f'endpoint/price-prediction-endpoint/variant/AllTraffic',
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    MinCapacity=2,
    MaxCapacity=10
)

# Define scaling policy
response = client.put_scaling_policy(
    PolicyName='price-prediction-scaling-policy',
    ServiceNamespace='sagemaker',
    ResourceId=f'endpoint/price-prediction-endpoint/variant/AllTraffic',
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    PolicyType='TargetTrackingScaling',
    TargetTrackingScalingPolicyConfiguration={
        'TargetValue': 70.0,  # Target 70% CPU utilization
        'PredefinedMetricSpecification': {
            'PredefinedMetricType': 'SageMakerVariantInvocationsPerInstance'
        },
        'ScaleInCooldown': 300,
        'ScaleOutCooldown': 60
    }
)
```

#### Inference Code
```python
import json

def predict_price(origin, destination, departure_date, features):
    """
    Predict flight price using SageMaker endpoint
    """
    # Prepare input data
    input_data = {
        'origin_airport': origin,
        'destination_airport': destination,
        'departure_date': departure_date,
        **features
    }
    
    # Convert to format expected by endpoint
    payload = json.dumps(input_data)
    
    # Invoke endpoint
    response = predictor.predict(payload)
    
    predicted_price = response['predictions'][0]
    
    return predicted_price

# Example usage
price = predict_price(
    origin='SFO',
    destination='JFK',
    departure_date='2024-02-22',
    features={
        'days_until_departure': 30,
        'is_weekend': 0,
        'route_popularity': 1500,
        'historical_avg_price': 320.0
    }
)

print(f'Predicted price: ${price:.2f}')
```

### 8.2 Batch Inference (SageMaker Batch Transform)

#### Use Case
- Generate daily/weekly price forecasts for all routes
- Offline scoring (not time-sensitive)
- Cost-effective for large datasets

#### Batch Transform Job
```python
from sagemaker.transformer import Transformer

# Create transformer
transformer = Transformer(
    model_name='price-prediction-model-v1',
    instance_count=2,
    instance_type='ml.m5.xlarge',
    output_path='s3://airline-data-lake/predictions/',
    assemble_with='Line',
    accept='text/csv'
)

# Run batch transform
transformer.transform(
    data='s3://airline-data-lake/ml/batch_input.csv',
    content_type='text/csv',
    split_type='Line'
)

# Wait for completion
transformer.wait()

print('Batch transform completed!')
```

---

## 9. System Architecture

### 9.1 Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA SOURCES                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │     GDS      │  │ Airline APIs │  │ Metasearch (Kayak, Skyscanner)│  │
│  │ (Sabre, etc) │  │              │  │                              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┬───────────────┘  │
└─────────┼──────────────────┼─────────────────────────┼──────────────────┘
          │                  │                         │
          └──────────────────┴─────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      INGESTION LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              Amazon Kinesis Data Streams                          │  │
│  │  - Auto-scaling shards                                            │  │
│  │  - 24-hour retention                                              │  │
│  └───────────────────────────┬───────────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │          Kinesis Data Firehose → S3 (Raw Data Lake)               │  │
│  │  - Buffer: 5MB / 60 seconds                                       │  │
│  │  - Compression: GZIP                                              │  │
│  │  - Partitioning: year/month/day/hour                              │  │
│  └───────────────────────────┬───────────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │ AWS Lambda   │───▶│ AWS Glue     │───▶│   AWS Glue ETL Jobs      │  │
│  │ (S3 Trigger) │    │ Crawler      │    │   (PySpark)              │  │
│  │              │    │ (Metadata)   │    │   - Flatten JSON         │  │
│  │              │    │              │    │   - Data cleaning        │  │
│  │              │    │              │    │   - Feature engineering  │  │
│  └──────────────┘    └──────────────┘    └──────────┬───────────────┘  │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CURATED DATA LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │         S3 (Curated Data Lake - Parquet Format)                   │  │
│  │         + AWS Glue Data Catalog (Metadata)                        │  │
│  └───────────────────────────┬───────────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
┌──────────────────────────────┐  ┌──────────────────────────────────────┐
│     ANALYTICS LAYER          │  │          ML LAYER                    │
│  ┌────────────────────────┐  │  │  ┌────────────────────────────────┐ │
│  │  Amazon Athena         │  │  │  │   Amazon SageMaker             │ │
│  │  (SQL Queries)         │  │  │  │   ┌────────────────────────┐   │ │
│  │                        │  │  │  │   │ Training Jobs          │   │ │
│  │  - Ad-hoc analysis     │  │  │  │   │ - XGBoost              │   │ │
│  │  - Business reporting  │  │  │  │   │ - LightGBM             │   │ │
│  └────────────────────────┘  │  │  │   │ - Isolation Forest     │   │ │
└──────────────────────────────┘  │  │   └────────────────────────┘   │ │
                                  │  │   ┌────────────────────────┐   │ │
                                  │  │   │ Hyperparameter Tuning  │   │ │
                                  │  │   │ (Bayesian Optimization)│   │ │
                                  │  │   └────────────────────────┘   │ │
                                  │  │   ┌────────────────────────┐   │ │
                                  │  │   │ Model Evaluation       │   │ │
                                  │  │   │ (RMSE, MAE, R²)        │   │ │
                                  │  │   └────────────────────────┘   │ │
                                  │  └────────────────┬───────────────┘ │
                                  └───────────────────┼─────────────────┘
                                                      │
                                                      ▼
                                  ┌──────────────────────────────────────┐
                                  │    MODEL DEPLOYMENT                  │
                                  │  ┌────────────────────────────────┐ │
                                  │  │ SageMaker Endpoint             │ │
                                  │  │ (Real-time Inference)          │ │
                                  │  │ - Instance: ml.m5.large        │ │
                                  │  │ - Auto-scaling: 2-10 instances │ │
                                  │  │ - Latency: < 100ms             │ │
                                  │  └────────────────┬───────────────┘ │
                                  │  ┌────────────────────────────────┐ │
                                  │  │ SageMaker Batch Transform      │ │
                                  │  │ (Batch Inference)              │ │
                                  │  │ - Daily/weekly forecasts       │ │
                                  │  └────────────────────────────────┘ │
                                  └────────────────┬─────────────────────┘
                                                   │
                                                   ▼
                                  ┌──────────────────────────────────────┐
                                  │   APPLICATION LAYER                  │
                                  │  ┌────────────────────────────────┐ │
                                  │  │  API Gateway + Lambda          │ │
                                  │  │  (REST API for predictions)    │ │
                                  │  └────────────────┬───────────────┘ │
                                  │  ┌────────────────────────────────┐ │
                                  │  │  Dashboard (React/Vue)         │ │
                                  │  │  - Real-time price predictions │ │
                                  │  │  - Demand forecasts            │ │
                                  │  │  - Anomaly alerts              │ │
                                  │  └────────────────────────────────┘ │
                                  └──────────────────────────────────────┘
                                                   │
                                                   ▼
                                  ┌──────────────────────────────────────┐
                                  │   MONITORING LAYER                   │
                                  │  ┌────────────────────────────────┐ │
                                  │  │  AWS CloudWatch                │ │
                                  │  │  - System metrics              │ │
                                  │  │  - Model metrics               │ │
                                  │  │  - Alerts & dashboards         │ │
                                  │  └────────────────────────────────┘ │
                                  └──────────────────────────────────────┘
```

### 9.2 Data Flow Summary
1. **Ingestion**: GDS/APIs → Kinesis Streams → Kinesis Firehose → S3 Raw
2. **Processing**: Lambda triggers → Glue Crawler → Glue ETL → S3 Curated
3. **Analytics**: Athena queries on curated data
4. **ML Training**: SageMaker reads from S3 → trains models → saves artifacts
5. **Deployment**: SageMaker Endpoints for real-time, Batch Transform for offline
6. **Application**: API Gateway + Lambda → fetch predictions → serve to dashboard
7. **Monitoring**: CloudWatch tracks all layers

---

## 10. Scalability & Performance

### 10.1 Scalability Strategies

#### Kinesis Auto-Scaling
- **Shard count**: Automatically adjusts based on throughput
- **Monitoring**: CloudWatch metrics for `IncomingRecords`, `IncomingBytes`

#### Lambda Concurrency
- **Reserved concurrency**: Ensure critical functions have guaranteed capacity
- **Provisioned concurrency**: Pre-warm functions for low latency

#### Glue Job Scaling
- **DPU (Data Processing Units)**: Auto-scaling based on data volume
- **Job bookmarks**: Track processed data to avoid reprocessing

#### SageMaker Endpoint Auto-Scaling
- **Target tracking**: Scale based on invocations per instance or CPU utilization
- **Min/Max instances**: 2-10 instances for production

### 10.2 Performance Optimization

#### Data Partitioning
- **S3**: Partition by `year/month/day/hour` for efficient queries
- **Parquet**: Columnar format for fast analytical queries

#### Caching
- **API Gateway**: Cache responses for frequently requested predictions
- **ElastiCache**: Cache feature values for real-time inference

#### Batch Processing
- **Glue**: Process data in batches (e.g., hourly) instead of per-record
- **SageMaker Batch Transform**: Offline scoring for non-time-sensitive tasks

---

## 11. Monitoring & Maintenance

### 11.1 CloudWatch Dashboards

#### System Metrics
- **Kinesis**: Throughput, iterator age, read/write provisioned throughput exceeded
- **Lambda**: Invocations, duration, errors, throttles
- **Glue**: Job success/failure rate, DPU hours
- **S3**: Storage usage, request count

#### Model Metrics
- **Endpoint Latency**: p50, p90, p99 latency
- **Invocations**: Requests per second
- **Model Accuracy**: RMSE, MAE (tracked over time)
- **Feature Distribution**: Detect data drift

### 11.2 Alerts

#### Critical Alerts
- Lambda function failures
- Glue job failures
- SageMaker endpoint latency > 200ms
- Model accuracy degradation (RMSE increase > 10%)

#### Warning Alerts
- Kinesis iterator age > 1 hour
- S3 storage usage > 80% of quota
- Endpoint invocations > 80% of capacity

### 11.3 Model Retraining

#### Triggers for Retraining
- **Scheduled**: Weekly or monthly retraining
- **Performance degradation**: RMSE increases by > 10%
- **Data drift**: Feature distributions shift significantly
- **New data**: Significant volume of new data available

#### Retraining Pipeline
1. Detect trigger (CloudWatch alarm or schedule)
2. Extract latest data from S3 curated lake
3. Retrain model using SageMaker
4. Evaluate on validation set
5. If performance improves, deploy new model
6. A/B test new model vs. existing model
7. Gradually shift traffic to new model

---

## 12. Cost Optimization

### 12.1 Cost Breakdown

#### Storage (S3)
- **Raw data**: ~$0.023/GB/month (Standard)
- **Curated data**: ~$0.023/GB/month (Standard)
- **Lifecycle policies**: Move to Glacier after 90 days (~$0.004/GB/month)

#### Compute
- **Lambda**: $0.20 per 1M requests + $0.0000166667 per GB-second
- **Glue**: $0.44 per DPU-hour
- **SageMaker Training**: $0.269/hour (ml.m5.xlarge)
- **SageMaker Endpoint**: $0.134/hour (ml.m5.large)

### 12.2 Cost Optimization Strategies

#### Use Serverless Where Possible
- Lambda for lightweight transformations
- Kinesis Firehose for data delivery
- Athena for ad-hoc queries (pay per query)

#### Right-Size Instances
- Use smaller instances for low-traffic endpoints
- Scale down during off-peak hours

#### Spot Instances for Training
- Use Spot instances for SageMaker training (up to 90% savings)
- Checkpointing to handle interruptions

#### Data Lifecycle Management
- Archive old data to Glacier
- Delete raw data after processing (if not needed)

#### Batch Processing
- Use Batch Transform instead of real-time endpoints for offline scoring

---

## Conclusion

This system design provides a **scalable, cost-effective, and production-ready** solution for airline ticket shopping optimization. By leveraging AWS serverless services and machine learning, it enables:
- **Real-time dynamic pricing**
- **Accurate demand forecasting**
- **Proactive anomaly detection**
- **Personalized user experiences**

The architecture is designed to handle **high-volume streaming data** while maintaining **low latency** and **high availability**.

---

**Next Steps**:
1. Implement data ingestion pipeline
2. Develop Glue ETL jobs
3. Train baseline ML models
4. Deploy SageMaker endpoints
5. Build API and dashboard
6. Set up monitoring and alerts
7. Optimize costs and performance
