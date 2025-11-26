import React, { useState } from 'react';
import { Bell, Moon, Globe, Database, Zap, Save } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            anomalies: true,
            reports: false
        },
        appearance: {
            darkMode: true,
            compactView: false
        },
        data: {
            autoRefresh: true,
            refreshInterval: 30
        }
    });

    const handleToggle = (category, key) => {
        setSettings({
            ...settings,
            [category]: {
                ...settings[category],
                [key]: !settings[category][key]
            }
        });
    };

    const handleSave = () => {
        // Save settings logic here
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Configure your dashboard preferences</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        Save Settings
                    </button>
                </div>
            </div>

            <div className="settings-content">
                {/* Notifications */}
                <div className="card settings-section">
                    <div className="section-header">
                        <Bell size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Notifications</h3>
                            <p className="section-description">Manage how you receive alerts and updates</p>
                        </div>
                    </div>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Email Notifications</p>
                                <p className="setting-description">Receive important updates via email</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={() => handleToggle('notifications', 'email')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Push Notifications</p>
                                <p className="setting-description">Get real-time alerts in your browser</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.push}
                                    onChange={() => handleToggle('notifications', 'push')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Anomaly Alerts</p>
                                <p className="setting-description">Notify when anomalies are detected</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.anomalies}
                                    onChange={() => handleToggle('notifications', 'anomalies')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Weekly Reports</p>
                                <p className="setting-description">Receive weekly performance summaries</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.reports}
                                    onChange={() => handleToggle('notifications', 'reports')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="card settings-section">
                    <div className="section-header">
                        <Moon size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Appearance</h3>
                            <p className="section-description">Customize the look and feel</p>
                        </div>
                    </div>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Dark Mode</p>
                                <p className="setting-description">Use dark theme across the dashboard</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.appearance.darkMode}
                                    onChange={() => handleToggle('appearance', 'darkMode')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Compact View</p>
                                <p className="setting-description">Reduce spacing for more content</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.appearance.compactView}
                                    onChange={() => handleToggle('appearance', 'compactView')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Data & Performance */}
                <div className="card settings-section">
                    <div className="section-header">
                        <Database size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Data & Performance</h3>
                            <p className="section-description">Configure data refresh and caching</p>
                        </div>
                    </div>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Auto Refresh</p>
                                <p className="setting-description">Automatically update dashboard data</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.data.autoRefresh}
                                    onChange={() => handleToggle('data', 'autoRefresh')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">Refresh Interval</p>
                                <p className="setting-description">How often to update data (seconds)</p>
                            </div>
                            <select
                                className="select"
                                value={settings.data.refreshInterval}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    data: { ...settings.data, refreshInterval: parseInt(e.target.value) }
                                })}
                            >
                                <option value={15}>15 seconds</option>
                                <option value={30}>30 seconds</option>
                                <option value={60}>1 minute</option>
                                <option value={300}>5 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
