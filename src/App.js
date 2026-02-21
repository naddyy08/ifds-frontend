// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Inventory from './pages/inventory';
import Transactions from './pages/transactions';
import FraudAlerts from './pages/fraudalerts';
import Reports from './pages/reports';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import './App.css';

// Protected Route Component with Role Checking
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Not logged in - redirect to login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles) {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission - redirect to dashboard with alert
      alert('Access Denied: You do not have permission to access this page.');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
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
                      {/* Routes accessible by everyone */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/fraud-alerts" element={<FraudAlerts />} />
                      
                      {/* Reports - ONLY admin and manager */}
                      <Route 
                        path="/reports" 
                        element={
                          <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <Reports />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Default redirect */}
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