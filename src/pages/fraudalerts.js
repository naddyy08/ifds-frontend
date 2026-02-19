// src/pages/FraudAlerts.js
import React, { useState, useEffect } from 'react';
import { getAllAlerts, reviewAlert, getFraudStatistics } from '../services/api';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import './fraudalerts.css';

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        getAllAlerts(),
        getFraudStatistics(),
      ]);
      setAlerts(alertsRes.data.alerts);
      setStatistics(statsRes.data.statistics);
    } catch (error) {
      console.error('Failed to load fraud alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (alertId, status) => {
    const notes = prompt(`Notes for ${status}:`);
    if (notes === null) return;

    try {
      await reviewAlert(alertId, { status, notes });
      loadData();
      alert(`Alert marked as ${status}!`);
    } catch (error) {
      alert('Failed to review alert');
    }
  };

  if (loading) {
    return <div className="loading">Loading fraud alerts...</div>;
  }

  return (
    <div className="fraud-alerts-page">
      <h1>🚨 Fraud Detection Alerts</h1>

      {statistics && (
        <div className="stats-summary">
          <div className="stat-box">
            <h3>{statistics.total_alerts}</h3>
            <p>Total Alerts</p>
          </div>
          <div className="stat-box pending">
            <h3>{statistics.by_status.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-box high">
            <h3>{statistics.by_severity.high}</h3>
            <p>High Severity</p>
          </div>
          <div className="stat-box resolved">
            <h3>{statistics.by_status.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      )}

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle size={48} color="#10b981" />
            <p>No fraud alerts detected!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
              <div className="alert-header">
                <div className="alert-title">
                  <AlertTriangle size={20} />
                  <span>{alert.alert_type.replace(/_/g, ' ')}</span>
                </div>
                <span className={`severity-badge ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              <div className="alert-body">
                <p className="alert-description">{alert.description}</p>
                <div className="alert-meta">
                  <span>Detected: {alert.detected_at}</span>
                  <span className={`status-badge ${alert.status}`}>
                    {alert.status}
                  </span>
                </div>

                {alert.status === 'pending' && (
                  <div className="alert-actions">
                    <button
                      className="review-btn resolved"
                      onClick={() => handleReview(alert.id, 'resolved')}
                    >
                      <CheckCircle size={16} />
                      Mark Resolved
                    </button>
                    <button
                      className="review-btn dismissed"
                      onClick={() => handleReview(alert.id, 'dismissed')}
                    >
                      <XCircle size={16} />
                      Dismiss
                    </button>
                  </div>
                )}

                {alert.notes && (
                  <div className="alert-notes">
                    <strong>Review Notes:</strong> {alert.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FraudAlerts;