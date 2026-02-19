// src/pages/Reports.js
import React, { useState } from 'react';
import {
  getDailyInventory,
  getWeeklyFraud,
  getMonthlyAnalytics,
  getWasteAnalysis,
  getLowStockAlert,
} from '../services/api';
import { FileText, Download } from 'lucide-react';
import './reports.css';

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    link.download = `${selectedReport}-report.json`;
    link.click();
  };

  return (
    <div className="reports-page">
      <h1>📊 Reports</h1>

      <div className="reports-grid">
        {reports.map((report) => (
          <div
            key={report.id}
            className="report-card"
            onClick={() => generateReport(report.id)}
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
        <div className="report-loading">Generating report...</div>
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