import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loader">Loading...</div>; // or custom spinner
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
