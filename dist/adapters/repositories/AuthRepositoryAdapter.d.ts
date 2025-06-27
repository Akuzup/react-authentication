/**
 * Auth Repository Adapter - Adapts Firebase Auth Service to AuthRepository interface
 */
import { AuthRepository } from '../../core/interfaces/AuthRepository';
import { FirebaseAuthService } from '../../infrastructure/firebase/FirebaseAuthService';
export declare class AuthRepositoryAdapter implements AuthRepository {
    private firebaseAuthService;
    constructor(firebaseAuthService: FirebaseAuthService);
    loginWithEmailPassword(credentials: any): Promise<import("../..").User>;
    loginWithGoogle(): Promise<import("../..").User>;
    sendSMSVerification(phoneNumber: string): Promise<import("../..").SMSVerificationResult>;
    verifySMSCode(verificationId: string, code: string): Promise<import("../..").User>;
    register(userData: any): Promise<import("../..").User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<import("../..").User | null>;
    refreshToken(): Promise<string>;
    getToken(): Promise<string | null>;
    validateToken(token: string): Promise<boolean>;
    sendPasswordResetEmail(email: string): Promise<void>;
    resetPassword(data: any): Promise<void>;
    changePassword(currentPassword: string, newPassword: string): Promise<void>;
    sendEmailVerification(): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    updateProfile(userData: any): Promise<import("../..").User>;
    deleteAccount(): Promise<void>;
    linkProvider(provider: string, credentials: any): Promise<import("../..").User>;
    unlinkProvider(provider: string): Promise<import("../..").User>;
    onAuthStateChanged(callback: (user: any) => void): () => void;
    onTokenRefresh(callback: (token: string) => void): () => void;
    onAuthError(callback: (error: any) => void): () => void;
}
//# sourceMappingURL=AuthRepositoryAdapter.d.ts.map