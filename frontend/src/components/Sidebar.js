import React from 'react';
import {
    LayoutDashboard,
    DollarSign,
    TrendingUp,
    BarChart3,
    AlertTriangle,
    Settings,
    Database,
    Activity
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'price-prediction', label: 'Price Prediction', icon: DollarSign },
        { id: 'demand-forecasting', label: 'Demand Forecasting', icon: TrendingUp },
        { id: 'market-analytics', label: 'Market Analytics', icon: BarChart3 },
        { id: 'anomaly-detection', label: 'Anomaly Detection', icon: AlertTriangle },
    ];

    const bottomMenuItems = [
        { id: 'data-sources', label: 'Data Sources', icon: Database },
        { id: 'system-health', label: 'System Health', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar-nav">
                {/* Main Navigation */}
                <div className="nav-section">
                    <div className="nav-section-title">Main Menu</div>
                    <ul className="nav-list">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <Icon size={20} className="nav-icon" />
                                        <span className="nav-label">{item.label}</span>
                                        {activeTab === item.id && <div className="active-indicator" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Bottom Navigation */}
                <div className="nav-section nav-section-bottom">
                    <div className="nav-section-title">System</div>
                    <ul className="nav-list">
                        {bottomMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <Icon size={20} className="nav-icon" />
                                        <span className="nav-label">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
