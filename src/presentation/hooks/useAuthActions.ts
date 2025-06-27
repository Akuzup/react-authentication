/**
 * useAuthActions Hook - Hook for auth actions only (no state)
 */

import { useAuth } from "../providers/AuthContext"


export const useAuthActions = () => {
  const {
    login,
    loginWithGoogle,
    initiateSMSLogin,
    completeSMSLogin,
    register,
    logout,
    refreshSession,
    sendPasswordReset,
    sendEmailVerification,
    updateProfile,
    hasPermission,
    getUserPermissions
  } = useAuth()

  return {
    login,
    loginWithGoogle,
    initiateSMSLogin,
    completeSMSLogin,
    register,
    logout,
    refreshSession,
    sendPasswordReset,
    sendEmailVerification,
    updateProfile,
    hasPermission,
    getUserPermissions
  }
}

export default useAuthActions
