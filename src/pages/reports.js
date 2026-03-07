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


          {/* Show category summary for daily inventory report */}
          {selectedReport === 'daily' && reportData.category_summary && (
            <div className="category-summary" style={{ marginBottom: 24 }}>
              <h3>Category Summary</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Category</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Items</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Quantity</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Value</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Low Stock Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reportData.category_summary).map(([cat, val]) => (
                    <tr key={cat}>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{cat}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{val.total_items}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{val.total_quantity}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>${val.total_value}</td>
                      <td style={{ padding: 8, border: '1px solid #eee' }}>{val.low_stock_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Show weekly fraud summary visually */}
          {selectedReport === 'weekly-fraud' && reportData.summary && (
            <div className="fraud-summary" style={{ marginBottom: 24 }}>
              <h3>Fraud Summary</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Severity</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>High</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Medium</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Low</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>Count</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_severity.high}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_severity.medium}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_severity.low}</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Pending</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Resolved</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Dismissed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>Count</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_status.pending}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_status.resolved}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.by_status.dismissed}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 16 }}>
                <h4>Alert Types</h4>
                <ul>
                  {Object.entries(reportData.summary.by_type).map(([type, count]) => (
                    <li key={type}><strong>{type}:</strong> {count}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 16 }}>
                <h4>Total Alerts: {reportData.summary.total_alerts}</h4>
              </div>
            </div>
          )}

          {/* Show monthly analytics visually */}
          {selectedReport === 'monthly' && reportData.summary && (
            <div className="monthly-summary" style={{ marginBottom: 24 }}>
              <h3>Monthly Transaction Analytics</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Month:</strong> {reportData.period?.month_name} {reportData.period?.year}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Transactions</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Stock In</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Stock Out</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Waste</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Stock In</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Stock Out</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Waste</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.total_transactions}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.stock_in_count}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.stock_out_count}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.waste_count}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.total_stock_in}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.total_stock_out}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.total_waste}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 16 }}>
                <h4>Top 5 Most Used Items</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Item Name</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Stock Out</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.top_5_most_used_items?.map((item) => (
                      <tr key={item.item_name}>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.item_name}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.stock_out}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.waste}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Show waste analysis visually */}
          {selectedReport === 'waste' && reportData.summary && (
            <div className="waste-summary" style={{ marginBottom: 24 }}>
              <h3>Waste Analysis</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Period:</strong> {reportData.period?.start_date} to {reportData.period?.end_date}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Total Waste Transactions</th>
                    <th style={{ padding: 8, border: '1px solid #eee' }}>Estimated Waste Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>{reportData.summary.total_waste_transactions}</td>
                    <td style={{ padding: 8, border: '1px solid #eee' }}>${reportData.summary.estimated_waste_value}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 16 }}>
                <h4>Top 5 Most Wasted Items</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Item Name</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Quantity</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Unit</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.top_5_most_wasted?.map((item) => (
                      <tr key={item.item_name}>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.item_name}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.quantity}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.unit}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="report-content">
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;