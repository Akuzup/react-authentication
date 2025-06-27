/**
 * Auth Service Adapter - Implements AuthService interface using Use Cases
 */
import { AuthError } from '../../core/entities/AuthError';
import { AuthState } from '../../core/entities/AuthState';
import { UpdateUserData, User } from '../../core/entities/User';
import { AuthRepository } from '../../core/interfaces/AuthRepository';
import { AuthService, ChangePasswordRequest, LoginRequest, PasswordResetRequest, RegisterRequest, SMSLoginRequest, SMSVerificationRequest } from '../../core/interfaces/AuthService';
import { GoogleLoginUseCase, LoginUseCase, LogoutUseCase, RegisterUseCase, SMSLoginUseCase } from '../../core/usecases';
export declare class AuthServiceAdapter implements AuthService {
    private loginUseCase;
    private registerUseCase;
    private googleLoginUseCase;
    private smsLoginUseCase;
    private logoutUseCase;
    private authRepository;
    private currentAuthState;
    private authStateListeners;
    private errorListeners;
    private firebaseUnsubscribe?;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase, googleLoginUseCase: GoogleLoginUseCase, smsLoginUseCase: SMSLoginUseCase, logoutUseCase: LogoutUseCase, authRepository: AuthRepository);
    login(request: LoginRequest): Promise<User>;
    loginWithGoogle(): Promise<User>;
    initiateSMSLogin(request: SMSLoginRequest): Promise<{
        verificationId: string;
    }>;
    completeSMSLogin(request: SMSVerificationRequest): Promise<User>;
    register(request: RegisterRequest): Promise<User>;
    logout(): Promise<void>;
    getCurrentAuthState(): Promise<AuthState>;
    private setupFirebaseAuthStateListener;
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
    /**
     * Cleanup method to unsubscribe from Firebase auth state changes
     * Should be called when the service is no longer needed
     */
    cleanup(): void;
}
//# sourceMappingURL=AuthServiceAdapter.d.ts.map