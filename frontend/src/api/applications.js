import api from './axiosInstance'

export const applyToJob          = (data)              => api.post('/applications', data)
export const getMyApplications   = ()                  => api.get('/applications/me')
export const checkApplied        = (jobId)             => api.get(`/applications/check/${jobId}`)
export const getApplicants       = (jobId, page=0, size=20) =>
  api.get(`/applications/jobs/${jobId}?page=${page}&size=${size}`)
export const updateAppStatus     = (id, data)          => api.patch(`/applications/${id}`, data)
export const withdrawApplication = (id)                => api.delete(`/applications/${id}`)

export const getRecruiterApplicantCount = () => api.get('/applications/recruiter/count')