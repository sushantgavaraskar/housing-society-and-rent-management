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

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await api.post('/announcements', announcementData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create announcement');
  }
};

export const getAllAnnouncements = async () => {
  try {
    const response = await api.get('/announcements');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch announcements');
  }
};

export const getRelevantAnnouncements = async () => {
  try {
    const response = await api.get('/announcements/relevant');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch relevant announcements');
  }
};

export const updateAnnouncement = async (announcementId, updateData) => {
  try {
    const response = await api.put(`/announcements/${announcementId}`, updateData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update announcement');
  }
};

export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await api.delete(`/announcements/${announcementId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete announcement');
  }
};

export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await api.get(`/announcements/${announcementId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch announcement');
  }
}; 