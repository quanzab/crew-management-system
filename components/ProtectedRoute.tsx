

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

type Role = User['role'];

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, authenticatedUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user has one of them
  const userRole = authenticatedUser?.role;
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // If the user's role is not in the allowed list, redirect them.
    // A crew member trying to access an admin page should go to the eCrew portal.
    // An admin/manager trying to access a page they shouldn't see can go to the dashboard.
    const redirectPath = userRole === 'crew' ? '/ecrew/profile' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }


  return children;
};

export default ProtectedRoute;