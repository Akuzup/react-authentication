import { AuthConfig } from '@inspireui/reactore-auth'

// Mock Firebase configuration for testing without real Firebase
const mockFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock123456789",
}

// Mock auth configuration for testing
export const mockAuthConfig: AuthConfig = {
  firebase: mockFirebaseConfig,
  providers: {
    emailPassword: {
      enabled: true,
      requireEmailVerification: false,
      allowPasswordReset: true,
      passwordRequirements: {
        minLength: 6,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSpecialChars: false
      }
    },
    google: {
      enabled: false, // Disable for mock testing
      scopes: ['email', 'profile']
    },
    sms: {
      enabled: false, // Disable for mock testing
      timeout: 60,
      codeLength: 6
    }
  },
  storage: {
    tokenKey: 'mock_auth_token',
    userKey: 'mock_auth_user',
    refreshTokenKey: 'mock_auth_refresh_token',
    sessionKey: 'mock_auth_session',
    prefix: 'mock_'
  },
  redirectUrls: {
    afterLogin: '/',
    afterLogout: '/login',
    afterRegister: '/profile'
  },
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    requireSecureContext: false // Disable for testing
  },
  ui: {
    theme: 'light',
    language: 'vi',
    showProviderIcons: true,
    allowRememberMe: true,
    customStyles: {
      primaryColor: '#3b82f6',
      borderRadius: '8px'
    }
  },
  debug: true, // Enable debug mode
  environment: 'development',
  errorMessages: {
    'auth/user-not-found': 'Không tìm thấy tài khoản với email này.',
    'auth/wrong-password': 'Mật khẩu không chính xác.',
    'auth/email-already-in-use': 'Email này đã được sử dụng.',
    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',
    'auth/invalid-email': 'Email không hợp lệ.',
    'auth/too-many-requests': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
    'auth/network-request-failed': 'Lỗi kết nối mạng. Đang sử dụng chế độ demo.'
  },
  callbacks: {
    onLogin: (user: any) => {
      console.log('Mock: User logged in:', user.email)
    },
    onLogout: () => {
      console.log('Mock: User logged out')
    },
    onRegister: (user: any) => {
      console.log('Mock: User registered:', user.email)
    },
    onError: (error: any) => {
      console.warn('Mock: Auth error:', error)
    }
  }
}
