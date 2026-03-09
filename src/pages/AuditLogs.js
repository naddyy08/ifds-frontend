// src/pages/AuditLogs.js
import React, { useState, useEffect } from 'react';
import { Shield, Calendar, User, Activity, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './auditlogs.css';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const response = await api.get('/audit');
      setLogs(response.data.logs || []);
      setError('');
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      if (error.response?.status === 403) {
        setError('Access Denied: Only administrators can view audit logs.');
      } else if (error.response?.status === 401) {
        setError('Unauthorized: Please login again.');
      } else {
        setError('Failed to load audit logs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('FAILED') || action.includes('UNAUTHORIZED')) {
      return '#ef4444'; // Red
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return '#3b82f6'; // Blue
    }
    if (action.includes('FRAUD')) {
      return '#f59e0b'; // Orange
    }
    if (action.includes('DELETED')) {
      return '#dc2626'; // Dark red
    }
    return '#10b981'; // Green
  };

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && !log.action.toLowerCase().includes(filter)) {
      return false;
    }
    if (searchTerm && !log.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="audit-logs-page">
        <div className="loading">
          <Activity size={48} className="spinner" />
          <p>Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-logs-page">
        <div className="error-container">
          <AlertCircle size={64} color="#ef4444" />
          <h2>Access Denied</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = '/dashboard'} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs-page">
      <div className="page-header">
        <div>
          <h1>🛡️ Audit Logs</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
            Tamper-proof system activity log. All actions are recorded and cannot be modified or deleted.
          </p>
        </div>
        <div className="log-stats">
          <div className="stat-badge">
            <Activity size={16} />
            <span>{logs.length} Total Logs</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Actions
          </button>
          <button 
            className={filter === 'login' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('login')}
          >
            Authentication
          </button>
          <button 
            className={filter === 'fraud' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('fraud')}
          >
            Fraud Events
          </button>
          <button 
            className={filter === 'unauthorized' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('unauthorized')}
          >
            Unauthorized Attempts
          </button>
        </div>

        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tamper-Proof Notice */}
      <div className="tamper-proof-notice">
        <Shield size={20} />
        <div>
          <strong>Tamper-Proof Logging Active</strong>
          <p>All logs are append-only and cannot be modified or deleted. Complete audit trail maintained.</p>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <Shield size={48} color="#9ca3af" />
            <p>No audit logs found</p>
            {searchTerm && <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search or filter</p>}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="log-entry">
              <div className="log-header">
                <div className="log-action" style={{ color: getActionColor(log.action) }}>
                  <Activity size={16} />
                  <strong>{log.action.replace(/_/g, ' ')}</strong>
                </div>
                <div className="log-timestamp">
                  <Calendar size={14} />
                  {new Date(log.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>

              <div className="log-details">
                <div className="log-user">
                  <User size={14} />
                  <span>User: {log.username || 'System'}</span>
                  {log.user_id && <span className="user-id">ID: {log.user_id}</span>}
                </div>
                <p className="log-description">{log.details}</p>
                {log.ip_address && log.ip_address !== 'system' && (
                  <div className="log-ip">
                    <span>IP Address: {log.ip_address}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      {filteredLogs.length > 0 && (
        <div className="logs-footer">
          <p>Showing {filteredLogs.length} of {logs.length} logs</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Read-only view • No delete or edit operations available
          </p>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;