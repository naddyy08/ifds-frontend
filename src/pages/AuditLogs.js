// src/pages/AuditLogs.js
import React, { useState, useEffect } from 'react';
import { Shield, Calendar, User, Activity } from 'lucide-react';
import axios from 'axios';
import './auditlogs.css';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ifds-backend.onrender.com/api/audit',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      alert('Failed to load audit logs. Admin access required.');
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
    return <div className="loading">Loading audit logs...</div>;
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
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="log-details">
                <div className="log-user">
                  <User size={14} />
                  <span>User: {log.username || 'System'}</span>
                  {log.user_id && <span className="user-id">ID: {log.user_id}</span>}
                </div>
                <p className="log-description">{log.details}</p>
                {log.ip_address && (
                  <div className="log-ip">
                    <span>IP Address: {log.ip_address}</span>
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

export default AuditLogs;