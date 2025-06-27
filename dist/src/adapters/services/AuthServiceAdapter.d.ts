/**
 * Auth Service Adapter - Implements AuthService interface using Use Cases
 */
import { User, UpdateUserData } from '../../core/entities/User';
import { AuthState } from '../../core/entities/AuthState';
import { AuthError } from '../../core/entities/AuthError';
import { AuthService, LoginRequest, RegisterRequest, SMSLoginRequest, SMSVerificationRequest, PasswordResetRequest, ChangePasswordRequest } from '../../core/interfaces/AuthService';
import { LoginUseCase, RegisterUseCase, GoogleLoginUseCase, SMSLoginUseCase, LogoutUseCase } from '../../core/usecases';
export declare class AuthServiceAdapter implements AuthService {
    private loginUseCase;
    private registerUseCase;
    private googleLoginUseCase;
    private smsLoginUseCase;
    private logoutUseCase;
    private currentAuthState;
    private authStateListeners;
    private errorListeners;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase, googleLoginUseCase: GoogleLoginUseCase, smsLoginUseCase: SMSLoginUseCase, logoutUseCase: LogoutUseCase);
    login(request: LoginRequest): Promise<User>;
    loginWithGoogle(): Promise<User>;
    initiateSMSLogin(request: SMSLoginRequest): Promise<{
        verificationId: string;
    }>;
    completeSMSLogin(request: SMSVerificationRequest): Promise<User>;
    register(request: RegisterRequest): Promise<User>;
    logout(): Promise<void>;
    getCurrentAuthState(): Promise<AuthState>;
    refreshSession(): Promise<User>;
    validateSession(): Promise<boolean>;
    requestPasswordReset(request: PasswordResetRequest): Promise<void>;
    changePassword(request: ChangePasswordRequest): Promise<void>;
    sendEmailVerification(): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    updateProfile(userData: UpdateUserData): Promise<User>;
    deleteAccount(password: string): Promise<void>;
    linkProvider(provider: string, credentials: any): Promise<User>;
    unlinkProvider(provider: string): Promise<User>;
    onAuthStateChange(callback: (state: AuthState) => void): () => void;
    onAuthError(callback: (error: AuthError) => void): () => void;
    isAuthenticated(): boolean;
    getCurrentUser(): User | null;
    isEmailVerified(): boolean;
    getUserPermissions(): string[];
    hasPermission(permission: string): boolean;
    private updateAuthState;
    private notifyAuthStateListeners;
    private notifyErrorListeners;
}
//# sourceMappingURL=AuthServiceAdapter.d.ts.map