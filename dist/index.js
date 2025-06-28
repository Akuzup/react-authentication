'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var auth = require('firebase/auth');
var app = require('firebase/app');
var firestore = require('firebase/firestore');

/**
 * User Entity - Core domain entity representing an authenticated user
 * This entity is independent of any external framework or library
 */
var AuthProvider$1;
(function (AuthProvider) {
    AuthProvider["EMAIL_PASSWORD"] = "email_password";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["SMS"] = "sms";
    AuthProvider["FACEBOOK"] = "facebook";
    AuthProvider["APPLE"] = "apple";
})(AuthProvider$1 || (AuthProvider$1 = {}));

/**
 * AuthState Entity - Represents the current authentication state
 * This entity encapsulates all authentication-related state information
 */
exports.AuthStateStatus = void 0;
(function (AuthStateStatus) {
    AuthStateStatus["IDLE"] = "idle";
    AuthStateStatus["LOADING"] = "loading";
    AuthStateStatus["AUTHENTICATED"] = "authenticated";
    AuthStateStatus["UNAUTHENTICATED"] = "unauthenticated";
    AuthStateStatus["ERROR"] = "error";
})(exports.AuthStateStatus || (exports.AuthStateStatus = {}));

/**
 * AuthError Entity - Represents authentication-related errors
 * This entity provides structured error information for the authentication module
 */
exports.AuthErrorCode = void 0;
(function (AuthErrorCode) {
    // Authentication errors
    AuthErrorCode["INVALID_CREDENTIALS"] = "auth/invalid-credentials";
    AuthErrorCode["USER_NOT_FOUND"] = "auth/user-not-found";
    AuthErrorCode["WRONG_PASSWORD"] = "auth/wrong-password";
    AuthErrorCode["TOO_MANY_REQUESTS"] = "auth/too-many-requests";
    AuthErrorCode["USER_DISABLED"] = "auth/user-disabled";
    // Registration errors
    AuthErrorCode["EMAIL_ALREADY_IN_USE"] = "auth/email-already-in-use";
    AuthErrorCode["WEAK_PASSWORD"] = "auth/weak-password";
    AuthErrorCode["INVALID_EMAIL"] = "auth/invalid-email";
    // Token errors
    AuthErrorCode["TOKEN_EXPIRED"] = "auth/token-expired";
    AuthErrorCode["INVALID_TOKEN"] = "auth/invalid-token";
    AuthErrorCode["TOKEN_REFRESH_FAILED"] = "auth/token-refresh-failed";
    // Network errors
    AuthErrorCode["NETWORK_ERROR"] = "auth/network-error";
    AuthErrorCode["TIMEOUT"] = "auth/timeout";
    // Provider errors
    AuthErrorCode["POPUP_BLOCKED"] = "auth/popup-blocked";
    AuthErrorCode["POPUP_CLOSED_BY_USER"] = "auth/popup-closed-by-user";
    AuthErrorCode["PROVIDER_ERROR"] = "auth/provider-error";
    // SMS errors
    AuthErrorCode["INVALID_PHONE_NUMBER"] = "auth/invalid-phone-number";
    AuthErrorCode["INVALID_VERIFICATION_CODE"] = "auth/invalid-verification-code";
    AuthErrorCode["SMS_QUOTA_EXCEEDED"] = "auth/quota-exceeded";
    // Permission errors
    AuthErrorCode["PERMISSION_DENIED"] = "auth/permission-denied";
    AuthErrorCode["UNAUTHORIZED"] = "auth/unauthorized";
    // Configuration errors
    AuthErrorCode["CONFIGURATION_ERROR"] = "auth/configuration-error";
    AuthErrorCode["PROVIDER_NOT_CONFIGURED"] = "auth/provider-not-configured";
    // Unknown errors
    AuthErrorCode["UNKNOWN_ERROR"] = "auth/unknown-error";
    AuthErrorCode["INTERNAL_ERROR"] = "auth/internal-error";
})(exports.AuthErrorCode || (exports.AuthErrorCode = {}));
class AuthErrorFactory {
    static createError(code, message, details, originalError) {
        return {
            code,
            message,
            details,
            originalError,
            timestamp: new Date(),
            retryable: this.isRetryable(code),
            userAction: this.getUserAction(code)
        };
    }
    static fromFirebaseError(firebaseError) {
        const code = this.mapFirebaseErrorCode(firebaseError.code);
        const message = this.getErrorMessage(code);
        return this.createError(code, message, {
            firebaseCode: firebaseError.code,
            firebaseMessage: firebaseError.message
        }, firebaseError);
    }
    static mapFirebaseErrorCode(firebaseCode) {
        const mapping = {
            'auth/user-not-found': exports.AuthErrorCode.USER_NOT_FOUND,
            'auth/wrong-password': exports.AuthErrorCode.WRONG_PASSWORD,
            'auth/invalid-email': exports.AuthErrorCode.INVALID_EMAIL,
            'auth/email-already-in-use': exports.AuthErrorCode.EMAIL_ALREADY_IN_USE,
            'auth/weak-password': exports.AuthErrorCode.WEAK_PASSWORD,
            'auth/too-many-requests': exports.AuthErrorCode.TOO_MANY_REQUESTS,
            'auth/user-disabled': exports.AuthErrorCode.USER_DISABLED,
            'auth/popup-blocked': exports.AuthErrorCode.POPUP_BLOCKED,
            'auth/popup-closed-by-user': exports.AuthErrorCode.POPUP_CLOSED_BY_USER,
            'auth/invalid-phone-number': exports.AuthErrorCode.INVALID_PHONE_NUMBER,
            'auth/invalid-verification-code': exports.AuthErrorCode.INVALID_VERIFICATION_CODE,
            'auth/quota-exceeded': exports.AuthErrorCode.SMS_QUOTA_EXCEEDED,
            'auth/network-request-failed': exports.AuthErrorCode.NETWORK_ERROR
        };
        return mapping[firebaseCode] || exports.AuthErrorCode.UNKNOWN_ERROR;
    }
    static getErrorMessage(code) {
        const messages = {
            [exports.AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
            [exports.AuthErrorCode.USER_NOT_FOUND]: 'No user found with this email',
            [exports.AuthErrorCode.WRONG_PASSWORD]: 'Incorrect password',
            [exports.AuthErrorCode.TOO_MANY_REQUESTS]: 'Too many failed attempts. Please try again later',
            [exports.AuthErrorCode.USER_DISABLED]: 'This account has been disabled',
            [exports.AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'An account with this email already exists',
            [exports.AuthErrorCode.WEAK_PASSWORD]: 'Password is too weak',
            [exports.AuthErrorCode.INVALID_EMAIL]: 'Invalid email address',
            [exports.AuthErrorCode.TOKEN_EXPIRED]: 'Session has expired. Please log in again',
            [exports.AuthErrorCode.INVALID_TOKEN]: 'Invalid authentication token',
            [exports.AuthErrorCode.TOKEN_REFRESH_FAILED]: 'Failed to refresh authentication token',
            [exports.AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection',
            [exports.AuthErrorCode.TIMEOUT]: 'Request timed out. Please try again',
            [exports.AuthErrorCode.POPUP_BLOCKED]: 'Popup was blocked. Please allow popups and try again',
            [exports.AuthErrorCode.POPUP_CLOSED_BY_USER]: 'Authentication was cancelled',
            [exports.AuthErrorCode.PROVIDER_ERROR]: 'Authentication provider error',
            [exports.AuthErrorCode.INVALID_PHONE_NUMBER]: 'Invalid phone number',
            [exports.AuthErrorCode.INVALID_VERIFICATION_CODE]: 'Invalid verification code',
            [exports.AuthErrorCode.SMS_QUOTA_EXCEEDED]: 'SMS quota exceeded. Please try again later',
            [exports.AuthErrorCode.PERMISSION_DENIED]: 'Permission denied',
            [exports.AuthErrorCode.UNAUTHORIZED]: 'Unauthorized access',
            [exports.AuthErrorCode.CONFIGURATION_ERROR]: 'Authentication configuration error',
            [exports.AuthErrorCode.PROVIDER_NOT_CONFIGURED]: 'Authentication provider not configured',
            [exports.AuthErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred',
            [exports.AuthErrorCode.INTERNAL_ERROR]: 'Internal error occurred'
        };
        return messages[code] || 'An unexpected error occurred';
    }
    static isRetryable(code) {
        const retryableCodes = [
            exports.AuthErrorCode.NETWORK_ERROR,
            exports.AuthErrorCode.TIMEOUT,
            exports.AuthErrorCode.TOKEN_REFRESH_FAILED,
            exports.AuthErrorCode.INTERNAL_ERROR
        ];
        return retryableCodes.includes(code);
    }
    static getUserAction(code) {
        const actions = {
            [exports.AuthErrorCode.INVALID_CREDENTIALS]: 'Please check your email and password',
            [exports.AuthErrorCode.USER_NOT_FOUND]: 'Please check your email or create a new account',
            [exports.AuthErrorCode.WRONG_PASSWORD]: 'Please check your password or reset it',
            [exports.AuthErrorCode.TOO_MANY_REQUESTS]: 'Please wait before trying again',
            [exports.AuthErrorCode.USER_DISABLED]: 'Your account has been disabled. Please contact support',
            [exports.AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'Please use a different email or sign in',
            [exports.AuthErrorCode.WEAK_PASSWORD]: 'Please choose a stronger password',
            [exports.AuthErrorCode.INVALID_EMAIL]: 'Please enter a valid email address',
            [exports.AuthErrorCode.TOKEN_EXPIRED]: 'Please sign in again',
            [exports.AuthErrorCode.INVALID_TOKEN]: 'Please sign in again',
            [exports.AuthErrorCode.TOKEN_REFRESH_FAILED]: 'Please sign in again',
            [exports.AuthErrorCode.NETWORK_ERROR]: 'Please check your internet connection',
            [exports.AuthErrorCode.TIMEOUT]: 'Request timed out. Please try again',
            [exports.AuthErrorCode.POPUP_BLOCKED]: 'Please allow popups in your browser',
            [exports.AuthErrorCode.POPUP_CLOSED_BY_USER]: 'Please complete the authentication process',
            [exports.AuthErrorCode.PROVIDER_ERROR]: 'Authentication provider error. Please try again',
            [exports.AuthErrorCode.INVALID_PHONE_NUMBER]: 'Please enter a valid phone number',
            [exports.AuthErrorCode.INVALID_VERIFICATION_CODE]: 'Please enter the correct verification code',
            [exports.AuthErrorCode.SMS_QUOTA_EXCEEDED]: 'SMS quota exceeded. Please try again later',
            [exports.AuthErrorCode.PERMISSION_DENIED]: 'Permission denied. Please check your access rights',
            [exports.AuthErrorCode.UNAUTHORIZED]: 'Unauthorized access. Please sign in',
            [exports.AuthErrorCode.CONFIGURATION_ERROR]: 'Configuration error. Please contact support',
            [exports.AuthErrorCode.PROVIDER_NOT_CONFIGURED]: 'Authentication provider not configured',
            [exports.AuthErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred. Please try again',
            [exports.AuthErrorCode.INTERNAL_ERROR]: 'Internal error. Please try again'
        };
        return actions[code] || 'Please try again';
    }
}

/**
 * LoginUseCase - Handles user authentication with email/password
 * This use case encapsulates the business logic for user login
 */
class LoginUseCase {
    constructor(authRepository, validationService, storageRepository) {
        this.authRepository = authRepository;
        this.validationService = validationService;
        this.storageRepository = storageRepository;
    }
    async execute(request) {
        try {
            // Validate input
            await this.validateInput(request);
            // Attempt login
            const user = await this.authRepository.loginWithEmailPassword({
                email: request.email,
                password: request.password
            });
            // Get authentication token
            const token = await this.authRepository.getToken();
            if (!token) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.TOKEN_REFRESH_FAILED, 'Failed to retrieve authentication token');
            }
            // Store session data if remember me is enabled
            if (request.rememberMe) {
                await this.storageRepository.setToken(token);
                await this.storageRepository.setUserData(user);
            }
            return {
                user,
                token,
                refreshToken: await this.authRepository.refreshToken()
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_CREDENTIALS, 'Login failed', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
    async validateInput(request) {
        const emailValidation = this.validationService.validateEmail(request.email);
        if (!emailValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_EMAIL, emailValidation.errors.join(', '));
        }
        const passwordValidation = this.validationService.validatePassword(request.password);
        if (!passwordValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.WEAK_PASSWORD, passwordValidation.errors.join(', '));
        }
    }
}

/**
 * RegisterUseCase - Handles user registration
 * This use case encapsulates the business logic for user registration
 */
class RegisterUseCase {
    constructor(authRepository, validationService, storageRepository) {
        this.authRepository = authRepository;
        this.validationService = validationService;
        this.storageRepository = storageRepository;
    }
    async execute(request) {
        try {
            // Validate input
            await this.validateInput(request);
            // Prepare registration data
            const registerData = {
                email: request.email,
                password: request.password,
                displayName: request.displayName,
                phoneNumber: request.phoneNumber,
                photoURL: request.photoURL,
                locale: request.locale,
                timezone: request.timezone
            };
            // Register user
            const user = await this.authRepository.register(registerData);
            // Get authentication token
            const token = await this.authRepository.getToken();
            if (!token) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.TOKEN_REFRESH_FAILED, 'Failed to retrieve authentication token after registration');
            }
            // Send email verification
            let emailVerificationSent = false;
            try {
                await this.authRepository.sendEmailVerification();
                emailVerificationSent = true;
            }
            catch (error) {
                // Don't fail registration if email verification fails
                console.warn('Failed to send email verification:', error);
            }
            // Store user data
            await this.storageRepository.setToken(token);
            await this.storageRepository.setUserData(user);
            return {
                user,
                token,
                emailVerificationSent
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INTERNAL_ERROR, 'Registration failed', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
    async validateInput(request) {
        // Validate email
        const emailValidation = this.validationService.validateEmail(request.email);
        if (!emailValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_EMAIL, emailValidation.errors.join(', '));
        }
        // Validate password
        const passwordValidation = this.validationService.validatePassword(request.password);
        if (!passwordValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.WEAK_PASSWORD, passwordValidation.errors.join(', '));
        }
        // Validate password confirmation
        const passwordMatchValidation = this.validationService.validatePasswordMatch(request.password, request.confirmPassword);
        if (!passwordMatchValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.WEAK_PASSWORD, 'Passwords do not match');
        }
        // Validate display name if provided
        if (request.displayName) {
            const displayNameValidation = this.validationService.validateDisplayName(request.displayName);
            if (!displayNameValidation.isValid) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_EMAIL, // Using generic validation error
                displayNameValidation.errors.join(', '));
            }
        }
        // Validate phone number if provided
        if (request.phoneNumber) {
            const phoneValidation = this.validationService.validatePhoneNumber(request.phoneNumber);
            if (!phoneValidation.isValid) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_PHONE_NUMBER, phoneValidation.errors.join(', '));
            }
        }
        // Validate photo URL if provided
        if (request.photoURL) {
            const urlValidation = this.validationService.validateURL(request.photoURL);
            if (!urlValidation.isValid) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_EMAIL, // Using generic validation error
                'Invalid photo URL');
            }
        }
        // Validate terms acceptance
        const termsValidation = this.validationService.validateTermsAcceptance(request.acceptTerms);
        if (!termsValidation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.PERMISSION_DENIED, 'You must accept the terms and conditions');
        }
    }
}

