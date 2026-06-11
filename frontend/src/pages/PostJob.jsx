import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { createJob, updateJob, getJobById } from '../api/jobs'
import '../styles/jobs.css'

const EMPTY = {
  title: '', description: '', requiredSkills: [],
  minExperience: 0, maxExperience: 0,
  location: '', salaryMin: '', salaryMax: '',
  jobType: 'FULL_TIME', companyName: '',
}

export default function PostJob() {
  const navigate    = useNavigate()
  const { id }      = useParams()              // present when editing
  const isEdit      = Boolean(id)
  const [form, setForm]     = useState(EMPTY)
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  // Pre-fill when editing
  useEffect(() => {
    if (!isEdit) return
    getJobById(id).then(r => {
      const j = r.data
      setForm({
        title: j.title, description: j.description,
        requiredSkills: j.requiredSkills,
        minExperience: j.minExperience, maxExperience: j.maxExperience,
        location: j.location, salaryMin: j.salaryMin, salaryMax: j.salaryMax,
        jobType: j.jobType, companyName: j.companyName || '',
      })
    })
  }, [id, isEdit])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.requiredSkills.includes(s)) {
      set('requiredSkills', [...form.requiredSkills, s])
    }
    setSkillInput('')
  }
  const removeSkill = (s) => set('requiredSkills', form.requiredSkills.filter(x => x !== s))

  const handleSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() }
    if (e.key === 'Backspace' && !skillInput && form.requiredSkills.length) {
      set('requiredSkills', form.requiredSkills.slice(0, -1))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.requiredSkills.length === 0) { setError('Add at least one required skill.'); return }
    setError(''); setLoading(true)
    try {
      const payload = { ...form, salaryMin: +form.salaryMin, salaryMax: +form.salaryMax }
      if (isEdit) { await updateJob(id, payload); setSuccess('Job updated successfully!') }
      else        { await createJob(payload);       setSuccess('Job posted successfully!') }
      setTimeout(() => navigate('/recruiter/jobs'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  return (
    <DashboardLayout>
      <button className="back-btn" onClick={() => navigate('/recruiter/jobs')}>← Back to My Jobs</button>

      <div className="form-card">
        <h2>{isEdit ? 'Edit Job' : 'Post a New Job'}</h2>
        <p className="form-sub">
          {isEdit ? 'Update the details below.' : 'Fill in the details and start receiving ranked candidates.'}
        </p>

        {success && <div className="success-toast">✅ {success}</div>}
        {error   && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group form-full">
              <label>Job Title *</label>
              <input placeholder="e.g. Senior React Developer"
                value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input placeholder="e.g. TechCorp Pvt. Ltd."
                value={form.companyName} onChange={e => set('companyName', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Job Type *</label>
              <select value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                {['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE'].map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input placeholder="e.g. Mumbai / Remote"
                value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Min. Experience (years)</label>
              <input type="number" min="0" max="30"
                value={form.minExperience} onChange={e => set('minExperience', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Max. Experience (years)</label>
              <input type="number" min="0" max="30"
                value={form.maxExperience} onChange={e => set('maxExperience', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Min. Salary (₹/year)</label>
              <input type="number" min="0" placeholder="e.g. 600000"
                value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Max. Salary (₹/year)</label>
              <input type="number" min="0" placeholder="e.g. 1200000"
                value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
            </div>

            <div className="form-group form-full">
              <label>Required Skills * <span style={{color:'var(--light)',fontWeight:400}}>(press Enter or comma to add)</span></label>
              <div className="skills-input-wrap" onClick={() => document.getElementById('skillInp').focus()}>
                {form.requiredSkills.map(s => (
                  <span key={s} className="skill-tag">
                    {s}<button type="button" onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))}
                <input
                  id="skillInp"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKey}
                  onBlur={addSkill}
                  placeholder={form.requiredSkills.length ? '' : 'React, Node.js, MongoDB…'}
                />
              </div>
              <span className="skills-hint">e.g. React, Node.js, Java, Spring Boot</span>
            </div>

            <div className="form-group form-full">
              <label>Job Description *</label>
              <textarea
                placeholder="Describe the role, responsibilities, team, and what makes it great…"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Job' : 'Post Job →'}
            </button>
            <button type="button" className="action-btn" onClick={() => navigate('/recruiter/jobs')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}