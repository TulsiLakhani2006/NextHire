import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/dashboard.css'

const candidateLinks = [
  { icon:'🏠', label:'Home',           active:true  },
  { icon:'👤', label:'My Profile',     active:false },
  { icon:'💼', label:'Browse Jobs',    active:false, badge:'12' },
  { icon:'📄', label:'Applications',   active:false },
  { icon:'🔔', label:'Notifications',  active:false, badge:'3' },
]

const recruiterLinks = [
  { icon:'🏠', label:'Home',           active:true  },
  { icon:'📋', label:'My Jobs',        active:false },
  { icon:'👥', label:'Applicants',     active:false, badge:'8' },
  { icon:'📊', label:'Analytics',      active:false },
  { icon:'🔔', label:'Notifications',  active:false },
]

export default function Dashboard() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const isCandidate = auth?.role === 'CANDIDATE'
  const isRecruiter = auth?.role === 'RECRUITER'
  const links = isRecruiter ? recruiterLinks : candidateLinks
  const initials = auth?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          ⚡ <span className="gradient-text">NextHire</span>
        </div>

        <nav className="sidebar-nav">
          {links.map(l => (
            l.label === 'My Profile' ? (
              <NavLink
                to="/profile/setup"
                className={`sidebar-link ${l.active ? 'active' : ''}`}
                key={l.label}
              >
                <span className="link-icon">{l.icon}</span>
                {l.label}
                {l.badge && <span className="badge">{l.badge}</span>}
              </NavLink>
            ) : (
              <div
                className={`sidebar-link ${l.active ? 'active' : ''}`}
                key={l.label}
              >
                <span className="link-icon">{l.icon}</span>
                {l.label}
                {l.badge && <span className="badge">{l.badge}</span>}
              </div>
            )
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div>
              <div className="user-name">{auth?.name}</div>
              <div className="user-role">{auth?.role}</div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">
            Good morning, {auth?.name?.split(' ')[0]} 👋
          </h1>

          <p className="page-sub">
            Here's what's happening with your{' '}
            {isRecruiter ? 'job listings' : 'job search'} today.
          </p>
        </div>

        {/* Welcome card */}
        <div className="welcome-card">
          <div className="welcome-text">
            <h2>
              {isCandidate && 'Complete your profile to unlock matches'}
              {isRecruiter && 'Post your first job to start receiving applicants'}
              {auth?.role === 'ADMIN' && 'Welcome to the Admin panel'}
            </h2>

            <p>
              {isCandidate &&
                'Add your skills and upload your resume. Our AI will start matching you with relevant jobs immediately.'}

              {isRecruiter &&
                'Create a detailed job listing with required skills and experience. Qualified candidates are ranked automatically.'}

              {auth?.role === 'ADMIN' &&
                'Manage users, view platform analytics, and monitor system health.'}
            </p>
          </div>

          <div className="welcome-emoji">
            {isCandidate ? '🚀' : isRecruiter ? '📋' : '🛡️'}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {isCandidate && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#EEF2FF' }}
                >
                  🎯
                </div>
                <div>
                  <div className="stat-num">—</div>
                  <div className="stat-label">Job Matches</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#D1FAE5' }}
                >
                  📄
                </div>
                <div>
                  <div className="stat-num">0</div>
                  <div className="stat-label">Applications Sent</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#FEF3C7' }}
                >
                  🔔
                </div>
                <div>
                  <div className="stat-num">3</div>
                  <div className="stat-label">New Notifications</div>
                </div>
              </div>
            </>
          )}

          {isRecruiter && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#EEF2FF' }}
                >
                  📋
                </div>
                <div>
                  <div className="stat-num">0</div>
                  <div className="stat-label">Active Jobs</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#D1FAE5' }}
                >
                  👥
                </div>
                <div>
                  <div className="stat-num">0</div>
                  <div className="stat-label">Total Applicants</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-wrap"
                  style={{ background: '#FEF3C7' }}
                >
                  📊
                </div>
                <div>
                  <div className="stat-num">—</div>
                  <div className="stat-label">Avg. Match Score</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phase placeholder */}
        <div className="coming-soon">
          <div className="cs-icon">
            {isCandidate ? '🧠' : '💼'}
          </div>

          <h3>
            {isCandidate
              ? 'Your job matches will appear here'
              : 'Your job listings will appear here'}
          </h3>

          <p>
            {isCandidate
              ? 'Complete your profile in Phase 2 and the AI matching engine (Phase 5) will rank jobs by how well they fit your skills.'
              : 'Post your first job in Phase 3 and start receiving ranked applicants with match scores.'}
          </p>
        </div>
      </main>
    </div>
  )
}