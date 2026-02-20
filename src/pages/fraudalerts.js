// src/pages/FraudAlerts.js
import React, { useState, useEffect } from 'react';
import { getAllAlerts, reviewAlert, getFraudStatistics } from '../services/api';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import RoleBasedAccess from '../components/RoleBasedAccess';
import './fraudalerts.css';

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        getAllAlerts(),
        getFraudStatistics(),
      ]);
      setAlerts(alertsRes.data.alerts);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Failed to load fraud alerts:', error);
      alert('Failed to load fraud alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (alertId, status) => {
    // Check role before allowing review
    if (userRole !== 'admin' && userRole !== 'manager') {
      alert('Access Denied: Only managers and administrators can review fraud alerts.');
      return;
    }

    const notes = prompt(`Enter notes for marking this alert as ${status}:`);
    if (notes === null) return; // User cancelled

    if (!notes.trim()) {
      alert('Please provide notes for this review.');
      return;
    }

    try {
      await reviewAlert(alertId, { status, notes });
      loadData(); // Reload data
      alert(`✅ Alert successfully marked as ${status}!`);
    } catch (error) {
      console.error('Failed to review alert:', error);
      if (error.response?.status === 403) {
        alert('Access Denied: Only managers and administrators can review fraud alerts.');
      } else {
        alert('Failed to review alert. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading fraud alerts...</div>;
  }

  return (
    <div className="fraud-alerts-page">
      <div className="page-header">
        <h1>🚨 Fraud Detection Alerts</h1>
        <RoleBasedAccess allowedRoles={['admin', 'manager']}>
          <p className="role-info">You can review and resolve alerts</p>
        </RoleBasedAccess>
        <RoleBasedAccess allowedRoles={['staff']}>
          <p className="role-info" style={{ color: '#f59e0b' }}>
            ⚠️ View-only access. Contact a manager to review alerts.
          </p>
        </RoleBasedAccess>
      </div>

      {statistics && (
        <div className="stats-summary">
          <div className="stat-box">
            <h3>{statistics.by_status?.total || 0}</h3>
            <p>Total Alerts</p>
          </div>
          <div className="stat-box pending">
            <h3>{statistics.by_status?.pending || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-box high">
            <h3>{statistics.by_severity?.high || 0}</h3>
            <p>High Severity</p>
          </div>
          <div className="stat-box resolved">
            <h3>{statistics.by_status?.resolved || 0}</h3>
            <p>Resolved</p>
          </div>
        </div>
      )}

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle size={48} color="#10b981" />
            <p>No fraud alerts detected!</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Your system is secure.
            </p>
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
                
                {/* Transaction Details */}
                {alert.transaction && (
                  <div className="transaction-info">
                    <p><strong>Item:</strong> {alert.transaction.item_name}</p>
                    <p><strong>Quantity:</strong> {alert.transaction.quantity}</p>
                    <p><strong>Type:</strong> {alert.transaction.transaction_type}</p>
                    <p><strong>User:</strong> {alert.transaction.username}</p>
                  </div>
                )}

                <div className="alert-meta">
                  <span>📅 Detected: {alert.detected_at}</span>
                  <span className={`status-badge ${alert.status}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>

                {/* RBAC: Only admin and manager can review */}
                {alert.status === 'pending' && (
                  <RoleBasedAccess allowedRoles={['admin', 'manager']}>
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
                  </RoleBasedAccess>
                )}

                {/* Show message for staff when alert is pending */}
                {alert.status === 'pending' && userRole === 'staff' && (
                  <div className="staff-message" style={{
                    padding: '10px',
                    backgroundColor: '#fef3c7',
                    borderLeft: '3px solid #f59e0b',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '14px',
                    color: '#92400e'
                  }}>
                    ⚠️ Contact a manager or administrator to review this alert.
                  </div>
                )}

                {/* Show review notes if reviewed */}
                {alert.notes && (
                  <div className="alert-notes">
                    <strong>📝 Review Notes:</strong> {alert.notes}
                    {alert.reviewed_at && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Reviewed: {alert.reviewed_at}
                      </div>
                    )}
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