import api from './axiosInstance'

export const createJob       = (data)         => api.post('/api/jobs', data)
export const getAllJobs       = (page=0, size=10, search='') =>
  api.get(`/api/jobs?page=${page}&size=${size}&search=${search}`)
export const getMyJobs       = ()             => api.get('/api/jobs/my')
export const getJobById      = (id)           => api.get(`/api/jobs/${id}`)
export const updateJob       = (id, data)     => api.put(`/api/jobs/${id}`, data)
export const deleteJob       = (id)           => api.delete(`/api/jobs/${id}`)
export const closeJob        = (id)           => api.patch(`/api/jobs/${id}/close`)