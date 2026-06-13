import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data.count;
};

export const markNotificationRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};