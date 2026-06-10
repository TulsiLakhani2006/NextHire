import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'

export default function Register() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ name:'', email:'', password:'', role:'CANDIDATE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await registerUser(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* Left branding */}
      <div className="auth-left">
        <div className="auth-brand">⚡ <span className="gradient-text">NextHire</span></div>
        <div className="auth-left-body">
          <h2>Start finding jobs that actually fit you</h2>
          <p>Create your free account in under 2 minutes and let AI do the job searching for you.</p>
          {[['🎯','Personalised job matches from day one'],['📊','Track all your applications in one place'],['🚀','Get noticed by top recruiters']].map(([icon,text])=>(
            <div className="auth-feature" key={text}>
              <div className="auth-feature-icon">{icon}</div>
              <div className="auth-feature-text">{text}</div>
            </div>
          ))}
        </div>
        <div className="auth-left-footer">Already have an account? <Link to="/login" style={{color:'#818CF8'}}>Sign in →</Link></div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1>Create account</h1>
          <p className="subtitle">Already registered? <Link to="/login">Sign in</Link></p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full name</label>
              <input placeholder="Jane Smith" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Minimum 6 characters" value={form.password}
                onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="input-group">
              <label>I am a…</label>
              <div className="role-select-group">
                {[['CANDIDATE','👤','Job Seeker'],['RECRUITER','💼','Recruiter']].map(([val,emoji,label])=>(
                  <div className="role-option" key={val}>
                    <input type="radio" id={val} name="role" value={val}
                      checked={form.role===val} onChange={()=>set('role',val)} />
                    <label htmlFor={val}>
                      <span className="role-emoji">{emoji}</span>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}