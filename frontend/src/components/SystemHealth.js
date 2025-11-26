import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import './SystemHealth.css';

const SystemHealth = () => {
    const [metrics, setMetrics] = useState({
        cpu: 45,
        memory: 62,
        storage: 78,
        network: 120,
        uptime: '99.98%'
    });

    const [services, setServices] = useState([
        { id: 1, name: 'API Gateway', status: 'operational', latency: '45ms' },
        { id: 2, name: 'Prediction Engine', status: 'operational', latency: '120ms' },
        { id: 3, name: 'Data Ingestion', status: 'operational', latency: '85ms' },
        { id: 4, name: 'Database Cluster', status: 'degraded', latency: '350ms' },
        { id: 5, name: 'Auth Service', status: 'operational', latency: '35ms' }
    ]);

    // Simulate real-time metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
                memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 5 - 2.5))),
                network: Math.max(0, prev.network + (Math.random() * 20 - 10))
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="system-health-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">System Health</h1>
                    <p className="page-subtitle">Monitor infrastructure performance and status</p>
                </div>
                <div className="header-actions">
                    <div className="uptime-badge">
                        <Activity size={18} />
                        <span>System Uptime: {metrics.uptime}</span>
                    </div>
                </div>
            </div>

            {/* Resource Usage */}
            <div className="health-grid">
                <div className="card metric-card">
                    <div className="metric-header">
                        <Cpu size={24} className="metric-icon" />
                        <span className="metric-title">CPU Usage</span>
                    </div>
                    <div className="metric-chart">
                        <div className="circular-progress" style={{ '--progress': `${metrics.cpu}%` }}>
                            <span className="progress-value">{Math.round(metrics.cpu)}%</span>
                        </div>
                    </div>
                    <p className="metric-detail">8 Cores Active</p>
                </div>

                <div className="card metric-card">
                    <div className="metric-header">
                        <Server size={24} className="metric-icon" />
                        <span className="metric-title">Memory Usage</span>
                    </div>
                    <div className="metric-chart">
                        <div className="circular-progress" style={{ '--progress': `${metrics.memory}%` }}>
                            <span className="progress-value">{Math.round(metrics.memory)}%</span>
                        </div>
                    </div>
                    <p className="metric-detail">16GB / 32GB Used</p>
                </div>

                <div className="card metric-card">
                    <div className="metric-header">
                        <HardDrive size={24} className="metric-icon" />
                        <span className="metric-title">Storage</span>
                    </div>
                    <div className="metric-chart">
                        <div className="circular-progress" style={{ '--progress': `${metrics.storage}%` }}>
                            <span className="progress-value">{Math.round(metrics.storage)}%</span>
                        </div>
                    </div>
                    <p className="metric-detail">1.2TB / 2TB Used</p>
                </div>

                <div className="card metric-card">
                    <div className="metric-header">
                        <Wifi size={24} className="metric-icon" />
                        <span className="metric-title">Network</span>
                    </div>
                    <div className="metric-value-large">
                        {Math.round(metrics.network)} <span className="unit">Mbps</span>
                    </div>
                    <p className="metric-detail">Inbound Traffic</p>
                </div>
            </div>

            {/* Service Status */}
            <div className="card services-card">
                <div className="card-header">
                    <h3 className="card-title">Service Status</h3>
                </div>
                <div className="services-list">
                    {services.map(service => (
                        <div key={service.id} className="service-item">
                            <div className="service-info">
                                <div className={`status-dot status-${service.status}`}></div>
                                <span className="service-name">{service.name}</span>
                            </div>
                            <div className="service-meta">
                                <span className="service-latency">{service.latency}</span>
                                <span className={`status-badge status-${service.status}`}>
                                    {service.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
