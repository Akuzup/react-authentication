/**
 * AuthError Entity - Represents authentication-related errors
 * This entity provides structured error information for the authentication module
 */
export declare enum AuthErrorCode {
    INVALID_CREDENTIALS = "auth/invalid-credentials",
    USER_NOT_FOUND = "auth/user-not-found",
    WRONG_PASSWORD = "auth/wrong-password",
    TOO_MANY_REQUESTS = "auth/too-many-requests",
    USER_DISABLED = "auth/user-disabled",
    EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
    WEAK_PASSWORD = "auth/weak-password",
    INVALID_EMAIL = "auth/invalid-email",
    TOKEN_EXPIRED = "auth/token-expired",
    INVALID_TOKEN = "auth/invalid-token",
    TOKEN_REFRESH_FAILED = "auth/token-refresh-failed",
    NETWORK_ERROR = "auth/network-error",
    TIMEOUT = "auth/timeout",
    POPUP_BLOCKED = "auth/popup-blocked",
    POPUP_CLOSED_BY_USER = "auth/popup-closed-by-user",
    PROVIDER_ERROR = "auth/provider-error",
    INVALID_PHONE_NUMBER = "auth/invalid-phone-number",
    INVALID_VERIFICATION_CODE = "auth/invalid-verification-code",
    SMS_QUOTA_EXCEEDED = "auth/quota-exceeded",
    PERMISSION_DENIED = "auth/permission-denied",
    UNAUTHORIZED = "auth/unauthorized",
    CONFIGURATION_ERROR = "auth/configuration-error",
    PROVIDER_NOT_CONFIGURED = "auth/provider-not-configured",
    UNKNOWN_ERROR = "auth/unknown-error",
    INTERNAL_ERROR = "auth/internal-error"
}
export interface AuthError {
    /** Error code identifying the type of error */
    code: AuthErrorCode;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: Record<string, any>;
    /** Original error object (if available) */
    originalError?: Error;
    /** Timestamp when the error occurred */
    timestamp: Date;
    /** Context where the error occurred */
    context?: string;
    /** Whether this error can be retried */
    retryable?: boolean;
    /** Suggested action for the user */
    userAction?: string;
}
export declare class AuthErrorFactory {
    static createError(code: AuthErrorCode, message: string, details?: Record<string, any>, originalError?: Error): AuthError;
    static fromFirebaseError(firebaseError: any): AuthError;
    private static mapFirebaseErrorCode;
    private static getErrorMessage;
    private static isRetryable;
    private static getUserAction;
}
//# sourceMappingURL=AuthError.d.ts.map