/**
 * User Entity - Core domain entity representing an authenticated user
 * This entity is independent of any external framework or library
 */

export enum AuthProvider {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  SMS = 'sms',
  FACEBOOK = 'facebook',
  APPLE = 'apple'
}

export interface User {
  /** Unique identifier for the user */
  id: string
  
  /** User's email address */
  email: string
  
  /** User's display name */
  displayName?: string
  
  /** URL to user's profile photo */
  photoURL?: string
  
  /** User's phone number */
  phoneNumber?: string
  
  /** Whether the user's email has been verified */
  emailVerified: boolean
  
  /** Timestamp when the user account was created */
  createdAt: Date
  
  /** Timestamp of the user's last login */
  lastLoginAt: Date
  
  /** List of authentication providers used by this user */
  providers: AuthProvider[]
  
  /** Custom claims/roles assigned to the user */
  customClaims?: Record<string, any>
  
  /** User's preferred language/locale */
  locale?: string
  
  /** User's timezone */
  timezone?: string
  
  /** Whether the user account is disabled */
  disabled?: boolean
  
  /** Additional metadata */
  metadata?: Record<string, any>
}

export interface CreateUserData {
  email: string
  password?: string
  displayName?: string
  phoneNumber?: string
  photoURL?: string
  locale?: string
  timezone?: string
}

export interface UpdateUserData {
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  locale?: string
  timezone?: string
  metadata?: Record<string, any>
}

export interface UserProfile {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  emailVerified: boolean
  providers: AuthProvider[]
  locale?: string
  timezone?: string
  createdAt: Date
  lastLoginAt: Date
}
