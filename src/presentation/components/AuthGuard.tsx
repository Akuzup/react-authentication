/**
 * AuthGuard Component - Protects routes based on authentication status
 */

import React, { ReactNode } from 'react'
import { useAuthState } from '../hooks/useAuthState'

export interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  requiredPermissions?: string[]
  fallback?: ReactNode
  loadingComponent?: ReactNode
  unauthorizedComponent?: ReactNode
  redirectTo?: string
  onUnauthorized?: () => void
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  requiredPermissions = [],
  fallback,
  loadingComponent,
  unauthorizedComponent,
  redirectTo,
  onUnauthorized
}) => {
  const { user, isLoading, isAuthenticated, isInitialized } = useAuthState()

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    
    return (
      <div className="auth-guard-loading flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo
      return null
    }
    
    if (onUnauthorized) {
      onUnauthorized()
    }
    
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>
    }
    
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="auth-guard-unauthorized flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access this page.
          </p>
        </div>
      </div>
    )
  }

  // Check email verification requirement
  if (requireEmailVerification && user && !user.emailVerified) {
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>
    }
    
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="auth-guard-email-verification flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4">
            <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Email Verification Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please verify your email address to access this page. Check your inbox for a verification link.
          </p>
          <button
            onClick={() => {
              // This would trigger email verification resend
              // Implementation depends on how you want to handle this
            }}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Resend verification email
          </button>
        </div>
      </div>
    )
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && user) {
    // This is a simplified permission check
    // In a real implementation, you'd check user.customClaims or call a permission service
    const userPermissions = user.customClaims?.permissions || []
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
    
    if (!hasAllPermissions) {
      if (onUnauthorized) {
        onUnauthorized()
      }
      
      if (unauthorizedComponent) {
        return <>{unauthorizedComponent}</>
      }
      
      if (fallback) {
        return <>{fallback}</>
      }
      
      return (
        <div className="auth-guard-insufficient-permissions flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-4">
              <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      )
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

// Convenience components for common use cases
export const ProtectedRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <AuthGuard requireAuth={true} fallback={fallback}>
    {children}
  </AuthGuard>
)

export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requireAuth={false}>
    {children}
  </AuthGuard>
)

export const VerifiedRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <AuthGuard requireAuth={true} requireEmailVerification={true} fallback={fallback}>
    {children}
  </AuthGuard>
)

export default AuthGuard
