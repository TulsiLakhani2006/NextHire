import axiosInstance from "./axiosInstance";

export const applyToJob = (jobId, coverLetter = "") => {
  return axiosInstance.post("/applications", { jobId, coverLetter });
};

export const getMyApplications = () => {
  return axiosInstance.get("/applications/me");
};

export const withdrawApplication = (applicationId) => {
  return axiosInstance.delete(`/applications/${applicationId}`);
};

export const getApplicantsForJob = (jobId, page = 0, size = 10) => {
  return axiosInstance.get(`/jobs/${jobId}/applicants`, {
    params: { page, size },
  });
};

export const updateApplicationStatus = (applicationId, status, recruiterNotes) => {
  return axiosInstance.patch(`/applications/${applicationId}`, {
    status,
    recruiterNotes,
  });
};