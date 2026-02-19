// src/components/Sidebar.js
import React from 'react';
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

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/transactions', icon: TrendingUp, label: 'Transactions' },
    { path: '/fraud-alerts', icon: AlertTriangle, label: 'Fraud Alerts' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;