/**
 * GoogleLoginUseCase - Handles Google OAuth authentication
 * This use case encapsulates the business logic for Google login
 */
class GoogleLoginUseCase {
    constructor(authRepository, storageRepository) {
        this.authRepository = authRepository;
        this.storageRepository = storageRepository;
    }
    async execute(request = {}) {
        try {
            // Check if user exists before login to determine if this is a new user
            const existingUser = await this.authRepository.getCurrentUser();
            // Attempt Google login
            const user = await this.authRepository.loginWithGoogle();
            // Get authentication token
            const token = await this.authRepository.getToken();
            if (!token) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.TOKEN_REFRESH_FAILED, 'Failed to retrieve authentication token');
            }
            // Store session data if remember me is enabled
            if (request.rememberMe) {
                await this.storageRepository.setToken(token);
                await this.storageRepository.setUserData(user);
            }
            // Determine if this is a new user
            const isNewUser = !existingUser || existingUser.id !== user.id;
            return {
                user,
                token,
                isNewUser
            };
        }
        catch (error) {
            if (error instanceof Error) {
                // Handle specific Google auth errors
                if (error.message.includes('popup_blocked')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.POPUP_BLOCKED, 'Popup was blocked. Please allow popups and try again.');
                }
                if (error.message.includes('popup_closed_by_user')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.POPUP_CLOSED_BY_USER, 'Authentication was cancelled by user.');
                }
                if (error.message.includes('network')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.NETWORK_ERROR, 'Network error during Google authentication.');
                }
                throw AuthErrorFactory.createError(exports.AuthErrorCode.PROVIDER_ERROR, 'Google authentication failed', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
}

/**
 * SMSLoginUseCase - Handles SMS-based authentication
 * This use case encapsulates the business logic for SMS login
 */
class SMSLoginUseCase {
    constructor(authRepository, validationService, storageRepository) {
        this.authRepository = authRepository;
        this.validationService = validationService;
        this.storageRepository = storageRepository;
    }
    async initiate(request) {
        try {
            // Validate phone number
            await this.validatePhoneNumber(request.phoneNumber, request.countryCode);
            // Send SMS verification
            const result = await this.authRepository.sendSMSVerification(request.phoneNumber);
            return {
                verificationId: result.verificationId,
                timeout: result.timeout,
                phoneNumber: request.phoneNumber
            };
        }
        catch (error) {
            if (error instanceof Error) {
                // Handle specific SMS errors
                if (error.message.includes('quota-exceeded')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.SMS_QUOTA_EXCEEDED, 'SMS quota exceeded. Please try again later.');
                }
                if (error.message.includes('invalid-phone-number')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_PHONE_NUMBER, 'Invalid phone number format.');
                }
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INTERNAL_ERROR, 'Failed to send SMS verification', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
    async complete(request) {
        try {
            // Validate verification code
            await this.validateVerificationCode(request.code);
            // Check if user exists before verification
            const existingUser = await this.authRepository.getCurrentUser();
            // Verify SMS code and authenticate
            const user = await this.authRepository.verifySMSCode(request.verificationId, request.code);
            // Get authentication token
            const token = await this.authRepository.getToken();
            if (!token) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.TOKEN_REFRESH_FAILED, 'Failed to retrieve authentication token');
            }
            // Store session data if remember me is enabled
            if (request.rememberMe) {
                await this.storageRepository.setToken(token);
                await this.storageRepository.setUserData(user);
            }
            // Determine if this is a new user
            const isNewUser = !existingUser || existingUser.id !== user.id;
            return {
                user,
                token,
                isNewUser
            };
        }
        catch (error) {
            if (error instanceof Error) {
                // Handle specific verification errors
                if (error.message.includes('invalid-verification-code')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_VERIFICATION_CODE, 'Invalid verification code. Please check and try again.');
                }
                if (error.message.includes('expired')) {
                    throw AuthErrorFactory.createError(exports.AuthErrorCode.TOKEN_EXPIRED, 'Verification code has expired. Please request a new one.');
                }
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INTERNAL_ERROR, 'SMS verification failed', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
    async validatePhoneNumber(phoneNumber, countryCode) {
        const validation = this.validationService.validatePhoneNumber(phoneNumber, countryCode);
        if (!validation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_PHONE_NUMBER, validation.errors.join(', '));
        }
    }
    async validateVerificationCode(code) {
        const validation = this.validationService.validateSMSCode(code);
        if (!validation.isValid) {
            throw AuthErrorFactory.createError(exports.AuthErrorCode.INVALID_VERIFICATION_CODE, validation.errors.join(', '));
        }
    }
}

/**
 * LogoutUseCase - Handles user logout
 * This use case encapsulates the business logic for user logout
 */
class LogoutUseCase {
    constructor(authRepository, storageRepository) {
        this.authRepository = authRepository;
        this.storageRepository = storageRepository;
    }
    async execute(request = {}) {
        try {
            // Logout from authentication provider
            await this.authRepository.logout();
            // Clear local storage
            await this.clearLocalData();
            return {
                success: true,
                redirectUrl: request.redirectUrl
            };
        }
        catch (error) {
            // Even if logout fails, clear local data
            try {
                await this.clearLocalData();
            }
            catch (storageError) {
                console.warn('Failed to clear local storage during logout:', storageError);
            }
            if (error instanceof Error) {
                throw AuthErrorFactory.createError(exports.AuthErrorCode.INTERNAL_ERROR, 'Logout failed', { originalMessage: error.message }, error);
            }
            throw error;
        }
    }
    async clearLocalData() {
        try {
            await this.storageRepository.clearAuthData();
        }
        catch (error) {
            console.warn('Failed to clear authentication data:', error);
            // Try to clear individual items
            try {
                await this.storageRepository.removeToken();
                await this.storageRepository.removeUserData();
                await this.storageRepository.removeRefreshToken();
                await this.storageRepository.removeSessionData();
            }
            catch (individualError) {
                console.error('Failed to clear individual storage items:', individualError);
            }
        }
    }
}

/**
 * AuthConfig - Configuration interface for the authentication module
 * This defines all configurable options for the authentication system
 */
