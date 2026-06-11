import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';              // ← added
import SkillsInput from '../components/profile/SkillsInput';
import ResumeUpload from '../components/profile/ResumeUpload';
import CompletionMeter from '../components/profile/CompletionMeter';
import '../styles/profile.css';
import '../styles/dashboard.css';

const STEPS = ['Personal Info', 'Skills', 'Education'];

const emptyEdu = { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' };
const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Engineer', 'Product Manager', 'UI/UX Designer',
  'DevOps Engineer', 'QA Engineer'
];

const calcCompletion = (form, hasResume) => {
  const fields = [
    Boolean(form.headline?.trim()),
    Boolean(form.preferredLocation?.trim()),
    Boolean(form.salaryExpectation && Number(form.salaryExpectation) > 0),
    Boolean(form.jobRole?.trim()),
    Boolean(form.skills?.length > 0),
    Boolean(form.education?.[0]?.institution?.trim()),
    Boolean(form.education?.[0]?.degree?.trim()),
    Boolean(form.education?.[0]?.startYear?.trim()),
    Boolean(form.experienceYears !== '' && form.experienceYears !== null && Number(form.experienceYears) >= 0),
    Boolean(hasResume),
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
};

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
  return errors;
};

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { profile, loading, saving, saveProfile, uploadResumeFile } = useProfile();
  const [step, setStep]               = useState(0);
  const [toast, setToast]             = useState({ msg: '', type: 'success' });
  const [fieldErrors, setFieldErrors] = useState([]);
  const [touched, setTouched]         = useState(false);

  const [form, setForm] = useState({
    headline: '', bio: '', preferredLocation: '', salaryExpectation: '',
    jobRole: '', experienceYears: '', skills: [],
    education: [{ ...emptyEdu }],
  });

  useEffect(() => {
    if (profile) {
      setForm({
        headline:          profile.headline          || '',
        bio:               profile.bio               || '',
        preferredLocation: profile.preferredLocation || '',
        salaryExpectation: profile.salaryExpectation || '',
        jobRole:           profile.jobRole           || '',
        experienceYears:   profile.experienceYears   || '',
        skills:            profile.skills            || [],
        education:         profile.education?.length ? profile.education : [{ ...emptyEdu }],
      });
    }
  }, [profile]);

  const livePercent = useMemo(
    () => calcCompletion(form, !!profile?.resumeUrl),
    [form, profile?.resumeUrl]
  );

  useEffect(() => {
    if (touched) setFieldErrors(validateStep(step, form));
  }, [form, step, touched]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    const result = await saveProfile({
      ...form,
      salaryExpectation: Number(form.salaryExpectation),
      experienceYears:   form.experienceYears ? Number(form.experienceYears) : null,
    });
    if (result.success) showToast('Draft saved!');
    else showToast(result.message, 'error');
  };

  const handleNext = async () => {
    setTouched(true);
    const errors = validateStep(step, form);
    if (errors.length > 0) {
      setFieldErrors(errors);
      showToast(errors[0], 'error');
      return;
    }
    setFieldErrors([]);
    setTouched(false);
    await handleSave();
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else navigate('/dashboard');
  };

  const isStepUnlocked = (i) => {
    if (i <= step) return true;
    if (i === 1) return form.skills?.length > 0;
    if (i === 2) return (
      form.education?.[0]?.institution?.trim() &&
      form.education?.[0]?.degree?.trim() &&
      form.education?.[0]?.startYear?.trim()
    );
    return false;
  };

  const updateEdu = (idx, field, value) => {
    const list = [...form.education];
    list[idx] = { ...list[idx], [field]: value };
    handleChange('education', list);
  };

  const isInvalid = (field) =>
    touched && fieldErrors.some(e => e.toLowerCase().includes(field.toLowerCase()));

  if (loading) return <div className="profile-loading">Loading your profile...</div>;

  return (
    // ── Only change: wrap with app-shell + shared Sidebar ──
    <div className="app-shell">
      <Sidebar />  {/* ← navigation sidebar, exactly like every other page */}

      {/* Right side keeps the same two-panel profile layout */}
      <div className="profile-setup-page">

        {/* ── Step sidebar (unchanged) ── */}
        <aside className="profile-sidebar">
          <CompletionMeter percent={livePercent} />

          <nav className="step-nav">
            {STEPS.map((s, i) => {
              const unlocked = isStepUnlocked(i);
              return (
                <button
                  key={s}
                  className={`step-btn ${i === step ? 'active' : ''} ${i < step ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                  onClick={() => unlocked && setStep(i)}
                  title={!unlocked ? 'Complete current step first' : ''}
                >
                  <span className="step-num">{i < step ? '✓' : i + 1}</span>
                  {s}
                  {!unlocked && <span className="step-lock">🔒</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Main form (completely unchanged) ── */}
        <main className="profile-main">
          <div className="step-header">
            <h1>{STEPS[step]}</h1>
            <p>Step {step + 1} of {STEPS.length} — changes auto-saved as draft</p>
          </div>

          {touched && fieldErrors.length > 0 && (
            <div className="error-banner">
              {fieldErrors.map((e, i) => <p key={i}>⚠ {e}</p>)}
            </div>
          )}

          {/* Step 0 — Personal Info */}
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

              <div className="form-row">
                <div className="form-group">
                  <label>Job Role</label>
                  <select value={form.jobRole} onChange={e => handleChange('jobRole', e.target.value)}>
                    <option value="">Select a role</option>
                    {JOB_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    value={form.experienceYears}
                    onChange={e => handleChange('experienceYears', e.target.value)}
                    placeholder="e.g. 3"
                    min={0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Skills */}
          {step === 1 && (
            <div className="step-content">
              <p className="step-hint">Add at least one skill. Type and press Enter, or pick from suggestions.</p>
              <div className={touched && fieldErrors.length > 0 && form.skills.length === 0 ? 'skills-error-wrap' : ''}>
                <SkillsInput
                  skills={form.skills}
                  onChange={skills => handleChange('skills', skills)}
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

          {/* Step 2 — Education */}
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
              <button className="btn-add" onClick={() =>
                handleChange('education', [...form.education, { ...emptyEdu }])
              }>
                + Add Another Education
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="step-actions">
            <button
              className="btn-secondary"
              onClick={() => { setTouched(false); setFieldErrors([]); setStep(s => s - 1); }}
              disabled={step === 0}
            >← Back</button>
            <button className="btn-save-draft" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button className="btn-primary" onClick={handleNext} disabled={saving}>
              {step === STEPS.length - 1 ? 'Finish →' : 'Next →'}
            </button>
          </div>

          {toast.msg && (
            <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileSetup;