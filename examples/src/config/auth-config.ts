import { AuthConfig } from '@inspireui/reactore-auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDy****************",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "****************.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "****************",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "****************.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "****************",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "****************",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-****************"
}

console.log('🔥 Firebase config loaded:', firebaseConfig)

// Auth module configuration
export const authConfig: AuthConfig = {
  firebase: firebaseConfig,
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
      enabled: true,
      scopes: ['email', 'profile']
    },
    sms: {
      enabled: true
    }
  },
  storage: {
    tokenKey: 'reactore_auth_token',
    userKey: 'reactore_auth_user',
    refreshTokenKey: 'reactore_refresh_token',
    sessionKey: 'reactore_session',
    prefix: 'reactore_'
  },
  redirectUrls: {
    afterLogin: '/',
    afterLogout: '/login',
    afterRegister: '/profile'
  },
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
  },
  ui: {
    theme: 'light'
  },
  debug: true,
  environment: 'development',
  errorMessages: {
    'auth/user-not-found': 'Không tìm thấy tài khoản với email này.',
    'auth/wrong-password': 'Mật khẩu không chính xác.',
    'auth/email-already-in-use': 'Email này đã được sử dụng.',
    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',
    'auth/invalid-email': 'Email không hợp lệ.',
    'auth/too-many-requests': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  },
  callbacks: {
    onLogin: (user: any) => {
      console.log('User logged in:', user.email)
      // Analytics tracking, notifications, etc.
    },
    onLogout: () => {
      console.log('User logged out')
      // Clear app state, analytics, etc.
    },
    onRegister: (user: any) => {
      console.log('User registered:', user.email)
      // Welcome email, analytics, etc.
    },
    onError: (error: any) => {
      console.error('Auth error:', error)
      // Show user-friendly message for network errors
      if (error.code === 'auth/network-request-failed') {
        console.warn('Firebase connection failed. Please check your internet connection and Firebase configuration.')
      }
    }
  }
}
