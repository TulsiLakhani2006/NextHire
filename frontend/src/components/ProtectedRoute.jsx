import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useAuth()

  if (!auth) return <Navigate to="/login" replace />

  if (allowedRoles) {
    const userRole = auth.role?.toUpperCase()
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase())

    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}