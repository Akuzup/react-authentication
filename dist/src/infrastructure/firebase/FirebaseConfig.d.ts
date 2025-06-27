/**
 * Firebase Configuration - Setup and initialization for Firebase services
 */
import { Auth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { FirebaseConfig } from '../../config/AuthConfig';
export declare class FirebaseConfigService {
    private static app;
    private static auth;
    private static googleProvider;
    private static recaptchaVerifier;
    static initialize(config: FirebaseConfig, useEmulator?: boolean): void;
    static getAuth(): Auth;
    static getGoogleProvider(): GoogleAuthProvider;
    static getRecaptchaVerifier(containerId: string): RecaptchaVerifier;
    static clearRecaptchaVerifier(): void;
    static isInitialized(): boolean;
    private static isEmulatorConnected;
    static destroy(): void;
}
//# sourceMappingURL=FirebaseConfig.d.ts.map