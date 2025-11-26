import React, { useState } from 'react';
import { Shield, Key, Lock, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Security.css';

const Security = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isEnabling2FA, setIsEnabling2FA] = useState(false);

    const handleToggle2FA = () => {
        setIsEnabling2FA(true);
        const action = is2FAEnabled ? 'Disabling' : 'Enabling';

        toast.loading(`${action} Two-Factor Authentication...`, { id: '2fa-toggle' });

        setTimeout(() => {
            setIs2FAEnabled(!is2FAEnabled);
            setIsEnabling2FA(false);
            toast.success(`Two-Factor Authentication ${is2FAEnabled ? 'disabled' : 'enabled'} successfully`, { id: '2fa-toggle' });
        }, 2000);
    };

    return (
        <div className="security-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Security</h1>
                    <p className="page-subtitle">Manage your account security settings</p>
                </div>
            </div>

            <div className="security-content">
                {/* Password */}
                <div className="card security-section">
                    <div className="section-header">
                        <Key size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Password</h3>
                            <p className="section-description">Keep your account secure with a strong password</p>
                        </div>
                    </div>
                    {!showPasswordForm ? (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowPasswordForm(true)}
                        >
                            Change Password
                        </button>
                    ) : (
                        <div className="password-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" className="input" placeholder="Enter current password" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" className="input" placeholder="Enter new password" />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" className="input" placeholder="Confirm new password" />
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="card security-section">
                    <div className="section-header">
                        <Smartphone size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Two-Factor Authentication</h3>
                            <p className="section-description">Add an extra layer of security to your account</p>
                        </div>
                    </div>
                    <div className="security-status">
                        {is2FAEnabled ? (
                            <div className="status-badge status-active">
                                <CheckCircle size={20} />
                                <span>Enabled</span>
                            </div>
                        ) : (
                            <div className="status-badge status-inactive">
                                <AlertTriangle size={20} />
                                <span>Not Enabled</span>
                            </div>
                        )}

                        <button
                            className={`btn ${is2FAEnabled ? 'btn-danger' : 'btn-primary'}`}
                            onClick={handleToggle2FA}
                            disabled={isEnabling2FA}
                        >
                            {isEnabling2FA ? 'Processing...' : (is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA')}
                        </button>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="card security-section">
                    <div className="section-header">
                        <Lock size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Active Sessions</h3>
                            <p className="section-description">Manage devices where you're currently logged in</p>
                        </div>
                    </div>
                    <div className="sessions-list">
                        <div className="session-item">
                            <div className="session-info">
                                <div className="session-device">
                                    <CheckCircle size={20} className="session-icon-active" />
                                    <div>
                                        <p className="session-name">Windows PC - Chrome</p>
                                        <p className="session-details">San Francisco, CA • Current session</p>
                                    </div>
                                </div>
                                <span className="session-time">Active now</span>
                            </div>
                        </div>
                        <div className="session-item">
                            <div className="session-info">
                                <div className="session-device">
                                    <Shield size={20} className="session-icon" />
                                    <div>
                                        <p className="session-name">iPhone 14 - Safari</p>
                                        <p className="session-details">San Francisco, CA</p>
                                    </div>
                                </div>
                                <span className="session-time">2 hours ago</span>
                            </div>
                            <button className="btn-text-danger">Revoke</button>
                        </div>
                    </div>
                </div>

                {/* Security Recommendations */}
                <div className="card security-section">
                    <div className="section-header">
                        <Shield size={24} className="section-icon" />
                        <div>
                            <h3 className="section-title">Security Recommendations</h3>
                            <p className="section-description">Improve your account security</p>
                        </div>
                    </div>
                    <div className="recommendations-list">
                        <div className="recommendation-item recommendation-warning">
                            <AlertTriangle size={20} />
                            <div>
                                <p className="recommendation-title">Enable Two-Factor Authentication</p>
                                <p className="recommendation-text">Add an extra layer of security to prevent unauthorized access</p>
                            </div>
                        </div>
                        <div className="recommendation-item recommendation-success">
                            <CheckCircle size={20} />
                            <div>
                                <p className="recommendation-title">Strong Password</p>
                                <p className="recommendation-text">Your password meets security requirements</p>
                            </div>
                        </div>
                        <div className="recommendation-item recommendation-success">
                            <CheckCircle size={20} />
                            <div>
                                <p className="recommendation-title">Recent Activity Monitored</p>
                                <p className="recommendation-text">We're keeping track of your account activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
