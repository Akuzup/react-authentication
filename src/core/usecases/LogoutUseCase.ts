/**
 * LogoutUseCase - Handles user logout
 * This use case encapsulates the business logic for user logout
 */

import { AuthError, AuthErrorCode, AuthErrorFactory } from '../entities/AuthError'
import { AuthRepository } from '../interfaces/AuthRepository'
import { StorageRepository } from '../interfaces/StorageRepository'

export interface LogoutRequest {
  clearAllSessions?: boolean
  redirectUrl?: string
}

export interface LogoutResponse {
  success: boolean
  redirectUrl?: string
}

export class LogoutUseCase {
  constructor(
    private authRepository: AuthRepository,
    private storageRepository: StorageRepository
  ) {}

  async execute(request: LogoutRequest = {}): Promise<LogoutResponse> {
    try {
      // Logout from authentication provider
      await this.authRepository.logout()
      
      // Clear local storage
      await this.clearLocalData()
      
      return {
        success: true,
        redirectUrl: request.redirectUrl
      }
    } catch (error) {
      // Even if logout fails, clear local data
      try {
        await this.clearLocalData()
      } catch (storageError) {
        console.warn('Failed to clear local storage during logout:', storageError)
      }
      
      if (error instanceof Error) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INTERNAL_ERROR,
          'Logout failed',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }

  private async clearLocalData(): Promise<void> {
    try {
      await this.storageRepository.clearAuthData()
    } catch (error) {
      console.warn('Failed to clear authentication data:', error)
      // Try to clear individual items
      try {
        await this.storageRepository.removeToken()
        await this.storageRepository.removeUserData()
        await this.storageRepository.removeRefreshToken()
        await this.storageRepository.removeSessionData()
      } catch (individualError) {
        console.error('Failed to clear individual storage items:', individualError)
      }
    }
  }
}
