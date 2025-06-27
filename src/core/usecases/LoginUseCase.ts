/**
 * LoginUseCase - Handles user authentication with email/password
 * This use case encapsulates the business logic for user login
 */

import { AuthErrorCode, AuthErrorFactory } from '../entities/AuthError'
import { User } from '../entities/User'
import { AuthRepository } from '../interfaces/AuthRepository'
import { LoginRequest } from '../interfaces/AuthService'
import { StorageRepository } from '../interfaces/StorageRepository'
import { ValidationService } from '../interfaces/ValidationService'

export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

export class LoginUseCase {
  constructor(
    private authRepository: AuthRepository,
    private validationService: ValidationService,
    private storageRepository: StorageRepository
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Validate input
      await this.validateInput(request)

      // Attempt login
      const user = await this.authRepository.loginWithEmailPassword({
        email: request.email,
        password: request.password
      })

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

      return {
        user,
        token,
        refreshToken: await this.authRepository.refreshToken()
      }
    } catch (error) {
      if (error instanceof Error) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INVALID_CREDENTIALS,
          'Login failed',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }

  private async validateInput(request: LoginRequest): Promise<void> {
    const emailValidation = this.validationService.validateEmail(request.email)
    if (!emailValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.INVALID_EMAIL,
        emailValidation.errors.join(', ')
      )
    }

    const passwordValidation = this.validationService.validatePassword(request.password)
    if (!passwordValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.WEAK_PASSWORD,
        passwordValidation.errors.join(', ')
      )
    }
  }
}
