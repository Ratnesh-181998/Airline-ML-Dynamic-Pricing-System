import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    BarChart3, TrendingUp, MapPin, DollarSign,
    Plane, Globe, Award, Calendar, Download, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './MarketAnalytics.css';

const MarketAnalytics = () => {
    const [popularRoutes, setPopularRoutes] = useState([]);
    const [seasonalTrends, setSeasonalTrends] = useState([]);
    const [priceDistribution, setPriceDistribution] = useState([]);
    const [topDestinations, setTopDestinations] = useState([]);

    // Date state
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(lastMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState(null);

    const generateData = () => {
        // Popular routes data
        const routes = [
            { route: 'SFO-JFK', searches: 12500 + Math.floor(Math.random() * 2000), bookings: 4200 + Math.floor(Math.random() * 500), avgPrice: 385 + Math.floor(Math.random() * 50) },
            { route: 'LAX-ORD', searches: 10800 + Math.floor(Math.random() * 2000), bookings: 3650 + Math.floor(Math.random() * 500), avgPrice: 295 + Math.floor(Math.random() * 50) },
            { route: 'DFW-ATL', searches: 9200 + Math.floor(Math.random() * 2000), bookings: 3100 + Math.floor(Math.random() * 500), avgPrice: 245 + Math.floor(Math.random() * 50) },
            { route: 'SEA-BOS', searches: 7500 + Math.floor(Math.random() * 2000), bookings: 2400 + Math.floor(Math.random() * 500), avgPrice: 425 + Math.floor(Math.random() * 50) },
            { route: 'MIA-DEN', searches: 6800 + Math.floor(Math.random() * 2000), bookings: 2150 + Math.floor(Math.random() * 500), avgPrice: 315 + Math.floor(Math.random() * 50) }
        ];
        setPopularRoutes(routes);

        // Seasonal trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const seasonal = months.map(month => ({
            month,
            avgPrice: 250 + Math.floor(Math.random() * 150),
            volume: 15000 + Math.floor(Math.random() * 10000)
        }));
        setSeasonalTrends(seasonal);

        // Price distribution
        const distribution = [
            { range: '$0-$200', count: 1200 + Math.floor(Math.random() * 200), color: '#10b981' },
            { range: '$200-$400', count: 3500 + Math.floor(Math.random() * 500), color: '#2563eb' },
            { range: '$400-$600', count: 2100 + Math.floor(Math.random() * 300), color: '#7c3aed' },
            { range: '$600-$800', count: 800 + Math.floor(Math.random() * 100), color: '#f59e0b' },
            { range: '$800+', count: 400 + Math.floor(Math.random() * 50), color: '#ef4444' }
        ];
        setPriceDistribution(distribution);

        // Top destinations
        const destinations = [
            { city: 'New York', searches: 25000 + Math.floor(Math.random() * 5000), growth: 15.2 },
            { city: 'Los Angeles', searches: 22000 + Math.floor(Math.random() * 4000), growth: 12.8 },
            { city: 'Chicago', searches: 18500 + Math.floor(Math.random() * 3000), growth: 8.5 },
            { city: 'Miami', searches: 16000 + Math.floor(Math.random() * 3000), growth: 18.3 },
            { city: 'Seattle', searches: 14500 + Math.floor(Math.random() * 2000), growth: 22.1 }
        ];
        setTopDestinations(destinations);
    };

    useEffect(() => {
        generateData();
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

    const handleExport = () => {
        setIsExporting(true);

        try {
            // Prepare CSV data
            const headers = ['Route', 'Searches', 'Bookings', 'Avg Price'];
            const rows = popularRoutes.map(r => [r.route, r.searches, r.bookings, r.avgPrice]);

            let csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");

            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `market_analysis_${startDate}_${endDate}.csv`);
            document.body.appendChild(link);

            // Trigger download
            link.click();
            document.body.removeChild(link);

            toast.success('Report downloaded successfully');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export report');
        } finally {
            setIsExporting(false);
        }
    };

    const insightDetails = {
        'Peak Season': {
            title: 'Peak Season Analysis',
            content: 'Detailed analysis of summer travel trends indicates a significant surge in demand during June through August. Historical data shows a consistent 35% increase in booking volume compared to the annual average. This period presents a prime opportunity for yield management strategies, with average ticket prices naturally supporting a $120 premium. Recommendation: Increase inventory allocation for leisure destinations and implement dynamic pricing rules to capitalize on high demand.',
            stats: [
                { label: 'Demand Increase', value: '+35%' },
                { label: 'Price Premium', value: '+$120' },
                { label: 'Key Months', value: 'Jun-Aug' }
            ]
        },
        'Emerging Routes': {
            title: 'Emerging Routes Report',
            content: 'West Coast to East Coast transcontinental routes are experiencing rapid growth, outpacing overall market expansion. Specifically, routes connecting tech hubs (e.g., SEA-BOS, SFO-NYC) are seeing a 22% year-over-year increase in search volume. This growth is largely driven by a resurgence in business travel and remote work flexibility. Recommendation: Evaluate feasibility for increasing frequency on these corridors and target marketing campaigns towards business travelers.',
            stats: [
                { label: 'YoY Growth', value: '+22%' },
                { label: 'Primary Driver', value: 'Business' },
                { label: 'Top Corridor', value: 'West-East' }
            ]
        },
        'Price Optimization': {
            title: 'Pricing Strategy Insights',
            content: 'Analysis of booking curves reveals that the optimal booking window for maximizing revenue while maintaining conversion rates is 3-4 weeks prior to departure. Tickets booked in this window offer the best balance of value for customers (avg. $85 savings) and yield for the airline. Late bookings (<7 days) show high price elasticity, suggesting potential for aggressive premium pricing. Recommendation: Adjust advance purchase requirements and promotional availability to steer bookings into the optimal 21-28 day window.',
            stats: [
                { label: 'Optimal Window', value: '21-28 Days' },
                { label: 'Avg Savings', value: '$85' },
                { label: 'Conversion Impact', value: 'High' }
            ]
        }
    };

    const handleInsightClick = (type) => {
        setSelectedInsight(insightDetails[type]);
    };

    const closeModal = () => {
        setSelectedInsight(null);
    };

    const handleDownloadAnalysis = () => {
        if (!selectedInsight) return;

        const reportContent = `
MARKET INTELLIGENCE REPORT
==========================
Topic: ${selectedInsight.title}
Date: ${new Date().toLocaleDateString()}
Period: ${startDate} to ${endDate}

EXECUTIVE SUMMARY
----------------
${selectedInsight.content}

KEY PERFORMANCE INDICATORS
-------------------------
${selectedInsight.stats.map(s => `${s.label}: ${s.value}`).join('\n')}

STRATEGIC RECOMMENDATIONS
------------------------
1. Leverage the identified trends to optimize inventory allocation.
2. Adjust pricing strategies in line with the ${selectedInsight.stats[0].value} shift in demand/value.
3. Monitor these metrics weekly to ensure sustained performance.

----------------
Generated by SkyOps Analytics System
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedInsight.title.replace(/\s+/g, '_').toLowerCase()}_report.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Analysis report downloaded successfully');
    };

    const metrics = [
        {
            title: 'Total Routes',
            value: '245',
            change: '+12 new',
            icon: Plane,
            color: 'primary'
        },
        {
            title: 'Avg Ticket Price',
            value: '$342',
            change: '+5.2%',
            icon: DollarSign,
            color: 'success'
        },
        {
            title: 'Top Destination',
            value: 'New York',
            change: '25K searches',
            icon: MapPin,
            color: 'info'
        },
        {
            title: 'Market Growth',
            value: '18.5%',
            change: 'YoY',
            icon: TrendingUp,
            color: 'warning'
        }
    ];

    return (
        <div className="market-analytics">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Market Analytics</h1>
                    <p className="page-subtitle">Comprehensive market trends and route analysis</p>
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
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? <Download size={18} className="pulse" /> : <BarChart3 size={18} />}
                        {isExporting ? 'Exporting...' : 'Export Report'}
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
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{metric.value}</h3>
                                <p className="stat-label">{metric.title}</p>
                                <span className="stat-change">{metric.change}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid grid grid-cols-2">
                {/* Popular Routes */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Most Popular Routes</h3>
                        <span className="badge badge-primary">Top 5</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={popularRoutes} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="route" type="category" stroke="#94a3b8" width={80} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="searches" fill="#2563eb" name="Searches" radius={[0, 8, 8, 0]} />
                                <Bar dataKey="bookings" fill="#10b981" name="Bookings" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Seasonal Trends */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Seasonal Price Trends</h3>
                        <span className="badge badge-info">12 Months</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={seasonalTrends}>
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
                                    dataKey="avgPrice"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    name="Avg Price ($)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Price Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Price Distribution</h3>
                        <span className="badge badge-success">Current Month</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={priceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {priceDistribution.map((entry, index) => (
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

                {/* Top Destinations */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Top Destinations</h3>
                        <span className="badge badge-warning">Trending</span>
                    </div>
                    <div className="destinations-list">
                        {topDestinations.map((dest, index) => (
                            <div key={index} className="destination-item">
                                <div className="destination-rank">#{index + 1}</div>
                                <div className="destination-info">
                                    <Globe size={20} className="destination-icon" />
                                    <div>
                                        <p className="destination-name">{dest.city}</p>
                                        <p className="destination-searches">{dest.searches.toLocaleString()} searches</p>
                                    </div>
                                </div>
                                <div className="destination-growth">
                                    <span className="badge badge-success">
                                        <TrendingUp size={12} />
                                        +{dest.growth}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Market Insights */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Market Insights</h3>
                    <span className="badge badge-primary">AI Powered</span>
                </div>
                <div className="insights-grid grid grid-cols-3">
                    <div className="insight-card" onClick={() => handleInsightClick('Peak Season')}>
                        <Award size={32} className="insight-icon-large" />
                        <h4 className="insight-card-title">Peak Season</h4>
                        <p className="insight-card-text">
                            Summer months (Jun-Aug) show 35% higher demand with average prices increasing by $120
                        </p>
                    </div>
                    <div className="insight-card" onClick={() => handleInsightClick('Emerging Routes')}>
                        <MapPin size={32} className="insight-icon-large" />
                        <h4 className="insight-card-title">Emerging Routes</h4>
                        <p className="insight-card-text">
                            West Coast to East Coast routes growing fastest at 22% YoY, driven by business travel
                        </p>
                    </div>
                    <div className="insight-card" onClick={() => handleInsightClick('Price Optimization')}>
                        <DollarSign size={32} className="insight-icon-large" />
                        <h4 className="insight-card-title">Price Optimization</h4>
                        <p className="insight-card-text">
                            Booking 3-4 weeks in advance offers best value, with average savings of $85 per ticket
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Insight Modal */}
            {selectedInsight && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedInsight.title}</h3>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-description">{selectedInsight.content}</p>
                            <div className="modal-stats">
                                {selectedInsight.stats.map((stat, index) => (
                                    <div key={index} className="modal-stat-item">
                                        <span className="modal-stat-value">{stat.value}</span>
                                        <span className="modal-stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                            <button className="btn btn-primary" onClick={handleDownloadAnalysis}>Download Analysis</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketAnalytics;
