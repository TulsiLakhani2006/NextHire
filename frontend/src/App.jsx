import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Dashboard     from './pages/Dashboard'
import ProfileSetup  from './pages/ProfileSetup'
import BrowseJobs    from './pages/BrowseJobs'
import JobDetail     from './pages/JobDetail'
import PostJob       from './pages/PostJob'
import RecruiterJobs from './pages/RecruiterJobs'
import MyApplications from './pages/MyApplications'
import JobApplicants from './pages/JobApplicants'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shared protected */}
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Candidate */}
        <Route path="/profile/setup" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><ProfileSetup /></ProtectedRoute>
        }/>
        <Route path="/jobs" element={
          <ProtectedRoute><BrowseJobs /></ProtectedRoute>
        }/>
        <Route path="/jobs/:id" element={
          <ProtectedRoute><JobDetail /></ProtectedRoute>
        }/>

        {/* Recruiter */}
        <Route path="/jobs/post" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><PostJob /></ProtectedRoute>
        }/>
        <Route path="/jobs/:id/edit" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><PostJob /></ProtectedRoute>
        }/>
        <Route path="/recruiter/jobs" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterJobs /></ProtectedRoute>
        }/>
        <Route path="/my-applications" element={
          <ProtectedRoute role="CANDIDATE"><MyApplications /></ProtectedRoute>
        } />

        <Route path="/jobs/:jobId/applicants" element={
          <ProtectedRoute role="RECRUITER"><JobApplicants /></ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<div style={{padding:'2rem'}}><h2>Access denied.</h2></div>} />
      </Routes>
    </BrowserRouter>
  )
}