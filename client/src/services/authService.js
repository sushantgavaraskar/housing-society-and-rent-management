import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Include cookies in requests
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on 401 errors
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // The token is now in an HTTP-only cookie, so we don't need to return it
    // Just return the user data
    return {
      user: response.data.data,
      // Don't return token since it's in HTTP-only cookie
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
}; 