class AuthConfigValidator {
    static validate(config) {
        const errors = [];
        const warnings = [];
        // Validate Firebase config
        if (!config.firebase) {
            errors.push('Firebase configuration is required');
        }
        else {
            if (!config.firebase.apiKey) {
                errors.push('Firebase API key is required');
            }
            if (!config.firebase.authDomain) {
                errors.push('Firebase auth domain is required');
            }
            if (!config.firebase.projectId) {
                errors.push('Firebase project ID is required');
            }
        }
        // Validate providers
        if (!config.providers) {
            errors.push('Providers configuration is required');
        }
        else {
            const enabledProviders = Object.values(config.providers).filter(p => p.enabled);
            if (enabledProviders.length === 0) {
                errors.push('At least one authentication provider must be enabled');
            }
            // Validate Google provider
            if (config.providers.google.enabled && !config.providers.google.clientId) {
                warnings.push('Google client ID is recommended for Google authentication');
            }
            // Validate SMS provider
            if (config.providers.sms.enabled) {
                if (config.providers.sms.timeout && config.providers.sms.timeout < 30) {
                    warnings.push('SMS timeout should be at least 30 seconds');
                }
            }
        }
        // Validate storage config
        if (!config.storage) {
            errors.push('Storage configuration is required');
        }
        else {
            if (!config.storage.tokenKey) {
                errors.push('Storage token key is required');
            }
            if (!config.storage.userKey) {
                errors.push('Storage user key is required');
            }
        }
        // Validate redirect URLs
        if (!config.redirectUrls) {
            errors.push('Redirect URLs configuration is required');
        }
        else {
            if (!config.redirectUrls.afterLogin) {
                errors.push('After login redirect URL is required');
            }
            if (!config.redirectUrls.afterLogout) {
                errors.push('After logout redirect URL is required');
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    static createDefaultConfig() {
        return {
            providers: {
                emailPassword: {
                    enabled: true,
                    requireEmailVerification: true,
                    allowPasswordReset: true,
                    passwordRequirements: {
                        minLength: 8,
                        requireUppercase: true,
                        requireLowercase: true,
                        requireNumbers: true,
                        requireSpecialChars: false
                    }
                },
                google: {
                    enabled: false,
                    scopes: ['email', 'profile']
                },
                sms: {
                    enabled: false,
                    timeout: 60,
                    codeLength: 6
                }
            },
            storage: {
                tokenKey: 'auth_token',
                userKey: 'auth_user',
                refreshTokenKey: 'auth_refresh_token',
                sessionKey: 'auth_session',
                prefix: 'auth_',
                secure: true,
                expiration: 7 * 24 * 60 * 60 * 1000 // 7 days
            },
            security: {
                sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
                tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
                maxLoginAttempts: 5,
                lockoutDuration: 15 * 60 * 1000, // 15 minutes
                requireSecureContext: true
            },
            ui: {
                theme: 'auto',
                language: 'en',
                showProviderIcons: true,
                allowRememberMe: true
            },
            debug: false,
            environment: 'production'
        };
    }
}

/**
 * Firebase Configuration - Setup and initialization for Firebase services
 */
class FirebaseConfigService {
    static initialize(config, useEmulator = false) {
        try {
            // Check if Firebase is already initialized
            if (app.getApps().length === 0) {
                this.app = app.initializeApp(config);
            }
            else {
                this.app = app.getApps()[0] || null;
            }
            // Initialize Auth
            this.auth = auth.getAuth(this.app || undefined);
            // Initialize Firestore
            this.firestore = firestore.getFirestore(this.app);
            // Connect to emulator in development
            if (useEmulator && !this.isEmulatorConnected()) {
                auth.connectAuthEmulator(this.auth, 'http://localhost:9099');
                firestore.connectFirestoreEmulator(this.firestore, 'localhost', 8080);
            }
            // Initialize Google provider
            this.googleProvider = new auth.GoogleAuthProvider();
            this.googleProvider.addScope('email');
            this.googleProvider.addScope('profile');
        }
        catch (error) {
            console.error('Failed to initialize Firebase:', error);
            throw new Error('Firebase initialization failed');
        }
    }
    static getAuth() {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized. Call initialize() first.');
        }
        return this.auth;
    }
    static getFirestore() {
        if (!this.firestore) {
            throw new Error('Firestore not initialized. Call initialize() first.');
        }
        return this.firestore;
    }
    static getGoogleProvider() {
        if (!this.googleProvider) {
            throw new Error('Google provider not initialized. Call initialize() first.');
        }
        return this.googleProvider;
    }
    static getRecaptchaVerifier(containerId) {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }
        if (!this.recaptchaVerifier) {
            this.recaptchaVerifier = new auth.RecaptchaVerifier(this.auth, containerId, {
                size: 'invisible',
                callback: () => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    // Response expired
                    this.recaptchaVerifier = null;
                }
            });
        }
        return this.recaptchaVerifier;
    }
    static clearRecaptchaVerifier() {
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = null;
        }
    }
    static isInitialized() {
        return this.app !== null && this.auth !== null && this.firestore !== null;
    }
    static isEmulatorConnected() {
        // Check if emulator is already connected
        return this.auth?._config?.emulator !== undefined;
    }
    static destroy() {
        this.clearRecaptchaVerifier();
        this.app = null;
        this.auth = null;
        this.firestore = null;
        this.googleProvider = null;
    }
}
FirebaseConfigService.app = null;
FirebaseConfigService.auth = null;
FirebaseConfigService.firestore = null;
FirebaseConfigService.googleProvider = null;
FirebaseConfigService.recaptchaVerifier = null;

/**
 * Firebase User Mapper - Maps Firebase User to domain User entity
 */
class FirebaseUserMapper {
    static fromFirebaseUser(firebaseUser, additionalData) {
        // Map Firebase providers to our AuthProvider enum
        const providers = this.mapProviders(firebaseUser.providerData);
        // Extract metadata
        const metadata = firebaseUser.metadata;
        const createdAt = metadata.creationTime ? new Date(metadata.creationTime) : new Date();
        const lastLoginAt = metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date();
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            firstName: additionalData?.firstName,
            lastName: additionalData?.lastName,
            username: additionalData?.username,
            photoURL: firebaseUser.photoURL || undefined,
            phoneNumber: firebaseUser.phoneNumber || undefined,
            emailVerified: firebaseUser.emailVerified,
            createdAt,
            lastLoginAt,
            updatedAt: additionalData?.updatedAt,
            providers,
            deviceToken: additionalData?.deviceToken,
            customClaims: additionalData?.customClaims,
            locale: additionalData?.locale,
            timezone: additionalData?.timezone,
            disabled: false, // Firebase doesn't expose this in client SDK
            metadata: {
                ...additionalData?.metadata,
                firebaseUid: firebaseUser.uid,
                isAnonymous: firebaseUser.isAnonymous,
                tenantId: firebaseUser.tenantId
            }
        };
    }
    static fromFirebaseUserWithFirestore(firebaseUser, firestoreData, additionalData) {
        // Parse Firestore timestamps
        let createdAt = new Date();
        let updatedAt;
        if (firestoreData?.CreatedAt) {
            try {
                createdAt = new Date(firestoreData.CreatedAt);
            }
            catch (error) {
                console.warn('Failed to parse CreatedAt from Firestore:', error);
            }
        }
        if (firestoreData?.UpdatedAt) {
            try {
                updatedAt = new Date(firestoreData.UpdatedAt);
            }
            catch (error) {
                console.warn('Failed to parse UpdatedAt from Firestore:', error);
            }
        }
        // Map Firebase providers to our AuthProvider enum
        const providers = this.mapProviders(firebaseUser.providerData);
        // Extract metadata
        const metadata = firebaseUser.metadata;
        const lastLoginAt = metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date();
        return {
            id: firebaseUser.uid,
            email: firestoreData?.Email || firebaseUser.email || '',
            displayName: firestoreData?.DisplayName || firebaseUser.displayName || undefined,
            firstName: firestoreData?.FirstName,
            lastName: firestoreData?.LastName,
            username: firestoreData?.Username,
            photoURL: firestoreData?.ProfilePicture || firebaseUser.photoURL || undefined,
            phoneNumber: firestoreData?.PhoneNumber || firebaseUser.phoneNumber || undefined,
            emailVerified: firebaseUser.emailVerified,
            createdAt,
            updatedAt,
            lastLoginAt,
            providers,
            deviceToken: firestoreData?.deviceToken,
            customClaims: additionalData?.customClaims,
            locale: additionalData?.locale,
            timezone: additionalData?.timezone,
            disabled: false, // Firebase doesn't expose this in client SDK
            metadata: {
                ...additionalData?.metadata,
                firebaseUid: firebaseUser.uid,
                isAnonymous: firebaseUser.isAnonymous,
                tenantId: firebaseUser.tenantId
            }
        };
    }
    static toFirebaseUpdateData(user) {
        const updateData = {};
        if (user.displayName !== undefined) {
            updateData.displayName = user.displayName;
        }
        if (user.photoURL !== undefined) {
            updateData.photoURL = user.photoURL;
        }
        return updateData;
    }
    static mapProviders(providerData) {
        const providers = [];
        providerData.forEach(provider => {
            switch (provider.providerId) {
                case 'password':
                    providers.push(AuthProvider$1.EMAIL_PASSWORD);
                    break;
                case 'google.com':
                    providers.push(AuthProvider$1.GOOGLE);
                    break;
                case 'phone':
                    providers.push(AuthProvider$1.SMS);
                    break;
                case 'facebook.com':
                    providers.push(AuthProvider$1.FACEBOOK);
                    break;
                case 'apple.com':
                    providers.push(AuthProvider$1.APPLE);
                    break;
            }
        });
        // If no providers found but user exists, assume email/password
        if (providers.length === 0) {
            providers.push(AuthProvider$1.EMAIL_PASSWORD);
        }
        return providers;
    }
    static getProviderDisplayName(provider) {
        switch (provider) {
            case AuthProvider$1.EMAIL_PASSWORD:
                return 'Email/Password';
            case AuthProvider$1.GOOGLE:
                return 'Google';
            case AuthProvider$1.SMS:
                return 'SMS';
            case AuthProvider$1.FACEBOOK:
                return 'Facebook';
            case AuthProvider$1.APPLE:
                return 'Apple';
            default:
                return 'Unknown';
        }
    }
    static getProviderIcon(provider) {
        switch (provider) {
            case AuthProvider$1.EMAIL_PASSWORD:
                return '✉️';
            case AuthProvider$1.GOOGLE:
                return '🔍';
            case AuthProvider$1.SMS:
                return '📱';
            case AuthProvider$1.FACEBOOK:
                return '📘';
            case AuthProvider$1.APPLE:
                return '🍎';
            default:
                return '❓';
        }
    }
}

/**
 * FirestoreUserRepository - Implementation of UserRepository using Firestore
 */
