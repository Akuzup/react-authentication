/**
 * SMSLoginUseCase - Handles SMS-based authentication
 * This use case encapsulates the business logic for SMS login
 */

import { AuthErrorCode, AuthErrorFactory } from '../entities/AuthError'
import { User } from '../entities/User'
import { AuthRepository } from '../interfaces/AuthRepository'
import { SMSLoginRequest, SMSVerificationRequest } from '../interfaces/AuthService'
import { StorageRepository } from '../interfaces/StorageRepository'
import { ValidationService } from '../interfaces/ValidationService'

export interface SMSLoginInitResponse {
  verificationId: string
  timeout: number
  phoneNumber: string
}

export interface SMSLoginCompleteResponse {
  user: User
  token: string
  isNewUser: boolean
}

export class SMSLoginUseCase {
  constructor(
    private authRepository: AuthRepository,
    private validationService: ValidationService,
    private storageRepository: StorageRepository
  ) {}

  async initiate(request: SMSLoginRequest): Promise<SMSLoginInitResponse> {
    try {
      // Validate phone number
      await this.validatePhoneNumber(request.phoneNumber, request.countryCode)

      // Send SMS verification
      const result = await this.authRepository.sendSMSVerification(request.phoneNumber)

      return {
        verificationId: result.verificationId,
        timeout: result.timeout,
        phoneNumber: request.phoneNumber
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific SMS errors
        if (error.message.includes('quota-exceeded')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.SMS_QUOTA_EXCEEDED,
            'SMS quota exceeded. Please try again later.'
          )
        }

        if (error.message.includes('invalid-phone-number')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.INVALID_PHONE_NUMBER,
            'Invalid phone number format.'
          )
        }

        throw AuthErrorFactory.createError(
          AuthErrorCode.INTERNAL_ERROR,
          'Failed to send SMS verification',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }

  async complete(request: SMSVerificationRequest): Promise<SMSLoginCompleteResponse> {
    try {
      // Validate verification code
      await this.validateVerificationCode(request.code)

      // Check if user exists before verification
      const existingUser = await this.authRepository.getCurrentUser()

      // Verify SMS code and authenticate
      const user = await this.authRepository.verifySMSCode(
        request.verificationId,
        request.code
      )

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
        // Handle specific verification errors
        if (error.message.includes('invalid-verification-code')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.INVALID_VERIFICATION_CODE,
            'Invalid verification code. Please check and try again.'
          )
        }

        if (error.message.includes('expired')) {
          throw AuthErrorFactory.createError(
            AuthErrorCode.TOKEN_EXPIRED,
            'Verification code has expired. Please request a new one.'
          )
        }

        throw AuthErrorFactory.createError(
          AuthErrorCode.INTERNAL_ERROR,
          'SMS verification failed',
          { originalMessage: error.message },
          error
        )
      }
      throw error
    }
  }

  private async validatePhoneNumber(phoneNumber: string, countryCode?: string): Promise<void> {
    const validation = this.validationService.validatePhoneNumber(phoneNumber, countryCode)
    if (!validation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.INVALID_PHONE_NUMBER,
        validation.errors.join(', ')
      )
    }
  }

  private async validateVerificationCode(code: string): Promise<void> {
    const validation = this.validationService.validateSMSCode(code)
    if (!validation.isValid) {
      throw AuthErrorFactory.createError(
        AuthErrorCode.INVALID_VERIFICATION_CODE,
        validation.errors.join(', ')
      )
    }
  }
}
