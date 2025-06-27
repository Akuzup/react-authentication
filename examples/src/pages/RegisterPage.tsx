import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm, useAuth } from '@inspireui/reactore-auth'
import { toast } from '../components/Toaster'

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleRegisterSuccess = () => {
    toast.success('Đăng ký thành công!', 'Chào mừng bạn đến với ReactCore Auth')
    navigate('/profile')
  }

  const handleRegisterError = (error: any) => {
    toast.error('Đăng ký thất bại', error.message)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-gray-600">
            Hoặc{' '}
            <Link 
              to="/login" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              đăng nhập với tài khoản có sẵn
            </Link>
          </p>
        </div>

        <div className="card">
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onError={handleRegisterError}
            showDisplayName={true}
            showPhoneNumber={true}
            requireTermsAcceptance={true}
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>

        {/* Registration benefits */}
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-sm font-medium text-green-900 mb-2">
            ✨ Lợi ích khi đăng ký
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Truy cập đầy đủ tính năng</li>
            <li>• Đồng bộ dữ liệu trên nhiều thiết bị</li>
            <li>• Nhận thông báo và cập nhật</li>
            <li>• Hỗ trợ khách hàng ưu tiên</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
