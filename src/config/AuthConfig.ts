/**
 * AuthConfig - Configuration interface for the authentication module
 * This defines all configurable options for the authentication system
 */

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
  measurementId?: string
}

export interface GoogleProviderConfig {
  enabled: boolean
  clientId?: string
  scopes?: string[]
  customParameters?: Record<string, string>
}

export interface SMSProviderConfig {
  enabled: boolean
  testNumbers?: Record<string, string>
  timeout?: number
  codeLength?: number
  allowedCountries?: string[]
  blockedCountries?: string[]
}

export interface EmailPasswordProviderConfig {
  enabled: boolean
  requireEmailVerification: boolean
  allowPasswordReset: boolean
  passwordRequirements?: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  }
}

export interface ProvidersConfig {
  google: GoogleProviderConfig
  sms: SMSProviderConfig
  emailPassword: EmailPasswordProviderConfig
}

export interface StorageConfig {
  tokenKey: string
  userKey: string
  refreshTokenKey: string
  sessionKey: string
  prefix?: string
  secure?: boolean
  expiration?: number
}

export interface RedirectConfig {
  afterLogin: string
  afterLogout: string
  afterRegister: string
  afterEmailVerification?: string
  afterPasswordReset?: string
}

export interface SecurityConfig {
  sessionTimeout?: number
  tokenRefreshThreshold?: number
  maxLoginAttempts?: number
  lockoutDuration?: number
  requireSecureContext?: boolean
}

export interface UIConfig {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  customStyles?: Record<string, any>
  showProviderIcons?: boolean
  allowRememberMe?: boolean
}

export interface AuthConfig {
  /** Firebase configuration */
  firebase: FirebaseConfig
  
  /** Authentication providers configuration */
  providers: ProvidersConfig
  
  /** Local storage configuration */
  storage: StorageConfig
  
  /** Redirect URLs configuration */
  redirectUrls: RedirectConfig
  
  /** Security settings */
  security?: SecurityConfig
  
  /** UI customization */
  ui?: UIConfig
  
  /** Debug mode */
  debug?: boolean
  
  /** Environment */
  environment?: 'development' | 'staging' | 'production'
  
  /** Custom error messages */
  errorMessages?: Record<string, string>
  
  /** Event callbacks */
  callbacks?: {
    onLogin?: (user: any) => void
    onLogout?: () => void
    onRegister?: (user: any) => void
    onError?: (error: any) => void
  }
}

export interface AuthConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class AuthConfigValidator {
  static validate(config: AuthConfig): AuthConfigValidation {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate Firebase config
    if (!config.firebase) {
      errors.push('Firebase configuration is required')
    } else {
      if (!config.firebase.apiKey) {
        errors.push('Firebase API key is required')
      }
      if (!config.firebase.authDomain) {
        errors.push('Firebase auth domain is required')
      }
      if (!config.firebase.projectId) {
        errors.push('Firebase project ID is required')
      }
    }

    // Validate providers
    if (!config.providers) {
      errors.push('Providers configuration is required')
    } else {
      const enabledProviders = Object.values(config.providers).filter(p => p.enabled)
      if (enabledProviders.length === 0) {
        errors.push('At least one authentication provider must be enabled')
      }

      // Validate Google provider
      if (config.providers.google.enabled && !config.providers.google.clientId) {
        warnings.push('Google client ID is recommended for Google authentication')
      }

      // Validate SMS provider
      if (config.providers.sms.enabled) {
        if (config.providers.sms.timeout && config.providers.sms.timeout < 30) {
          warnings.push('SMS timeout should be at least 30 seconds')
        }
      }
    }

    // Validate storage config
    if (!config.storage) {
      errors.push('Storage configuration is required')
    } else {
      if (!config.storage.tokenKey) {
        errors.push('Storage token key is required')
      }
      if (!config.storage.userKey) {
        errors.push('Storage user key is required')
      }
    }

    // Validate redirect URLs
    if (!config.redirectUrls) {
      errors.push('Redirect URLs configuration is required')
    } else {
      if (!config.redirectUrls.afterLogin) {
        errors.push('After login redirect URL is required')
      }
      if (!config.redirectUrls.afterLogout) {
        errors.push('After logout redirect URL is required')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  static createDefaultConfig(): Partial<AuthConfig> {
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
    }
  }
}
