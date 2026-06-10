import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProfileSetup from './pages/ProfileSetup';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route
          path="/profile/setup"
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<div className="page-shell"><h2>Access denied.</h2></div>} />
      </Routes>
    </BrowserRouter>
  )
}