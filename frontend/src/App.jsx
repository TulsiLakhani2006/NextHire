import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute  from './components/ProtectedRoute'
import Landing         from './pages/Landing'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import ProfileSetup    from './pages/ProfileSetup'
import BrowseJobs      from './pages/BrowseJobs'
import JobDetail       from './pages/JobDetail'
import PostJob         from './pages/PostJob'
import RecruiterJobs   from './pages/RecruiterJobs'
import MyApplications  from './pages/MyApplications'
import JobApplicants   from './pages/JobApplicants'
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
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
        <Route path="/dashboard/*" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }/>

        {/* Candidate routes */}
        <Route path="/profile/setup" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><ProfileSetup /></ProtectedRoute>
        }/>
        <Route path="/jobs" element={
          <ProtectedRoute><BrowseJobs /></ProtectedRoute>
        }/>
        <Route path="/my-applications" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><MyApplications /></ProtectedRoute>
        }/>

        {/* Recruiter routes — must come BEFORE /jobs/:id */}
        <Route path="/jobs/post" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><PostJob /></ProtectedRoute>
        }/>
        <Route path="/recruiter/jobs" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterJobs /></ProtectedRoute>
        }/>
        <Route path="/jobs/:jobId/applicants" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><JobApplicants /></ProtectedRoute>
        }/>
        <Route path="/jobs/:id/edit" element={
          <ProtectedRoute allowedRoles={['RECRUITER']}><PostJob /></ProtectedRoute>
        }/>

        {/* Shared job detail — after specific routes */}
        <Route path="/jobs/:id" element={
          <ProtectedRoute><JobDetail /></ProtectedRoute>
        }/>

        <Route path="/unauthorized" element={
          <div style={{ padding: '2rem' }}><h2>Access denied.</h2></div>
        }/>
        <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
        <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

              <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['RECRUITER']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  )
}