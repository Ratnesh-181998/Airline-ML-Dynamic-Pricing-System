"""
AWS Glue ETL Job for Airline Ticket Shopping Data Processing

This PySpark script performs the following transformations:
1. Read raw JSON data from S3 using Glue Data Catalog
2. Flatten nested JSON structures (price_offers array)
3. Handle missing values and data type conversions
4. Perform feature engineering
5. Write cleaned data to S3 in Parquet format

Author: Ratnesh Data Engineering Team
Date: 2024-01-20
"""

from pyspark.sql import SparkSession
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.utils import getResolvedOptions

from pyspark.sql.functions import (
    explode, col, from_json, get_json_object, to_date,
    current_date, datediff, dayofweek, weekofyear, month,
    when, count, avg, stddev, lit
)
from pyspark.sql.types import (
    StructType, StructField, StringType, FloatType, ArrayType,
    TimestampType, IntegerType, DoubleType
)
from pyspark.sql.window import Window

import sys


# ============================================================================
# Initialize Spark and Glue Context
# ============================================================================

args = getResolvedOptions(sys.argv, ['JOB_NAME'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)


# ============================================================================
# Step 1: Read Raw Data from S3 using Glue Data Catalog
# ============================================================================

print("Step 1: Reading raw data from Glue Data Catalog...")

raw_data_dyf = glueContext.create_dynamic_frame.from_catalog(
    database="airline_raw_db",
    table_name="flight_searches"
)

# Convert to Spark DataFrame for easier operations
raw_data_df = raw_data_dyf.toDF()

print(f"Raw data count: {raw_data_df.count()}")
raw_data_df.printSchema()


# ============================================================================
# Step 2: Flatten Nested JSON Structures
# ============================================================================

print("Step 2: Flattening nested JSON structures...")

# Explode price_offers array to create one row per price offer
flattened_df = raw_data_df.select(
    col("search_id"),
    col("timestamp"),
    col("user_id"),
    col("origin_airport"),
    col("destination_airport"),
    col("departure_date"),
    col("return_date"),
    col("number_of_passengers"),
    col("currency"),
    explode("price_offers").alias("price_offer")
).select(
    # Select fields after explode - nested structure becomes flattened
    col("search_id"),
    col("timestamp"),
    col("user_id"),
    col("origin_airport"),
    col("destination_airport"),
    col("departure_date"),
    col("return_date"),
    col("number_of_passengers"),
    col("currency"),
    col("price_offer.airline").alias("airline"),
    col("price_offer.flight_number").alias("flight_number"),
    col("price_offer.price").alias("price"),
    col("price_offer.stops").alias("stops")
)

print(f"Flattened data count: {flattened_df.count()}")


# ============================================================================
# Step 3: Data Cleaning
# ============================================================================

print("Step 3: Cleaning data...")

# Handle missing values
# Calculate mean price for filling nulls
mean_price = flattened_df.select(avg("price")).collect()[0][0]

cleaned_df = flattened_df.fillna({
    'stops': 0,
    'price': mean_price,
    'return_date': None  # Keep as null for one-way flights
})

# Remove duplicates
cleaned_df = cleaned_df.dropDuplicates(['search_id', 'flight_number'])

# Data type conversions
cleaned_df = cleaned_df.withColumn('price', col('price').cast(DoubleType()))
cleaned_df = cleaned_df.withColumn('stops', col('stops').cast(IntegerType()))
cleaned_df = cleaned_df.withColumn('number_of_passengers', col('number_of_passengers').cast(IntegerType()))

# Convert date strings to date type
cleaned_df = cleaned_df.withColumn('departure_date', to_date(col('departure_date')))
cleaned_df = cleaned_df.withColumn('return_date', to_date(col('return_date')))

print(f"Cleaned data count: {cleaned_df.count()}")


# ============================================================================
# Step 4: Feature Engineering
# ============================================================================

print("Step 4: Performing feature engineering...")

# Temporal features
cleaned_df = cleaned_df.withColumn('days_until_departure', 
                                   datediff(col('departure_date'), current_date()))
cleaned_df = cleaned_df.withColumn('day_of_week', dayofweek(col('departure_date')))
cleaned_df = cleaned_df.withColumn('week_of_year', weekofyear(col('departure_date')))
cleaned_df = cleaned_df.withColumn('month', month(col('departure_date')))

# Is weekend
cleaned_df = cleaned_df.withColumn('is_weekend', 
                                   when(col('day_of_week').isin([1, 7]), 1).otherwise(0))

# Season (1=Winter, 2=Spring, 3=Summer, 4=Fall)
cleaned_df = cleaned_df.withColumn('season',
    when(col('month').isin([12, 1, 2]), 1)
    .when(col('month').isin([3, 4, 5]), 2)
    .when(col('month').isin([6, 7, 8]), 3)
    .otherwise(4)
)

# Route-based features
window_spec = Window.partitionBy('origin_airport', 'destination_airport')

# Route popularity (count of searches for this route)
cleaned_df = cleaned_df.withColumn('route_popularity', 
                                   count('search_id').over(window_spec))

# Price statistics for route
cleaned_df = cleaned_df.withColumn('route_avg_price', 
                                   avg('price').over(window_spec))
cleaned_df = cleaned_df.withColumn('route_price_volatility', 
                                   stddev('price').over(window_spec))

# Competitor price difference (your price - average price)
cleaned_df = cleaned_df.withColumn('price_diff_from_avg', 
                                   col('price') - col('route_avg_price'))

# Is round trip
cleaned_df = cleaned_df.withColumn('is_round_trip', 
                                   when(col('return_date').isNotNull(), 1).otherwise(0))

# Trip duration (for round trips)
cleaned_df = cleaned_df.withColumn('trip_duration_days',
    when(col('is_round_trip') == 1, 
         datediff(col('return_date'), col('departure_date'))
    ).otherwise(0)
)

print("Feature engineering completed!")
cleaned_df.printSchema()


# ============================================================================
# Step 5: Write to Curated Data Lake in S3 (Parquet format)
# ============================================================================

print("Step 5: Writing curated data to S3...")

curated_s3_path = "s3://airline-data-lake/curated/flight_searches/"

cleaned_df.write.mode("overwrite").parquet(curated_s3_path)

print(f"Glue ETL job completed successfully!")
print(f"Curated data written to: {curated_s3_path}")

# Optionally, update the Glue Data Catalog for the curated data
# This allows Athena to query the curated data directly
glueContext.write_dynamic_frame.from_options(
    frame=glueContext.create_dynamic_frame.from_catalog(
        database="airline_curated_db",
        table_name="flight_searches_curated"
    ),
    connection_type="s3",
    connection_options={"path": curated_s3_path},
    format="parquet"
)

job.commit()
