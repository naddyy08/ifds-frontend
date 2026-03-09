// src/pages/AuditLogs.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Shield, Calendar, User, Activity, AlertCircle } from 'lucide-react';
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
      const token = localStorage.getItem('access_token');
      
      console.log('=== AUDIT LOGS DEBUG ===');
      console.log('Token exists:', !!token);
      
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }

      const url = 'https://ifds-backend.onrender.com/api/audit';
      console.log('Fetching from:', url);

      // Use fetch instead of axios to avoid CORS issues
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access Denied: Only administrators can view audit logs.');
        } else if (response.status === 401) {
          throw new Error('Unauthorized: Your session has expired. Please login again.');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      setLogs(data.logs || []);
      setError('');
      console.log('✅ Successfully loaded', data.logs?.length || 0, 'logs');
      
    } catch (error) {
      console.error('❌ Error loading audit logs:', error);
      
      if (error.message.includes('Access Denied')) {
        setError('Access Denied: Only administrators can view audit logs.');
      } else if (error.message.includes('Unauthorized')) {
        setError('Your session has expired. Please logout and login again.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. The backend may be sleeping. Please wait 60 seconds and try again.');
      } else {
        setError(error.message || 'Failed to load audit logs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('FAILED') || action.includes('UNAUTHORIZED')) {
      return '#ef4444';
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return '#3b82f6';
    }
    if (action.includes('FRAUD')) {
      return '#f59e0b';
    }
    if (action.includes('DELETED')) {
      return '#dc2626';
    }
    return '#10b981';
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
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
            If backend is sleeping, this may take up to 60 seconds...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-logs-page">
        <div className="error-container">
          <AlertCircle size={64} color="#ef4444" />
          <h2>Error Loading Audit Logs</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={loadAuditLogs} className="back-btn">
              🔄 Retry
            </button>
            <button onClick={() => window.location.href = '/dashboard'} className="back-btn">
              ← Back to Dashboard
            </button>
          </div>
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