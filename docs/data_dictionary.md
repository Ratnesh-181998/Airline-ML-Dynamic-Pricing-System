# Data Dictionary - Airline Ticket Shopping System

This document describes all data fields used in the system.

---

## Raw Data Schema (JSON)

### Flight Search Event

| Field Name | Data Type | Description | Example | Required |
|------------|-----------|-------------|---------|----------|
| `timestamp` | String (ISO 8601) | UTC timestamp of search | `"2024-01-20T10:30:00Z"` | Yes |
| `search_id` | String | Unique identifier for search | `"search_12345_1705750200"` | Yes |
| `user_id` | String | Anonymized user identifier | `"user_4567"` | Yes |
| `origin_airport` | String (IATA code) | Departure airport | `"SFO"` | Yes |
| `destination_airport` | String (IATA code) | Arrival airport | `"JFK"` | Yes |
| `departure_date` | String (YYYY-MM-DD) | Departure date | `"2024-02-22"` | Yes |
| `return_date` | String (YYYY-MM-DD) | Return date (null for one-way) | `"2024-03-01"` | No |
| `number_of_passengers` | Integer | Number of passengers | `2` | Yes |
| `currency` | String (ISO 4217) | Currency code | `"USD"` | Yes |
| `price_offers` | Array | Array of price offers | See below | Yes |
| `user_location` | Object | User location information | See below | Yes |
| `device_info` | Object | Device information | See below | Yes |

### Price Offer Object

| Field Name | Data Type | Description | Example | Required |
|------------|-----------|-------------|---------|----------|
| `airline` | String (IATA code) | Airline code | `"AA"` | Yes |
| `flight_number` | String | Flight number | `"AA123"` | Yes |
| `price` | Float | Ticket price | `300.50` | Yes |
| `stops` | Integer | Number of stops | `0` | Yes |

### User Location Object

| Field Name | Data Type | Description | Example | Required |
|------------|-----------|-------------|---------|----------|
| `ip_address` | String | IP address (anonymized) | `"192.168.1.1"` | Yes |
| `country` | String (ISO 3166) | Country code | `"US"` | Yes |

### Device Info Object

| Field Name | Data Type | Description | Example | Required |
|------------|-----------|-------------|---------|----------|
| `user_agent` | String | Browser user agent | `"Mozilla/5.0..."` | Yes |
| `platform` | String | Platform type | `"Web"` | Yes |

---

## Curated Data Schema (Parquet)

### Flight Searches Table

| Field Name | Data Type | Description | Derived From | ML Feature |
|------------|-----------|-------------|--------------|------------|
| `search_id` | String | Unique search identifier | Raw: `search_id` | No |
| `timestamp` | Timestamp | Search timestamp | Raw: `timestamp` | No |
| `user_id` | String | User identifier | Raw: `user_id` | Yes |
| `origin_airport` | String | Origin airport code | Raw: `origin_airport` | Yes |
| `destination_airport` | String | Destination airport code | Raw: `destination_airport` | Yes |
| `departure_date` | Date | Departure date | Raw: `departure_date` | Yes |
| `return_date` | Date | Return date | Raw: `return_date` | Yes |
| `airline` | String | Airline code | Raw: `price_offers.airline` | Yes |
| `flight_number` | String | Flight number | Raw: `price_offers.flight_number` | No |
| `price` | Double | Ticket price (USD) | Raw: `price_offers.price` | Yes (Target) |
| `stops` | Integer | Number of stops | Raw: `price_offers.stops` | Yes |
| `number_of_passengers` | Integer | Passenger count | Raw: `number_of_passengers` | Yes |
| `country` | String | User country | Raw: `user_location.country` | Yes |
| `platform` | String | Device platform | Raw: `device_info.platform` | Yes |

### Engineered Features

