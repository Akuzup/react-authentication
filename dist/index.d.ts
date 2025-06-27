/**
 * React Authentication Module
 *
 * A complete, reusable authentication module built with Clean Architecture principles.
 * Supports Firebase Auth with email/password, Google OAuth, and SMS authentication.
 *
 * @author Your Organization
 * @version 1.0.0
 */
export * from './core';
export * from './config';
export * from './presentation';
export { DIContainer } from './adapters/container/DIContainer';
export { FirebaseConfigService } from './infrastructure/firebase/FirebaseConfig';
export { LocalStorageService } from './infrastructure/storage/LocalStorageService';
export { ValidationServiceImpl } from './infrastructure/validation/ValidationServiceImpl';
export { AuthGuard, LoginForm, ProtectedRoute, PublicRoute, RegisterForm, VerifiedRoute } from './presentation/components';
export { AuthProvider, useAuth } from './presentation/providers/AuthContext';
export type { AuthConfig, AuthContextValue, AuthError, AuthGuardProps, AuthState, LoginFormProps, RegisterFormProps, User } from './presentation/types';
//# sourceMappingURL=index.d.ts.map