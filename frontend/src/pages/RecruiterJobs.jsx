import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getMyJobs, deleteJob, closeJob } from '../api/jobs'
import '../styles/jobs.css'

function timeAgo(dateStr) {
  const d = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

export default function RecruiterJobs() {
  const navigate = useNavigate()
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getMyJobs()
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleClose = async (id) => {
    if (!window.confirm('Close this job? Candidates will no longer be able to apply.')) return
    await closeJob(id)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this job from the platform?')) return
    await deleteJob(id)
    load()
  }

  const active = jobs.filter(j => j.status === 'ACTIVE').length

  return (
    <DashboardLayout>
      <div className="jobs-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1>My Jobs</h1>
          <p>{active} active listing{active !== 1 ? 's' : ''} · {jobs.length} total</p>
        </div>
        <button className="form-submit" onClick={() => navigate('/jobs/post')}>+ Post New Job</button>
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading…</h3></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No jobs posted yet</h3>
          <p>Create your first listing and start receiving ranked candidates.</p>
          <button className="form-submit" onClick={() => navigate('/jobs/post')}>Post a Job</button>
        </div>
      ) : (
        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {job.companyName || '—'}
                    </div>
                  </td>
                  <td>
                    <span className={`job-type-badge ${job.jobType}`}>
                      {job.jobType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{job.location}</td>
                  <td><span className={`status-badge ${job.status}`}>{job.status}</span></td>
                  <td>{timeAgo(job.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn primary"
                        onClick={() => navigate(`/jobs/${job.id}`)}>View</button>
                      <button className="action-btn"
                        onClick={() => navigate(`/jobs/${job.id}/edit`)}>Edit</button>
                      {job.status === 'ACTIVE' && (
                        <button className="action-btn" onClick={() => handleClose(job.id)}>Close</button>
                      )}
                      <button className="action-btn danger" onClick={() => handleDelete(job.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}