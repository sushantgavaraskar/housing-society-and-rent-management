import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    // Check auth if not authenticated and not loading
    if (!isAuthenticated && !loading && !user) {
      checkAuth();
    }
  }, [isAuthenticated, loading, user, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 