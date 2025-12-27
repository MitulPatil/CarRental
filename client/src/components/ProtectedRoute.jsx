import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='flex justify-center items-center min-h-screen'>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireOwner && user.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
