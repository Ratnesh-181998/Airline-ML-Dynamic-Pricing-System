import React, { useState } from 'react';
import { Menu, X, Plane, Bell, User, Settings, LogOut, UserCircle, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Header.css';

const Header = ({ sidebarOpen, setSidebarOpen, systemStats, setActiveTab }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const notifications = [
        { id: 1, type: 'warning', message: 'Price spike detected on SFO-JFK route', time: '5 min ago' },
        { id: 2, type: 'success', message: 'Model accuracy improved to 89.2%', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'New data batch processed successfully', time: '2 hours ago' }
    ];

    const handleLogout = () => {
        toast.success('Logged out successfully');
        setShowUserMenu(false);
        // In a real app, this would clear auth state and redirect
    };

    const handleNavigation = (tab) => {
        setActiveTab(tab);
        setShowUserMenu(false);
    };

    return (
        <header className="header glass">
            <div className="header-content">
                {/* Left Section */}
                <div className="header-left">
                    <button
                        className="btn-icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="logo">
                        <Plane size={32} className="logo-icon" />
                        <div className="logo-text">
                            <h1 className="logo-title gradient-text">AirlineML</h1>
                            <p className="logo-subtitle">Dynamic Pricing System</p>
                        </div>
                    </div>
                </div>

                {/* Center Section - Real-time Stats */}
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Searches</span>
                        <span className="stat-value">{systemStats.totalSearches.toLocaleString()}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label">Avg Price</span>
                        <span className="stat-value">${systemStats.avgPrice.toFixed(2)}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label">Model Accuracy</span>
                        <span className="stat-value">{(systemStats.modelAccuracy * 100).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="header-right">
                    {/* Notifications */}
                    <div className="dropdown">
                        <button
                            className="btn-icon notification-btn"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                        >
                            <Bell size={20} />
                            <span className="notification-badge">{notifications.length}</span>
                        </button>

                        {showNotifications && (
                            <div className="dropdown-menu notifications-dropdown">
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                    <span className="badge badge-primary">{notifications.length} new</span>
                                </div>
                                <div className="notifications-list">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`notification-item notification-${notif.type}`}>
                                            <p className="notification-message">{notif.message}</p>
                                            <span className="notification-time">{notif.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer">
                                    <button
                                        className="btn-text"
                                        onClick={() => {
                                            handleNavigation('notifications');
                                            setShowNotifications(false);
                                        }}
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="dropdown">
                        <div
                            className="user-menu"
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                        >
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">Admin User</span>
                                <span className="user-role">System Administrator</span>
                            </div>
                        </div>

                        {showUserMenu && (
                            <div className="dropdown-menu user-dropdown">
                                <div className="dropdown-header">
                                    <div className="user-avatar-large">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <p className="user-name-large">Admin User</p>
                                        <p className="user-email">admin@airlineml.com</p>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-items">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleNavigation('profile')}
                                    >
                                        <UserCircle size={18} />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleNavigation('settings')}
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleNavigation('security')}
                                    >
                                        <Shield size={18} />
                                        <span>Security</span>
                                    </button>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button
                                    className="dropdown-item logout-item"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
