import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getAllJobs } from '../api/jobs'
import '../styles/jobs.css'

const JOB_TYPES = ['ALL', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

function formatSalary(min, max) {
  if (!min && !max) return 'Salary not listed'
  const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`
  return `${fmt(min)} – ${fmt(max)}`
}

export default function BrowseJobs() {
  const navigate = useNavigate()
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [query,   setQuery]   = useState('')
  const [page,    setPage]    = useState(0)
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(0)
  const SIZE = 9

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getAllJobs(page, SIZE, query)
      setJobs(data.content)
      setTotal(data.totalElements)
      setPages(data.totalPages)
    } catch { /* handled by interceptor */ }
    finally  { setLoading(false) }
  }, [page, query])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleSearch = () => { setPage(0); setQuery(search) }

  return (
    <DashboardLayout>
      <div className="jobs-header">
        <h1>Browse Jobs</h1>
        <p>{total} active opportunities available</p>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search job title or keyword…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading jobs…</h3></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try a different search term or check back later.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className="job-card-top">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-company">
                    {job.companyName || job.recruiterName}
                  </div>
                </div>
                <span className={`job-type-badge ${job.jobType}`}>
                  {job.jobType?.replace('_', ' ')}
                </span>
              </div>

              <div className="job-meta">
                <span className="job-meta-item">📍 {job.location}</span>
                <span className="job-meta-item">
                  💼 {job.minExperience}–{job.maxExperience} yrs
                </span>
              </div>

              <div className="job-skills">
                {job.requiredSkills?.slice(0, 4).map(s => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
                {job.requiredSkills?.length > 4 && (
                  <span className="skill-chip more">+{job.requiredSkills.length - 4}</span>
                )}
              </div>

              <div className="job-footer">
                <span className="job-salary">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                <span className="job-date">{timeAgo(job.createdAt)}</span>
                <span className="view-btn">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => p-1)} disabled={page === 0}>← Prev</button>
          <span className="page-info">Page {page + 1} of {pages}</span>
          <button className="page-btn" onClick={() => setPage(p => p+1)} disabled={page >= pages-1}>Next →</button>
        </div>
      )}
    </DashboardLayout>
  )
}