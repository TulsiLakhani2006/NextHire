import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getMyApplications, withdrawApplication } from '../api/applications'
import '../styles/applications.css'

const STATUS_CONFIG = {
  APPLIED:      { label: 'Applied',       color: '#3B82F6', bg: '#EFF6FF' },
  UNDER_REVIEW: { label: 'Under Review',  color: '#D97706', bg: '#FFFBEB' },
  ACCEPTED:     { label: 'Accepted 🎉',   color: '#059669', bg: '#ECFDF5' },
  REJECTED:     { label: 'Rejected',      color: '#DC2626', bg: '#FEF2F2' },
  WITHDRAWN:    { label: 'Withdrawn',     color: '#6B7280', bg: '#F3F4F6' },
}

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const d = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

export default function MyApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [withdrawing,  setWithdrawing]  = useState(null)
  const [error,        setError]        = useState('')

  const load = () => {
    setLoading(true)
    getMyApplications()
      .then(r => setApplications(r.data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application? This cannot be undone.')) return
    setWithdrawing(id)
    try {
      await withdrawApplication(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to withdraw')
    } finally {
      setWithdrawing(null)
    }
  }

  const canWithdraw = (status) => ['APPLIED', 'UNDER_REVIEW'].includes(status)

  return (
    <DashboardLayout>
      <div className="apps-header">
        <div>
          <h1>My Applications</h1>
          <p>
            {applications.length} total ·{' '}
            {applications.filter(a => canWithdraw(a.status)).length} active ·{' '}
            {applications.filter(a => a.status === 'ACCEPTED').length} accepted
          </p>
        </div>
        <button className="form-submit" onClick={() => navigate('/jobs')}>Browse More Jobs</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Status summary cards */}
      <div className="app-stats-row">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="app-stat-card" style={{ borderTop: `3px solid ${cfg.color}` }}>
            <div className="app-stat-num" style={{ color: cfg.color }}>
              {applications.filter(a => a.status === key).length}
            </div>
            <div className="app-stat-label">{cfg.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading…</h3></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs that match your skills and experience.</p>
          <button className="form-submit" style={{ marginTop: 16 }} onClick={() => navigate('/jobs')}>
            Browse Jobs →
          </button>
        </div>
      ) : (
        <div className="apps-list">
          {applications.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED
            return (
              <div key={app.id} className="app-card">
                <div className="app-card-left">
                  <div className="app-job-title">{app.jobTitle || 'Job no longer available'}</div>
                  <div className="app-company">{app.company || '—'}</div>

                  <div className="app-meta">
                    <span>📅 {timeAgo(app.appliedAt)}</span>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="resume-link">
                        📎 View Resume
                      </a>
                    )}
                  </div>

                  {app.coverLetter && (
                    <p className="app-cover-preview">
                      "{app.coverLetter.length > 120
                        ? app.coverLetter.slice(0, 120) + '…'
                        : app.coverLetter}"
                    </p>
                  )}
                </div>

                <div className="app-card-right">
                  <span className="app-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </span>
                  <div className="app-card-actions">
                    <button className="action-btn" onClick={() => navigate(`/jobs/${app.jobId}`)}>
                      View Job
                    </button>
                    {canWithdraw(app.status) && (
                      <button
                        className="action-btn danger"
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawing === app.id}
                      >
                        {withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}