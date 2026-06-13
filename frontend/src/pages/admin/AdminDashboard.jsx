import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob,
} from "../../api/admin";
import "../../styles/admin.css";

const TABS = ["Overview", "Users", "Jobs"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, usersData, jobsData] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllJobs(),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setJobs(jobsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleToggleUser = async (user) => {
    try {
      await updateUserStatus(user.id, !user.active);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user status.");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleToggleJob = async (job) => {
    const newStatus = job.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
    try {
      await updateJobStatus(job.id, newStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update job status.");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete job "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job.");
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-icon">⚡</span>
          <span>TalentAI</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`admin-nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Overview" && "📊"}
              {tab === "Users" && "👥"}
              {tab === "Jobs" && "💼"}
              <span>{tab}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        {activeTab === "Overview" && <OverviewTab stats={stats} />}
        {activeTab === "Users" && (
          <UsersTab
            users={users}
            onToggle={handleToggleUser}
            onDelete={handleDeleteUser}
          />
        )}
        {activeTab === "Jobs" && (
          <JobsTab
            jobs={jobs}
            onToggle={handleToggleJob}
            onDelete={handleDeleteJob}
          />
        )}
      </main>
    </div>
  );
}

function OverviewTab({ stats }) {
  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "indigo" },
    { label: "Candidates", value: stats.totalCandidates, icon: "🎓", color: "blue" },
    { label: "Recruiters", value: stats.totalRecruiters, icon: "💼", color: "purple" },
    { label: "Total Jobs", value: stats.totalJobs, icon: "📋", color: "amber" },
    { label: "Active Jobs", value: stats.activeJobs, icon: "✅", color: "green" },
    { label: "Closed Jobs", value: stats.closedJobs, icon: "🔒", color: "red" },
    { label: "Applications", value: stats.totalApplications, icon: "📨", color: "cyan" },
  ];

  return (
    <div>
      <h1>Platform Overview</h1>
      <p className="admin-subtitle">A snapshot of activity across TalentAI.</p>
      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div className={`admin-stat-card stat-${c.color}`} key={c.label}>
            <div className="admin-stat-icon">{c.icon}</div>
            <div>
              <div className="admin-stat-value">{c.value}</div>
              <div className="admin-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ users, onToggle, onDelete }) {
  return (
    <div>
      <h1>User Management</h1>
      <p className="admin-subtitle">{users.length} total users</p>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`admin-pill role-${u.role.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`admin-pill ${u.active ? "status-active" : "status-inactive"}`}>
                    {u.active ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="admin-actions">
                  {u.role !== "ADMIN" && (
                    <>
                      <button className="admin-btn" onClick={() => onToggle(u)}>
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className="admin-btn danger" onClick={() => onDelete(u)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobsTab({ jobs, onToggle, onDelete }) {
  return (
    <div>
      <h1>Job Moderation</h1>
      <p className="admin-subtitle">{jobs.length} total jobs posted</p>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Recruiter</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>{j.companyName}</td>
                <td>{j.recruiterName}</td>
                <td>{j.jobType}</td>
                <td>
                  <span className={`admin-pill ${j.status === "ACTIVE" ? "status-active" : "status-inactive"}`}>
                    {j.status}
                  </span>
                </td>
                <td className="admin-actions">
                  <button className="admin-btn" onClick={() => onToggle(j)}>
                    {j.status === "ACTIVE" ? "Close" : "Reopen"}
                  </button>
                  <button className="admin-btn danger" onClick={() => onDelete(j)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}