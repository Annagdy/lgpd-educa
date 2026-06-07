import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-state">
        <div className="spinner-purple" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
