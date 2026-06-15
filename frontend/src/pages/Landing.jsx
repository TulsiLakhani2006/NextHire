import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/landing.css'
// Use emoji fallback for shield icon to avoid missing dependency
// import { ShieldCheck } from 'lucide-react';
const candidateSteps = [
  { num: '1', title: 'Create your profile', desc: 'Add your skills, experience, and preferences. Takes less than 5 minutes.' },
  { num: '2', title: 'Upload your resume', desc: 'Our AI parses it automatically and fills your profile in seconds.' },
  { num: '3', title: 'Get matched instantly', desc: 'See ranked job recommendations with a match score for each.' },
]

const recruiterSteps = [
  { num: '1', title: 'Post your job', desc: 'List required skills, experience, location and salary in minutes.' },
  { num: '2', title: 'Get qualified applicants', desc: 'Candidates are ranked by match score so you review the best first.' },
  { num: '3', title: 'Hire with confidence', desc: 'Use analytics to track your pipeline and improve your listings.' },
]

export default function Landing() {
  const [tab, setTab] = useState('candidate')

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">⚡</span>
            <span className="gradient-text">NextHire</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How it works</a>
            <Link to="/login"    className="btn-outline" style={{padding:'8px 18px',fontSize:'13px'}}>Sign in</Link>
            <Link to="/register" className="btn-primary" style={{padding:'8px 18px',fontSize:'13px'}}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">✨ AI-Powered Job Matching</div>
            <h1>
              Find jobs that{' '}
              <span className="gradient-text">actually match</span>
              {' '}your skills
            </h1>
            <p className="hero-sub">
              Stop scrolling through irrelevant listings. Our intelligent matching
              engine analyzes your skills, experience, and preferences to surface
              only the opportunities worth your time.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary" style={{fontSize:'15px',padding:'13px 28px'}}>
                Start for free →
              </Link>
              <Link to="/login" className="btn-ghost" style={{fontSize:'15px'}}>
                Already have an account?
              </Link>
            </div>
            <p className="hero-note">🔒 Free to use · No credit card required</p>
          </div>

          <div className="match-card-wrap">
            <div className="match-card floating">
              <div className="mc-header">
                <div>
                  <div className="mc-job">Senior React Developer</div>
                  <div className="mc-co">TechCorp · Remote</div>
                </div>
                <div className="mc-badge">94%</div>
              </div>
              <div className="mc-tags">
                <span className="mc-tag matched">React</span>
                <span className="mc-tag matched">TypeScript</span>
                <span className="mc-tag matched">Node.js</span>
                <span className="mc-tag missing">GraphQL</span>
              </div>
              <div className="mc-bars">
                {[['Skills','92%','92%'],['Experience','95%','95%'],['Location','100%','100%']].map(([l,v,p])=>(
                  <div className="mc-bar-row" key={l}>
                    <span className="lbl">{l}</span>
                    <div className="bar-bg"><div className="bar-fill" style={{width:v}}/></div>
                    <span className="pct">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="notif-bubble">
              <div className="notif-dot"/>
              <div>
                <div className="notif-text">New match found!</div>
                <div className="notif-sub">Product Designer · 88% match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[['12,400+','Active Jobs'],['98,000+','Candidates'],['91%','Match Accuracy']].map(([n,l])=>(
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-center">
          <span className="section-eyebrow">Platform Features</span>
          <h2 className="section-title">Everything you need to land your next role</h2>
          <p className="section-sub">Powerful tools for both candidates looking for work and recruiters building teams.</p>
        </div>
        <div className="features-grid">
          {[
            { icon:'🧠', title:'Smart Matching', desc:'Our AI scores every job against your profile in real time using skills overlap, experience level, and location preference.' },
            { icon:'📑', title:'Resume Parsing', desc:'Upload your PDF resume once and watch your profile fill itself automatically — skills, experience, education, all extracted instantly.' },
            { icon:'🔔', title:'Instant Alerts', desc:'Get notified the moment a high-match job appears or your application status changes, via in-app and email notifications.' },
            { icon:'📊', title:'Recruiter Analytics', desc:'Track applications per job, acceptance rates, and skill demand trends through a real-time recruiter dashboard.' },
            { icon:'🛡️', title:'Role-Based Access', desc:'Candidates, recruiters, and admins each see a tailored experience. Your data is only visible to the right people.' },
            { icon:'⚡', title:'Fast & Scalable', desc:'Built with REST APIs, pagination, and Redis caching so the platform stays snappy even as the job database grows.' },
          ].map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon-wrap">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how" id="how">
        <div className="how-inner">
          <div className="section-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">Up and running in minutes</h2>
          </div>
          <div className="how-tabs">
            <button className={`how-tab ${tab==='candidate'?'active':''}`} onClick={()=>setTab('candidate')}>👤 For Candidates</button>
            <button className={`how-tab ${tab==='recruiter'?'active':''}`} onClick={()=>setTab('recruiter')}>💼 For Recruiters</button>
          </div>
          <div className="how-steps">
            {(tab==='candidate' ? candidateSteps : recruiterSteps).map(s=>(
              <div className="how-step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <h2>Ready to find your next role?</h2>
        <p>Join 98,000+ candidates already using NextHire to cut job search time in half.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn-white">Create free account →</Link>
          <Link to="/login"    className="btn-ghost" style={{color:'#C7D2FE'}}>Sign in instead</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">⚡ <span className="gradient-text">NextHire</span></div>
          <p className="footer-copy">© 2026 NextHire. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  )
}