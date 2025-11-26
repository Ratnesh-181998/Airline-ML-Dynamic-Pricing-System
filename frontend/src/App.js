import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import PricePrediction from './components/PricePrediction';
import DemandForecasting from './components/DemandForecasting';
import MarketAnalytics from './components/MarketAnalytics';
import AnomalyDetection from './components/AnomalyDetection';
import DataSources from './components/DataSources';
import SystemHealth from './components/SystemHealth';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Security from './components/Security';
import Notifications from './components/Notifications';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalSearches: 0,
    avgPrice: 0,
    activeRoutes: 0,
    modelAccuracy: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        totalSearches: prev.totalSearches + Math.floor(Math.random() * 10),
        avgPrice: 285 + Math.random() * 50,
        activeRoutes: 150 + Math.floor(Math.random() * 20),
        modelAccuracy: 0.85 + Math.random() * 0.1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard systemStats={systemStats} />;
      case 'price-prediction':
        return <PricePrediction />;
      case 'demand-forecasting':
        return <DemandForecasting />;
      case 'market-analytics':
        return <MarketAnalytics />;
      case 'anomaly-detection':
        return <AnomalyDetection />;
      case 'data-sources':
        return <DataSources />;
      case 'system-health':
        return <SystemHealth />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'security':
        return <Security />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard systemStats={systemStats} />;
    }
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        systemStats={systemStats}
        setActiveTab={setActiveTab}
      />

      <div className="app-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
        />

        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content-wrapper animate-fadeIn">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
