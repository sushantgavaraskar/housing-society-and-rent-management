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

export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/complaints', complaintData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create complaint');
  }
};

export const getMyComplaints = async () => {
  try {
    const response = await api.get('/complaints/my');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch complaints');
  }
};

export const getAllComplaints = async () => {
  try {
    const response = await api.get('/complaints');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all complaints');
  }
};

export const updateComplaint = async (complaintId, updateData) => {
  try {
    const response = await api.patch(`/complaints/${complaintId}`, updateData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update complaint');
  }
};

export const deleteComplaint = async (complaintId) => {
  try {
    const response = await api.delete(`/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete complaint');
  }
};

export const getComplaintById = async (complaintId) => {
  try {
    const response = await api.get(`/complaints/${complaintId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch complaint');
  }
}; 