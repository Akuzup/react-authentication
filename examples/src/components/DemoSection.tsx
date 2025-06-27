import React, { useState } from 'react'
import { useAuth } from '@inspireui/reactore-auth'
import { toast } from './Toaster'

const DemoSection: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    loginWithGoogle, 
    register, 
    logout,
    sendPasswordReset,
    sendEmailVerification,
    updateProfile,
    hasPermission,
    getUserPermissions
  } = useAuth()

  const [demoEmail] = useState('demo@example.com')
  const [demoPassword] = useState('demo123456')
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      await login(demoEmail, demoPassword)
      toast.success('Demo login thành công!', 'Đã đăng nhập với tài khoản demo')
    } catch (error: any) {
      toast.error('Demo login thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Google login thành công!', 'Đã đăng nhập với Google')
    } catch (error: any) {
      toast.error('Google login thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoRegister = async () => {
    setIsLoading(true)
    try {
      await register({
        email: `demo${Date.now()}@example.com`,
        password: 'demo123456',
        confirmPassword: 'demo123456',
        displayName: 'Demo User',
        acceptTerms: true
      })
      toast.success('Demo register thành công!', 'Đã tạo tài khoản demo mới')
    } catch (error: any) {
      toast.error('Demo register thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast.success('Đăng xuất thành công!', 'Hẹn gặp lại bạn')
    } catch (error: any) {
      toast.error('Đăng xuất thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setIsLoading(true)
    try {
      await sendPasswordReset(user.email)
      toast.success('Email đặt lại mật khẩu đã được gửi!', 'Kiểm tra hộp thư của bạn')
    } catch (error: any) {
      toast.error('Gửi email thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async () => {
    setIsLoading(true)
    try {
      await sendEmailVerification()
      toast.success('Email xác thực đã được gửi!', 'Kiểm tra hộp thư của bạn')
    } catch (error: any) {
      toast.error('Gửi email thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      await updateProfile({
        displayName: `Updated User ${Date.now()}`,
        phoneNumber: '+84123456789'
      })
      toast.success('Cập nhật profile thành công!', 'Thông tin đã được cập nhật')
    } catch (error: any) {
      toast.error('Cập nhật profile thất bại', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const testPermissions = () => {
    const permissions = getUserPermissions()
    const hasAdminPermission = hasPermission('admin')
    
    toast.info('Permissions Test', 
      `Permissions: ${permissions.join(', ') || 'None'}\nHas admin: ${hasAdminPermission}`
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        🧪 Demo & Test Functions
      </h2>

      <div className="space-y-6">
        {/* Auth Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Auth Status</h3>
          <div className="text-sm space-y-1">
            <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'N/A'}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? '✅' : '❌'}</p>
                <p><strong>Providers:</strong> {user.providers.join(', ')}</p>
              </>
            )}
          </div>
        </div>

        {/* Authentication Actions */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Authentication Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="btn-primary text-sm"
                >
                  Demo Login
                </button>
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="btn-outline text-sm"
                >
                  Google Login
                </button>
                <button
                  onClick={handleDemoRegister}
                  disabled={isLoading}
                  className="btn-secondary text-sm"
                >
                  Demo Register
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="btn-outline text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* User Actions (only when authenticated) */}
        {isAuthenticated && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">User Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="btn-outline text-sm"
              >
                Update Profile
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={isLoading}
                className="btn-outline text-sm"
              >
                Reset Password
              </button>
              {!user?.emailVerified && (
                <button
                  onClick={handleEmailVerification}
                  disabled={isLoading}
                  className="btn-outline text-sm"
                >
                  Verify Email
                </button>
              )}
              <button
                onClick={testPermissions}
                disabled={isLoading}
                className="btn-secondary text-sm"
              >
                Test Permissions
              </button>
            </div>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Demo Credentials</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Email:</strong> {demoEmail}</p>
            <p><strong>Password:</strong> {demoPassword}</p>
            <p className="text-xs text-blue-600 mt-2">
              * Hoặc sử dụng Google Sign-in để test OAuth
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Processing...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DemoSection
