import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import SkillsInput from '../components/profile/SkillsInput';
import ResumeUpload from '../components/profile/ResumeUpload';
import CompletionMeter from '../components/profile/CompletionMeter';
import '../styles/profile.css';

const STEPS = ['Personal Info', 'Skills', 'Education', 'Experience'];

const emptyEdu = { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' };
const emptyExp = { company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: '' };

// ── Live completion calculator (mirrors backend logic) ──────────────────────
const calcCompletion = (form, hasResume) => {
  let score = 0;
  if (form.headline?.trim()) score += 20;
  if (form.skills?.length > 0) score += 20;
  if (form.education?.some(e => e.institution?.trim())) score += 20;
  if (form.experience?.some(e => e.company?.trim())) score += 20;
  if (hasResume) score += 20;
  return score;
};

// ── Per-step validation rules ───────────────────────────────────────────────
const validateStep = (step, form) => {
  const errors = [];

  if (step === 0) {
    if (!form.headline?.trim())
      errors.push('Professional Headline is required.');
    if (!form.preferredLocation?.trim())
      errors.push('Preferred Location is required.');
    if (!form.salaryExpectation || Number(form.salaryExpectation) <= 0)
      errors.push('Expected Salary must be a positive number.');
  }

  if (step === 1) {
    if (!form.skills || form.skills.length === 0)
      errors.push('Add at least one skill before continuing.');
  }

  if (step === 2) {
    const edu = form.education?.[0];
    if (!edu?.institution?.trim()) errors.push('Institution name is required.');
    if (!edu?.degree?.trim())      errors.push('Degree is required.');
    if (!edu?.startYear?.trim())   errors.push('Start year is required.');
  }

  if (step === 3) {
    const exp = form.experience?.[0];
    if (!exp?.company?.trim())   errors.push('Company name is required.');
    if (!exp?.title?.trim())     errors.push('Job title is required.');
    if (!exp?.startDate?.trim()) errors.push('Start date is required.');
  }

  return errors;
};

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { profile, loading, saving, saveProfile, uploadResumeFile, toggleProfileVisibility } = useProfile();
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [fieldErrors, setFieldErrors] = useState([]);
  const [touched, setTouched] = useState(false); // show errors only after first Next attempt

  const [form, setForm] = useState({
    headline: '',
    bio: '',
    preferredLocation: '',
    salaryExpectation: '',
    isPublic: true,
    skills: [],
    education: [{ ...emptyEdu }],
    experience: [{ ...emptyExp }],
  });

  // Populate form from saved profile
  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline || '',
        bio: profile.bio || '',
        preferredLocation: profile.preferredLocation || '',
        salaryExpectation: profile.salaryExpectation || '',
        isPublic: profile.isPublic ?? true,
        skills: profile.skills || [],
        education: profile.education?.length ? profile.education : [{ ...emptyEdu }],
        experience: profile.experience?.length ? profile.experience : [{ ...emptyExp }],
      });
    }
  }, [profile]);

  // Live completion %
  const livePercent = useMemo(
    () => calcCompletion(form, !!profile?.resumeUrl),
    [form, profile?.resumeUrl]
  );

  // Re-validate whenever form changes (so errors clear as soon as field is filled)
  useEffect(() => {
    if (touched) setFieldErrors(validateStep(step, form));
  }, [form, step, touched]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    const result = await saveProfile({ ...form, salaryExpectation: Number(form.salaryExpectation) });
    if (result.success) showToast('Draft saved!');
    else showToast(result.message, 'error');
  };

  const handleNext = async () => {
    setTouched(true);
    const errors = validateStep(step, form);
    if (errors.length > 0) {
      setFieldErrors(errors);
      showToast(errors[0], 'error');   // show first error in toast too
      return;                           // ← BLOCK navigation
    }
    setFieldErrors([]);
    setTouched(false);
    await handleSave();
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else navigate('/dashboard');
  };

  const handleStepClick = (i) => {
    // Only allow jumping to already-completed steps or current step
    if (i <= step) setStep(i);
  };

  const updateEdu = (idx, field, value) => {
    const list = [...form.education];
    list[idx] = { ...list[idx], [field]: value };
    handleChange('education', list);
  };

  const updateExp = (idx, field, value) => {
    const list = [...form.experience];
    list[idx] = { ...list[idx], [field]: value };
    handleChange('experience', list);
  };

  // Which fields are invalid for inline red-border highlighting
  const isInvalid = (field) => touched && fieldErrors.some(e => e.toLowerCase().includes(field.toLowerCase()));

  if (loading) return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-setup-page">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="profile-sidebar">
        <CompletionMeter percent={livePercent} />

        <nav className="step-nav">
          {STEPS.map((s, i) => (
            <button
              key={s}
              className={`step-btn ${i === step ? 'active' : ''} ${i < step ? 'done' : ''} ${i > step ? 'locked' : ''}`}
              onClick={() => handleStepClick(i)}
              title={i > step ? 'Complete current step first' : ''}
            >
              <span className="step-num">{i < step ? '✓' : i + 1}</span>
              {s}
              {i > step && <span className="step-lock">🔒</span>}
            </button>
          ))}
        </nav>

        {/* Visibility toggle */}
        <div className="visibility-toggle">
          <label>Profile Visibility</label>
          <div className="toggle-row">
            <span>{form.isPublic ? 'Public' : 'Private'}</span>
            <button
              className={`toggle-btn ${form.isPublic ? 'on' : 'off'}`}
              onClick={toggleProfileVisibility}
            >
              {form.isPublic ? '👁 Public' : '🔒 Private'}
            </button>
          </div>
          <p className="visibility-note">
            {form.isPublic ? 'Recruiters can find you' : 'Hidden from recruiters'}
          </p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="profile-main">
        <div className="step-header">
          <h1>{STEPS[step]}</h1>
          <p>Step {step + 1} of {STEPS.length} — changes auto-saved as draft</p>
        </div>

        {/* Inline validation error banner */}
        {touched && fieldErrors.length > 0 && (
          <div className="error-banner">
            {fieldErrors.map((e, i) => (
              <p key={i}>⚠ {e}</p>
            ))}
          </div>
        )}

        {/* ── Step 0: Personal Info ── */}
        {step === 0 && (
          <div className="step-content">
            <div className={`form-group ${isInvalid('headline') ? 'has-error' : ''}`}>
              <label>Professional Headline <span className="required">*</span></label>
              <input
                type="text"
                value={form.headline}
                onChange={e => handleChange('headline', e.target.value)}
                placeholder="e.g. Full Stack Developer with 3 years experience"
                maxLength={120}
              />
              {isInvalid('headline') && <span className="field-error">Headline is required</span>}
            </div>

            <div className="form-group">
              <label>Bio <span className="optional">(optional)</span></label>
              <textarea
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Tell recruiters about yourself..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className={`form-group ${isInvalid('location') ? 'has-error' : ''}`}>
                <label>Preferred Location <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.preferredLocation}
                  onChange={e => handleChange('preferredLocation', e.target.value)}
                  placeholder="e.g. Pune, Remote"
                />
                {isInvalid('location') && <span className="field-error">Location is required</span>}
              </div>
              <div className={`form-group ${isInvalid('salary') ? 'has-error' : ''}`}>
                <label>Expected Salary (₹ LPA) <span className="required">*</span></label>
                <input
                  type="number"
                  value={form.salaryExpectation}
                  onChange={e => handleChange('salaryExpectation', e.target.value)}
                  placeholder="e.g. 12"
                  min={1}
                />
                {isInvalid('salary') && <span className="field-error">Valid salary is required</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Skills ── */}
        {step === 1 && (
          <div className="step-content">
            <p className="step-hint">Add at least one skill. Type and press Enter, or pick from suggestions.</p>
            <div className={touched && fieldErrors.length > 0 && form.skills.length === 0 ? 'skills-error-wrap' : ''}>
              <SkillsInput
                skills={form.skills}
                onChange={(skills) => handleChange('skills', skills)}
              />
              {touched && form.skills.length === 0 && (
                <span className="field-error">At least one skill is required</span>
              )}
            </div>
            <ResumeUpload
              currentResumeUrl={profile?.resumeUrl}
              onUpload={uploadResumeFile}
            />
          </div>
        )}

        {/* ── Step 2: Education ── */}
        {step === 2 && (
          <div className="step-content">
            {form.education.map((edu, i) => (
              <div key={i} className="entry-card">
                <div className="entry-card-header">
                  <h3>Education {i + 1}</h3>
                  {i > 0 && (
                    <button className="btn-remove" onClick={() =>
                      handleChange('education', form.education.filter((_, idx) => idx !== i))
                    }>Remove</button>
                  )}
                </div>
                <div className="form-row">
                  <div className={`form-group ${i === 0 && isInvalid('institution') ? 'has-error' : ''}`}>
                    <label>Institution {i === 0 && <span className="required">*</span>}</label>
                    <input value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="University / College" />
                    {i === 0 && isInvalid('institution') && <span className="field-error">Institution is required</span>}
                  </div>
                  <div className={`form-group ${i === 0 && isInvalid('degree') ? 'has-error' : ''}`}>
                    <label>Degree {i === 0 && <span className="required">*</span>}</label>
                    <input value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="B.Tech / M.Sc" />
                    {i === 0 && isInvalid('degree') && <span className="field-error">Degree is required</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input value={edu.fieldOfStudy} onChange={e => updateEdu(i, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className={`form-group ${i === 0 && isInvalid('start year') ? 'has-error' : ''}`}>
                    <label>Start Year {i === 0 && <span className="required">*</span>}</label>
                    <input value={edu.startYear} onChange={e => updateEdu(i, 'startYear', e.target.value)} placeholder="2018" />
                    {i === 0 && isInvalid('start year') && <span className="field-error">Start year is required</span>}
                  </div>
                  <div className="form-group">
                    <label>End Year</label>
                    <input value={edu.endYear} onChange={e => updateEdu(i, 'endYear', e.target.value)} placeholder="2022 or Present" />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn-add" onClick={() => handleChange('education', [...form.education, { ...emptyEdu }])}>
              + Add Another Education
            </button>
          </div>
        )}

        {/* ── Step 3: Experience ── */}
        {step === 3 && (
          <div className="step-content">
            {form.experience.map((exp, i) => (
              <div key={i} className="entry-card">
                <div className="entry-card-header">
                  <h3>Experience {i + 1}</h3>
                  {i > 0 && (
                    <button className="btn-remove" onClick={() =>
                      handleChange('experience', form.experience.filter((_, idx) => idx !== i))
                    }>Remove</button>
                  )}
                </div>
                <div className="form-row">
                  <div className={`form-group ${i === 0 && isInvalid('company') ? 'has-error' : ''}`}>
                    <label>Company {i === 0 && <span className="required">*</span>}</label>
                    <input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company name" />
                    {i === 0 && isInvalid('company') && <span className="field-error">Company is required</span>}
                  </div>
                  <div className={`form-group ${i === 0 && isInvalid('title') ? 'has-error' : ''}`}>
                    <label>Job Title {i === 0 && <span className="required">*</span>}</label>
                    <input value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Software Engineer" />
                    {i === 0 && isInvalid('title') && <span className="field-error">Job title is required</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input value={exp.location} onChange={e => updateExp(i, 'location', e.target.value)} placeholder="Pune / Remote" />
                  </div>
                  <div className={`form-group ${i === 0 && isInvalid('start date') ? 'has-error' : ''}`}>
                    <label>Start Date {i === 0 && <span className="required">*</span>}</label>
                    <input type="month" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} />
                    {i === 0 && isInvalid('start date') && <span className="field-error">Start date is required</span>}
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="month" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} disabled={exp.current} />
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" checked={exp.current} onChange={e => updateExp(i, 'current', e.target.checked)} />
                    Currently working here
                  </label>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} rows={3} placeholder="Key responsibilities and achievements..." />
                </div>
              </div>
            ))}
            <button className="btn-add" onClick={() => handleChange('experience', [...form.experience, { ...emptyExp }])}>
              + Add Another Experience
            </button>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="step-actions">
          <button className="btn-secondary" onClick={() => { setTouched(false); setFieldErrors([]); setStep(s => s - 1); }} disabled={step === 0}>
            ← Back
          </button>
          <button className="btn-save-draft" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="btn-primary" onClick={handleNext} disabled={saving}>
            {step === STEPS.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
        )}
      </main>
    </div>
  );
};

export default ProfileSetup;