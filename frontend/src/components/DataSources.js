import React, { useState, useEffect } from 'react';
import { Database, Cloud, Server, RefreshCw, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './DataSources.css';

const DataSources = () => {
    const [sources, setSources] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSource, setNewSource] = useState({
        name: '',
        type: 'API Integration',
        icon: 'Cloud'
    });

    useEffect(() => {
        // Simulated data sources
        const data = [
            {
                id: 1,
                name: 'Amadeus GDS',
                type: 'API Integration',
                status: 'active',
                lastSync: '2 mins ago',
                records: '1.2M',
                health: 98,
                icon: Cloud
            },
            {
                id: 2,
                name: 'Sabre API',
                type: 'API Integration',
                status: 'active',
                lastSync: '5 mins ago',
                records: '850K',
                health: 95,
                icon: Cloud
            },
            {
                id: 3,
                name: 'Historical Fares',
                type: 'Database',
                status: 'syncing',
                lastSync: 'Syncing...',
                records: '45M',
                health: 100,
                icon: Database
            },
            {
                id: 4,
                name: 'Competitor Scraper',
                type: 'Web Scraper',
                status: 'warning',
                lastSync: '1 hour ago',
                records: '250K',
                health: 75,
                icon: Server
            }
        ];
        setSources(data);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'syncing': return 'info';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'text-tertiary';
        }
    };

    const handleSyncAll = () => {
        setIsSyncing(true);
        toast.loading('Syncing all data sources...', { id: 'sync' });

        // Update all statuses to syncing
        setSources(prev => prev.map(s => ({ ...s, status: 'syncing', lastSync: 'Syncing...' })));

        setTimeout(() => {
            setSources(prev => prev.map(s => ({
                ...s,
                status: 'active',
                lastSync: 'Just now',
                health: Math.min(100, s.health + Math.floor(Math.random() * 5))
            })));
            setIsSyncing(false);
            toast.success('All sources synced successfully', { id: 'sync' });
        }, 3000);
    };

    const handleAddSource = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewSource({ name: '', type: 'API Integration', icon: 'Cloud' });
    };

    const handleSaveSource = () => {
        if (!newSource.name) {
            toast.error('Please enter a source name');
            return;
        }

        const source = {
            id: Date.now(),
            name: newSource.name,
            type: newSource.type,
            status: 'active',
            lastSync: 'Just now',
            records: '0',
            health: 100,
            icon: newSource.icon === 'Database' ? Database : (newSource.icon === 'Server' ? Server : Cloud)
        };

        setSources([...sources, source]);
        toast.success('New data source added successfully');
        closeAddModal();
    };

    return (
        <div className="data-sources-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Data Sources</h1>
                    <p className="page-subtitle">Manage data integrations and pipelines</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleSyncAll}
                        disabled={isSyncing}
                    >
                        <RefreshCw size={18} className={isSyncing ? 'spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync All'}
                    </button>
                    <button className="btn btn-primary" onClick={handleAddSource}>
                        <Plus size={18} />
                        Add Source
                    </button>
                </div>
            </div>

            <div className="sources-grid">
                {sources.map((source) => {
                    const Icon = source.icon;
                    return (
                        <div key={source.id} className="card source-card">
                            <div className="source-header">
                                <div className="source-icon-wrapper">
                                    <Icon size={24} className="source-icon" />
                                </div>
                                <div className={`status-indicator status-${source.status}`}>
                                    {source.status === 'active' && <CheckCircle size={14} />}
                                    {source.status === 'warning' && <AlertCircle size={14} />}
                                    {source.status === 'syncing' && <RefreshCw size={14} className="spin" />}
                                    <span>{source.status}</span>
                                </div>
                            </div>

                            <div className="source-info">
                                <h3 className="source-name">{source.name}</h3>
                                <p className="source-type">{source.type}</p>
                            </div>

                            <div className="source-metrics">
                                <div className="metric">
                                    <span className="metric-label">Last Sync</span>
                                    <span className="metric-value">{source.lastSync}</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Records</span>
                                    <span className="metric-value">{source.records}</span>
                                </div>
                            </div>

                            <div className="health-bar-container">
                                <div className="health-info">
                                    <span>Health Score</span>
                                    <span className={`health-value color-${getStatusColor(source.status)}`}>
                                        {source.health}%
                                    </span>
                                </div>
                                <div className="health-bar">
                                    <div
                                        className={`health-fill bg-${getStatusColor(source.status)}`}
                                        style={{ width: `${source.health}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="source-actions">
                                <button className="btn-text">Configure</button>
                                <button className="btn-text">Logs</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Source Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={closeAddModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add New Data Source</h3>
                            <button className="modal-close" onClick={closeAddModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Source Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Skyscanner API"
                                    value={newSource.name}
                                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Source Type</label>
                                <select
                                    className="form-select"
                                    value={newSource.type}
                                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                                >
                                    <option value="API Integration">API Integration</option>
                                    <option value="Database">Database</option>
                                    <option value="Web Scraper">Web Scraper</option>
                                    <option value="File Upload">File Upload</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Icon</label>
                                <div className="icon-selection">
                                    <button
                                        className={`icon-option ${newSource.icon === 'Cloud' ? 'selected' : ''}`}
                                        onClick={() => setNewSource({ ...newSource, icon: 'Cloud' })}
                                    >
                                        <Cloud size={20} />
                                        <span>Cloud</span>
                                    </button>
                                    <button
                                        className={`icon-option ${newSource.icon === 'Database' ? 'selected' : ''}`}
                                        onClick={() => setNewSource({ ...newSource, icon: 'Database' })}
                                    >
                                        <Database size={20} />
                                        <span>Database</span>
                                    </button>
                                    <button
                                        className={`icon-option ${newSource.icon === 'Server' ? 'selected' : ''}`}
                                        onClick={() => setNewSource({ ...newSource, icon: 'Server' })}
                                    >
                                        <Server size={20} />
                                        <span>Server</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeAddModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveSource}>Add Source</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataSources;
