/**
 * GoogleLoginUseCase - Handles Google OAuth authentication
 * This use case encapsulates the business logic for Google login
 */

import { User } from '../entities/User'
import { AuthError, AuthErrorCode, AuthErrorFactory } from '../entities/AuthError'
import { AuthRepository } from '../interfaces/AuthRepository'
import { StorageRepository } from '../interfaces/StorageRepository'

export interface GoogleLoginRequest {
  rememberMe?: boolean
}

export interface GoogleLoginResponse {
  user: User
  token: string
  isNewUser: boolean
}

export class GoogleLoginUseCase {
  constructor(
    private authRepository: AuthRepository,
    private storageRepository: StorageRepository
  ) {}

  async execute(request: GoogleLoginRequest = {}): Promise<GoogleLoginResponse> {
    try {
      // Check if user exists before login to determine if this is a new user
      const existingUser = await this.authRepository.getCurrentUser()
      
      // Attempt Google login
      const user = await this.authRepository.loginWithGoogle()
      
      // Get authentication token
      const token = await this.authRepository.getToken()
      if (!token) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.TOKEN_REFRESH_FAILED,
          'Failed to retrieve authentication token'
        )
      }
      
      // Store session data if remember me is enabled
      if (request.rememberMe) {
        await this.storageRepository.setToken(token)
        await this.storageRepository.setUserData(user)
      }
      
      // Determine if this is a new user
      const isNewUser = !existingUser || existingUser.id !== user.id
      
      return {
        user,
        token,
        isNewUser
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific Google auth errors
        if (error.message.includes('popup_blocked')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.POPUP_BLOCKED,
            'Popup was blocked. Please allow popups and try again.'
          )
        }
        
        if (error.message.includes('popup_closed_by_user')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.POPUP_CLOSED_BY_USER,
            'Authentication was cancelled by user.'
          )
        }
        
        if (error.message.includes('network')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.NETWORK_ERROR,
            'Network error during Google authentication.'
          )
        }
        
        throw AuthErrorFactory.createError(
          AuthErrorCode.PROVIDER_ERROR,
          'Google authentication failed',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }
}
