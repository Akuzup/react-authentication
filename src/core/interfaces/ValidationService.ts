/**
 * ValidationService Interface - Defines the contract for input validation
 * This interface handles validation of authentication-related data
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface PasswordStrength {
  score: number // 0-4 (weak to strong)
  feedback: string[]
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumbers: boolean
    hasSpecialChars: boolean
  }
}

export interface ValidationService {
  /**
   * Validate email address format
   */
  validateEmail(email: string): ValidationResult
  
  /**
   * Validate password strength and requirements
   */
  validatePassword(password: string): ValidationResult
  
  /**
   * Check password strength
   */
  checkPasswordStrength(password: string): PasswordStrength
  
  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string, countryCode?: string): ValidationResult
  
  /**
   * Validate display name
   */
  validateDisplayName(displayName: string): ValidationResult
  
  /**
   * Validate registration data
   */
  validateRegistrationData(data: {
    email: string
    password: string
    confirmPassword: string
    displayName?: string
    phoneNumber?: string
  }): ValidationResult
  
  /**
   * Validate login credentials
   */
  validateLoginCredentials(email: string, password: string): ValidationResult
  
  /**
   * Validate SMS verification code
   */
  validateSMSCode(code: string): ValidationResult
  
  /**
   * Validate profile update data
   */
  validateProfileData(data: {
    displayName?: string
    phoneNumber?: string
    photoURL?: string
  }): ValidationResult
  
  /**
   * Validate password change request
   */
  validatePasswordChange(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): ValidationResult
  
  /**
   * Sanitize user input
   */
  sanitizeInput(input: string): string
  
  /**
   * Validate URL format (for photo URLs)
   */
  validateURL(url: string): ValidationResult
  
  /**
   * Check if passwords match
   */
  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult
  
  /**
   * Validate terms acceptance
   */
  validateTermsAcceptance(accepted: boolean): ValidationResult
}