class FirestoreUserRepository {
    constructor() {
        this.COLLECTION_NAME = 'Users';
    }
    async getUserById(userId) {
        try {
            const db = FirebaseConfigService.getFirestore();
            const userDoc = firestore.doc(db, this.COLLECTION_NAME, userId);
            const docSnap = await firestore.getDoc(userDoc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    Email: data.Email || '',
                    DisplayName: data.DisplayName,
                    FirstName: data.FirstName,
                    LastName: data.LastName,
                    Username: data.Username,
                    PhoneNumber: data.PhoneNumber,
                    ProfilePicture: data.ProfilePicture,
                    CreatedAt: data.CreatedAt,
                    UpdatedAt: data.UpdatedAt,
                    deviceToken: data.deviceToken
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting user from Firestore:', error);
            throw error;
        }
    }
    async saveUser(userData) {
        try {
            const db = FirebaseConfigService.getFirestore();
            const userDoc = firestore.doc(db, this.COLLECTION_NAME, userData.id);
            const dataToSave = {
                ...userData,
                UpdatedAt: firestore.serverTimestamp()
            };
            await firestore.setDoc(userDoc, dataToSave, { merge: true });
        }
        catch (error) {
            console.error('Error saving user to Firestore:', error);
            throw error;
        }
    }
    async updateUser(userId, userData) {
        try {
            const db = FirebaseConfigService.getFirestore();
            const userDoc = firestore.doc(db, this.COLLECTION_NAME, userId);
            const updateData = {
                UpdatedAt: firestore.serverTimestamp()
            };
            // Map update data to Firestore field names
            if (userData.displayName !== undefined) {
                updateData.DisplayName = userData.displayName;
            }
            if (userData.firstName !== undefined) {
                updateData.FirstName = userData.firstName;
            }
            if (userData.lastName !== undefined) {
                updateData.LastName = userData.lastName;
            }
            if (userData.username !== undefined) {
                updateData.Username = userData.username;
            }
            if (userData.phoneNumber !== undefined) {
                updateData.PhoneNumber = userData.phoneNumber;
            }
            if (userData.photoURL !== undefined) {
                updateData.ProfilePicture = userData.photoURL;
            }
            if (userData.deviceToken !== undefined) {
                updateData.deviceToken = userData.deviceToken;
            }
            await firestore.updateDoc(userDoc, updateData);
        }
        catch (error) {
            console.error('Error updating user in Firestore:', error);
            throw error;
        }
    }
    async deleteUser(userId) {
        try {
            const db = FirebaseConfigService.getFirestore();
            const userDoc = firestore.doc(db, this.COLLECTION_NAME, userId);
            await firestore.deleteDoc(userDoc);
        }
        catch (error) {
            console.error('Error deleting user from Firestore:', error);
            throw error;
        }
    }
    async userExists(userId) {
        try {
            const db = FirebaseConfigService.getFirestore();
            const userDoc = firestore.doc(db, this.COLLECTION_NAME, userId);
            const docSnap = await firestore.getDoc(userDoc);
            return docSnap.exists();
        }
        catch (error) {
            console.error('Error checking if user exists in Firestore:', error);
            return false;
        }
    }
}

/**
 * Firebase Auth Service - Implementation of AuthRepository using Firebase Auth
 */
class FirebaseAuthService {
    constructor() {
        this.authStateListeners = [];
        this.tokenRefreshListeners = [];
        this.errorListeners = [];
        this.userRepository = new FirestoreUserRepository();
        this.setupAuthStateListener();
    }
    async loginWithEmailPassword(credentials) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const userCredential = await auth.signInWithEmailAndPassword(auth$1, credentials.email, credentials.password);
            // Get additional user data from Firestore
            const firestoreData = await this.userRepository.getUserById(userCredential.user.uid);
            return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreData);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async loginWithGoogle() {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const provider = FirebaseConfigService.getGoogleProvider();
            const userCredential = await auth.signInWithPopup(auth$1, provider);
            // Get additional user data from Firestore
            const firestoreData = await this.userRepository.getUserById(userCredential.user.uid);
            return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreData);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async sendSMSVerification(phoneNumber) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            // Create reCAPTCHA verifier
            const recaptchaVerifier = FirebaseConfigService.getRecaptchaVerifier('recaptcha-container');
            const confirmationResult = await auth.signInWithPhoneNumber(auth$1, phoneNumber, recaptchaVerifier);
            return {
                verificationId: confirmationResult.verificationId,
                timeout: 60 // 60 seconds timeout
            };
        }
        catch (error) {
            FirebaseConfigService.clearRecaptchaVerifier();
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async verifySMSCode(verificationId, code) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const credential = auth.PhoneAuthProvider.credential(verificationId, code);
            const userCredential = await auth.signInWithCredential(auth$1, credential);
            FirebaseConfigService.clearRecaptchaVerifier();
            return FirebaseUserMapper.fromFirebaseUser(userCredential.user);
        }
        catch (error) {
            FirebaseConfigService.clearRecaptchaVerifier();
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async register(userData) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const userCredential = await auth.createUserWithEmailAndPassword(auth$1, userData.email, userData.password);
            // Update profile with additional data
            if (userData.displayName || userData.photoURL) {
                await auth.updateProfile(userCredential.user, {
                    displayName: userData.displayName || null,
                    photoURL: userData.photoURL || null
                });
            }
            // Create user document in Firestore
            const firestoreUserData = {
                id: userCredential.user.uid,
                Email: userData.email,
                DisplayName: userData.displayName || '',
                FirstName: userData.firstName || '',
                LastName: userData.lastName || '',
                Username: userData.username || '',
                PhoneNumber: userData.phoneNumber || '',
                ProfilePicture: userData.photoURL || '',
                CreatedAt: new Date().toISOString(),
                deviceToken: userData.deviceToken || ''
            };
            await this.userRepository.saveUser(firestoreUserData);
            return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreUserData, userData);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async logout() {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            await auth.signOut(auth$1);
            FirebaseConfigService.clearRecaptchaVerifier();
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async getCurrentUser() {
        try {
            const auth = FirebaseConfigService.getAuth();
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                return null;
            }
            // Get additional user data from Firestore
            const firestoreData = await this.userRepository.getUserById(firebaseUser.uid);
            return FirebaseUserMapper.fromFirebaseUserWithFirestore(firebaseUser, firestoreData);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async refreshToken() {
        try {
            const auth = FirebaseConfigService.getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            const token = await user.getIdToken(true); // Force refresh
            this.notifyTokenRefreshListeners(token);
            return token;
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async getToken() {
        try {
            const auth = FirebaseConfigService.getAuth();
            const user = auth.currentUser;
            if (!user) {
                return null;
            }
            return await user.getIdToken();
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async validateToken(token) {
        try {
            // Firebase automatically validates tokens
            // We can check if current user exists and token is not expired
            const auth = FirebaseConfigService.getAuth();
            const user = auth.currentUser;
            if (!user) {
                return false;
            }
            const currentToken = await user.getIdToken();
            return currentToken === token;
        }
        catch (error) {
            return false;
        }
    }
    async sendPasswordResetEmail(email) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            await auth.sendPasswordResetEmail(auth$1, email);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async resetPassword(data) {
        // Firebase handles password reset via email link
        // This method is for compatibility with the interface
        throw new Error('Password reset with token not supported by Firebase. Use sendPasswordResetEmail instead.');
    }
    async changePassword(currentPassword, newPassword) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user || !user.email) {
                throw new Error('No authenticated user');
            }
            // Re-authenticate user before changing password
            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
            await auth.reauthenticateWithCredential(user, credential);
            // Update password
            await auth.updatePassword(user, newPassword);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async sendEmailVerification() {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            await auth.sendEmailVerification(user);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async verifyEmail(token) {
        // Firebase handles email verification via email link
        // This method is for compatibility with the interface
        throw new Error('Email verification with token not supported by Firebase. Email verification is handled automatically.');
    }
    async updateProfile(userData) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            await auth.updateProfile(user, {
                displayName: userData.displayName || user.displayName,
                photoURL: userData.photoURL || user.photoURL
            });
            // Reload user to get updated data
            await user.reload();
            return FirebaseUserMapper.fromFirebaseUser(user);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async deleteAccount() {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            await auth.deleteUser(user);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async linkProvider(provider, credentials) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            let credential;
            switch (provider) {
                case 'google':
                    credential = auth.GoogleAuthProvider.credential(credentials.idToken, credentials.accessToken);
                    break;
                case 'phone':
                    credential = auth.PhoneAuthProvider.credential(credentials.verificationId, credentials.code);
                    break;
                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }
            const userCredential = await auth.linkWithCredential(user, credential);
            return FirebaseUserMapper.fromFirebaseUser(userCredential.user);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async unlinkProvider(provider) {
        try {
            const auth$1 = FirebaseConfigService.getAuth();
            const user = auth$1.currentUser;
            if (!user) {
                throw new Error('No authenticated user');
            }
            const updatedUser = await auth.unlink(user, provider);
            return FirebaseUserMapper.fromFirebaseUser(updatedUser);
        }
        catch (error) {
            const authError = AuthErrorFactory.fromFirebaseError(error);
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        return () => {
            const index = this.authStateListeners.indexOf(callback);
            if (index > -1) {
                this.authStateListeners.splice(index, 1);
            }
        };
    }
    onTokenRefresh(callback) {
        this.tokenRefreshListeners.push(callback);
        return () => {
            const index = this.tokenRefreshListeners.indexOf(callback);
            if (index > -1) {
                this.tokenRefreshListeners.splice(index, 1);
            }
        };
    }
    onAuthError(callback) {
        this.errorListeners.push(callback);
        return () => {
            const index = this.errorListeners.indexOf(callback);
            if (index > -1) {
                this.errorListeners.splice(index, 1);
            }
        };
    }
    setupAuthStateListener() {
        const auth$1 = FirebaseConfigService.getAuth();
        auth.onAuthStateChanged(auth$1, (firebaseUser) => {
            try {
                const user = firebaseUser ? FirebaseUserMapper.fromFirebaseUser(firebaseUser) : null;
                this.notifyAuthStateListeners(user);
            }
            catch (error) {
                console.error('Error in auth state change:', error);
            }
        });
    }
    notifyAuthStateListeners(user) {
        this.authStateListeners.forEach(callback => {
            try {
                callback(user);
            }
            catch (error) {
                console.error('Error in auth state listener:', error);
            }
        });
    }
    notifyTokenRefreshListeners(token) {
        this.tokenRefreshListeners.forEach(callback => {
            try {
                callback(token);
            }
            catch (error) {
                console.error('Error in token refresh listener:', error);
            }
        });
    }
    notifyErrorListeners(error) {
        this.errorListeners.forEach(callback => {
            try {
                callback(error);
            }
            catch (listenerError) {
                console.error('Error in error listener:', listenerError);
            }
        });
    }
}

/**
 * Local Storage Service - Implementation of StorageRepository using browser localStorage
 */
class LocalStorageService {
    constructor(prefix = 'auth_', isSecure = true) {
        // In-memory storage fallback
        this.memoryStorage = new Map();
        this.prefix = prefix;
        this.isSecure = isSecure;
        // Check if localStorage is available
        if (!this.isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Using in-memory storage.');
        }
    }
    async setItem(key, value) {
        try {
            const prefixedKey = this.getPrefixedKey(key);
            const processedValue = this.isSecure ? this.encrypt(value) : value;
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(prefixedKey, processedValue);
            }
            else {
                this.memoryStorage.set(prefixedKey, processedValue);
            }
        }
        catch (error) {
            console.error('Failed to set item in storage:', error);
            throw new Error('Storage operation failed');
        }
    }
    async getItem(key) {
        try {
            const prefixedKey = this.getPrefixedKey(key);
            let value;
            if (this.isLocalStorageAvailable()) {
                value = localStorage.getItem(prefixedKey);
            }
            else {
                value = this.memoryStorage.get(prefixedKey) || null;
            }
            if (value === null) {
                return null;
            }
            return this.isSecure ? this.decrypt(value) : value;
        }
        catch (error) {
            console.error('Failed to get item from storage:', error);
            return null;
        }
    }
    async removeItem(key) {
        try {
            const prefixedKey = this.getPrefixedKey(key);
            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(prefixedKey);
            }
            else {
                this.memoryStorage.delete(prefixedKey);
            }
        }
        catch (error) {
            console.error('Failed to remove item from storage:', error);
            throw new Error('Storage operation failed');
        }
    }
    async clear() {
        try {
            if (this.isLocalStorageAvailable()) {
                // Only clear items with our prefix
                const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
                keys.forEach(key => localStorage.removeItem(key));
            }
            else {
                // Clear memory storage
                const keys = Array.from(this.memoryStorage.keys()).filter(key => key.startsWith(this.prefix));
                keys.forEach(key => this.memoryStorage.delete(key));
            }
        }
        catch (error) {
            console.error('Failed to clear storage:', error);
            throw new Error('Storage operation failed');
        }
    }
    async hasItem(key) {
        try {
            const value = await this.getItem(key);
            return value !== null;
        }
        catch (error) {
            console.error('Failed to check item existence:', error);
            return false;
        }
    }
    async getAllKeys() {
        try {
            let keys;
            if (this.isLocalStorageAvailable()) {
                keys = Object.keys(localStorage);
            }
            else {
                keys = Array.from(this.memoryStorage.keys());
            }
            return keys
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.substring(this.prefix.length));
        }
        catch (error) {
            console.error('Failed to get all keys:', error);
            return [];
        }
    }
    async setObject(key, value) {
        try {
            const jsonString = JSON.stringify(value);
            await this.setItem(key, jsonString);
        }
        catch (error) {
            console.error('Failed to set object in storage:', error);
            throw new Error('Failed to serialize and store object');
        }
    }
    async getObject(key) {
        try {
            const jsonString = await this.getItem(key);
            if (jsonString === null) {
                return null;
            }
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Failed to get object from storage:', error);
            return null;
        }
    }
    // Authentication-specific methods
    async setToken(token) {
        await this.setItem('token', token);
    }
    async getToken() {
        return await this.getItem('token');
    }
    async removeToken() {
        await this.removeItem('token');
    }
    async setUserData(userData) {
        await this.setObject('user', userData);
    }
    async getUserData() {
        return await this.getObject('user');
    }
    async removeUserData() {
        await this.removeItem('user');
    }
    async setRefreshToken(token) {
        await this.setItem('refresh_token', token);
    }
    async getRefreshToken() {
        return await this.getItem('refresh_token');
    }
    async removeRefreshToken() {
        await this.removeItem('refresh_token');
    }
    async setSessionData(sessionData) {
        await this.setObject('session', sessionData);
    }
    async getSessionData() {
        return await this.getObject('session');
    }
    async removeSessionData() {
        await this.removeItem('session');
    }
    async clearAuthData() {
        await Promise.all([
            this.removeToken(),
            this.removeUserData(),
            this.removeRefreshToken(),
            this.removeSessionData()
        ]);
    }
    // Private methods
    getPrefixedKey(key) {
        return `${this.prefix}${key}`;
    }
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    // Simple encryption/decryption (for demonstration - use proper encryption in production)
    encrypt(value) {
        if (!this.isSecure)
            return value;
        try {
            // Simple base64 encoding (NOT secure - replace with proper encryption)
            return btoa(value);
        }
        catch (error) {
            console.warn('Encryption failed, storing as plain text');
            return value;
        }
    }
    decrypt(value) {
        if (!this.isSecure)
            return value;
        try {
            // Simple base64 decoding (NOT secure - replace with proper decryption)
            return atob(value);
        }
        catch (error) {
            console.warn('Decryption failed, returning as is');
            return value;
        }
    }
}

/**
 * Validation Service Implementation - Handles all input validation
 */
class ValidationServiceImpl {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phoneRegex = /^\+?[1-9]\d{1,14}$/;
        this.urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    }
    validateEmail(email) {
        const errors = [];
        if (!email) {
            errors.push('Email is required');
        }
        else {
            if (email.length > 254) {
                errors.push('Email is too long');
            }
            if (!this.emailRegex.test(email)) {
                errors.push('Invalid email format');
            }
            email.split('@')[1];
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validatePassword(password) {
        const errors = [];
        if (!password) {
            errors.push('Password is required');
        }
        else {
            if (password.length < 6) {
                errors.push('Password must be at least 6 characters long');
            }
            if (password.length > 128) {
                errors.push('Password is too long (max 128 characters)');
            }
            // Relaxed validation - only require length, no character requirements
            // if (!/[a-z]/.test(password)) {
            //   errors.push('Password must contain at least one lowercase letter')
            // }
            // if (!/[A-Z]/.test(password)) {
            //   errors.push('Password must contain at least one uppercase letter')
            // }
            // if (!/\d/.test(password)) {
            //   errors.push('Password must contain at least one number')
            // }
            // Check for common weak passwords
            const commonPasswords = [
                'password', '123456', '123456789', 'qwerty', 'abc123',
                'password123', 'admin', 'letmein', 'welcome', 'monkey'
            ];
            if (commonPasswords.includes(password.toLowerCase())) {
                errors.push('Password is too common');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    checkPasswordStrength(password) {
        let score = 0;
        const feedback = [];
        const requirements = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        // Calculate score
        if (requirements.minLength)
            score++;
        if (requirements.hasUppercase)
            score++;
        if (requirements.hasLowercase)
            score++;
        if (requirements.hasNumbers)
            score++;
        if (requirements.hasSpecialChars)
            score++;
        // Additional checks
        if (password.length >= 12)
            score++;
        if (password.length >= 16)
            score++;
        // Reduce score for patterns
        if (/(.)\1{2,}/.test(password)) {
            score--;
            feedback.push('Avoid repeating characters');
        }
        if (/123|abc|qwe/i.test(password)) {
            score--;
            feedback.push('Avoid sequential characters');
        }
        // Normalize score to 0-4
        score = Math.max(0, Math.min(4, score));
        // Generate feedback
        if (!requirements.minLength) {
            feedback.push('Use at least 8 characters');
        }
        if (!requirements.hasUppercase) {
            feedback.push('Add uppercase letters');
        }
        if (!requirements.hasLowercase) {
            feedback.push('Add lowercase letters');
        }
        if (!requirements.hasNumbers) {
            feedback.push('Add numbers');
        }
        if (!requirements.hasSpecialChars) {
            feedback.push('Add special characters');
        }
        return {
            score,
            feedback,
            requirements
        };
    }
    validatePhoneNumber(phoneNumber, countryCode) {
        const errors = [];
        if (!phoneNumber) {
            errors.push('Phone number is required');
        }
        else {
            // Remove spaces and dashes for validation
            const cleanNumber = phoneNumber.replace(/[\s-]/g, '');
            if (!this.phoneRegex.test(cleanNumber)) {
                errors.push('Invalid phone number format');
            }
            // Check length
            if (cleanNumber.length < 10 || cleanNumber.length > 15) {
                errors.push('Phone number must be between 10 and 15 digits');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateDisplayName(displayName) {
        const errors = [];
        if (!displayName) {
            errors.push('Display name is required');
        }
        else {
            if (displayName.length < 2) {
                errors.push('Display name must be at least 2 characters long');
            }
            if (displayName.length > 50) {
                errors.push('Display name is too long (max 50 characters)');
            }
            // Check for invalid characters
            if (!/^[a-zA-Z0-9\s\-_.]+$/.test(displayName)) {
                errors.push('Display name contains invalid characters');
            }
            // Check for profanity (basic check)
            const profanityWords = ['spam', 'test', 'admin', 'null', 'undefined'];
            if (profanityWords.some(word => displayName.toLowerCase().includes(word))) {
                errors.push('Display name contains inappropriate content');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateRegistrationData(data) {
        const errors = [];
        // Validate email
        const emailValidation = this.validateEmail(data.email);
        errors.push(...emailValidation.errors);
        // Validate password
        const passwordValidation = this.validatePassword(data.password);
        errors.push(...passwordValidation.errors);
        // Validate password confirmation
        const passwordMatchValidation = this.validatePasswordMatch(data.password, data.confirmPassword);
        errors.push(...passwordMatchValidation.errors);
        // Validate display name if provided
        if (data.displayName) {
            const displayNameValidation = this.validateDisplayName(data.displayName);
            errors.push(...displayNameValidation.errors);
        }
        // Validate phone number if provided
        if (data.phoneNumber) {
            const phoneValidation = this.validatePhoneNumber(data.phoneNumber);
            errors.push(...phoneValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateLoginCredentials(email, password) {
        const errors = [];
        if (!email) {
            errors.push('Email is required');
        }
        if (!password) {
            errors.push('Password is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateSMSCode(code) {
        const errors = [];
        if (!code) {
            errors.push('Verification code is required');
        }
        else {
            // Remove spaces
            const cleanCode = code.replace(/\s/g, '');
            if (!/^\d{4,8}$/.test(cleanCode)) {
                errors.push('Verification code must be 4-8 digits');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateProfileData(data) {
        const errors = [];
        if (data.displayName) {
            const displayNameValidation = this.validateDisplayName(data.displayName);
            errors.push(...displayNameValidation.errors);
        }
        if (data.phoneNumber) {
            const phoneValidation = this.validatePhoneNumber(data.phoneNumber);
            errors.push(...phoneValidation.errors);
        }
        if (data.photoURL) {
            const urlValidation = this.validateURL(data.photoURL);
            errors.push(...urlValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validatePasswordChange(data) {
        const errors = [];
        if (!data.currentPassword) {
            errors.push('Current password is required');
        }
        const newPasswordValidation = this.validatePassword(data.newPassword);
        errors.push(...newPasswordValidation.errors);
        const passwordMatchValidation = this.validatePasswordMatch(data.newPassword, data.confirmPassword);
        errors.push(...passwordMatchValidation.errors);
        if (data.currentPassword === data.newPassword) {
            errors.push('New password must be different from current password');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/['"]/g, '') // Remove quotes
            .substring(0, 1000); // Limit length
    }
    validateURL(url) {
        const errors = [];
        if (!url) {
            errors.push('URL is required');
        }
        else {
            if (!this.urlRegex.test(url)) {
                errors.push('Invalid URL format');
            }
            if (url.length > 2048) {
                errors.push('URL is too long');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validatePasswordMatch(password, confirmPassword) {
        const errors = [];
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateTermsAcceptance(accepted) {
        const errors = [];
        if (!accepted) {
            errors.push('You must accept the terms and conditions');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

/**
 * Auth Repository Adapter - Adapts Firebase Auth Service to AuthRepository interface
 */
class AuthRepositoryAdapter {
    constructor(firebaseAuthService) {
        this.firebaseAuthService = firebaseAuthService;
    }
    // Delegate all methods to Firebase Auth Service
    async loginWithEmailPassword(credentials) {
        return this.firebaseAuthService.loginWithEmailPassword(credentials);
    }
    async loginWithGoogle() {
        return this.firebaseAuthService.loginWithGoogle();
    }
    async sendSMSVerification(phoneNumber) {
        return this.firebaseAuthService.sendSMSVerification(phoneNumber);
    }
    async verifySMSCode(verificationId, code) {
        return this.firebaseAuthService.verifySMSCode(verificationId, code);
    }
    async register(userData) {
        return this.firebaseAuthService.register(userData);
    }
    async logout() {
        return this.firebaseAuthService.logout();
    }
    async getCurrentUser() {
        return this.firebaseAuthService.getCurrentUser();
    }
    async refreshToken() {
        return this.firebaseAuthService.refreshToken();
    }
    async getToken() {
        return this.firebaseAuthService.getToken();
    }
    async validateToken(token) {
        return this.firebaseAuthService.validateToken(token);
    }
    async sendPasswordResetEmail(email) {
        return this.firebaseAuthService.sendPasswordResetEmail(email);
    }
    async resetPassword(data) {
        return this.firebaseAuthService.resetPassword(data);
    }
    async changePassword(currentPassword, newPassword) {
        return this.firebaseAuthService.changePassword(currentPassword, newPassword);
    }
    async sendEmailVerification() {
        return this.firebaseAuthService.sendEmailVerification();
    }
    async verifyEmail(token) {
        return this.firebaseAuthService.verifyEmail(token);
    }
    async updateProfile(userData) {
        return this.firebaseAuthService.updateProfile(userData);
    }
    async deleteAccount() {
        return this.firebaseAuthService.deleteAccount();
    }
    async linkProvider(provider, credentials) {
        return this.firebaseAuthService.linkProvider(provider, credentials);
    }
    async unlinkProvider(provider) {
        return this.firebaseAuthService.unlinkProvider(provider);
    }
    onAuthStateChanged(callback) {
        return this.firebaseAuthService.onAuthStateChanged(callback);
    }
    onTokenRefresh(callback) {
        return this.firebaseAuthService.onTokenRefresh(callback);
    }
    onAuthError(callback) {
        return this.firebaseAuthService.onAuthError(callback);
    }
}

/**
 * Auth Service Adapter - Implements AuthService interface using Use Cases
 */
class AuthServiceAdapter {
    constructor(loginUseCase, registerUseCase, googleLoginUseCase, smsLoginUseCase, logoutUseCase, authRepository) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.googleLoginUseCase = googleLoginUseCase;
        this.smsLoginUseCase = smsLoginUseCase;
        this.logoutUseCase = logoutUseCase;
        this.authRepository = authRepository;
        this.currentAuthState = {
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
            isInitialized: false,
            isSessionValid: false
        };
        this.authStateListeners = [];
        this.errorListeners = [];
        this.setupFirebaseAuthStateListener();
    }
    async login(request) {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            const response = await this.loginUseCase.execute({
                email: request.email,
                password: request.password,
                rememberMe: request.rememberMe
            });
            this.updateAuthState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                isSessionValid: true,
                sessionToken: response.token
            });
            return response.user;
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({
                isLoading: false,
                error: authError,
                isAuthenticated: false,
                isSessionValid: false
            });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async loginWithGoogle() {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            const response = await this.googleLoginUseCase.execute();
            this.updateAuthState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                isSessionValid: true,
                sessionToken: response.token
            });
            return response.user;
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({
                isLoading: false,
                error: authError,
                isAuthenticated: false,
                isSessionValid: false
            });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async initiateSMSLogin(request) {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            const response = await this.smsLoginUseCase.initiate({
                phoneNumber: request.phoneNumber,
                countryCode: request.countryCode
            });
            this.updateAuthState({ isLoading: false });
            return { verificationId: response.verificationId };
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({ isLoading: false, error: authError });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async completeSMSLogin(request) {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            const response = await this.smsLoginUseCase.complete({
                verificationId: request.verificationId,
                code: request.code,
                rememberMe: false // Can be added to request if needed
            });
            this.updateAuthState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                isSessionValid: true,
                sessionToken: response.token
            });
            return response.user;
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({
                isLoading: false,
                error: authError,
                isAuthenticated: false,
                isSessionValid: false
            });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async register(request) {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            const response = await this.registerUseCase.execute(request);
            this.updateAuthState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                isSessionValid: true,
                sessionToken: response.token
            });
            return response.user;
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({
                isLoading: false,
                error: authError,
                isAuthenticated: false,
                isSessionValid: false
            });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async logout() {
        try {
            this.updateAuthState({ isLoading: true, error: null });
            await this.logoutUseCase.execute();
            // Note: Firebase auth state listener will handle updating the state
            // when Firebase auth state changes to null after logout
            this.updateAuthState({
                isLoading: false,
                error: null
            });
        }
        catch (error) {
            const authError = error;
            this.updateAuthState({ isLoading: false, error: authError });
            this.notifyErrorListeners(authError);
            throw authError;
        }
    }
    async getCurrentAuthState() {
        try {
            // Get current user from Firebase to ensure we have the latest state
            const currentUser = await this.authRepository.getCurrentUser();
            // Always update our local state to match Firebase
            this.updateAuthState({
                user: currentUser,
                isAuthenticated: currentUser !== null,
                isSessionValid: currentUser !== null,
                isInitialized: true,
                isLoading: false
            });
            console.log('getCurrentAuthState:', currentUser ? 'User found' : 'No user', 'isAuthenticated:', currentUser !== null);
        }
        catch (error) {
            console.error('Error getting current auth state:', error);
            this.updateAuthState({
                isInitialized: true,
                isLoading: false,
                error: error
            });
        }
        return { ...this.currentAuthState };
    }
    setupFirebaseAuthStateListener() {
        try {
            this.firebaseUnsubscribe = this.authRepository.onAuthStateChanged((user) => {
                console.log('Firebase auth state changed:', user ? 'Authenticated' : 'Unauthenticated');
                this.updateAuthState({
                    user,
                    isAuthenticated: user !== null,
                    isSessionValid: user !== null,
                    isInitialized: true,
                    isLoading: false
                });
            });
        }
        catch (error) {
            console.error('Error setting up Firebase auth state listener:', error);
        }
    }
    async refreshSession() {
        // Implementation would use refresh token use case
        throw new Error('Not implemented yet');
    }
    async validateSession() {
        return this.currentAuthState.isSessionValid;
    }
    async requestPasswordReset(request) {
        // Implementation would use password reset use case
        throw new Error('Not implemented yet');
    }
    async changePassword(request) {
        // Implementation would use change password use case
        throw new Error('Not implemented yet');
    }
    async sendEmailVerification() {
        // Implementation would use email verification use case
        throw new Error('Not implemented yet');
    }
    async verifyEmail(token) {
        // Implementation would use email verification use case
        throw new Error('Not implemented yet');
    }
    async updateProfile(userData) {
        // Implementation would use update profile use case
        throw new Error('Not implemented yet');
    }
    async deleteAccount(password) {
        // Implementation would use delete account use case
        throw new Error('Not implemented yet');
    }
    async linkProvider(provider, credentials) {
        // Implementation would use link provider use case
        throw new Error('Not implemented yet');
    }
    async unlinkProvider(provider) {
        // Implementation would use unlink provider use case
        throw new Error('Not implemented yet');
    }
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        // Immediately call with current state
        callback(this.currentAuthState);
        return () => {
            const index = this.authStateListeners.indexOf(callback);
            if (index > -1) {
                this.authStateListeners.splice(index, 1);
            }
        };
    }
    onAuthError(callback) {
        this.errorListeners.push(callback);
        return () => {
            const index = this.errorListeners.indexOf(callback);
            if (index > -1) {
                this.errorListeners.splice(index, 1);
            }
        };
    }
    isAuthenticated() {
        return this.currentAuthState.isAuthenticated;
    }
    getCurrentUser() {
        return this.currentAuthState.user;
    }
    isEmailVerified() {
        return this.currentAuthState.user?.emailVerified || false;
    }
    getUserPermissions() {
        // Implementation would extract permissions from user claims
        return [];
    }
    hasPermission(permission) {
        const permissions = this.getUserPermissions();
        return permissions.includes(permission);
    }
    updateAuthState(updates) {
        this.currentAuthState = {
            ...this.currentAuthState,
            ...updates,
            lastChecked: new Date()
        };
        // Update isAuthenticated based on user presence
        if (updates.user !== undefined) {
            this.currentAuthState.isAuthenticated = updates.user !== null;
        }
        this.notifyAuthStateListeners(this.currentAuthState);
    }
    notifyAuthStateListeners(state) {
        this.authStateListeners.forEach(callback => {
            try {
                callback(state);
            }
            catch (error) {
                console.error('Error in auth state listener:', error);
            }
        });
    }
    notifyErrorListeners(error) {
        this.errorListeners.forEach(callback => {
            try {
                callback(error);
            }
            catch (listenerError) {
                console.error('Error in error listener:', listenerError);
            }
        });
    }
    /**
     * Cleanup method to unsubscribe from Firebase auth state changes
     * Should be called when the service is no longer needed
     */
    cleanup() {
        if (this.firebaseUnsubscribe) {
            this.firebaseUnsubscribe();
            this.firebaseUnsubscribe = undefined;
        }
    }
}

/**
 * Dependency Injection Container - Manages all dependencies for the auth module
 */
// Use cases
class DIContainer {
    constructor() {
        this.dependencies = new Map();
        this.config = null;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DIContainer();
        }
        return this.instance;
    }
    initialize(config) {
        this.config = config;
        this.setupDependencies();
    }
    setupDependencies() {
        if (!this.config) {
            throw new Error('Configuration not provided');
        }
        // Initialize Firebase
        FirebaseConfigService.initialize(this.config.firebase, this.config.environment === 'development');
        // Register infrastructure services
        this.register('ValidationService', new ValidationServiceImpl());
        this.register('StorageRepository', new LocalStorageService(this.config.storage.prefix, this.config.storage.secure));
        this.register('FirebaseAuthService', new FirebaseAuthService());
        // Register repository adapters
        this.register('AuthRepository', new AuthRepositoryAdapter(this.resolve('FirebaseAuthService')));
        // Register use cases
        this.register('LoginUseCase', new LoginUseCase(this.resolve('AuthRepository'), this.resolve('ValidationService'), this.resolve('StorageRepository')));
        this.register('RegisterUseCase', new RegisterUseCase(this.resolve('AuthRepository'), this.resolve('ValidationService'), this.resolve('StorageRepository')));
        this.register('GoogleLoginUseCase', new GoogleLoginUseCase(this.resolve('AuthRepository'), this.resolve('StorageRepository')));
        this.register('SMSLoginUseCase', new SMSLoginUseCase(this.resolve('AuthRepository'), this.resolve('ValidationService'), this.resolve('StorageRepository')));
        this.register('LogoutUseCase', new LogoutUseCase(this.resolve('AuthRepository'), this.resolve('StorageRepository')));
        // Register service adapters
        this.register('AuthService', new AuthServiceAdapter(this.resolve('LoginUseCase'), this.resolve('RegisterUseCase'), this.resolve('GoogleLoginUseCase'), this.resolve('SMSLoginUseCase'), this.resolve('LogoutUseCase'), this.resolve('AuthRepository')));
    }
    register(key, instance) {
        this.dependencies.set(key, instance);
    }
    resolve(key) {
        const dependency = this.dependencies.get(key);
        if (!dependency) {
            throw new Error(`Dependency '${key}' not found`);
        }
        return dependency;
    }
    // Convenience methods for common dependencies
    getAuthService() {
        return this.resolve('AuthService');
    }
    getAuthRepository() {
        return this.resolve('AuthRepository');
    }
    getStorageRepository() {
        return this.resolve('StorageRepository');
    }
    getValidationService() {
        return this.resolve('ValidationService');
    }
    getLoginUseCase() {
        return this.resolve('LoginUseCase');
    }
    getRegisterUseCase() {
        return this.resolve('RegisterUseCase');
    }
    getGoogleLoginUseCase() {
        return this.resolve('GoogleLoginUseCase');
    }
    getSMSLoginUseCase() {
        return this.resolve('SMSLoginUseCase');
    }
    getLogoutUseCase() {
        return this.resolve('LogoutUseCase');
    }
    // Cleanup method
    destroy() {
        FirebaseConfigService.destroy();
        this.dependencies.clear();
        this.config = null;
        DIContainer.instance = null;
    }
    // Get current configuration
    getConfig() {
        return this.config;
    }
    // Check if container is initialized
    isInitialized() {
        return this.config !== null && this.dependencies.size > 0;
    }
}
DIContainer.instance = null;

const AuthContext = react.createContext(null);
const AuthProvider = ({ config, children, onAuthStateChange, onError }) => {
    const [authState, setAuthState] = react.useState({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
        isInitialized: false,
        isSessionValid: false
    });
    const [authService, setAuthService] = react.useState(null);
    // Initialize the auth module
    react.useEffect(() => {
        let cleanup;
        const initializeAuth = async () => {
            try {
                // Initialize DI container
                const container = DIContainer.getInstance();
                container.initialize(config);
                const service = container.getAuthService();
                setAuthService(service);
                // Get initial auth state first
                const initialState = await service.getCurrentAuthState();
                setAuthState({ ...initialState, isInitialized: true });
                // Call onAuthStateChange with initial state
                onAuthStateChange?.({ ...initialState, isInitialized: true });
                // Subscribe to auth state changes
                const unsubscribe = service.onAuthStateChange((state) => {
                    console.log('AuthProvider received state change:', state.isAuthenticated ? 'Authenticated' : 'Not authenticated');
                    setAuthState(state);
                    onAuthStateChange?.(state);
                });
                // Subscribe to auth errors
                const unsubscribeError = service.onAuthError((error) => {
                    setAuthState(prev => ({ ...prev, error }));
                    onError?.(error);
                });
                cleanup = () => {
                    unsubscribe();
                    unsubscribeError();
                };
            }
            catch (error) {
                console.error('Failed to initialize auth:', error);
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    isInitialized: true,
                    error: error
                }));
            }
        };
        initializeAuth();
        return () => {
            cleanup?.();
        };
    }, [config, onAuthStateChange, onError]);
    // Auth actions
    const login = async (email, password, rememberMe = false) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.login({ email, password, rememberMe });
    };
    const loginWithGoogle = async () => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.loginWithGoogle();
    };
    const initiateSMSLogin = async (phoneNumber, countryCode) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.initiateSMSLogin({ phoneNumber, countryCode });
    };
    const completeSMSLogin = async (verificationId, code) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.completeSMSLogin({ verificationId, code });
    };
    const register = async (data) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.register(data);
    };
    const logout = async () => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.logout();
    };
    const refreshSession = async () => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.refreshSession();
    };
    const sendPasswordReset = async (email) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.requestPasswordReset({ email });
    };
    const sendEmailVerification = async () => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.sendEmailVerification();
    };
    const updateProfile = async (data) => {
        if (!authService)
            throw new Error('Auth service not initialized');
        return authService.updateProfile(data);
    };
    const hasPermission = (permission) => {
        if (!authService)
            return false;
        return authService.hasPermission(permission);
    };
    const getUserPermissions = () => {
        if (!authService)
            return [];
        return authService.getUserPermissions();
    };
    const contextValue = {
        // State
        user: authState.user,
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
        error: authState.error,
        isInitialized: authState.isInitialized,
        // Actions
        login,
        loginWithGoogle,
        initiateSMSLogin,
        completeSMSLogin,
        register,
        logout,
        // Utility methods
        refreshSession,
        sendPasswordReset,
        sendEmailVerification,
        updateProfile,
        // Permission methods
        hasPermission,
        getUserPermissions
    };
    return (jsxRuntime.jsx(AuthContext.Provider, { value: contextValue, children: children }));
};
const useAuth = () => {
    const context = react.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// Alias for backward compatibility
const useAuthContext = useAuth;

/**
 * useAuthState Hook - Hook for auth state only (no actions)
 */
const useAuthState = () => {
    const { user, isLoading, isAuthenticated, error, isInitialized } = useAuth();
    return {
        user,
        isLoading,
        isAuthenticated,
        error,
        isInitialized
    };
};

const AuthGuard = ({ children, requireAuth = true, requireEmailVerification = false, requiredPermissions = [], fallback, loadingComponent, unauthorizedComponent, redirectTo, onUnauthorized }) => {
    const { user, isLoading, isAuthenticated, isInitialized } = useAuthState();
    // Show loading while initializing
    if (!isInitialized || isLoading) {
        if (loadingComponent) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: loadingComponent });
        }
        return (jsxRuntime.jsxs("div", { className: "auth-guard-loading flex items-center justify-center min-h-screen", children: [jsxRuntime.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), jsxRuntime.jsx("span", { className: "ml-2 text-gray-600", children: "Loading..." })] }));
    }
    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
        if (redirectTo && typeof window !== 'undefined') {
            window.location.href = redirectTo;
            return null;
        }
        if (onUnauthorized) {
            onUnauthorized();
        }
        if (unauthorizedComponent) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: unauthorizedComponent });
        }
        if (fallback) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: fallback });
        }
        return (jsxRuntime.jsx("div", { className: "auth-guard-unauthorized flex items-center justify-center min-h-screen", children: jsxRuntime.jsxs("div", { className: "text-center", children: [jsxRuntime.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Authentication Required" }), jsxRuntime.jsx("p", { className: "text-gray-600", children: "Please sign in to access this page." })] }) }));
    }
    // Check email verification requirement
    if (requireEmailVerification && user && !user.emailVerified) {
        if (unauthorizedComponent) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: unauthorizedComponent });
        }
        if (fallback) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: fallback });
        }
        return (jsxRuntime.jsx("div", { className: "auth-guard-email-verification flex items-center justify-center min-h-screen", children: jsxRuntime.jsxs("div", { className: "text-center max-w-md mx-auto px-4", children: [jsxRuntime.jsx("div", { className: "mb-4", children: jsxRuntime.jsx("svg", { className: "h-12 w-12 text-yellow-500 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), jsxRuntime.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Email Verification Required" }), jsxRuntime.jsx("p", { className: "text-gray-600 mb-4", children: "Please verify your email address to access this page. Check your inbox for a verification link." }), jsxRuntime.jsx("button", { onClick: () => {
                            // This would trigger email verification resend
                            // Implementation depends on how you want to handle this
                        }, className: "text-blue-600 hover:text-blue-500 text-sm font-medium", children: "Resend verification email" })] }) }));
    }
    // Check permission requirements
    if (requiredPermissions.length > 0 && user) {
        // This is a simplified permission check
        // In a real implementation, you'd check user.customClaims or call a permission service
        const userPermissions = user.customClaims?.permissions || [];
        const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            if (onUnauthorized) {
                onUnauthorized();
            }
            if (unauthorizedComponent) {
                return jsxRuntime.jsx(jsxRuntime.Fragment, { children: unauthorizedComponent });
            }
            if (fallback) {
                return jsxRuntime.jsx(jsxRuntime.Fragment, { children: fallback });
            }
            return (jsxRuntime.jsx("div", { className: "auth-guard-insufficient-permissions flex items-center justify-center min-h-screen", children: jsxRuntime.jsxs("div", { className: "text-center", children: [jsxRuntime.jsx("div", { className: "mb-4", children: jsxRuntime.jsx("svg", { className: "h-12 w-12 text-red-500 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), jsxRuntime.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Insufficient Permissions" }), jsxRuntime.jsx("p", { className: "text-gray-600", children: "You don't have the required permissions to access this page." })] }) }));
        }
    }
    // All checks passed, render children
    return jsxRuntime.jsx(jsxRuntime.Fragment, { children: children });
};
// Convenience components for common use cases
const ProtectedRoute = ({ children, fallback }) => (jsxRuntime.jsx(AuthGuard, { requireAuth: true, fallback: fallback, children: children }));
const PublicRoute = ({ children }) => (jsxRuntime.jsx(AuthGuard, { requireAuth: false, children: children }));
const VerifiedRoute = ({ children, fallback }) => (jsxRuntime.jsx(AuthGuard, { requireAuth: true, requireEmailVerification: true, fallback: fallback, children: children }));

const ForgotPasswordForm = ({ onSuccess, onError, onCancel, className = '', disabled = false, showBackToLogin = true }) => {
    const { sendPasswordReset, isLoading } = useAuth();
    const [email, setEmail] = react.useState('');
    const [errors, setErrors] = react.useState({});
    const [isSubmitting, setIsSubmitting] = react.useState(false);
    const [isEmailSent, setIsEmailSent] = react.useState(false);
    const validateEmail = (email) => {
        if (!email.trim()) {
            setErrors({ email: 'Email is required' });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return false;
        }
        return true;
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        // Clear error when user starts typing
        if (errors.email) {
            setErrors({});
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email) || isSubmitting || disabled) {
            return;
        }
        setIsSubmitting(true);
        setErrors({});
        try {
            await sendPasswordReset(email);
            setIsEmailSent(true);
            onSuccess?.(email);
        }
        catch (error) {
            const authError = error;
            onError?.(authError);
            setErrors({ general: authError.message });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleTryAgain = () => {
        setIsEmailSent(false);
        setEmail('');
        setErrors({});
    };
    const isFormDisabled = isLoading || isSubmitting || disabled;
    if (isEmailSent) {
        return (jsxRuntime.jsx("div", { className: `forgot-password-form ${className}`, children: jsxRuntime.jsxs("div", { className: "text-center space-y-4", children: [jsxRuntime.jsx("div", { className: "w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center", children: jsxRuntime.jsx("svg", { className: "w-8 h-8 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: jsxRuntime.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Email Sent Successfully" }), jsxRuntime.jsxs("p", { className: "text-sm text-gray-600 mb-4", children: ["We've sent a password reset link to ", jsxRuntime.jsx("strong", { children: email }), ". Please check your inbox and follow the instructions to reset your password."] }), jsxRuntime.jsx("p", { className: "text-xs text-gray-500", children: "Didn't receive the email? Check your spam folder or try again." })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx("button", { type: "button", onClick: handleTryAgain, className: "w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: "Send Another Email" }), showBackToLogin && (jsxRuntime.jsx("button", { type: "button", onClick: onCancel, className: "w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2", children: "Back to Login" }))] })] }) }));
    }
    return (jsxRuntime.jsx("div", { className: `forgot-password-form ${className}`, children: jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), jsxRuntime.jsx("input", { type: "email", id: "email", name: "email", value: email, onChange: handleInputChange, disabled: isFormDisabled, className: `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`, placeholder: "Enter your email address", autoComplete: "email", autoFocus: true }), errors.email && (jsxRuntime.jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.email }))] }), errors.general && (jsxRuntime.jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded-md", children: jsxRuntime.jsx("p", { className: "text-sm text-red-600", children: errors.general }) })), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx("button", { type: "submit", disabled: isFormDisabled, className: `w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isFormDisabled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}`, children: isSubmitting ? (jsxRuntime.jsxs("span", { className: "flex items-center justify-center", children: [jsxRuntime.jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [jsxRuntime.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), jsxRuntime.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Sending..."] })) : ('Send Reset Email') }), showBackToLogin && (jsxRuntime.jsx("button", { type: "button", onClick: onCancel, disabled: isFormDisabled, className: "w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: "Back to Login" }))] })] }) }));
};

const LoginForm = ({ onSuccess, onError, showRememberMe = true, showGoogleLogin = true, showSMSLogin = false, className = '', disabled = false }) => {
    const { login, loginWithGoogle, isLoading } = useAuth();
    const [formData, setFormData] = react.useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = react.useState({});
    const [isSubmitting, setIsSubmitting] = react.useState(false);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || isSubmitting || disabled) {
            return;
        }
        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password, formData.rememberMe);
            onSuccess?.();
        }
        catch (error) {
            const authError = error;
            onError?.(authError);
            setErrors({ general: authError.message });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleGoogleLogin = async () => {
        if (isSubmitting || disabled)
            return;
        setIsSubmitting(true);
        try {
            await loginWithGoogle();
            onSuccess?.();
        }
        catch (error) {
            const authError = error;
            onError?.(authError);
            setErrors({ general: authError.message });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const isFormDisabled = isLoading || isSubmitting || disabled;
    return (jsxRuntime.jsxs("div", { className: `auth-login-form ${className}`, children: [jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.general && (jsxRuntime.jsx("div", { className: "auth-error-message text-red-600 text-sm", children: errors.general })), jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }), jsxRuntime.jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your email" }), errors.email && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email }))] }), jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), jsxRuntime.jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your password" }), errors.password && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password }))] }), showRememberMe && (jsxRuntime.jsx("div", { className: "form-group", children: jsxRuntime.jsxs("label", { className: "flex items-center", children: [jsxRuntime.jsx("input", { type: "checkbox", name: "rememberMe", checked: formData.rememberMe, onChange: handleInputChange, disabled: isFormDisabled, className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), jsxRuntime.jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Remember me" })] }) })), jsxRuntime.jsx("button", { type: "submit", disabled: isFormDisabled, className: `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isFormDisabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`, children: isSubmitting ? 'Signing in...' : 'Sign in' })] }), showGoogleLogin && (jsxRuntime.jsxs("div", { className: "mt-4", children: [jsxRuntime.jsxs("div", { className: "relative", children: [jsxRuntime.jsx("div", { className: "absolute inset-0 flex items-center", children: jsxRuntime.jsx("div", { className: "w-full border-t border-gray-300" }) }), jsxRuntime.jsx("div", { className: "relative flex justify-center text-sm", children: jsxRuntime.jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })] }), jsxRuntime.jsxs("button", { type: "button", onClick: handleGoogleLogin, disabled: isFormDisabled, className: `mt-3 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${isFormDisabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`, children: [jsxRuntime.jsxs("svg", { className: "w-5 h-5 mr-2", viewBox: "0 0 24 24", children: [jsxRuntime.jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), jsxRuntime.jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), jsxRuntime.jsx("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), jsxRuntime.jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Continue with Google"] })] }))] }));
};

const RegisterForm = ({ onSuccess, onError, showDisplayName = true, showPhoneNumber = false, requireTermsAcceptance = true, className = '', disabled = false }) => {
    const { register, isLoading } = useAuth();
    const [formData, setFormData] = react.useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        phoneNumber: '',
        acceptTerms: false
    });
    const [errors, setErrors] = react.useState({});
    const [isSubmitting, setIsSubmitting] = react.useState(false);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }
        else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        // Display name validation
        if (showDisplayName && !formData.displayName) {
            newErrors.displayName = 'Display name is required';
        }
        else if (formData.displayName && formData.displayName.length < 2) {
            newErrors.displayName = 'Display name must be at least 2 characters';
        }
        // Phone number validation
        if (showPhoneNumber && formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }
        // Terms acceptance validation
        if (requireTermsAcceptance && !formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || isSubmitting || disabled) {
            return;
        }
        setIsSubmitting(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                displayName: formData.displayName || undefined,
                phoneNumber: formData.phoneNumber || undefined,
                acceptTerms: formData.acceptTerms
            });
            onSuccess?.();
        }
        catch (error) {
            const authError = error;
            onError?.(authError);
            setErrors({ general: authError.message });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const isFormDisabled = isLoading || isSubmitting || disabled;
    return (jsxRuntime.jsx("div", { className: `auth-register-form ${className}`, children: jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.general && (jsxRuntime.jsx("div", { className: "auth-error-message text-red-600 text-sm", children: errors.general })), jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email *" }), jsxRuntime.jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your email" }), errors.email && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email }))] }), showDisplayName && (jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsxs("label", { htmlFor: "displayName", className: "block text-sm font-medium text-gray-700", children: ["Display Name ", showDisplayName ? '*' : ''] }), jsxRuntime.jsx("input", { type: "text", id: "displayName", name: "displayName", value: formData.displayName, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.displayName ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your display name" }), errors.displayName && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.displayName }))] })), showPhoneNumber && (jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "phoneNumber", className: "block text-sm font-medium text-gray-700", children: "Phone Number" }), jsxRuntime.jsx("input", { type: "tel", id: "phoneNumber", name: "phoneNumber", value: formData.phoneNumber, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your phone number" }), errors.phoneNumber && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phoneNumber }))] })), jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password *" }), jsxRuntime.jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Enter your password" }), errors.password && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password })), jsxRuntime.jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Password must be at least 8 characters with uppercase, lowercase, and number" })] }), jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password *" }), jsxRuntime.jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", value: formData.confirmPassword, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`, placeholder: "Confirm your password" }), errors.confirmPassword && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword }))] }), requireTermsAcceptance && (jsxRuntime.jsxs("div", { className: "form-group", children: [jsxRuntime.jsxs("label", { className: "flex items-start", children: [jsxRuntime.jsx("input", { type: "checkbox", name: "acceptTerms", checked: formData.acceptTerms, onChange: handleInputChange, disabled: isFormDisabled, className: `mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.acceptTerms ? 'border-red-500' : ''}` }), jsxRuntime.jsxs("span", { className: "ml-2 text-sm text-gray-700", children: ["I accept the", ' ', jsxRuntime.jsx("a", { href: "/terms", className: "text-blue-600 hover:text-blue-500", target: "_blank", rel: "noopener noreferrer", children: "Terms and Conditions" }), ' ', "and", ' ', jsxRuntime.jsx("a", { href: "/privacy", className: "text-blue-600 hover:text-blue-500", target: "_blank", rel: "noopener noreferrer", children: "Privacy Policy" })] })] }), errors.acceptTerms && (jsxRuntime.jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.acceptTerms }))] })), jsxRuntime.jsx("button", { type: "submit", disabled: isFormDisabled, className: `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isFormDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`, children: isSubmitting ? 'Creating account...' : 'Create account' })] }) }));
};

