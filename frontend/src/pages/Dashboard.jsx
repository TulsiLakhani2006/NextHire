import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DashboardLayout from '../components/DashboardLayout'
 import { getMyJobs, getAllJobs } from '../api/jobs'
import { getMyApplications, getRecruiterApplicantCount } from '../api/applications'

export default function Dashboard() {
  const { auth }  = useAuth()
  const navigate  = useNavigate()
const [stats, setStats] = useState({ jobs: 0, total: 0, applications: 0 })
  const isCandidate = auth?.role === 'CANDIDATE'
  const isRecruiter = auth?.role === 'RECRUITER'

 

useEffect(() => {
  if (isRecruiter) {
    getMyJobs().then(r => setStats(s => ({ ...s, jobs: r.data.filter(j=>j.status==='ACTIVE').length, total: r.data.length })))
    getRecruiterApplicantCount().then(r => setStats(s => ({ ...s, applications: r.data })))
  }
  if (isCandidate) {
    getAllJobs(0, 1).then(r => setStats(s => ({ ...s, total: r.data.totalElements })))
    getMyApplications().then(r => setStats(s => ({ ...s, applications: r.data.filter(a => a.status !== 'WITHDRAWN').length })))
  }
}, [isRecruiter, isCandidate])

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Good morning, {auth?.name?.split(' ')[0]} 👋</h1>
        <p className="page-sub">Here's what's happening with your {isRecruiter ? 'listings' : 'job search'} today.</p>
      </div>

      {/* Welcome card */}
      <div className="welcome-card">
        <div className="welcome-text">
          <h2>
            {isCandidate && 'Find your next opportunity'}
            {isRecruiter && 'Manage your job listings'}
          </h2>
          <p>
            {isCandidate && `${stats.total} active jobs are waiting. Browse them and apply to the best matches.`}
            {isRecruiter && `${stats.jobs} active listing${stats.jobs!==1?'s':''} live. Post new jobs or review your applicants.`}
          </p>
        </div>
        <div className="welcome-emoji">{isCandidate ? '🚀' : '📋'}</div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {isCandidate && <>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#EEF2FF'}}>💼</div>
            <div><div className="stat-num">{stats.total}</div><div className="stat-label">Active Jobs</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#D1FAE5'}}>📄</div>
            <div className="stat-num">{stats.applications ?? 0}</div><div className="stat-label">Applications Sent</div></div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#FEF3C7'}}>🎯</div>
            <div><div className="stat-num">—</div><div className="stat-label">Match Score</div></div>
          </div>
        </>}
        {isRecruiter && <>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#EEF2FF'}}>📋</div>
            <div><div className="stat-num">{stats.jobs}</div><div className="stat-label">Active Jobs</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#D1FAE5'}}>👥</div>
            <div><div className="stat-num">{stats.applications ?? 0}</div><div className="stat-label">Applicants</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:'#FEF3C7'}}>📊</div>
            <div><div className="stat-num">{stats.total}</div><div className="stat-label">Total Jobs</div></div>
          </div>
        </>}
      </div>

      {/* Quick actions */}
      <div className="coming-soon">
        <div className="cs-icon">{isCandidate ? '💼' : '➕'}</div>
        <h3>{isCandidate ? 'Start browsing jobs' : 'Post your first job'}</h3>
        <p>
          {isCandidate ? 'Browse all active jobs and apply. AI-powered matching scores coming in Phase 5.'
                       : 'Create a listing and receive ranked, matched candidates automatically.'}
        </p>
        <button
          className="form-submit"
          style={{marginTop:16}}
          onClick={() => navigate(isCandidate ? '/jobs' : '/jobs/post')}
        >
          {isCandidate ? 'Browse Jobs →' : 'Post a Job →'}
        </button>
      </div>
    </DashboardLayout>
  )
}