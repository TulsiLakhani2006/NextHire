import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getApplicants, updateAppStatus } from '../api/applications'
import { getJobById } from '../api/jobs'
import '../styles/applications.css'

const STATUSES = ['APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']

const STATUS_CONFIG = {
  APPLIED:      { label: 'Applied',       color: '#3B82F6', bg: '#EFF6FF' },
  UNDER_REVIEW: { label: 'Under Review',  color: '#D97706', bg: '#FFFBEB' },
  ACCEPTED:     { label: 'Accepted',      color: '#059669', bg: '#ECFDF5' },
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

export default function JobApplicants() {
  const { jobId }  = useParams()
  const navigate   = useNavigate()

  const [job,           setJob]           = useState(null)
  const [applicants,    setApplicants]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(0)
  const [filterStatus,  setFilterStatus]  = useState('ALL')
  const [noteMap,       setNoteMap]       = useState({})    // { appId: text }
  const [savingNote,    setSavingNote]    = useState(null)
  const [updatingId,    setUpdatingId]    = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [jobRes, appRes] = await Promise.all([
        getJobById(jobId),
        getApplicants(jobId, page, 20),
      ])
      setJob(jobRes.data)
      setApplicants(appRes.data.content)
      setTotalPages(appRes.data.totalPages)
    } catch {
      navigate('/recruiter/jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [jobId, page])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId)
    try {
      await updateAppStatus(appId, { status: newStatus })
      setApplicants(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveNote = async (appId) => {
    setSavingNote(appId)
    try {
      const note = noteMap[appId] ?? applicants.find(a => a.id === appId)?.recruiterNotes ?? ''
      await updateAppStatus(appId, { recruiterNotes: note })
      setApplicants(prev =>
        prev.map(a => a.id === appId ? { ...a, recruiterNotes: note } : a))
    } catch {
      alert('Failed to save note')
    } finally {
      setSavingNote(null)
    }
  }

  const displayed = (filterStatus === 'ALL'
  ? applicants
  : applicants.filter(a => a.status === filterStatus)
).filter(a => a.status !== 'WITHDRAWN')
const counts = STATUSES.reduce((acc, s) => ({
  ...acc, [s]: applicants.filter(a => a.status === s).length
}), {})

  if (loading) return (
    <DashboardLayout>
      <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading applicants…</h3></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <button className="back-btn" onClick={() => navigate('/recruiter/jobs')}>
        ← Back to My Jobs
      </button>

      <div className="apps-header">
        <div>
          <h1>Applicants — {job?.title}</h1>
          <p>
            {applicants.length} application{applicants.length !== 1 ? 's' : ''} ·{' '}
            {job?.companyName || job?.recruiterName || ''}
          </p>
        </div>
        <button className="action-btn primary" onClick={() => navigate(`/jobs/${jobId}`)}>
          View Job Listing
        </button>
      </div>

      {/* Status stats — clickable as filters */}
     <div className="app-stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s]
          const isActive = filterStatus === s
          return (
            <div
              key={s}
              className={`app-stat-card clickable ${isActive ? 'active-filter' : ''}`}
              style={{ borderTop: `3px solid ${cfg.color}`, cursor: 'pointer',
                outline: isActive ? `2px solid ${cfg.color}` : 'none' }}
              onClick={() => setFilterStatus(isActive ? 'ALL' : s)}
            >
              <div className="app-stat-num" style={{ color: cfg.color }}>{counts[s]}</div>
              <div className="app-stat-label">{cfg.label}</div>
            </div>
          )
        })}
      </div>

      {filterStatus !== 'ALL' && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            Filtering: <strong>{STATUS_CONFIG[filterStatus].label}</strong> ({displayed.length})
          </span>
          <button className="action-btn" style={{ padding: '3px 10px', fontSize: 12 }}
            onClick={() => setFilterStatus('ALL')}>
            Clear
          </button>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No applicants {filterStatus !== 'ALL' ? `with status "${filterStatus}"` : 'yet'}</h3>
          <p>Share the job listing to attract more candidates.</p>
        </div>
      ) : (
        <div className="apps-list">
          {displayed.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED
            const currentNote = noteMap[app.id] ?? (app.recruiterNotes || '')

            return (
              <div key={app.id} className="app-card recruiter-card">
                <div className="app-card-left">
                  {/* Candidate info */}
                  <div className="app-job-title">
                    {app.candidateName || 'Unknown Candidate'}
                  </div>
                  <div className="app-company">{app.candidateEmail || '—'}</div>

                  <div className="app-meta">
                    <span>📅 Applied {timeAgo(app.appliedAt)}</span>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="resume-link">
                        📎 View Resume
                      </a>
                    )}
                  </div>

                  {app.coverLetter && (
                    <div className="cover-letter-box">
                      <strong>Cover Letter</strong>
                      <p>{app.coverLetter}</p>
                    </div>
                  )}

                  {/* Internal note */}
                  <div className="note-section">
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
                      Internal Note
                    </label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <input
                        className="note-input"
                        placeholder="Add a private note about this candidate…"
                        value={currentNote}
                        onChange={e => setNoteMap(m => ({ ...m, [app.id]: e.target.value }))}
                      />
                      <button
                        className="action-btn"
                        style={{ flexShrink: 0 }}
                        onClick={() => handleSaveNote(app.id)}
                        disabled={savingNote === app.id}
                      >
                        {savingNote === app.id ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="app-card-right">
                  <span className="app-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </span>

                  <div style={{ width: '100%' }}>
                    <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600,
                      display: 'block', marginBottom: 4 }}>
                      Update Status
                    </label>
                    <select
                      className="status-select"
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                    {updatingId === app.id && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                        Updating…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ← Prev
          </button>
          <span className="page-info">Page {page + 1} of {totalPages}</span>
          <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}