"""
Kinesis Data Producer for Airline Ticket Shopping Data

This script simulates real-time flight search data and streams it to
Amazon Kinesis Data Streams.

Features:
- Generate realistic flight search events
- Stream data to Kinesis in real-time
- Support for multiple airlines and routes
- Configurable data generation rate

Author: Ratnesh Data Engineering Team
Date: 2024-01-20
"""

import boto3
import json
import random
import time
from datetime import datetime, timedelta
from typing import Dict, List
import argparse


class FlightDataGenerator:
    """Generate realistic flight search data"""
    
    # Sample data
    AIRPORTS = [
        'SFO', 'JFK', 'LAX', 'ORD', 'DFW', 'DEN', 'ATL', 'SEA', 'BOS', 'MIA',
        'LAS', 'PHX', 'IAH', 'MCO', 'EWR', 'MSP', 'DTW', 'PHL', 'LGA', 'BWI'
    ]
    
    AIRLINES = [
        'AA', 'UA', 'DL', 'WN', 'B6', 'AS', 'NK', 'F9', 'G4', 'SY'
    ]
    
    DEVICES = ['Web', 'iOS', 'Android', 'Mobile Web']
    
    COUNTRIES = ['US', 'CA', 'MX', 'UK', 'DE', 'FR', 'JP', 'AU', 'BR', 'IN']
    
    def __init__(self):
        self.search_counter = 0
    
    def generate_search_event(self) -> Dict:
        """Generate a single flight search event"""
        self.search_counter += 1
        
        # Random origin and destination (ensure they're different)
        origin = random.choice(self.AIRPORTS)
        destination = random.choice([a for a in self.AIRPORTS if a != origin])
        
        # Random departure date (1-90 days from now)
        days_ahead = random.randint(1, 90)
        departure_date = (datetime.now() + timedelta(days=days_ahead)).strftime('%Y-%m-%d')
        
        # Random return date (for round trips, 50% chance)
        is_round_trip = random.random() > 0.5
        return_date = None
        if is_round_trip:
            trip_duration = random.randint(2, 14)
            return_date = (datetime.now() + timedelta(days=days_ahead + trip_duration)).strftime('%Y-%m-%d')
        
        # Generate price offers from multiple airlines
        num_offers = random.randint(2, 5)
        price_offers = []
        
        for _ in range(num_offers):
            airline = random.choice(self.AIRLINES)
            base_price = random.uniform(150, 800)
            stops = random.choices([0, 1, 2], weights=[0.6, 0.3, 0.1])[0]
            
            # Adjust price based on stops
            price = base_price - (stops * random.uniform(20, 50))
            
            price_offers.append({
                'airline': airline,
                'flight_number': f'{airline}{random.randint(100, 9999)}',
                'price': round(price, 2),
                'stops': stops
            })
        
        # Create search event
        event = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'search_id': f'search_{self.search_counter}_{int(time.time())}',
            'user_id': f'user_{random.randint(1000, 9999)}',
            'origin_airport': origin,
            'destination_airport': destination,
            'departure_date': departure_date,
            'return_date': return_date,
            'number_of_passengers': random.choices([1, 2, 3, 4], weights=[0.5, 0.3, 0.15, 0.05])[0],
            'currency': 'USD',
            'price_offers': price_offers,
            'user_location': {
                'ip_address': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}',
                'country': random.choice(self.COUNTRIES)
            },
            'device_info': {
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'platform': random.choice(self.DEVICES)
            }
        }
        
        return event


class KinesisProducer:
    """Stream data to Amazon Kinesis"""
    
    def __init__(self, stream_name: str, region_name: str = 'us-east-1'):
        """
        Initialize Kinesis producer
        
        Args:
            stream_name: Name of the Kinesis stream
            region_name: AWS region
        """
        self.stream_name = stream_name
        self.kinesis_client = boto3.client('kinesis', region_name=region_name)
        self.data_generator = FlightDataGenerator()
    
    def send_record(self, data: Dict) -> Dict:
        """
        Send a single record to Kinesis
        
        Args:
            data: Dictionary containing the event data
        
        Returns:
            Response from Kinesis PutRecord API
        """
        # Convert data to JSON
        data_json = json.dumps(data)
        
        # Use search_id as partition key for even distribution
        partition_key = data['search_id']
        
        # Send to Kinesis
        response = self.kinesis_client.put_record(
            StreamName=self.stream_name,
            Data=data_json,
            PartitionKey=partition_key
        )
        
        return response
    
    def stream_data(self, num_records: int = 100, delay_seconds: float = 0.1):
        """
        Stream multiple records to Kinesis
        
        Args:
            num_records: Number of records to generate and send
            delay_seconds: Delay between records (to simulate real-time)
        """
        print(f"Starting to stream {num_records} records to Kinesis stream: {self.stream_name}")
        print(f"Delay between records: {delay_seconds} seconds")
        
        success_count = 0
        error_count = 0
        
        for i in range(num_records):
            try:
                # Generate event
                event = self.data_generator.generate_search_event()
                
                # Send to Kinesis
                response = self.send_record(event)
                
                success_count += 1
                
                if (i + 1) % 10 == 0:
                    print(f"Sent {i + 1}/{num_records} records (Success: {success_count}, Errors: {error_count})")
                
                # Delay before next record
                time.sleep(delay_seconds)
                
            except Exception as e:
                error_count += 1
                print(f"Error sending record {i + 1}: {str(e)}")
        
        print(f"\nStreaming completed!")
        print(f"Total records sent: {success_count}")
        print(f"Total errors: {error_count}")


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Stream flight search data to Kinesis')
    parser.add_argument('--stream-name', type=str, default='airline-flight-searches',
                        help='Name of the Kinesis stream')
    parser.add_argument('--region', type=str, default='us-east-1',
                        help='AWS region')
    parser.add_argument('--num-records', type=int, default=100,
                        help='Number of records to generate')
    parser.add_argument('--delay', type=float, default=0.1,
                        help='Delay between records in seconds')
    
    args = parser.parse_args()
    
    # Create producer
    producer = KinesisProducer(
        stream_name=args.stream_name,
        region_name=args.region
    )
    
    # Stream data
    producer.stream_data(
        num_records=args.num_records,
        delay_seconds=args.delay
    )


if __name__ == '__main__':
    main()
