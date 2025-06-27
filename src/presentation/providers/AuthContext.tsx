/**
 * Auth Context - React Context for authentication state and actions
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { DIContainer } from '../../adapters/container/DIContainer'
import { AuthConfig } from '../../config/AuthConfig'
import { AuthError } from '../../core/entities/AuthError'
import { AuthState } from '../../core/entities/AuthState'
import { User } from '../../core/entities/User'
import { AuthService } from '../../core/interfaces/AuthService'

export interface AuthContextValue {
  // State
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: AuthError | null
  isInitialized: boolean

  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>
  loginWithGoogle: () => Promise<User>
  initiateSMSLogin: (phoneNumber: string, countryCode?: string) => Promise<{ verificationId: string }>
  completeSMSLogin: (verificationId: string, code: string) => Promise<User>
  register: (data: {
    email: string
    password: string
    confirmPassword: string
    displayName?: string
    phoneNumber?: string
    acceptTerms: boolean
  }) => Promise<User>
  logout: () => Promise<void>

  // Utility methods
  refreshSession: () => Promise<User>
  sendPasswordReset: (email: string) => Promise<void>
  sendEmailVerification: () => Promise<void>
  updateProfile: (data: any) => Promise<User>

  // Permission methods
  hasPermission: (permission: string) => boolean
  getUserPermissions: () => string[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export interface AuthProviderProps {
  config: AuthConfig
  children: ReactNode
  onAuthStateChange?: (state: AuthState) => void
  onError?: (error: AuthError) => void
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  config,
  children,
  onAuthStateChange,
  onError
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    isInitialized: false,
    isSessionValid: false
  })

  const [authService, setAuthService] = useState<AuthService | null>(null)

  // Initialize the auth module
  useEffect(() => {
    let cleanup: (() => void) | undefined

    const initializeAuth = async () => {
      try {
        // Initialize DI container
        const container = DIContainer.getInstance()
        container.initialize(config)

        const service = container.getAuthService()
        setAuthService(service)

        // Subscribe to auth state changes
        const unsubscribe = service.onAuthStateChange((state) => {
          setAuthState(state)
          onAuthStateChange?.(state)
        })

        // Subscribe to auth errors
        const unsubscribeError = service.onAuthError((error) => {
          setAuthState(prev => ({ ...prev, error }))
          onError?.(error)
        })

        // Get initial auth state
        const initialState = await service.getCurrentAuthState()
        setAuthState({ ...initialState, isInitialized: true })

        cleanup = () => {
          unsubscribe()
          unsubscribeError()
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
          error: error as AuthError
        }))
      }
    }

    initializeAuth()

    return () => {
      cleanup?.()
    }
  }, [config, onAuthStateChange, onError])

  // Auth actions
  const login = async (email: string, password: string, rememberMe = false): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.login({ email, password, rememberMe })
  }

  const loginWithGoogle = async (): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.loginWithGoogle()
  }

  const initiateSMSLogin = async (phoneNumber: string, countryCode?: string) => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.initiateSMSLogin({ phoneNumber, countryCode })
  }

  const completeSMSLogin = async (verificationId: string, code: string): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.completeSMSLogin({ verificationId, code })
  }

  const register = async (data: {
    email: string
    password: string
    confirmPassword: string
    displayName?: string
    phoneNumber?: string
    acceptTerms: boolean
  }): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.register(data)
  }

  const logout = async (): Promise<void> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.logout()
  }

  const refreshSession = async (): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.refreshSession()
  }

  const sendPasswordReset = async (email: string): Promise<void> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.requestPasswordReset({ email })
  }

  const sendEmailVerification = async (): Promise<void> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.sendEmailVerification()
  }

  const updateProfile = async (data: any): Promise<User> => {
    if (!authService) throw new Error('Auth service not initialized')
    return authService.updateProfile(data)
  }

  const hasPermission = (permission: string): boolean => {
    if (!authService) return false
    return authService.hasPermission(permission)
  }

  const getUserPermissions = (): string[] => {
    if (!authService) return []
    return authService.getUserPermissions()
  }

  const contextValue: AuthContextValue = {
    // State
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    isInitialized: authState.isInitialized,

    // Actions
    login,
    loginWithGoogle,
    initiateSMSLogin,
    completeSMSLogin,
    register,
    logout,

    // Utility methods
    refreshSession,
    sendPasswordReset,
    sendEmailVerification,
    updateProfile,

    // Permission methods
    hasPermission,
    getUserPermissions
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Alias for backward compatibility
export const useAuthContext = useAuth
