import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2, Filter } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', title: 'Price Spike Detected', message: 'Significant price increase detected on SFO-JFK route.', time: '5 min ago', read: false },
        { id: 2, type: 'success', title: 'Model Accuracy Improved', message: 'Prediction model accuracy has improved to 89.2% after latest training.', time: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'Data Batch Processed', message: 'New batch of 1.2M records processed successfully.', time: '2 hours ago', read: true },
        { id: 4, type: 'error', title: 'API Connection Failed', message: 'Connection to Sabre API failed. Retrying in 5 minutes.', time: '4 hours ago', read: true },
        { id: 5, type: 'info', title: 'System Maintenance', message: 'Scheduled maintenance window at 02:00 AM UTC.', time: '1 day ago', read: true },
        { id: 6, type: 'success', title: 'Report Generated', message: 'Monthly market analysis report is ready for download.', time: '1 day ago', read: true },
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={20} className="text-warning" />;
            case 'error': return <AlertTriangle size={20} className="text-error" />;
            case 'success': return <CheckCircle size={20} className="text-success" />;
            default: return <Info size={20} className="text-info" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">Stay updated with system alerts and activities</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={markAllAsRead}>
                        <CheckCircle size={18} />
                        Mark all as read
                    </button>
                </div>
            </div>

            <div className="notifications-container">
                <div className="notifications-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
                        onClick={() => setFilter('warning')}
                    >
                        Warnings
                    </button>
                    <button
                        className={`filter-btn ${filter === 'error' ? 'active' : ''}`}
                        onClick={() => setFilter('error')}
                    >
                        Errors
                    </button>
                </div>

                <div className="notifications-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
                                <div className="notification-icon-wrapper">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h3 className="notification-title">{notification.title}</h3>
                                        <span className="notification-time">
                                            <Clock size={14} />
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="notification-message">{notification.message}</p>
                                </div>
                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button
                                            className="action-btn"
                                            title="Mark as read"
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    <button
                                        className="action-btn delete-btn"
                                        title="Delete"
                                        onClick={() => deleteNotification(notification.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <Bell size={48} />
                            <h3>No notifications found</h3>
                            <p>You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
