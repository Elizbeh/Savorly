import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // import the context

// ProtectedRoute component to guard routes based on authentication status
const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
