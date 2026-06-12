import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getMyApplications, withdrawApplication } from "../api/applications";
import "../styles/jobs.css";

const statusColors = {
  APPLIED: "#3b82f6",
  UNDER_REVIEW: "#f59e0b",
  ACCEPTED: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getMyApplications();
      setApplications(Array.isArray(res.data) ? res.data : []);
      if (!Array.isArray(res.data)) {
        setError("Unexpected applications response format");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
    };
    loadApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await withdrawApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "WITHDRAWN" } : app))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to withdraw application");
    }
  };

  if (loading) return <DashboardLayout><p>Loading applications...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2>My Applications</h2>
      {error && <p className="error-text">{error}</p>}

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-info">
                <h3>{app.jobTitle}</h3>
                <p className="company-name">{app.company}</p>
                <p className="applied-date">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                {app.coverLetter && (
                  <p className="cover-letter-preview">"{app.coverLetter}"</p>
                )}
              </div>

              <div className="application-status-section">
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[app.status] }}
                >
                  {app.status.replace("_", " ")}
                </span>

                {(app.status === "APPLIED" || app.status === "UNDER_REVIEW") && (
                  <button className="withdraw-btn" onClick={() => handleWithdraw(app.id)}>
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplications;