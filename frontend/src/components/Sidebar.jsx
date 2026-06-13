import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from "react";
import { getUnreadCount } from "../api/notifications";
const candidateLinks = [
  { icon: '🏠', label: 'Dashboard',       path: '/dashboard' },
  { icon: '👤', label: 'My Profile',      path: '/profile/setup' },
  { icon: '💼', label: 'Browse Jobs',     path: '/jobs' },
  { icon: '📄', label: 'Applications',    path: '/my-applications' },
  { icon: '🔔', label: 'Notifications',   path: '/notifications' },
]
const recruiterLinks = [
  { icon: '🏠', label: 'Dashboard',  path: '/dashboard' },
  { icon: '📋', label: 'My Jobs',    path: '/recruiter/jobs' },
  { icon: '➕', label: 'Post a Job', path: '/jobs/post' },
  { icon: '📊', label: 'Analytics',  path: '/analytics' },
]
const adminLinks = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '👥', label: 'Users',     path: '/admin/users' },
  { icon: '💼', label: 'All Jobs',  path: '/admin/jobs' },
]

export default function Sidebar() {
  const { auth, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [unreadCount, setUnreadCount] = useState(0);
  const links = auth?.role === 'RECRUITER' ? recruiterLinks
              : auth?.role === 'ADMIN'     ? adminLinks
              : candidateLinks
  useEffect(() => {
  const fetchCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCount();
  const interval = setInterval(fetchCount, 30000); // poll every 30s
  return () => clearInterval(interval);
}, []);
  const initials = auth?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}>
        ⚡ <span className="gradient-text">TalentAI</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(l => (
          <div
            key={l.path}
            className={`sidebar-link ${isActive(l.path) ? 'active' : ''}`}
            onClick={() => navigate(l.path)}
          >
            <span className="link-icon">{l.icon}</span>
            {l.label}
            {l.path === '/notifications' && unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{auth?.name}</div>
            <div className="user-role">{auth?.role?.toLowerCase()}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => { logout(); navigate('/') }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}