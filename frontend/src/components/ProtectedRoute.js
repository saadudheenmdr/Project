import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const location = useLocation(); 
  
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token'); 
  
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error("Error parsing user data from localStorage", e);
  }

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user.role !== 'admin') {
    toast.error("Access Denied: Admin privileges required.");
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && user.role === 'admin') {
    toast.error("Notice: Redirecting to Admin Dashboard.");
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;