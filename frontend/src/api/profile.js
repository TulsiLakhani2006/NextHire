import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
});

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
  return axios.post(`${API_BASE}/profile/resume`, formData, {
    ...getAuthHeader(),
    headers: {
      ...getAuthHeader().headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Toggle public/private visibility
export const toggleVisibility = () =>
  axios.patch(`${API_BASE}/profile/visibility`, {}, getAuthHeader());

// Get all public profiles (recruiter)
export const getPublicProfiles = () =>
  axios.get(`${API_BASE}/profile/public`, getAuthHeader());