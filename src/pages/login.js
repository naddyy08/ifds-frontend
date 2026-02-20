// src/pages/login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import './login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(credentials);
      const { access_token, user } = response.data;

      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      '🔐 Password Reset\n\n' +
      'Please contact your system administrator to reset your password.\n\n' +
      'Admin Contact:\n' +
      '📧 Email: admin@ifds.com\n' +
      '📞 Phone: +60 12-345-6789\n\n' +
      'Your administrator will verify your identity and reset your password securely.'
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 IFDS Login</h1>
        <p className="subtitle">AI-Powered Inventory Fraud Detection System</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          <button 
            type="button"
            onClick={handleForgotPassword}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#667eea', 
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
              font: 'inherit'
            }}
          >
            Forgot password?
          </button>
        </p>

        <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;