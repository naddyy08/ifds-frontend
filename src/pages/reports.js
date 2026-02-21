// src/pages/Reports.js
import React, { useState, useEffect } from 'react';
import {
  getDailyInventory,
  getWeeklyFraud,
  getMonthlyAnalytics,
  getWasteAnalysis,
  getLowStockAlert,
} from '../services/api';
import { FileText, Download, Shield } from 'lucide-react';
import './reports.css';

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
  }, []);

  // Access denied screen for staff
  if (userRole === 'staff') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        margin: '20px'
      }}>
        <Shield size={80} color="#ef4444" style={{ marginBottom: '24px' }} />
        <h2 style={{ 
          color: '#1f2937', 
          marginBottom: '12px', 
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Access Denied
        </h2>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px', 
          maxWidth: '500px',
          lineHeight: '1.6',
          marginBottom: '16px'
        }}>
          You don't have permission to access the Reports section. 
          Only <strong>Managers</strong> and <strong>Administrators</strong> can view and generate reports.
        </p>
        <div style={{
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#374151', fontSize: '14px', margin: 0 }}>
            📧 Contact your manager if you need access to specific reports.
          </p>
        </div>
      </div>
    );
  }

  const reports = [
    { id: 'daily', name: 'Daily Inventory Report', icon: '📦' },
    { id: 'weekly-fraud', name: 'Weekly Fraud Summary', icon: '🚨' },
    { id: 'monthly', name: 'Monthly Analytics', icon: '📊' },
    { id: 'waste', name: 'Waste Analysis', icon: '🗑️' },
    { id: 'low-stock', name: 'Low Stock Alert', icon: '⚠️' },
  ];

  const generateReport = async (reportId) => {
    setLoading(true);
    setSelectedReport(reportId);
    try {
      let response;
      switch (reportId) {
        case 'daily':
          response = await getDailyInventory();
          break;
        case 'weekly-fraud':
          response = await getWeeklyFraud();
          break;
        case 'monthly':
          response = await getMonthlyAnalytics();
          break;
        case 'waste':
          response = await getWasteAnalysis();
          break;
        case 'low-stock':
          response = await getLowStockAlert();
          break;
        default:
          break;
      }
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1>📊 Reports</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
          Generate comprehensive reports for inventory, fraud detection, and analytics
        </p>
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <div
            key={report.id}
            className="report-card"
            onClick={() => generateReport(report.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="report-icon">{report.icon}</div>
            <h3>{report.name}</h3>
            <button className="generate-btn">
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="report-loading">
          <div className="spinner"></div>
          <p>Generating report...</p>
        </div>
      )}

      {reportData && !loading && (
        <div className="report-result">
          <div className="result-header">
            <h2>{reportData.report_type}</h2>
            <button className="download-btn" onClick={downloadReport}>
              <Download size={18} />
              Download JSON
            </button>
          </div>

          <div className="report-content">
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;