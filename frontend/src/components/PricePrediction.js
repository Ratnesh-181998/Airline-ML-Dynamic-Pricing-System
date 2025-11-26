import React, { useState } from 'react';
import { DollarSign, Calendar, MapPin, Users, Plane, TrendingUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import './PricePrediction.css';

const PricePrediction = () => {
    const [formData, setFormData] = useState({
        origin: 'SFO',
        destination: 'JFK',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        stops: 0,
        airline: 'AA'
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const airports = [
        { code: 'SFO', name: 'San Francisco' },
        { code: 'JFK', name: 'New York JFK' },
        { code: 'LAX', name: 'Los Angeles' },
        { code: 'ORD', name: 'Chicago O\'Hare' },
        { code: 'DFW', name: 'Dallas/Fort Worth' },
        { code: 'DEN', name: 'Denver' },
        { code: 'ATL', name: 'Atlanta' },
        { code: 'SEA', name: 'Seattle' },
        { code: 'BOS', name: 'Boston' },
        { code: 'MIA', name: 'Miami' }
    ];

    const airlines = [
        { code: 'AA', name: 'American Airlines' },
        { code: 'UA', name: 'United Airlines' },
        { code: 'DL', name: 'Delta Air Lines' },
        { code: 'WN', name: 'Southwest' },
        { code: 'B6', name: 'JetBlue' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const basePrice = 250;
            const randomFactor = Math.random() * 100;
            const stopsPenalty = formData.stops * 30;
            const passengerMultiplier = formData.passengers;

            const predictedPrice = (basePrice + randomFactor - stopsPenalty) * passengerMultiplier;
            const confidence = 0.85 + Math.random() * 0.1;

            setPrediction({
                price: predictedPrice.toFixed(2),
                confidence: (confidence * 100).toFixed(1),
                priceRange: {
                    min: (predictedPrice * 0.9).toFixed(2),
                    max: (predictedPrice * 1.1).toFixed(2)
                },
                factors: [
                    { name: 'Route Popularity', impact: 'High', value: '+$45' },
                    { name: 'Days Until Departure', impact: 'Medium', value: '+$22' },
                    { name: 'Seasonal Demand', impact: 'Low', value: '+$8' },
                    { name: 'Competitor Pricing', impact: 'Medium', value: '-$15' }
                ],
                recommendations: [
                    'Book 2-3 weeks in advance for best prices',
                    'Consider flying on Tuesday or Wednesday',
                    'Direct flights are 15% more expensive'
                ]
            });

            setLoading(false);
            toast.success('Price prediction generated successfully!');
        }, 1500);
    };

    return (
        <div className="price-prediction">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Price Prediction</h1>
                    <p className="page-subtitle">AI-powered flight price forecasting</p>
                </div>
            </div>

            <div className="prediction-grid grid grid-cols-2">
                {/* Input Form */}
                <div className="card prediction-form-card">
                    <div className="card-header">
                        <h3 className="card-title">Flight Details</h3>
                        <span className="badge badge-primary">
                            <Sparkles size={12} />
                            ML Powered
                        </span>
                    </div>

                    <form onSubmit={handlePredict} className="prediction-form">
                        {/* Origin & Destination */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <MapPin size={16} />
                                    Origin
                                </label>
                                <select
                                    name="origin"
                                    value={formData.origin}
                                    onChange={handleInputChange}
                                    className="select"
                                    required
                                >
                                    {airports.map(airport => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <MapPin size={16} />
                                    Destination
                                </label>
                                <select
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    className="select"
                                    required
                                >
                                    {airports.map(airport => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <Calendar size={16} />
                                    Departure Date
                                </label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Calendar size={16} />
                                    Return Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleInputChange}
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* Passengers & Stops */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <Users size={16} />
                                    Passengers
                                </label>
                                <select
                                    name="passengers"
                                    value={formData.passengers}
                                    onChange={handleInputChange}
                                    className="select"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Plane size={16} />
                                    Stops
                                </label>
                                <select
                                    name="stops"
                                    value={formData.stops}
                                    onChange={handleInputChange}
                                    className="select"
                                >
                                    <option value={0}>Non-stop</option>
                                    <option value={1}>1 Stop</option>
                                    <option value={2}>2+ Stops</option>
                                </select>
                            </div>
                        </div>

                        {/* Airline */}
                        <div className="form-group">
                            <label className="form-label">
                                <Plane size={16} />
                                Preferred Airline
                            </label>
                            <select
                                name="airline"
                                value={formData.airline}
                                onChange={handleInputChange}
                                className="select"
                            >
                                {airlines.map(airline => (
                                    <option key={airline.code} value={airline.code}>
                                        {airline.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin">⏳</div>
                                    Predicting...
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={20} />
                                    Predict Price
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Prediction Results */}
                <div className="prediction-results">
                    {prediction ? (
                        <>
                            {/* Price Card */}
                            <div className="card price-result-card">
                                <div className="price-result-header">
                                    <DollarSign size={32} className="price-icon" />
                                    <div>
                                        <p className="price-label">Predicted Price</p>
                                        <h2 className="price-value">${prediction.price}</h2>
                                        <p className="price-confidence">
                                            {prediction.confidence}% confidence
                                        </p>
                                    </div>
                                </div>

                                <div className="price-range">
                                    <div className="price-range-item">
                                        <span className="price-range-label">Min</span>
                                        <span className="price-range-value">${prediction.priceRange.min}</span>
                                    </div>
                                    <div className="price-range-bar">
                                        <div className="price-range-indicator"></div>
                                    </div>
                                    <div className="price-range-item">
                                        <span className="price-range-label">Max</span>
                                        <span className="price-range-value">${prediction.priceRange.max}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Factors */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Price Factors</h3>
                                </div>
                                <div className="factors-list">
                                    {prediction.factors.map((factor, index) => (
                                        <div key={index} className="factor-item">
                                            <div className="factor-info">
                                                <span className="factor-name">{factor.name}</span>
                                                <span className={`factor-impact badge badge-${factor.impact === 'High' ? 'error' :
                                                        factor.impact === 'Medium' ? 'warning' : 'success'
                                                    }`}>
                                                    {factor.impact}
                                                </span>
                                            </div>
                                            <span className="factor-value">{factor.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Recommendations</h3>
                                </div>
                                <ul className="recommendations-list">
                                    {prediction.recommendations.map((rec, index) => (
                                        <li key={index} className="recommendation-item">
                                            <Sparkles size={16} className="recommendation-icon" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="card empty-state">
                            <div className="empty-state-content">
                                <DollarSign size={64} className="empty-state-icon" />
                                <h3 className="empty-state-title">No Prediction Yet</h3>
                                <p className="empty-state-text">
                                    Fill in the flight details and click "Predict Price" to get AI-powered price predictions
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricePrediction;
