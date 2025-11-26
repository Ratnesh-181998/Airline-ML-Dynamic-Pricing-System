import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Ratnesh Kumar',
        email: 'rattudacsit2021gate@gmail.com',
        phone: '+91 9478752146',
        location: 'IIT Delhi , Hauz Khas , Delhi , India',
        role: 'Data Scientist',
        department: 'Data Science',
        joinDate: 'January 15, 2023'
    });

    const [editedProfile, setEditedProfile] = useState({ ...profile });

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile({ ...profile });
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Profile</h1>
                    <p className="page-subtitle">Manage your personal information</p>
                </div>
                <div className="header-actions">
                    {!isEditing ? (
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                <X size={18} />
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={18} />
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="profile-content grid grid-cols-3">
                {/* Profile Card */}
                <div className="card profile-card">
                    <div className="profile-avatar-large">
                        <User size={64} />
                    </div>
                    <h2 className="profile-name">{profile.name}</h2>
                    <p className="profile-role">{profile.role}</p>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">156</span>
                            <span className="stat-label">Analyses Run</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">89.2%</span>
                            <span className="stat-label">Avg Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="card profile-details">
                    <h3 className="card-title">Personal Information</h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <User size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.name}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                        className="input"
                                    />
                                ) : (
                                    <p>{profile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Mail size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                        className="input"
                                    />
                                ) : (
                                    <p>{profile.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Phone size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                        className="input"
                                    />
                                ) : (
                                    <p>{profile.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <MapPin size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.location}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                                        className="input"
                                    />
                                ) : (
                                    <p>{profile.location}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Information */}
                <div className="card profile-details">
                    <h3 className="card-title">Work Information</h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <User size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Role</label>
                                <p>{profile.role}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <MapPin size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Department</label>
                                <p>{profile.department}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Calendar size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Join Date</label>
                                <p>{profile.joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
