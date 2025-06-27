/**
 * AuthConfig - Configuration interface for the authentication module
 * This defines all configurable options for the authentication system
 */
export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}
export interface GoogleProviderConfig {
    enabled: boolean;
    clientId?: string;
    scopes?: string[];
    customParameters?: Record<string, string>;
}
export interface SMSProviderConfig {
    enabled: boolean;
    testNumbers?: Record<string, string>;
    timeout?: number;
    codeLength?: number;
    allowedCountries?: string[];
    blockedCountries?: string[];
}
export interface EmailPasswordProviderConfig {
    enabled: boolean;
    requireEmailVerification: boolean;
    allowPasswordReset: boolean;
    passwordRequirements?: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    };
}
export interface ProvidersConfig {
    google: GoogleProviderConfig;
    sms: SMSProviderConfig;
    emailPassword: EmailPasswordProviderConfig;
}
export interface StorageConfig {
    tokenKey: string;
    userKey: string;
    refreshTokenKey: string;
    sessionKey: string;
    prefix?: string;
    secure?: boolean;
    expiration?: number;
}
export interface RedirectConfig {
    afterLogin: string;
    afterLogout: string;
    afterRegister: string;
    afterEmailVerification?: string;
    afterPasswordReset?: string;
}
export interface SecurityConfig {
    sessionTimeout?: number;
    tokenRefreshThreshold?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    requireSecureContext?: boolean;
}
export interface UIConfig {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    customStyles?: Record<string, any>;
    showProviderIcons?: boolean;
    allowRememberMe?: boolean;
}
export interface AuthConfig {
    /** Firebase configuration */
    firebase: FirebaseConfig;
    /** Authentication providers configuration */
    providers: ProvidersConfig;
    /** Local storage configuration */
    storage: StorageConfig;
    /** Redirect URLs configuration */
    redirectUrls: RedirectConfig;
    /** Security settings */
    security?: SecurityConfig;
    /** UI customization */
    ui?: UIConfig;
    /** Debug mode */
    debug?: boolean;
    /** Environment */
    environment?: 'development' | 'staging' | 'production';
    /** Custom error messages */
    errorMessages?: Record<string, string>;
    /** Event callbacks */
    callbacks?: {
        onLogin?: (user: any) => void;
        onLogout?: () => void;
        onRegister?: (user: any) => void;
        onError?: (error: any) => void;
    };
}
export interface AuthConfigValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export declare class AuthConfigValidator {
    static validate(config: AuthConfig): AuthConfigValidation;
    static createDefaultConfig(): Partial<AuthConfig>;
}
//# sourceMappingURL=AuthConfig.d.ts.map