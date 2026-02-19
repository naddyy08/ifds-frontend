// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Inventory from './pages/inventory';
import Transactions from './pages/transactions';
import FraudAlerts from './pages/fraudalerts';
import Reports from './pages/reports';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Navbar />
                <div className="main-layout">
                  <Sidebar />
                  <div className="content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/fraud-alerts" element={<FraudAlerts />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;