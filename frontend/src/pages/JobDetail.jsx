import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getJobById } from '../api/jobs'
import { applyToJob, checkApplied } from '../api/applications'
import { useAuth } from '../hooks/useAuth'
import '../styles/jobs.css'
import '../styles/applications.css'

function formatSalary(min, max) {
  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`
  return (min || max) ? `${fmt(min)} – ${fmt(max)} / year` : 'Salary not disclosed'
}

export default function JobDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()

  const [job,         setJob]         = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [applied,     setApplied]     = useState(false)
  const [showModal,   setShowModal]   = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying,    setApplying]    = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')

  useEffect(() => {
    getJobById(id)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  // Check if already applied
  useEffect(() => {
    if (auth?.role === 'CANDIDATE' && id) {
      checkApplied(id)
        .then(r => setApplied(r.data))
        .catch(() => {})
    }
  }, [id, auth?.role])
const handleApply = async () => {
  setApplying(true)
  setError('')
  try {
    await applyToJob({ jobId: id, coverLetter })
    setApplied(true)
    setShowModal(false)
    setCoverLetter('')
    setSuccess('🎉 Application submitted! Good luck!')
    setTimeout(() => setSuccess(''), 5000)
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to apply. Please try again.')
  } finally {
    setApplying(false)
  }
}

  if (loading) return (
    <DashboardLayout>
      <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading…</h3></div>
    </DashboardLayout>
  )
  if (!job) return null

  return (
    <DashboardLayout>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to jobs</button>

      {success && <div className="success-toast">{success}</div>}

      <div className="job-detail-card">
        {/* Header */}
        <div className="detail-header">
          <div>
            <div className="detail-title">{job.title}</div>
            <div className="detail-company">
              {job.companyName || job.recruiterName} ·{' '}
              <span className={`job-type-badge ${job.jobType}`} style={{ fontSize: 11 }}>
                {job.jobType?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="detail-actions">
            {auth?.role === 'CANDIDATE' && (
              applied
                ? <button className="apply-btn applied" disabled>✓ Applied</button>
                : <button className="apply-btn" onClick={() => { setError(''); setShowModal(true) }}>
                    Apply Now
                  </button>
            )}
            {auth?.role === 'RECRUITER' && (
              <button
                className="action-btn primary"
                onClick={() => navigate(`/jobs/${id}/applicants`)}
              >
                👥 View Applicants
              </button>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="detail-meta-row">
          <div className="detail-meta-item"><span className="meta-icon">📍</span>{job.location}</div>
          <div className="detail-meta-item"><span className="meta-icon">💼</span>
            {job.minExperience}–{job.maxExperience} yrs exp.
          </div>
          <div className="detail-meta-item"><span className="meta-icon">💰</span>
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
          <div className="detail-meta-item"><span className="meta-icon">👤</span>
            Posted by {job.recruiterName}
          </div>
        </div>

        {/* Skills */}
        <div className="detail-section">
          <h3>Required Skills</h3>
          <div className="job-skills">
            {job.requiredSkills?.map(s => <span key={s} className="skill-chip">{s}</span>)}
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3>Job Description</h3>
          <p className="detail-desc">{job.description}</p>
        </div>

        {/* Bottom apply CTA for candidates */}
        {auth?.role === 'CANDIDATE' && (
          <div style={{ marginTop: 8 }}>
            {applied
              ? <button className="apply-btn applied" disabled>✓ Already Applied</button>
              : <button className="apply-btn" onClick={() => { setError(''); setShowModal(true) }}>
                  Apply for this Role →
                </button>
            }
          </div>
        )}
      </div>
      {error && (
  <div className="error-msg" style={{ marginBottom: 14 }}>
    ⚠️ {error}
    {(error.includes('profile') || error.includes('resume')) && (
      <div style={{ marginTop: 8 }}>
        <button
          className="action-btn"
          style={{ fontSize: 12, padding: '4px 10px' }}
          onClick={() => navigate('/profile/setup')}
        >
          Complete Profile →
        </button>
      </div>
    )}
  </div>
)}

      {/* ── Apply Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <p className="modal-sub">
                at <strong>{job.companyName || job.recruiterName}</strong> · {job.location}
              </p>

              {error && <div className="error-msg" style={{ marginBottom: 14 }}>⚠️ {error}</div>}

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)',
                  display: 'block', marginBottom: 6 }}>
                  Cover Letter <span style={{ color: 'var(--light)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder={`Hi, I'm excited to apply for the ${job.title} role. My skills in ${job.requiredSkills?.[0] || 'this field'} make me a strong fit because…`}
                  rows={6}
                />
              </div>

              <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex',
                alignItems: 'center', gap: 6, background: 'var(--bg)',
                padding: '8px 12px', borderRadius: 'var(--r-md)' }}>
                📎 Your saved resume will be attached automatically
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="apply-btn" onClick={handleApply} disabled={applying}>
                {applying ? 'Submitting…' : 'Submit Application →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
  
}