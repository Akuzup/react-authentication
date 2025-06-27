/**
 * AuthError Entity - Represents authentication-related errors
 * This entity provides structured error information for the authentication module
 */

export enum AuthErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  USER_DISABLED = 'auth/user-disabled',

  // Registration errors
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  INVALID_EMAIL = 'auth/invalid-email',

  // Token errors
  TOKEN_EXPIRED = 'auth/token-expired',
  INVALID_TOKEN = 'auth/invalid-token',
  TOKEN_REFRESH_FAILED = 'auth/token-refresh-failed',

  // Network errors
  NETWORK_ERROR = 'auth/network-error',
  TIMEOUT = 'auth/timeout',

  // Provider errors
  POPUP_BLOCKED = 'auth/popup-blocked',
  POPUP_CLOSED_BY_USER = 'auth/popup-closed-by-user',
  PROVIDER_ERROR = 'auth/provider-error',

  // SMS errors
  INVALID_PHONE_NUMBER = 'auth/invalid-phone-number',
  INVALID_VERIFICATION_CODE = 'auth/invalid-verification-code',
  SMS_QUOTA_EXCEEDED = 'auth/quota-exceeded',

  // Permission errors
  PERMISSION_DENIED = 'auth/permission-denied',
  UNAUTHORIZED = 'auth/unauthorized',

  // Configuration errors
  CONFIGURATION_ERROR = 'auth/configuration-error',
  PROVIDER_NOT_CONFIGURED = 'auth/provider-not-configured',

  // Unknown errors
  UNKNOWN_ERROR = 'auth/unknown-error',
  INTERNAL_ERROR = 'auth/internal-error'
}

export interface AuthError {
  /** Error code identifying the type of error */
  code: AuthErrorCode

  /** Human-readable error message */
  message: string

  /** Additional error details */
  details?: Record<string, any>

  /** Original error object (if available) */
  originalError?: Error

  /** Timestamp when the error occurred */
  timestamp: Date

  /** Context where the error occurred */
  context?: string

  /** Whether this error can be retried */
  retryable?: boolean

  /** Suggested action for the user */
  userAction?: string
}

export class AuthErrorFactory {
  static createError(
    code: AuthErrorCode,
    message: string,
    details?: Record<string, any>,
    originalError?: Error
  ): AuthError {
    return {
      code,
      message,
      details,
      originalError,
      timestamp: new Date(),
      retryable: this.isRetryable(code),
      userAction: this.getUserAction(code)
    }
  }

  static fromFirebaseError(firebaseError: any): AuthError {
    const code = this.mapFirebaseErrorCode(firebaseError.code)
    const message = this.getErrorMessage(code)

    return this.createError(code, message, {
      firebaseCode: firebaseError.code,
      firebaseMessage: firebaseError.message
    }, firebaseError)
  }

  private static mapFirebaseErrorCode(firebaseCode: string): AuthErrorCode {
    const mapping: Record<string, AuthErrorCode> = {
      'auth/user-not-found': AuthErrorCode.USER_NOT_FOUND,
      'auth/wrong-password': AuthErrorCode.WRONG_PASSWORD,
      'auth/invalid-email': AuthErrorCode.INVALID_EMAIL,
      'auth/email-already-in-use': AuthErrorCode.EMAIL_ALREADY_IN_USE,
      'auth/weak-password': AuthErrorCode.WEAK_PASSWORD,
      'auth/too-many-requests': AuthErrorCode.TOO_MANY_REQUESTS,
      'auth/user-disabled': AuthErrorCode.USER_DISABLED,
      'auth/popup-blocked': AuthErrorCode.POPUP_BLOCKED,
      'auth/popup-closed-by-user': AuthErrorCode.POPUP_CLOSED_BY_USER,
      'auth/invalid-phone-number': AuthErrorCode.INVALID_PHONE_NUMBER,
      'auth/invalid-verification-code': AuthErrorCode.INVALID_VERIFICATION_CODE,
      'auth/quota-exceeded': AuthErrorCode.SMS_QUOTA_EXCEEDED,
      'auth/network-request-failed': AuthErrorCode.NETWORK_ERROR
    }

    return mapping[firebaseCode] || AuthErrorCode.UNKNOWN_ERROR
  }

