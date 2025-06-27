/**
 * Auth Service Adapter - Implements AuthService interface using Use Cases
 */

import { AuthError } from '../../core/entities/AuthError'
import { AuthState } from '../../core/entities/AuthState'
import { UpdateUserData, User } from '../../core/entities/User'
import { AuthRepository } from '../../core/interfaces/AuthRepository'
import {
  AuthService,
  ChangePasswordRequest,
  LoginRequest,
  PasswordResetRequest,
  RegisterRequest,
  SMSLoginRequest,
  SMSVerificationRequest
} from '../../core/interfaces/AuthService'

import {
  GoogleLoginUseCase,
  LoginUseCase,
  LogoutUseCase,
  RegisterUseCase,
  SMSLoginUseCase
} from '../../core/usecases'

export class AuthServiceAdapter implements AuthService {
  private currentAuthState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    isInitialized: false,
    isSessionValid: false
  }

  private authStateListeners: ((state: AuthState) => void)[] = []
  private errorListeners: ((error: AuthError) => void)[] = []
  private firebaseUnsubscribe?: () => void

  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private smsLoginUseCase: SMSLoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private authRepository: AuthRepository
  ) {
    this.setupFirebaseAuthStateListener()
  }

  async login(request: LoginRequest): Promise<User> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      const response = await this.loginUseCase.execute({
        email: request.email,
        password: request.password,
        rememberMe: request.rememberMe
      })

      this.updateAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        isSessionValid: true,
        sessionToken: response.token
      })

      return response.user
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({
        isLoading: false,
        error: authError,
        isAuthenticated: false,
        isSessionValid: false
      })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      const response = await this.googleLoginUseCase.execute()

      this.updateAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        isSessionValid: true,
        sessionToken: response.token
      })

      return response.user
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({
        isLoading: false,
        error: authError,
        isAuthenticated: false,
        isSessionValid: false
      })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async initiateSMSLogin(request: SMSLoginRequest): Promise<{ verificationId: string }> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      const response = await this.smsLoginUseCase.initiate({
        phoneNumber: request.phoneNumber,
        countryCode: request.countryCode
      })

      this.updateAuthState({ isLoading: false })

      return { verificationId: response.verificationId }
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({ isLoading: false, error: authError })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async completeSMSLogin(request: SMSVerificationRequest): Promise<User> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      const response = await this.smsLoginUseCase.complete({
        verificationId: request.verificationId,
        code: request.code,
        rememberMe: false // Can be added to request if needed
      })

      this.updateAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        isSessionValid: true,
        sessionToken: response.token
      })

      return response.user
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({
        isLoading: false,
        error: authError,
        isAuthenticated: false,
        isSessionValid: false
      })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async register(request: RegisterRequest): Promise<User> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      const response = await this.registerUseCase.execute(request)

      this.updateAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        isSessionValid: true,
        sessionToken: response.token
      })

      return response.user
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({
        isLoading: false,
        error: authError,
        isAuthenticated: false,
        isSessionValid: false
      })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async logout(): Promise<void> {
    try {
      this.updateAuthState({ isLoading: true, error: null })

      await this.logoutUseCase.execute()

      // Note: Firebase auth state listener will handle updating the state
      // when Firebase auth state changes to null after logout
      this.updateAuthState({
        isLoading: false,
        error: null
      })
    } catch (error) {
      const authError = error as AuthError
      this.updateAuthState({ isLoading: false, error: authError })
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async getCurrentAuthState(): Promise<AuthState> {
    try {
      // Get current user from Firebase to ensure we have the latest state
      const currentUser = await this.authRepository.getCurrentUser()

      // Always update our local state to match Firebase
      this.updateAuthState({
        user: currentUser,
        isAuthenticated: currentUser !== null,
        isSessionValid: currentUser !== null,
        isInitialized: true,
        isLoading: false
      })

      console.log('getCurrentAuthState:', currentUser ? 'User found' : 'No user', 'isAuthenticated:', currentUser !== null)
    } catch (error) {
      console.error('Error getting current auth state:', error)
      this.updateAuthState({
        isInitialized: true,
        isLoading: false,
        error: error as AuthError
      })
    }

    return { ...this.currentAuthState }
  }

  private setupFirebaseAuthStateListener(): void {
    try {
      this.firebaseUnsubscribe = this.authRepository.onAuthStateChanged((user: User | null) => {
        console.log('Firebase auth state changed:', user ? 'Authenticated' : 'Unauthenticated')

        this.updateAuthState({
          user,
          isAuthenticated: user !== null,
          isSessionValid: user !== null,
          isInitialized: true,
          isLoading: false
        })
      })
    } catch (error) {
      console.error('Error setting up Firebase auth state listener:', error)
    }
  }

  async refreshSession(): Promise<User> {
    // Implementation would use refresh token use case
    throw new Error('Not implemented yet')
  }

  async validateSession(): Promise<boolean> {
    return this.currentAuthState.isSessionValid
  }

  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    // Implementation would use password reset use case
    throw new Error('Not implemented yet')
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    // Implementation would use change password use case
    throw new Error('Not implemented yet')
  }

  async sendEmailVerification(): Promise<void> {
    // Implementation would use email verification use case
    throw new Error('Not implemented yet')
  }

  async verifyEmail(token: string): Promise<void> {
    // Implementation would use email verification use case
    throw new Error('Not implemented yet')
  }

  async updateProfile(userData: UpdateUserData): Promise<User> {
    // Implementation would use update profile use case
    throw new Error('Not implemented yet')
  }

  async deleteAccount(password: string): Promise<void> {
    // Implementation would use delete account use case
    throw new Error('Not implemented yet')
  }

  async linkProvider(provider: string, credentials: any): Promise<User> {
    // Implementation would use link provider use case
    throw new Error('Not implemented yet')
  }

  async unlinkProvider(provider: string): Promise<User> {
    // Implementation would use unlink provider use case
    throw new Error('Not implemented yet')
  }

  onAuthStateChange(callback: (state: AuthState) => void): () => void {
    this.authStateListeners.push(callback)

    // Immediately call with current state
    callback(this.currentAuthState)

    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
    }
  }

  onAuthError(callback: (error: AuthError) => void): () => void {
    this.errorListeners.push(callback)

    return () => {
      const index = this.errorListeners.indexOf(callback)
      if (index > -1) {
        this.errorListeners.splice(index, 1)
      }
    }
  }

  isAuthenticated(): boolean {
    return this.currentAuthState.isAuthenticated
  }

  getCurrentUser(): User | null {
    return this.currentAuthState.user
  }

  isEmailVerified(): boolean {
    return this.currentAuthState.user?.emailVerified || false
  }

  getUserPermissions(): string[] {
    // Implementation would extract permissions from user claims
    return []
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions()
    return permissions.includes(permission)
  }

  private updateAuthState(updates: Partial<AuthState>): void {
    this.currentAuthState = {
      ...this.currentAuthState,
      ...updates,
      lastChecked: new Date()
    }

    // Update isAuthenticated based on user presence
    if (updates.user !== undefined) {
      this.currentAuthState.isAuthenticated = updates.user !== null
    }

    this.notifyAuthStateListeners(this.currentAuthState)
  }

  private notifyAuthStateListeners(state: AuthState): void {
    this.authStateListeners.forEach(callback => {
      try {
        callback(state)
      } catch (error) {
        console.error('Error in auth state listener:', error)
      }
    })
  }

  private notifyErrorListeners(error: AuthError): void {
    this.errorListeners.forEach(callback => {
      try {
        callback(error)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })
  }

  /**
   * Cleanup method to unsubscribe from Firebase auth state changes
   * Should be called when the service is no longer needed
   */
  cleanup(): void {
    if (this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe()
      this.firebaseUnsubscribe = undefined
    }
  }
}
