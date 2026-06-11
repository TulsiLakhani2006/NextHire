import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  return auth ? JSON.parse(auth).token : null;
};

const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Get logged-in candidate's profile
export const getMyProfile = () =>
  axios.get(`${API_BASE}/profile/me`, getAuthHeader());

// Create or update profile (upsert)
export const upsertProfile = (profileData) =>
  axios.put(`${API_BASE}/profile`, profileData, getAuthHeader());

// Upload resume PDF
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = getAuthHeader();
  return axios.post(`${API_BASE}/profile/resume`, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Get all public profiles (recruiter)
export const getPublicProfiles = () =>
  axios.get(`${API_BASE}/profile/public`, getAuthHeader());