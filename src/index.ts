/**
 * React Authentication Module
 *
 * A complete, reusable authentication module built with Clean Architecture principles.
 * Supports Firebase Auth with email/password, Google OAuth, and SMS authentication.
 *
 * @author Your Organization
 * @version 1.0.0
 */

// Core exports (entities, interfaces, use cases)
export * from './core'

// Configuration
export * from './config'

// Presentation layer (React components, hooks, providers)
export * from './presentation'

// Adapters (for advanced usage)
export { DIContainer } from './adapters/container/DIContainer'

// Infrastructure (for custom implementations)
export { FirebaseConfigService } from './infrastructure/firebase/FirebaseConfig'
export { LocalStorageService } from './infrastructure/storage/LocalStorageService'
export { ValidationServiceImpl } from './infrastructure/validation/ValidationServiceImpl'

// Main exports for easy usage
export { AuthGuard, ProtectedRoute, PublicRoute, VerifiedRoute } from './presentation/components'
export { ForgotPasswordForm } from './presentation/components/ForgotPasswordForm'
export { LoginForm } from './presentation/components/LoginForm'
export { RegisterForm } from './presentation/components/RegisterForm'
export { AuthProvider, useAuth } from './presentation/providers/AuthContext'

// Types for TypeScript users
export type {
  AuthConfig,
  AuthContextValue, AuthError, AuthGuardProps, AuthState, ForgotPasswordFormProps, LoginFormProps,
  RegisterFormProps, User
} from './presentation/types'

