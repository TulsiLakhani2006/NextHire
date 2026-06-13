import axiosInstance from "./axiosInstance";

export const getRecruiterAnalytics = async () => {
  const response = await axiosInstance.get("/analytics/recruiter");
  return response.data;
};