/**
 * useAuthActions Hook - Hook for auth actions only (no state)
 */
const useAuthActions = () => {
    const { login, loginWithGoogle, initiateSMSLogin, completeSMSLogin, register, logout, refreshSession, sendPasswordReset, sendEmailVerification, updateProfile, hasPermission, getUserPermissions } = useAuth();
    return {
        login,
        loginWithGoogle,
        initiateSMSLogin,
        completeSMSLogin,
        register,
        logout,
        refreshSession,
        sendPasswordReset,
        sendEmailVerification,
        updateProfile,
        hasPermission,
        getUserPermissions
    };
};

exports.AuthConfigValidator = AuthConfigValidator;
exports.AuthErrorFactory = AuthErrorFactory;
exports.AuthGuard = AuthGuard;
exports.AuthProvider = AuthProvider;
exports.DIContainer = DIContainer;
exports.FirebaseConfigService = FirebaseConfigService;
exports.ForgotPasswordForm = ForgotPasswordForm;
exports.GoogleLoginUseCase = GoogleLoginUseCase;
exports.LocalStorageService = LocalStorageService;
exports.LoginForm = LoginForm;
exports.LoginUseCase = LoginUseCase;
exports.LogoutUseCase = LogoutUseCase;
exports.ProtectedRoute = ProtectedRoute;
exports.PublicRoute = PublicRoute;
exports.RegisterForm = RegisterForm;
exports.RegisterUseCase = RegisterUseCase;
exports.SMSLoginUseCase = SMSLoginUseCase;
exports.ValidationServiceImpl = ValidationServiceImpl;
exports.VerifiedRoute = VerifiedRoute;
exports.useAuth = useAuth;
exports.useAuthActions = useAuthActions;
exports.useAuthContext = useAuthContext;
exports.useAuthState = useAuthState;
//# sourceMappingURL=index.js.map
