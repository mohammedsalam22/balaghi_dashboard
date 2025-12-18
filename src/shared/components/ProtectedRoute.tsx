import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

// Route to role mapping
const routeRoles: Record<string, string[]> = {
  '/citizens': ['Admin'],
  '/government-agency': ['Admin'],
  '/analytics': ['Admin'],
  '/dashboard': ['Admin'],
  '/complaints': ['Admin', 'Employee'],
  '/settings': ['Admin', 'Employee'],
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, roles } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const fallbackPath = roles.includes('Admin') ? '/dashboard' : '/complaints'

  // Check if route requires specific roles
  const routeRequiredRoles = requiredRoles || routeRoles[location.pathname]
  if (routeRequiredRoles && routeRequiredRoles.length > 0) {
    const hasRequiredRole = routeRequiredRoles.some((role) => roles.includes(role))
    if (!hasRequiredRole) {
      return <Navigate to={fallbackPath} replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
