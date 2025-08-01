import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';
import { showToast } from '../utils/toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Remove automatic initialization - only check auth when explicitly needed
  const checkAuth = async () => {
    if (loading) return; // Prevent multiple simultaneous checks
    
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('No authenticated user found (this is normal for new users)');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { user: userData } = response;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      showToast('Login successful!', 'success');
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
      return { success: true };
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
      showToast('Logged out successfully', 'success');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth, // Expose checkAuth for manual calls
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 