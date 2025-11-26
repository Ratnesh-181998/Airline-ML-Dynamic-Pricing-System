"""
SageMaker Training Script for Price Prediction using XGBoost

This script trains an XGBoost regression model to predict flight ticket prices.

Features:
- Loads training and validation data from S3
- Trains XGBoost model with specified hyperparameters
- Evaluates model performance (RMSE, MAE, R²)
- Saves trained model artifacts to S3

Author:Ratnesh ML Engineering Team
Date: 2024-01-20
"""

import argparse
import os
import json
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib


def parse_args():
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser()
    
    # Hyperparameters
    parser.add_argument('--objective', type=str, default='reg:squarederror')
    parser.add_argument('--num_round', type=int, default=100)
    parser.add_argument('--max_depth', type=int, default=6)
    parser.add_argument('--eta', type=float, default=0.3)
    parser.add_argument('--subsample', type=float, default=0.8)
    parser.add_argument('--colsample_bytree', type=float, default=0.8)
    parser.add_argument('--min_child_weight', type=int, default=1)
    parser.add_argument('--gamma', type=float, default=0)
    
    # SageMaker specific arguments
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR'))
    parser.add_argument('--train', type=str, default=os.environ.get('SM_CHANNEL_TRAIN'))
    parser.add_argument('--validation', type=str, default=os.environ.get('SM_CHANNEL_VALIDATION'))
    parser.add_argument('--output-data-dir', type=str, default=os.environ.get('SM_OUTPUT_DATA_DIR'))
    
    return parser.parse_args()


def load_data(data_path):
    """Load data from CSV file"""
    print(f"Loading data from {data_path}")
    
    # Find all CSV files in the directory
    files = [os.path.join(data_path, f) for f in os.listdir(data_path) if f.endswith('.csv')]
    
    if len(files) == 0:
        raise ValueError(f"No CSV files found in {data_path}")
    
    # Load all CSV files and concatenate
    df_list = [pd.read_csv(file) for file in files]
    df = pd.concat(df_list, ignore_index=True)
    
    print(f"Loaded {len(df)} rows")
    return df


def prepare_features(df, target_column='price'):
    """Prepare features and target"""
    # Separate features and target
    X = df.drop([target_column], axis=1)
    y = df[target_column]
    
    # Handle categorical variables (one-hot encoding)
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    
    if len(categorical_cols) > 0:
        print(f"Encoding categorical columns: {categorical_cols}")
        X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)
    
    # Handle missing values
    X = X.fillna(X.mean())
    
    print(f"Feature shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    
    return X, y


def train_model(X_train, y_train, X_val, y_val, params, num_round):
    """Train XGBoost model"""
    print("Training XGBoost model...")
    
    # Create DMatrix for XGBoost
    dtrain = xgb.DMatrix(X_train, label=y_train)
    dval = xgb.DMatrix(X_val, label=y_val)
    
    # Watchlist for monitoring
    watchlist = [(dtrain, 'train'), (dval, 'validation')]
    
    # Train model
    model = xgb.train(
        params=params,
        dtrain=dtrain,
        num_boost_round=num_round,
        evals=watchlist,
        early_stopping_rounds=10,
        verbose_eval=10
    )
    
    print("Training completed!")
    return model


def evaluate_model(model, X_val, y_val):
    """Evaluate model performance"""
    print("Evaluating model...")
    
    # Create DMatrix for validation
    dval = xgb.DMatrix(X_val)
    
    # Make predictions
    y_pred = model.predict(dval)
    
    # Calculate metrics
    rmse = np.sqrt(mean_squared_error(y_val, y_pred))
    mae = mean_absolute_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)
    
    metrics = {
        'rmse': float(rmse),
        'mae': float(mae),
        'r2': float(r2)
    }
    
    print(f"Validation Metrics:")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  MAE: {mae:.2f}")
    print(f"  R²: {r2:.4f}")
    
    return metrics


def save_model(model, model_dir, feature_names):
    """Save trained model and metadata"""
    print(f"Saving model to {model_dir}")
    
    # Save XGBoost model
    model_path = os.path.join(model_dir, 'xgboost-model')
    model.save_model(model_path)
    
    # Save feature names for inference
    feature_names_path = os.path.join(model_dir, 'feature_names.json')
    with open(feature_names_path, 'w') as f:
        json.dump(feature_names, f)
    
    print("Model saved successfully!")


def main():
    """Main training function"""
    args = parse_args()
    
    # Load training data
    train_df = load_data(args.train)
    val_df = load_data(args.validation)
    
    # Prepare features
    X_train, y_train = prepare_features(train_df)
    X_val, y_val = prepare_features(val_df)
    
    # Ensure same columns in train and validation
    # (important after one-hot encoding)
    X_val = X_val.reindex(columns=X_train.columns, fill_value=0)
    
    # XGBoost parameters
    params = {
        'objective': args.objective,
        'max_depth': args.max_depth,
        'eta': args.eta,
        'subsample': args.subsample,
        'colsample_bytree': args.colsample_bytree,
        'min_child_weight': args.min_child_weight,
        'gamma': args.gamma,
        'eval_metric': 'rmse',
        'seed': 42
    }
    
    print(f"Training with parameters: {params}")
    
    # Train model
    model = train_model(X_train, y_train, X_val, y_val, params, args.num_round)
    
    # Evaluate model
    metrics = evaluate_model(model, X_val, y_val)
    
    # Save metrics
    metrics_path = os.path.join(args.output_data_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f)
    
    # Save model
    save_model(model, args.model_dir, X_train.columns.tolist())
    
    print("Training pipeline completed successfully!")


if __name__ == '__main__':
    main()
