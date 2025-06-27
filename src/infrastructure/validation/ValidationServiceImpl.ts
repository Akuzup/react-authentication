/**
 * Validation Service Implementation - Handles all input validation
 */

import {
    PasswordStrength,
    ValidationResult,
    ValidationService
} from '../../core/interfaces/ValidationService'

export class ValidationServiceImpl implements ValidationService {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private phoneRegex = /^\+?[1-9]\d{1,14}$/
  private urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

  validateEmail(email: string): ValidationResult {
    const errors: string[] = []

    if (!email) {
      errors.push('Email is required')
    } else {
      if (email.length > 254) {
        errors.push('Email is too long')
      }

      if (!this.emailRegex.test(email)) {
        errors.push('Invalid email format')
      }

      // Check for common typos
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
      const domain = email.split('@')[1]
      if (domain && !commonDomains.includes(domain)) {
        // This is just a warning, not an error
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = []

    if (!password) {
      errors.push('Password is required')
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long')
      }

      if (password.length > 128) {
        errors.push('Password is too long (max 128 characters)')
      }

      // Relaxed validation - only require length, no character requirements
      // if (!/[a-z]/.test(password)) {
      //   errors.push('Password must contain at least one lowercase letter')
      // }

      // if (!/[A-Z]/.test(password)) {
      //   errors.push('Password must contain at least one uppercase letter')
      // }

      // if (!/\d/.test(password)) {
      //   errors.push('Password must contain at least one number')
      // }

      // Check for common weak passwords
      const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey'
      ]

      if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  checkPasswordStrength(password: string): PasswordStrength {
    let score = 0
    const feedback: string[] = []

    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }

    // Calculate score
    if (requirements.minLength) score++
    if (requirements.hasUppercase) score++
    if (requirements.hasLowercase) score++
    if (requirements.hasNumbers) score++
    if (requirements.hasSpecialChars) score++

    // Additional checks
    if (password.length >= 12) score++
    if (password.length >= 16) score++

    // Reduce score for patterns
    if (/(.)\1{2,}/.test(password)) {
      score--
      feedback.push('Avoid repeating characters')
    }

    if (/123|abc|qwe/i.test(password)) {
      score--
      feedback.push('Avoid sequential characters')
    }

    // Normalize score to 0-4
    score = Math.max(0, Math.min(4, score))

    // Generate feedback
    if (!requirements.minLength) {
      feedback.push('Use at least 8 characters')
    }
    if (!requirements.hasUppercase) {
      feedback.push('Add uppercase letters')
    }
    if (!requirements.hasLowercase) {
      feedback.push('Add lowercase letters')
    }
    if (!requirements.hasNumbers) {
      feedback.push('Add numbers')
    }
    if (!requirements.hasSpecialChars) {
      feedback.push('Add special characters')
    }

    return {
      score,
      feedback,
      requirements
    }
  }

  validatePhoneNumber(phoneNumber: string, countryCode?: string): ValidationResult {
    const errors: string[] = []

    if (!phoneNumber) {
      errors.push('Phone number is required')
    } else {
      // Remove spaces and dashes for validation
      const cleanNumber = phoneNumber.replace(/[\s-]/g, '')

      if (!this.phoneRegex.test(cleanNumber)) {
        errors.push('Invalid phone number format')
      }

      // Check length
      if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        errors.push('Phone number must be between 10 and 15 digits')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateDisplayName(displayName: string): ValidationResult {
    const errors: string[] = []

    if (!displayName) {
      errors.push('Display name is required')
    } else {
      if (displayName.length < 2) {
        errors.push('Display name must be at least 2 characters long')
      }

      if (displayName.length > 50) {
        errors.push('Display name is too long (max 50 characters)')
      }

      // Check for invalid characters
      if (!/^[a-zA-Z0-9\s\-_.]+$/.test(displayName)) {
        errors.push('Display name contains invalid characters')
      }

      // Check for profanity (basic check)
      const profanityWords = ['spam', 'test', 'admin', 'null', 'undefined']
      if (profanityWords.some(word => displayName.toLowerCase().includes(word))) {
        errors.push('Display name contains inappropriate content')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateRegistrationData(data: {
    email: string
    password: string
    confirmPassword: string
    displayName?: string
    phoneNumber?: string
  }): ValidationResult {
    const errors: string[] = []

    // Validate email
    const emailValidation = this.validateEmail(data.email)
    errors.push(...emailValidation.errors)

    // Validate password
    const passwordValidation = this.validatePassword(data.password)
    errors.push(...passwordValidation.errors)

    // Validate password confirmation
    const passwordMatchValidation = this.validatePasswordMatch(data.password, data.confirmPassword)
    errors.push(...passwordMatchValidation.errors)

    // Validate display name if provided
    if (data.displayName) {
      const displayNameValidation = this.validateDisplayName(data.displayName)
      errors.push(...displayNameValidation.errors)
    }

    // Validate phone number if provided
    if (data.phoneNumber) {
      const phoneValidation = this.validatePhoneNumber(data.phoneNumber)
      errors.push(...phoneValidation.errors)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateLoginCredentials(email: string, password: string): ValidationResult {
    const errors: string[] = []

    if (!email) {
      errors.push('Email is required')
    }

    if (!password) {
      errors.push('Password is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateSMSCode(code: string): ValidationResult {
    const errors: string[] = []

    if (!code) {
      errors.push('Verification code is required')
    } else {
      // Remove spaces
      const cleanCode = code.replace(/\s/g, '')

      if (!/^\d{4,8}$/.test(cleanCode)) {
        errors.push('Verification code must be 4-8 digits')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateProfileData(data: {
    displayName?: string
    phoneNumber?: string
    photoURL?: string
  }): ValidationResult {
    const errors: string[] = []

    if (data.displayName) {
      const displayNameValidation = this.validateDisplayName(data.displayName)
      errors.push(...displayNameValidation.errors)
    }

    if (data.phoneNumber) {
      const phoneValidation = this.validatePhoneNumber(data.phoneNumber)
      errors.push(...phoneValidation.errors)
    }

    if (data.photoURL) {
      const urlValidation = this.validateURL(data.photoURL)
      errors.push(...urlValidation.errors)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validatePasswordChange(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): ValidationResult {
    const errors: string[] = []

    if (!data.currentPassword) {
      errors.push('Current password is required')
    }

    const newPasswordValidation = this.validatePassword(data.newPassword)
    errors.push(...newPasswordValidation.errors)

    const passwordMatchValidation = this.validatePasswordMatch(data.newPassword, data.confirmPassword)
    errors.push(...passwordMatchValidation.errors)

    if (data.currentPassword === data.newPassword) {
      errors.push('New password must be different from current password')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000) // Limit length
  }

  validateURL(url: string): ValidationResult {
    const errors: string[] = []

    if (!url) {
      errors.push('URL is required')
    } else {
      if (!this.urlRegex.test(url)) {
        errors.push('Invalid URL format')
      }

      if (url.length > 2048) {
        errors.push('URL is too long')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    const errors: string[] = []

    if (password !== confirmPassword) {
      errors.push('Passwords do not match')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateTermsAcceptance(accepted: boolean): ValidationResult {
    const errors: string[] = []

    if (!accepted) {
      errors.push('You must accept the terms and conditions')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
