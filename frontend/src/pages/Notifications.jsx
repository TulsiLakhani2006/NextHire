import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notifications";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/notifications.css";

const TYPE_ICONS = {
  STATUS_CHANGE: "📄",
  NEW_MATCHING_JOB: "🎯",
  MESSAGE: "💬",
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotifications();
        setNotifications(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    // Navigate based on notification type
    if (notification.type === "NEW_MATCHING_JOB" && notification.relatedJobId) {
      navigate(`/jobs/${notification.relatedJobId}`);
    } else if (notification.type === "STATUS_CHANGE") {
      navigate("/applications");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="notifications-loading">Loading notifications...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="notifications-error">{error}</div>
      </DashboardLayout>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="notifications-page">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">🔔</div>
            <h3>No notifications yet</h3>
            <p>
              We'll let you know about application updates, new job matches,
              and messages from recruiters.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${n.read ? "" : "unread"}`}
                onClick={() => handleClick(n)}
              >
                <div className="notification-icon">
                  {TYPE_ICONS[n.type] || "🔔"}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{n.title}</div>
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-time">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.read && <div className="notification-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}