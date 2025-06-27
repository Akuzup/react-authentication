/**
 * useAuthState Hook - Hook for auth state only (no actions)
 */

import { useAuth } from '../providers/AuthContext'

export const useAuthState = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    isInitialized
  } = useAuth()

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    isInitialized
  }
}

export default useAuthState
