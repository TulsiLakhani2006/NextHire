import { Navigate } from 'react-router-dom'
// NEW
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useAuth()

  if (!auth) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}