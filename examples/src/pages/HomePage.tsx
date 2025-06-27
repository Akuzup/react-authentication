import { useAuth } from '@inspireui/reactore-auth'
import React from 'react'
import { Link } from 'react-router-dom'
import DemoSection from '../components/DemoSection'

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với ReactCore Auth
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Một module authentication hoàn chỉnh cho React với Firebase backend
        </p>

        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg text-green-600">
              Xin chào, {user?.displayName || user?.email}! 👋
            </p>
            <div className="space-x-4">
              <Link to="/profile" className="btn-primary">
                Xem hồ sơ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="btn-primary">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn-outline">
              Đăng ký ngay
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bảo mật cao
          </h3>
          <p className="text-gray-600">
            Sử dụng Firebase Authentication với các tính năng bảo mật tiên tiến
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Dễ sử dụng
          </h3>
          <p className="text-gray-600">
            API đơn giản, component có sẵn, tích hợp nhanh chóng
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đa phương thức
          </h3>
          <p className="text-gray-600">
            Hỗ trợ email/password, Google, SMS và nhiều phương thức khác
          </p>
        </div>
      </div>

      {/* Demo Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tính năng chính
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔐 Authentication Methods
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Email & Password</li>
              <li>• Google OAuth</li>
              <li>• SMS/Phone Number</li>
              <li>• Facebook (coming soon)</li>
              <li>• Apple (coming soon)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⚛️ React Components
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• LoginForm</li>
              <li>• RegisterForm</li>
              <li>• AuthGuard</li>
              <li>• ProtectedRoute</li>
              <li>• Custom Hooks</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🛡️ Security Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Email verification</li>
              <li>• Password reset</li>
              <li>• Session management</li>
              <li>• Brute force protection</li>
              <li>• Permission system</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎨 Developer Experience
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• TypeScript support</li>
              <li>• Clean Architecture</li>
              <li>• Customizable UI</li>
              <li>• Error handling</li>
              <li>• Event callbacks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Cách sử dụng
        </h2>

        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{`// 1. Wrap your app with AuthProvider
import { AuthProvider } from '@inspireui/reactore-auth'

function App() {
  return (
    <AuthProvider config={authConfig}>
      <YourApp />
    </AuthProvider>
  )
}

// 2. Use authentication in components
import { useAuth } from '@inspireui/reactore-auth'

function LoginComponent() {
  const { login, user, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    await login(email, password)
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user.email}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>

      {/* Demo Section */}
      <DemoSection />
    </div>
  )
}

export default HomePage
