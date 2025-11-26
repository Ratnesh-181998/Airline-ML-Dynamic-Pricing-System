import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, Users,
    Plane, AlertCircle, Activity, Zap, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = ({ systemStats }) => {
    const [priceData, setPriceData] = useState([]);
    const [demandData, setDemandData] = useState([]);
    const [routeData, setRouteData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Generate sample data
    const generateData = () => {
        // Price trends over time
        const prices = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            avgPrice: 250 + Math.random() * 100,
            predictions: 240 + Math.random() * 110,
        }));
        setPriceData(prices);

        // Demand by day of week
        const demand = [
            { day: 'Mon', searches: 1200 + Math.random() * 200, bookings: 450 + Math.random() * 100 },
            { day: 'Tue', searches: 1100 + Math.random() * 200, bookings: 420 + Math.random() * 100 },
            { day: 'Wed', searches: 1300 + Math.random() * 200, bookings: 480 + Math.random() * 100 },
            { day: 'Thu', searches: 1400 + Math.random() * 200, bookings: 520 + Math.random() * 100 },
            { day: 'Fri', searches: 1800 + Math.random() * 200, bookings: 680 + Math.random() * 100 },
            { day: 'Sat', searches: 2100 + Math.random() * 200, bookings: 820 + Math.random() * 100 },
            { day: 'Sun', searches: 1900 + Math.random() * 200, bookings: 750 + Math.random() * 100 },
        ];
        setDemandData(demand);

        // Top routes
        const routes = [
            { route: 'SFO-JFK', value: 2500 + Math.floor(Math.random() * 500), color: '#2563eb' },
            { route: 'LAX-ORD', value: 2100 + Math.floor(Math.random() * 500), color: '#7c3aed' },
            { route: 'DFW-ATL', value: 1800 + Math.floor(Math.random() * 500), color: '#f59e0b' },
            { route: 'SEA-BOS', value: 1500 + Math.floor(Math.random() * 500), color: '#10b981' },
            { route: 'MIA-DEN', value: 1200 + Math.floor(Math.random() * 500), color: '#ef4444' },
        ];
        setRouteData(routes);
    };

    useEffect(() => {
        generateData();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            generateData();
            setIsRefreshing(false);
            toast.success('Dashboard data refreshed successfully');
        }, 1500);
    };

    const handleAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate complex analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            toast.success('System analysis completed. Report generated.');
        }, 2000);
    };

    const stats = [
        {
            title: 'Total Revenue',
            value: '$2.4M',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'success'
        },
        {
            title: 'Active Users',
            value: '45.2K',
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'info'
        },
        {
            title: 'Flight Searches',
            value: systemStats.totalSearches.toLocaleString(),
            change: '+15.3%',
            trend: 'up',
            icon: Plane,
            color: 'primary'
        },
        {
            title: 'Model Accuracy',
            value: `${(systemStats.modelAccuracy * 100).toFixed(1)}%`,
            change: '+2.1%',
            trend: 'up',
            icon: Activity,
            color: 'warning'
        },
    ];

    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Real-time analytics and system performance</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleAnalysis}
                        disabled={isAnalyzing}
                    >
                        <Zap size={18} className={isAnalyzing ? 'pulse' : ''} />
                        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid grid grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="stat-card card">
                            <div className="stat-header">
                                <div className={`stat-icon stat-icon-${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`stat-change badge badge-${stat.trend === 'up' ? 'success' : 'error'}`}>
                                    {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.change}
                                </span>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid grid grid-cols-2">
                {/* Price Trends Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Price Trends (24h)</h3>
                        <span className="badge badge-info">Live</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={priceData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="hour" stroke="#94a3b8" />
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
                                    dataKey="avgPrice"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    name="Actual Price"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="predictions"
                                    stroke="#7c3aed"
                                    fillOpacity={1}
                                    fill="url(#colorPrediction)"
                                    name="Predicted Price"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demand Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Weekly Demand</h3>
                        <span className="badge badge-success">Updated</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={demandData}>
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
                                <Bar dataKey="searches" fill="#2563eb" name="Searches" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="bookings" fill="#10b981" name="Bookings" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Routes */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Top Routes</h3>
                        <span className="badge badge-warning">Popular</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={routeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ route, percent }) => `${route} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {routeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Alerts</h3>
                        <span className="badge badge-error">3 New</span>
                    </div>
                    <div className="alerts-list">
                        <div className="alert-item alert-warning">
                            <AlertCircle size={20} />
                            <div className="alert-content">
                                <p className="alert-title">Price Spike Detected</p>
                                <p className="alert-time">SFO-JFK route • 5 min ago</p>
                            </div>
                        </div>
                        <div className="alert-item alert-info">
                            <Activity size={20} />
                            <div className="alert-content">
                                <p className="alert-title">High Demand Period</p>
                                <p className="alert-time">Weekend bookings • 15 min ago</p>
                            </div>
                        </div>
                        <div className="alert-item alert-success">
                            <TrendingUp size={20} />
                            <div className="alert-content">
                                <p className="alert-title">Model Accuracy Improved</p>
                                <p className="alert-time">XGBoost model • 1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
