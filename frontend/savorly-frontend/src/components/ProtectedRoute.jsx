import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// You can pass `requiredRole` prop to specify the role required for access
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If the user is logged in but doesn't have the required role
    // redirect to the appropriate page based on their role
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
