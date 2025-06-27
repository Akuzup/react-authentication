/**
 * AuthService Interface - Defines the contract for authentication business logic
 * This interface represents the application's authentication use cases
 */
import { AuthError } from '../entities/AuthError';
import { AuthState } from '../entities/AuthState';
import { CreateUserData, UpdateUserData, User } from '../entities/User';
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterRequest extends CreateUserData {
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}
export interface SMSLoginRequest {
    phoneNumber: string;
    countryCode?: string;
}
export interface SMSVerificationRequest {
    verificationId: string;
    code: string;
    rememberMe?: boolean;
}
export interface PasswordResetRequest {
    email: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface AuthService {
    /**
     * Login with email and password
     */
    login(request: LoginRequest): Promise<User>;
    /**
     * Login with Google OAuth
     */
    loginWithGoogle(): Promise<User>;
    /**
     * Initiate SMS login process
     */
    initiateSMSLogin(request: SMSLoginRequest): Promise<{
        verificationId: string;
    }>;
    /**
     * Complete SMS login with verification code
     */
    completeSMSLogin(request: SMSVerificationRequest): Promise<User>;
    /**
     * Register new user
     */
    register(request: RegisterRequest): Promise<User>;
    /**
     * Logout current user
     */
    logout(): Promise<void>;
    /**
     * Get current authentication state
     */
    getCurrentAuthState(): Promise<AuthState>;
    /**
     * Refresh authentication session
     */
    refreshSession(): Promise<User>;
    /**
     * Validate current session
     */
    validateSession(): Promise<boolean>;
    /**
     * Send password reset email
     */
    requestPasswordReset(request: PasswordResetRequest): Promise<void>;
    /**
     * Change user password
     */
    changePassword(request: ChangePasswordRequest): Promise<void>;
    /**
     * Send email verification
     */
    sendEmailVerification(): Promise<void>;
    /**
     * Verify email address
     */
    verifyEmail(token: string): Promise<void>;
    /**
     * Update user profile
     */
    updateProfile(userData: UpdateUserData): Promise<User>;
    /**
     * Delete user account
     */
    deleteAccount(password: string): Promise<void>;
    /**
     * Link additional authentication provider
     */
    linkProvider(provider: string, credentials: any): Promise<User>;
    /**
     * Unlink authentication provider
     */
    unlinkProvider(provider: string): Promise<User>;
    /**
     * Subscribe to authentication state changes
     */
    onAuthStateChange(callback: (state: AuthState) => void): () => void;
    /**
     * Subscribe to authentication errors
     */
    onAuthError(callback: (error: AuthError) => void): () => void;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Get current user
     */
    getCurrentUser(): User | null;
    /**
     * Check if email is verified
     */
    isEmailVerified(): boolean;
    /**
     * Get user permissions/roles
     */
    getUserPermissions(): string[];
    /**
     * Check if user has specific permission
     */
    hasPermission(permission: string): boolean;
}
//# sourceMappingURL=AuthService.d.ts.map