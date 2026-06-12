import api from './axiosInstance'

export const createJob       = (data)         => api.post('/jobs', data)
export const getAllJobs       = (page=0, size=10, search='') =>
  api.get(`/jobs?page=${page}&size=${size}&search=${search}`)
export const getMyJobs       = ()             => api.get('/jobs/my')
export const getJobById      = (id)           => api.get(`/jobs/${id}`)
export const updateJob       = (id, data)     => api.put(`/jobs/${id}`, data)
export const deleteJob       = (id)           => api.delete(`/jobs/${id}`)
export const closeJob        = (id)           => api.patch(`/jobs/${id}/close`)