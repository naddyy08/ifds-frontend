// src/components/RoleBasedAccess.js
import React from 'react';

/**
 * Role-Based Access Control Component
 * Shows/hides content based on user's role
 */
const RoleBasedAccess = ({ allowedRoles, children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return null; // Not logged in
  }

  const user = JSON.parse(userStr);
  const userRole = user.role;

  // Check if user's role is in the allowed roles
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return null; // User doesn't have permission
};

export default RoleBasedAccess;