  private static getErrorMessage(code: AuthErrorCode): string {
    const messages: Record<AuthErrorCode, string> = {
      [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
      [AuthErrorCode.USER_NOT_FOUND]: 'No user found with this email',
      [AuthErrorCode.WRONG_PASSWORD]: 'Incorrect password',
      [AuthErrorCode.TOO_MANY_REQUESTS]: 'Too many failed attempts. Please try again later',
      [AuthErrorCode.USER_DISABLED]: 'This account has been disabled',
      [AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'An account with this email already exists',
      [AuthErrorCode.WEAK_PASSWORD]: 'Password is too weak',
      [AuthErrorCode.INVALID_EMAIL]: 'Invalid email address',
      [AuthErrorCode.TOKEN_EXPIRED]: 'Session has expired. Please log in again',
      [AuthErrorCode.INVALID_TOKEN]: 'Invalid authentication token',
      [AuthErrorCode.TOKEN_REFRESH_FAILED]: 'Failed to refresh authentication token',
      [AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection',
      [AuthErrorCode.TIMEOUT]: 'Request timed out. Please try again',
      [AuthErrorCode.POPUP_BLOCKED]: 'Popup was blocked. Please allow popups and try again',
      [AuthErrorCode.POPUP_CLOSED_BY_USER]: 'Authentication was cancelled',
      [AuthErrorCode.PROVIDER_ERROR]: 'Authentication provider error',
      [AuthErrorCode.INVALID_PHONE_NUMBER]: 'Invalid phone number',
      [AuthErrorCode.INVALID_VERIFICATION_CODE]: 'Invalid verification code',
      [AuthErrorCode.SMS_QUOTA_EXCEEDED]: 'SMS quota exceeded. Please try again later',
      [AuthErrorCode.PERMISSION_DENIED]: 'Permission denied',
      [AuthErrorCode.UNAUTHORIZED]: 'Unauthorized access',
      [AuthErrorCode.CONFIGURATION_ERROR]: 'Authentication configuration error',
      [AuthErrorCode.PROVIDER_NOT_CONFIGURED]: 'Authentication provider not configured',
      [AuthErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
      [AuthErrorCode.INTERNAL_ERROR]: 'Internal error occurred'
    }

    return messages[code] || 'An unexpected error occurred'
  }

  private static isRetryable(code: AuthErrorCode): boolean {
    const retryableCodes = [
      AuthErrorCode.NETWORK_ERROR,
      AuthErrorCode.TIMEOUT,
      AuthErrorCode.TOKEN_REFRESH_FAILED,
      AuthErrorCode.INTERNAL_ERROR
    ]

    return retryableCodes.includes(code)
  }

  private static getUserAction(code: AuthErrorCode): string {
    const actions: Record<AuthErrorCode, string> = {
      [AuthErrorCode.INVALID_CREDENTIALS]: 'Please check your email and password',
      [AuthErrorCode.USER_NOT_FOUND]: 'Please check your email or create a new account',
      [AuthErrorCode.WRONG_PASSWORD]: 'Please check your password or reset it',
      [AuthErrorCode.TOO_MANY_REQUESTS]: 'Please wait before trying again',
      [AuthErrorCode.USER_DISABLED]: 'Your account has been disabled. Please contact support',
      [AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'Please use a different email or sign in',
      [AuthErrorCode.WEAK_PASSWORD]: 'Please choose a stronger password',
      [AuthErrorCode.INVALID_EMAIL]: 'Please enter a valid email address',
      [AuthErrorCode.TOKEN_EXPIRED]: 'Please sign in again',
      [AuthErrorCode.INVALID_TOKEN]: 'Please sign in again',
      [AuthErrorCode.TOKEN_REFRESH_FAILED]: 'Please sign in again',
      [AuthErrorCode.NETWORK_ERROR]: 'Please check your internet connection',
      [AuthErrorCode.TIMEOUT]: 'Request timed out. Please try again',
      [AuthErrorCode.POPUP_BLOCKED]: 'Please allow popups in your browser',
      [AuthErrorCode.POPUP_CLOSED_BY_USER]: 'Please complete the authentication process',
      [AuthErrorCode.PROVIDER_ERROR]: 'Authentication provider error. Please try again',
      [AuthErrorCode.INVALID_PHONE_NUMBER]: 'Please enter a valid phone number',
      [AuthErrorCode.INVALID_VERIFICATION_CODE]: 'Please enter the correct verification code',
      [AuthErrorCode.SMS_QUOTA_EXCEEDED]: 'SMS quota exceeded. Please try again later',
      [AuthErrorCode.PERMISSION_DENIED]: 'Permission denied. Please check your access rights',
      [AuthErrorCode.UNAUTHORIZED]: 'Unauthorized access. Please sign in',
      [AuthErrorCode.CONFIGURATION_ERROR]: 'Configuration error. Please contact support',
      [AuthErrorCode.PROVIDER_NOT_CONFIGURED]: 'Authentication provider not configured',
      [AuthErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred. Please try again',
      [AuthErrorCode.INTERNAL_ERROR]: 'Internal error. Please try again'
    }

    return actions[code] || 'Please try again'
  }
}
