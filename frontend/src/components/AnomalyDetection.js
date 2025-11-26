import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, ScatterChart, Scatter, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
    AlertTriangle, AlertCircle, TrendingUp, Activity,
    Shield, Zap, Clock, CheckCircle, X, History
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './AnomalyDetection.css';

const AnomalyDetection = () => {
    const [anomalies, setAnomalies] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [severityData, setSeverityData] = useState([]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        // Recent anomalies
        const recentAnomalies = [
            {
                id: 1,
                route: 'SFO-JFK',
                type: 'Price Spike',
                severity: 'high',
                price: 685,
                normalPrice: 385,
                deviation: '+78%',
                time: '2 hours ago',
                status: 'active'
            },
            {
                id: 2,
                route: 'LAX-ORD',
                type: 'Demand Surge',
                severity: 'medium',
                searches: 2500,
                normalSearches: 1200,
                deviation: '+108%',
                time: '4 hours ago',
                status: 'monitoring'
            },
            {
                id: 3,
                route: 'DFW-ATL',
                type: 'Price Drop',
                severity: 'low',
                price: 145,
                normalPrice: 245,
                deviation: '-41%',
                time: '6 hours ago',
                status: 'resolved'
            },
            {
                id: 4,
                route: 'SEA-BOS',
                type: 'Booking Anomaly',
                severity: 'medium',
                bookings: 850,
                normalBookings: 420,
                deviation: '+102%',
                time: '8 hours ago',
                status: 'monitoring'
            }
        ];
        setAnomalies(recentAnomalies);

        // Timeline data (24 hours)
        const timeline = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            normal: 300 + Math.random() * 50,
            anomalies: i % 6 === 0 ? 450 + Math.random() * 100 : 300 + Math.random() * 50,
            threshold: 400
        }));
        setTimelineData(timeline);

        // Severity distribution
        const severity = [
            { severity: 'Critical', count: 3, color: '#ef4444' },
            { severity: 'High', count: 8, color: '#f59e0b' },
            { severity: 'Medium', count: 15, color: '#eab308' },
            { severity: 'Low', count: 12, color: '#10b981' }
        ];
        setSeverityData(severity);
    }, []);

    const handleRunDetection = () => {
        setIsDetecting(true);
        toast.loading('Running anomaly detection algorithms...', { id: 'detection' });

        setTimeout(() => {
            // Simulate new anomaly detection
            const newAnomaly = {
                id: Date.now(),
                route: 'MIA-LHR',
                type: 'Unusual Booking Pattern',
                severity: 'high',
                bookings: 120,
                normalBookings: 45,
                deviation: '+166%',
                time: 'Just now',
                status: 'active'
            };

            setAnomalies(prev => [newAnomaly, ...prev]);
            setIsDetecting(false);
            toast.success('Detection complete. 1 new anomaly found.', { id: 'detection' });
        }, 2500);
    };

    const handleViewHistory = () => {
        setShowHistory(true);
    };

    const closeHistory = () => {
        setShowHistory(false);
    };

    const metrics = [
        {
            title: 'Active Anomalies',
            value: '12',
            change: '+3 new',
            icon: AlertTriangle,
            color: 'error'
        },
        {
            title: 'Detection Rate',
            value: '94.2%',
            change: '+2.1%',
            icon: Shield,
            color: 'success'
        },
        {
            title: 'Avg Response Time',
            value: '4.5 min',
            change: '-1.2 min',
            icon: Clock,
            color: 'info'
        },
        {
            title: 'Resolved Today',
            value: '28',
            change: '85% resolved',
            icon: CheckCircle,
            color: 'success'
        }
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'info';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'error';
            case 'monitoring': return 'warning';
            case 'resolved': return 'success';
            default: return 'info';
        }
    };

    // Mock history data
    const historyData = [
        { date: '2023-10-25', event: 'System Scan', result: 'Clean', user: 'System' },
        { date: '2023-10-24', event: 'Manual Detection', result: '2 Anomalies', user: 'Admin' },
        { date: '2023-10-23', event: 'System Scan', result: '1 Critical', user: 'System' },
        { date: '2023-10-22', event: 'Rule Update', result: 'Success', user: 'DevOps' },
        { date: '2023-10-21', event: 'System Scan', result: 'Clean', user: 'System' },
    ];

    const handleExportLog = () => {
        try {
            // Prepare CSV data
            const headers = ['Date', 'Event', 'Result', 'User'];
            const rows = historyData.map(item => [item.date, item.event, item.result, item.user]);

            let csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");

            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `anomaly_detection_log_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);

            // Trigger download
            link.click();
            document.body.removeChild(link);

            toast.success('Log exported successfully');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export log');
        }
    };

    return (
        <div className="anomaly-detection">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Anomaly Detection</h1>
                    <p className="page-subtitle">Real-time detection using Isolation Forest algorithm</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={handleViewHistory}>
                        <History size={18} />
                        View History
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleRunDetection}
                        disabled={isDetecting}
                    >
                        {isDetecting ? <Activity size={18} className="spin" /> : <Zap size={18} />}
                        {isDetecting ? 'Running...' : 'Run Detection'}
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
                {/* Anomaly Timeline */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Anomaly Timeline (24h)</h3>
                        <span className="badge badge-error">Live</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timelineData}>
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
                                <Line
                                    type="monotone"
                                    dataKey="normal"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Normal Range"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="anomalies"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="Detected Anomalies"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="threshold"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Threshold"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Severity Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Severity Distribution</h3>
                        <span className="badge badge-info">Last 7 Days</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={severityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="severity" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Anomalies */}
                <div className="card anomalies-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Anomalies</h3>
                        <span className="badge badge-error">{anomalies.length} Active</span>
                    </div>
                    <div className="anomalies-list">
                        {anomalies.map((anomaly) => (
                            <div key={anomaly.id} className="anomaly-item">
                                <div className={`anomaly-severity anomaly-severity-${anomaly.severity}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="anomaly-content">
                                    <div className="anomaly-header">
                                        <span className="anomaly-route">{anomaly.route}</span>
                                        <span className={`anomaly-status badge badge-${getStatusColor(anomaly.status)}`}>
                                            {anomaly.status}
                                        </span>
                                    </div>
                                    <p className="anomaly-type">{anomaly.type}</p>
                                    <p className="anomaly-details">
                                        {anomaly.price && `$${anomaly.price} (normal: $${anomaly.normalPrice})`}
                                        {anomaly.searches && `${anomaly.searches} searches (normal: ${anomaly.normalSearches})`}
                                        {anomaly.bookings && `${anomaly.bookings} bookings (normal: ${anomaly.normalBookings})`}
                                    </p>
                                    <div className="anomaly-footer">
                                        <span className={`anomaly-deviation badge badge-${getSeverityColor(anomaly.severity)}`}>
                                            {anomaly.deviation}
                                        </span>
                                        <span className="anomaly-time">{anomaly.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detection Insights */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Detection Insights</h3>
                        <span className="badge badge-primary">ML Powered</span>
                    </div>
                    <div className="insights-list">
                        <div className="insight-item">
                            <div className="insight-icon insight-error">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Price Spike Alert</p>
                                <p className="insight-text">
                                    SFO-JFK route showing 78% price increase - likely due to high demand or limited capacity
                                </p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon insight-warning">
                                <TrendingUp size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Demand Surge Detected</p>
                                <p className="insight-text">
                                    LAX-ORD searches doubled in last 4 hours - possible event or holiday travel
                                </p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon insight-success">
                                <CheckCircle size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Model Performance</p>
                                <p className="insight-text">
                                    Isolation Forest achieving 94.2% detection accuracy with 2.1% false positive rate
                                </p>
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="insight-icon insight-info">
                                <Activity size={20} />
                            </div>
                            <div className="insight-content">
                                <p className="insight-title">Pattern Recognition</p>
                                <p className="insight-text">
                                    System identified 3 new anomaly patterns this week requiring investigation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {showHistory && (
                <div className="modal-overlay" onClick={closeHistory}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Detection History Log</h3>
                            <button className="modal-close" onClick={closeHistory}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Event</th>
                                        <th>Result</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.date}</td>
                                            <td>{item.event}</td>
                                            <td>
                                                <span className={`badge badge-${item.result === 'Clean' || item.result === 'Success' ? 'success' : 'warning'}`}>
                                                    {item.result}
                                                </span>
                                            </td>
                                            <td>{item.user}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeHistory}>Close</button>
                            <button className="btn btn-primary" onClick={handleExportLog}>Export Log</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnomalyDetection;
