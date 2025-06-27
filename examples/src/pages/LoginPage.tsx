import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginForm, useAuth } from '@inspireui/reactore-auth'
import { toast } from '../components/Toaster'

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLoginSuccess = () => {
    toast.success('Đăng nhập thành công!', 'Chào mừng bạn quay trở lại')
    navigate('/')
  }

  const handleLoginError = (error: any) => {
    toast.error('Đăng nhập thất bại', error.message)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-gray-600">
            Hoặc{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              tạo tài khoản mới
            </Link>
          </p>
        </div>

        <div className="card">
          <LoginForm
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            showRememberMe={true}
            showGoogleLogin={true}
            showSMSLogin={false}
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Quên mật khẩu?{' '}
            <button className="font-medium text-primary-600 hover:text-primary-500">
              Đặt lại mật khẩu
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            🧪 Demo Credentials
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> demo123456</p>
            <p className="text-xs text-blue-600 mt-2">
              * Hoặc sử dụng Google Sign-in để test
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
