// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import './sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
  }, []);

  // Define menu items with role restrictions
  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      allowedRoles: ['admin', 'manager', 'staff'] // Everyone
    },
    { 
      path: '/inventory', 
      icon: Package, 
      label: 'Inventory',
      allowedRoles: ['admin', 'manager', 'staff'] // Everyone
    },
    { 
      path: '/transactions', 
      icon: TrendingUp, 
      label: 'Transactions',
      allowedRoles: ['admin', 'manager', 'staff'] // Everyone
    },
    { 
      path: '/fraud-alerts', 
      icon: AlertTriangle, 
      label: 'Fraud Alerts',
      allowedRoles: ['admin', 'manager', 'staff'] // Everyone can view
    },
    { 
      path: '/reports', 
      icon: FileText, 
      label: 'Reports',
      allowedRoles: ['admin', 'manager'] // Only admin and manager
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <div className="sidebar">
      {/* User Role Badge */}
      {userRole && (
        <div className="role-badge-container" style={{
          padding: '12px 16px',
          marginBottom: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
            ROLE
          </div>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {userRole === 'admin' && '👑 Admin'}
            {userRole === 'manager' && '👔 Manager'}
            {userRole === 'staff' && '👤 Staff'}
          </div>
        </div>
      )}

      {/* Menu Items */}
      {visibleMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Access Info for Staff */}
      {userRole === 'staff' && (
        <div style={{
          marginTop: 'auto',
          padding: '12px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          lineHeight: '1.5'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Staff Access
          </div>
          <div>• View & add inventory</div>
          <div>• Record transactions</div>
          <div>• View fraud alerts</div>
          <div style={{ marginTop: '6px', fontSize: '10px', fontStyle: 'italic' }}>
            Contact manager for reports
          </div>
        </div>
      )}

      {/* Access Info for Manager */}
      {userRole === 'manager' && (
        <div style={{
          marginTop: 'auto',
          padding: '12px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          lineHeight: '1.5'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Manager Access
          </div>
          <div>• Full inventory access</div>
          <div>• Review fraud alerts</div>
          <div>• Generate all reports</div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;