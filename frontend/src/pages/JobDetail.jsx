import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getJobById } from '../api/jobs'
import { useAuth } from '../hooks/useAuth'
import '../styles/jobs.css'


function formatSalary(min, max) {
  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`
  return min || max ? `${fmt(min)} – ${fmt(max)} / year` : 'Salary not disclosed'
}

export default function JobDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { auth }  = useAuth()
  const [job, setJob]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobById(id)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <DashboardLayout><div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading…</h3></div></DashboardLayout>
  if (!job)    return null

  return (
    <DashboardLayout>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to jobs</button>

      <div className="job-detail-card">
        <div className="detail-header">
          <div>
            <div className="detail-title">{job.title}</div>
            <div className="detail-company">
              {job.companyName || job.recruiterName} ·{' '}
              <span className={`job-type-badge ${job.jobType}`} style={{fontSize:11}}>
                {job.jobType?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="detail-actions">
            {auth?.role === 'CANDIDATE' && (
              <button className="apply-btn" disabled title="Application system coming in Phase 4">
                Apply Now (Phase 4)
              </button>
            )}
          </div>
        </div>

        <div className="detail-meta-row">
          <div className="detail-meta-item"><span className="meta-icon">📍</span>{job.location}</div>
          <div className="detail-meta-item"><span className="meta-icon">💼</span>{job.minExperience}–{job.maxExperience} years exp.</div>
          <div className="detail-meta-item"><span className="meta-icon">💰</span>{formatSalary(job.salaryMin, job.salaryMax)}</div>
          <div className="detail-meta-item"><span className="meta-icon">👤</span>Posted by {job.recruiterName}</div>
        </div>

        <div className="detail-section">
          <h3>Required Skills</h3>
          <div className="job-skills">
            {job.requiredSkills?.map(s => <span key={s} className="skill-chip">{s}</span>)}
          </div>
        </div>

        <div className="detail-section">
          <h3>Job Description</h3>
          <p className="detail-desc">{job.description}</p>
        </div>

        {auth?.role === 'CANDIDATE' && (
          <button className="apply-btn" disabled title="Coming in Phase 4">
            Apply Now — Coming in Phase 4
          </button>
        )}
      </div>
    </DashboardLayout>
  )
}