/**
 * Firebase Auth Service - Implementation of AuthRepository using Firebase Auth
 */
import { AuthError } from '../../core/entities/AuthError';
import { User } from '../../core/entities/User';
import { AuthRepository, LoginCredentials, PasswordResetData, RegisterData, SMSVerificationResult } from '../../core/interfaces/AuthRepository';
export declare class FirebaseAuthService implements AuthRepository {
    private authStateListeners;
    private tokenRefreshListeners;
    private errorListeners;
    private userRepository;
    constructor();
    loginWithEmailPassword(credentials: LoginCredentials): Promise<User>;
    loginWithGoogle(): Promise<User>;
    sendSMSVerification(phoneNumber: string): Promise<SMSVerificationResult>;
    verifySMSCode(verificationId: string, code: string): Promise<User>;
    register(userData: RegisterData): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    refreshToken(): Promise<string>;
    getToken(): Promise<string | null>;
    validateToken(token: string): Promise<boolean>;
    sendPasswordResetEmail(email: string): Promise<void>;
    resetPassword(data: PasswordResetData): Promise<void>;
    changePassword(currentPassword: string, newPassword: string): Promise<void>;
    sendEmailVerification(): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    updateProfile(userData: any): Promise<User>;
    deleteAccount(): Promise<void>;
    linkProvider(provider: string, credentials: any): Promise<User>;
    unlinkProvider(provider: string): Promise<User>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
    onTokenRefresh(callback: (token: string) => void): () => void;
    onAuthError(callback: (error: AuthError) => void): () => void;
    private setupAuthStateListener;
    private notifyAuthStateListeners;
    private notifyTokenRefreshListeners;
    private notifyErrorListeners;
}
//# sourceMappingURL=FirebaseAuthService.d.ts.map