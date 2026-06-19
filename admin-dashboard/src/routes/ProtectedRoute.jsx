import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/Loader'

export default function ProtectedRoute({
  children,
  allowedRoles
}) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <Loader />

  if (!isAuthenticated)
    return <Navigate to="/login" />

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" />
  }

  return children
}