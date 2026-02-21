// src/components/RoleBasedAccess.js
import React from 'react';

const RoleBasedAccess = ({ allowedRoles, children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return null;
  }

  const user = JSON.parse(userStr);
  const userRole = user.role;

  if (allowedRoles && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleBasedAccess;