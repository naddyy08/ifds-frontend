// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, UserCircle, Users } from 'lucide-react';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };

  // Get role-specific icon and color
  const getRoleInfo = (role) => {
    switch(role) {
      case 'admin':
        return { 
          icon: Shield, 
          color: '#ef4444', 
          bgColor: '#fee2e2',
          label: 'Administrator'
        };
      case 'manager':
        return { 
          icon: Users, 
          color: '#3b82f6', 
          bgColor: '#dbeafe',
          label: 'Manager'
        };
      case 'staff':
        return { 
          icon: UserCircle, 
          color: '#10b981', 
          bgColor: '#d1fae5',
          label: 'Staff'
        };
      default:
        return { 
          icon: User, 
          color: '#6b7280', 
          bgColor: '#f3f4f6',
          label: 'User'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🔐 IFDS</h2>
        <span className="navbar-subtitle">Inventory Fraud Detection System</span>
      </div>
      
      <div className="navbar-user">
        {/* User Info */}
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">
              <User size={16} />
              <span>{user?.username || 'Guest'}</span>
            </div>
            <div className="user-email">
              {user?.email || 'No email'}
            </div>
          </div>
          
          {/* Role Badge */}
          <div 
            className="role-badge"
            style={{
              backgroundColor: roleInfo.bgColor,
              color: roleInfo.color,
              padding: '6px 12px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              marginLeft: '12px'
            }}
          >
            <RoleIcon size={16} />
            <span>{roleInfo.label}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="logout-btn"
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;