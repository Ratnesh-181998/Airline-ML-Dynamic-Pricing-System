import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, Calendar, Users, Plane,
    ArrowUp, ArrowDown, Activity, Target, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './DemandForecasting.css';

const DemandForecasting = () => {
    const [forecastData, setForecastData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [routeDemand, setRouteDemand] = useState([]);

    // Date state
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(nextWeek.toISOString().split('T')[0]);
    const [isRunningForecast, setIsRunningForecast] = useState(false);

    const generateData = (start, end) => {
        const startDt = new Date(start);
        const endDt = new Date(end);

        // Calculate difference in days
        const diffTime = Math.abs(endDt - startDt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

        // Generate forecast based on date range
        const forecast = Array.from({ length: diffDays }, (_, i) => {
            const date = new Date(startDt);
            date.setDate(date.getDate() + i);
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                predicted: 1200 + Math.random() * 400,
                actual: i === 0 ? 1350 : null,
                confidence: 85 + Math.random() * 10
            };
        });
        setForecastData(forecast);

        // Generate monthly trend
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthly = months.map(month => ({
            month,
            bookings: 15000 + Math.random() * 5000,
            searches: 45000 + Math.random() * 15000,
            conversion: 25 + Math.random() * 10
        }));
        setMonthlyData(monthly);

        // Generate route demand
        const routes = [
            { route: 'SFO-JFK', demand: 2500 + Math.floor(Math.random() * 500), growth: 12.5, trend: 'up' },
            { route: 'LAX-ORD', demand: 2100 + Math.floor(Math.random() * 500), growth: 8.3, trend: 'up' },
            { route: 'DFW-ATL', demand: 1800 + Math.floor(Math.random() * 500), growth: -2.1, trend: 'down' },
            { route: 'SEA-BOS', demand: 1500 + Math.floor(Math.random() * 500), growth: 15.7, trend: 'up' },
            { route: 'MIA-DEN', demand: 1200 + Math.floor(Math.random() * 500), growth: 5.2, trend: 'up' }
        ];
        setRouteDemand(routes);
    };

    useEffect(() => {
        generateData(startDate, endDate);
    }, [startDate, endDate]);

    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
            if (new Date(value) > new Date(endDate)) {
                setEndDate(value);
            }
        } else {
            setEndDate(value);
            if (new Date(value) < new Date(startDate)) {
                setStartDate(value);
            }
        }
    };

    const handleRunForecast = () => {
        setIsRunningForecast(true);
        // Simulate ML forecast run
        setTimeout(() => {
            generateData(startDate, endDate);
            setIsRunningForecast(false);
            toast.success('New forecast generated successfully');
        }, 2000);
    };

    const metrics = [
        {
            title: `Forecast Range`,
            value: `${Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} Days`,
            change: 'Custom Period',
            trend: 'up',
            icon: Calendar,
            color: 'primary'
        },
        {
            title: 'Peak Day',
            value: 'Friday',
            change: '1,580 bookings',
            trend: 'up',
            icon: TrendingUp,
            color: 'success'
        },
        {
            title: 'Avg Conversion',
            value: '32.5%',
            change: '+2.1%',
            trend: 'up',
            icon: Target,
            color: 'info'
        },
        {
            title: 'Forecast Accuracy',
            value: '89.2%',
            change: '+1.5%',
            trend: 'up',
            icon: Activity,
            color: 'warning'
        }
    ];

    return (
        <div className="demand-forecasting">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Demand Forecasting</h1>
                    <p className="page-subtitle">AI-powered booking volume and search pattern predictions</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker-container">
                        <div className="date-input-group">
                            <label>From</label>
                            <input
                                type="date"
                                className="date-input"
                                value={startDate}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                            />
                        </div>
                        <div className="date-input-group">
                            <label>To</label>
                            <input
                                type="date"
                                className="date-input"
                                value={endDate}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleRunForecast}
                        disabled={isRunningForecast}
                    >
                        {isRunningForecast ? <RefreshCw size={18} className="spin" /> : <Activity size={18} />}
                        {isRunningForecast ? 'Running...' : 'Run Forecast'}
                    </button>
                </div>
            </div>


            {/* Metrics Grid */}
            <div className="stats-grid grid grid-cols-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="stat-card card">
                            <div className="stat-header">
                                <div className={`stat-icon stat-icon-${metric.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`stat-change badge badge-${metric.trend === 'up' ? 'success' : 'error'}`}>
                                    {metric.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {metric.change}
                                </span>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{metric.value}</h3>
                                <p className="stat-label">{metric.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid grid grid-cols-2">
                {/* 7-Day Forecast */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">7-Day Booking Forecast</h3>
                        <span className="badge badge-success">ML Powered</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorPredicted)"
                                    name="Predicted Bookings"
                                />
                                {forecastData[0]?.actual && (
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 6 }}
                                        name="Actual"
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Monthly Trend</h3>
                        <span className="badge badge-info">6 Months</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    name="Bookings"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="searches"
                                    stroke="#7c3aed"
                                    strokeWidth={2}
                                    name="Searches"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Route Demand */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Route Demand Forecast</h3>
                        <span className="badge badge-warning">Top 5</span>
                    </div>
                    <div className="route-demand-list">
                        {routeDemand.map((route, index) => (
                            <div key={index} className="route-item">
                                <div className="route-info">
                                    <Plane size={20} className="route-icon" />
                                    <div>
                                        <p className="route-name">{route.route}</p>
                                        <p className="route-demand">{route.demand.toLocaleString()} bookings/week</p>
                                    </div>
                                </div>
                                <div className="route-growth">
                                    <span className={`growth-badge badge badge-${route.trend === 'up' ? 'success' : 'error'}`}>
                                        {route.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                        {Math.abs(route.growth)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Forecast Details */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Forecast Insights</h3>
                        <span className="badge badge-primary">AI Analysis</span>
                    </div>
                    <div className="insights-list">
                        <div className="insight-item">
                            <div className="insight-icon insight-success">
                                <TrendingUp size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Peak Demand Expected</p>
                                <p className="insight-text">Friday shows 18% higher bookings than average</p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon insight-info">
                                <Calendar size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Weekend Surge</p>
                                <p className="insight-text">Saturday-Sunday bookings up 25% from last week</p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon insight-warning">
                                <Users size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Capacity Alert</p>
                                <p className="insight-text">SFO-JFK route approaching 85% capacity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandForecasting;
