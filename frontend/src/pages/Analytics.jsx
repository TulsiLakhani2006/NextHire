import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getRecruiterAnalytics } from "../api/analytics";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/analytics.css";

const STATUS_COLORS = {
  APPLIED: "#6366f1",
  SHORTLISTED: "#f59e0b",
  INTERVIEW: "#0ea5e9",
  REJECTED: "#ef4444",
  HIRED: "#22c55e",
};

const TYPE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRecruiterAnalytics();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="analytics-loading">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="analytics-error">{error}</div>
      </DashboardLayout>
    );
  }

  const statusData = Object.entries(data.applicationsByStatus || {}).map(
    ([status, count]) => ({ status, count })
  );

  const typeData = Object.entries(data.jobsByType || {}).map(
    ([type, count]) => ({ type, count })
  );

  const timelineData = (data.applicationsOverTime || []).map((d) => ({
    date: d.date.slice(5), // MM-DD
    count: d.count,
  }));

  return (
    <DashboardLayout>
      <div className="analytics-page">
        <h1>Analytics</h1>
        <p className="analytics-subtitle">
          Overview of your job listings and applicant activity.
        </p>

        {/* Summary cards */}
        <div className="analytics-summary-grid">
          <SummaryCard label="Total Jobs" value={data.totalJobs} />
          <SummaryCard label="Active Jobs" value={data.activeJobs} />
          <SummaryCard label="Total Applicants" value={data.totalApplicants} />
          <SummaryCard label="Hired" value={data.totalHired} />
        </div>

        <div className="analytics-charts-grid">
          {/* Applications over time */}
          <div className="analytics-card analytics-card-wide">
            <h3>Applications (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1f1f2e", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Applications by status */}
          <div className="analytics-card">
            <h3>Applications by Status</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={90}
                  label={({ status, count }) =>
                    count > 0 ? `${status}: ${count}` : ""
                  }
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || "#888"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1f1f2e", border: "none" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs by type */}
          <div className="analytics-card">
            <h3>Jobs by Type</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1f1f2e", border: "none" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell
                      key={entry.type}
                      fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top jobs by applicants */}
          <div className="analytics-card analytics-card-wide">
            <h3>Top Jobs by Applicants</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.topJobsByApplicants || []}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis type="number" stroke="#9ca3af" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="#9ca3af"
                  width={150}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{ background: "#1f1f2e", border: "none" }}
                />
                <Bar
                  dataKey="applicantCount"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="analytics-summary-card">
      <div className="analytics-summary-value">{value}</div>
      <div className="analytics-summary-label">{label}</div>
    </div>
  );
}