| Field Name | Data Type | Description | Calculation | ML Feature |
|------------|-----------|-------------|-------------|------------|
| `days_until_departure` | Integer | Days from search to departure | `departure_date - current_date` | Yes |
| `day_of_week` | Integer | Day of week (1=Sunday, 7=Saturday) | `DAYOFWEEK(departure_date)` | Yes |
| `week_of_year` | Integer | Week number (1-52) | `WEEKOFYEAR(departure_date)` | Yes |
| `month` | Integer | Month (1-12) | `MONTH(departure_date)` | Yes |
| `season` | Integer | Season (1=Winter, 2=Spring, 3=Summer, 4=Fall) | Derived from `month` | Yes |
| `is_weekend` | Integer | Weekend flag (0/1) | `day_of_week IN (1, 7)` | Yes |
| `is_round_trip` | Integer | Round trip flag (0/1) | `return_date IS NOT NULL` | Yes |
| `trip_duration_days` | Integer | Trip duration in days | `return_date - departure_date` | Yes |
| `route_popularity` | Integer | Number of searches for this route | `COUNT(*) OVER (PARTITION BY origin, destination)` | Yes |
| `route_avg_price` | Double | Average price for this route | `AVG(price) OVER (PARTITION BY origin, destination)` | Yes |
| `route_price_volatility` | Double | Price std dev for this route | `STDDEV(price) OVER (PARTITION BY origin, destination)` | Yes |
| `price_diff_from_avg` | Double | Price difference from route average | `price - route_avg_price` | Yes |

---

## ML Model Features

### Price Prediction Model

**Target Variable**: `price` (Double)

**Features** (25 total):

#### Categorical Features (One-Hot Encoded)
- `origin_airport` (20 categories)
- `destination_airport` (20 categories)
- `airline` (10 categories)
- `platform` (4 categories: Web, iOS, Android, Mobile Web)
- `country` (10 categories)

#### Numerical Features
- `days_until_departure`
- `day_of_week`
- `week_of_year`
- `month`
- `season`
- `is_weekend`
- `is_round_trip`
- `trip_duration_days`
- `stops`
- `number_of_passengers`
- `route_popularity`
- `route_avg_price`
- `route_price_volatility`
- `price_diff_from_avg`

---

## Data Quality Rules

### Validation Rules

| Field | Rule | Action on Violation |
|-------|------|---------------------|
| `price` | > 0 and < 10000 | Drop record |
| `days_until_departure` | >= 0 and <= 365 | Drop record |
| `origin_airport` | != `destination_airport` | Drop record |
| `departure_date` | >= current_date | Drop record |
| `return_date` | > `departure_date` (if not null) | Drop record |
| `stops` | >= 0 and <= 3 | Drop record |
| `number_of_passengers` | >= 1 and <= 9 | Drop record |

### Missing Value Handling

| Field | Strategy |
|-------|----------|
| `price` | Fill with route average |
| `stops` | Fill with 0 |
| `return_date` | Keep as null (one-way flight) |
| `route_avg_price` | Fill with global average |
| `route_price_volatility` | Fill with 0 |

---

## Data Retention Policy

| Data Type | Retention Period | Storage Class | Notes |
|-----------|------------------|---------------|-------|
| Raw Data | 90 days | S3 Standard | Then move to Glacier |
| Raw Data (Glacier) | 2 years | S3 Glacier | Then delete |
| Curated Data | 2 years | S3 Standard | For model retraining |
| Model Artifacts | Indefinite | S3 Standard | Version controlled |
| Logs | 30 days | CloudWatch Logs | Then delete |

---

## Data Privacy & Compliance

### PII (Personally Identifiable Information)

| Field | PII Status | Anonymization |
|-------|------------|---------------|
| `user_id` | Yes | Hashed (SHA-256) |
| `ip_address` | Yes | Masked (last octet) |
| `user_agent` | No | Stored as-is |

### GDPR Compliance
- **Right to Access**: Users can request their data via API
- **Right to Deletion**: User data deleted within 30 days of request
- **Data Minimization**: Only necessary fields collected
- **Consent**: Users must opt-in to data collection

---

## Sample Data

### Raw JSON Example
```json
{
  "timestamp": "2024-01-20T10:30:00Z",
  "search_id": "search_12345_1705750200",
  "user_id": "user_4567",
  "origin_airport": "SFO",
  "destination_airport": "JFK",
  "departure_date": "2024-02-22",
  "return_date": "2024-03-01",
  "number_of_passengers": 2,
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
    "ip_address": "192.168.1.1",
    "country": "US"
  },
  "device_info": {
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "platform": "Web"
  }
}
```

### Curated Parquet Example (as CSV)
```csv
search_id,timestamp,origin_airport,destination_airport,airline,price,days_until_departure,is_weekend,route_popularity,route_avg_price
search_12345,2024-01-20 10:30:00,SFO,JFK,AA,300.50,33,0,1500,320.00
```

---

**Last Updated**: January 2024
