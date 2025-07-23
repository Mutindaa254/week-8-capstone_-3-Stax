import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  // Check if a token exists in localStorage
  const isAuthenticated = localStorage.getItem('token'); 

  // If authenticated, render the child routes/components (Outlet)
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
