import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await loginUser(form)

      if (data.role !== 'ADMIN') {
        setError('This account does not have admin access.')
        setLoading(false)
        return
      }

      login(data)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* Left branding */}
      <div className="auth-left">
        <div className="auth-brand">⚡ <span className="gradient-text">NextHire</span></div>
        <div className="auth-left-body">
          <h2>Admin Control Panel</h2>
          <p>Sign in to manage users, jobs, and platform analytics.</p>
          {[['🛠️','Manage users & roles'],['📊','Platform-wide analytics'],['🔐','Secure admin access']].map(([icon,text])=>(
            <div className="auth-feature" key={text}>
              <div className="auth-feature-icon">{icon}</div>
              <div className="auth-feature-text">{text}</div>
            </div>
          ))}
        </div>
        <div className="auth-left-footer">
          Not an admin? <Link to="/login" style={{color:'#818CF8'}}>Go to regular sign in →</Link>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1>Admin Sign in</h1>
          <p className="subtitle">Restricted access — authorized personnel only</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email address</label>
              <input type="email" placeholder="admin@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Your password" value={form.password}
                onChange={e => set('password', e.target.value)} required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}