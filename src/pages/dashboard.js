// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/api';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import './dashboard.css';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's what's happening with your inventory today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon inventory">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{summary?.inventory?.total_items || 0}</h3>
            <p>Total Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{summary?.inventory?.low_stock_items || 0}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon transactions">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{summary?.transactions?.today || 0}</h3>
            <p>Transactions Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon fraud">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{summary?.fraud_alerts?.pending || 0}</h3>
            <p>Pending Alerts</p>
            {summary?.fraud_alerts?.high_severity_pending > 0 && (
              <span className="alert-badge">
                {summary.fraud_alerts.high_severity_pending} High Priority
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Quick Stats</h2>
        <ul>
          <li>
            Transactions (Last 7 days):{' '}
            <strong>{summary?.transactions?.last_7_days || 0}</strong>
          </li>
          <li>
            Role: <strong>{user?.role}</strong>
          </li>
          <li>
            Last Updated: <strong>{summary?.generated_at}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;