/**
 * Presentation Types - Export all presentation layer types
 */

// Re-export core types for convenience
export type { AuthConfig } from '../../config/AuthConfig'
export type { AuthError } from '../../core/entities/AuthError'
export type { AuthState } from '../../core/entities/AuthState'
export type { User } from '../../core/entities/User'

// Component prop types
export type { AuthGuardProps } from '../components/AuthGuard'
export type { ForgotPasswordFormProps } from '../components/ForgotPasswordForm'
export type { LoginFormProps } from '../components/LoginForm'
export type { RegisterFormProps } from '../components/RegisterForm'
export type { AuthContextValue, AuthProviderProps } from '../providers/AuthContext'

