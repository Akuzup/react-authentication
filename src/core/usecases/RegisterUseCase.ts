/**
 * RegisterUseCase - Handles user registration
 * This use case encapsulates the business logic for user registration
 */

import { AuthErrorCode, AuthErrorFactory } from '../entities/AuthError'
import { User } from '../entities/User'
import { AuthRepository, RegisterData } from '../interfaces/AuthRepository'
import { RegisterRequest } from '../interfaces/AuthService'
import { StorageRepository } from '../interfaces/StorageRepository'
import { ValidationService } from '../interfaces/ValidationService'

export interface RegisterResponse {
  user: User
  token: string
  emailVerificationSent: boolean
}

export class RegisterUseCase {
  constructor(
    private authRepository: AuthRepository,
    private validationService: ValidationService,
    private storageRepository: StorageRepository
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Validate input
      await this.validateInput(request)

      // Prepare registration data
      const registerData: RegisterData = {
        email: request.email,
        password: request.password,
        displayName: request.displayName,
        phoneNumber: request.phoneNumber,
        photoURL: request.photoURL,
        locale: request.locale,
        timezone: request.timezone
      }

      // Register user
      const user = await this.authRepository.register(registerData)

      // Get authentication token
      const token = await this.authRepository.getToken()
      if (!token) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.TOKEN_REFRESH_FAILED,
          'Failed to retrieve authentication token after registration'
        )
      }

      // Send email verification
      let emailVerificationSent = false
      try {
        await this.authRepository.sendEmailVerification()
        emailVerificationSent = true
      } catch (error) {
        // Don't fail registration if email verification fails
        console.warn('Failed to send email verification:', error)
      }

      // Store user data
      await this.storageRepository.setToken(token)
      await this.storageRepository.setUserData(user)

      return {
        user,
        token,
        emailVerificationSent
      }
    } catch (error) {
      if (error instanceof Error) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INTERNAL_ERROR,
          'Registration failed',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }

  private async validateInput(request: RegisterRequest): Promise<void> {
    // Validate email
    const emailValidation = this.validationService.validateEmail(request.email)
    if (!emailValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.INVALID_EMAIL,
        emailValidation.errors.join(', ')
      )
    }

    // Validate password
    const passwordValidation = this.validationService.validatePassword(request.password)
    if (!passwordValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.WEAK_PASSWORD,
        passwordValidation.errors.join(', ')
      )
    }

    // Validate password confirmation
    const passwordMatchValidation = this.validationService.validatePasswordMatch(
      request.password,
      request.confirmPassword
    )
    if (!passwordMatchValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.WEAK_PASSWORD,
        'Passwords do not match'
      )
    }

    // Validate display name if provided
    if (request.displayName) {
      const displayNameValidation = this.validationService.validateDisplayName(request.displayName)
      if (!displayNameValidation.isValid) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INVALID_EMAIL, // Using generic validation error
          displayNameValidation.errors.join(', ')
        )
      }
    }

    // Validate phone number if provided
    if (request.phoneNumber) {
      const phoneValidation = this.validationService.validatePhoneNumber(request.phoneNumber)
      if (!phoneValidation.isValid) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INVALID_PHONE_NUMBER,
          phoneValidation.errors.join(', ')
        )
      }
    }

    // Validate photo URL if provided
    if (request.photoURL) {
      const urlValidation = this.validationService.validateURL(request.photoURL)
      if (!urlValidation.isValid) {
        throw AuthErrorFactory.createError(
          AuthErrorCode.INVALID_EMAIL, // Using generic validation error
          'Invalid photo URL'
        )
      }
    }

    // Validate terms acceptance
    const termsValidation = this.validationService.validateTermsAcceptance(request.acceptTerms)
    if (!termsValidation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.PERMISSION_DENIED,
        'You must accept the terms and conditions'
      )
    }
  }
}
