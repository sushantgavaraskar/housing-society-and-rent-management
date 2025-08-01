import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard/overview');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin dashboard');
  }
};

export const getOwnerDashboard = async () => {
  try {
    const response = await api.get('/owner/dashboard/overview');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch owner dashboard');
  }
};

export const getTenantDashboard = async () => {
  try {
    const response = await api.get('/tenant/dashboard/overview');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tenant dashboard');
  }
};

export const getOwnerFlats = async () => {
  try {
    const response = await api.get('/owner/flats');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch owner flats');
  }
};

export const getTenantMyFlat = async () => {
  try {
    const response = await api.get('/tenant/my-flat');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tenant flat');
  }
};

export const getRentHistory = async (role = 'tenant') => {
  try {
    const endpoint = role === 'owner' ? '/owner/rent-history' : '/tenant/rent-history';
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rent history');
  }
};

export const getMaintenanceDue = async (role = 'tenant') => {
  try {
    const endpoint = role === 'owner' ? '/owner/maintenance-due' : '/tenant/maintenance-due';
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch maintenance due');
  }
}; 