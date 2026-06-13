import axiosInstance from "./axiosInstance";

export const getAdminStats = async () => {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const updateUserStatus = async (id, active) => {
  const res = await axiosInstance.patch(`/admin/users/${id}/status`, { active });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
};

export const getAllJobs = async () => {
  const res = await axiosInstance.get("/admin/jobs");
  return res.data;
};

export const updateJobStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/admin/jobs/${id}/status`, { status });
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await axiosInstance.delete(`/admin/jobs/${id}`);
  return res.data;
};