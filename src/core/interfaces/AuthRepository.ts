/**
 * AuthRepository Interface - Defines the contract for authentication data access
 * This interface abstracts the authentication data layer from business logic
 */

import { User, CreateUserData, UpdateUserData } from '../entities/User'
import { AuthError } from '../entities/AuthError'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends CreateUserData {
  password: string
}

export interface SMSVerificationResult {
  verificationId: string
  timeout: number
}

export interface PasswordResetData {
  email: string
  newPassword: string
  resetToken: string
}

export interface AuthRepository {
  // Authentication methods
  /**
   * Authenticate user with email and password
   */
  loginWithEmailPassword(credentials: LoginCredentials): Promise<User>
  
  /**
   * Authenticate user with Google OAuth
   */
  loginWithGoogle(): Promise<User>
  
  /**
   * Send SMS verification code to phone number
   */
  sendSMSVerification(phoneNumber: string): Promise<SMSVerificationResult>
  
  /**
   * Verify SMS code and authenticate user
   */
  verifySMSCode(verificationId: string, code: string): Promise<User>
  
  /**
   * Register new user with email and password
   */
  register(userData: RegisterData): Promise<User>
  
  /**
   * Sign out current user
   */
  logout(): Promise<void>
  
  /**
   * Get currently authenticated user
   */
  getCurrentUser(): Promise<User | null>
  
  // Token management
  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<string>
  
  /**
   * Get current authentication token
   */
  getToken(): Promise<string | null>
  
  /**
   * Validate authentication token
   */
  validateToken(token: string): Promise<boolean>
  
  // Password management
  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>
  
  /**
   * Reset password with token
   */
  resetPassword(data: PasswordResetData): Promise<void>
  
  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>
  
  // Email verification
  /**
   * Send email verification
   */
  sendEmailVerification(): Promise<void>
  
  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<void>
  
  // Profile management
  /**
   * Update user profile
   */
  updateProfile(userData: UpdateUserData): Promise<User>
  
  /**
   * Delete user account
   */
  deleteAccount(): Promise<void>
  
  /**
   * Link authentication provider to existing account
   */
  linkProvider(provider: string, credentials: any): Promise<User>
  
  /**
   * Unlink authentication provider from account
   */
  unlinkProvider(provider: string): Promise<User>
  
  // Event listeners
  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void
  
  /**
   * Listen to token refresh events
   */
  onTokenRefresh(callback: (token: string) => void): () => void
  
  /**
   * Listen to authentication errors
   */
  onAuthError(callback: (error: AuthError) => void): () => void
}
