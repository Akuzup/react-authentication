import { useAuth } from '@inspireui/reactore-auth'
import React, { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from '../components/Toaster'

const ProfilePage: React.FC = () => {
  const {
    user,
    updateProfile,
    sendEmailVerification,
    sendPasswordReset,
    isLoading
  } = useAuth()

  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || ''
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateProfile(formData)
      toast.success('Cập nhật thành công!', 'Thông tin hồ sơ đã được cập nhật')
      setIsEditMode(false)
    } catch (error: any) {
      toast.error('Cập nhật thất bại', error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendEmailVerification = async () => {
    try {
      await sendEmailVerification()
      toast.success('Email xác thực đã được gửi!', 'Vui lòng kiểm tra hộp thư của bạn')
    } catch (error: any) {
      toast.error('Gửi email thất bại', error.message)
    }
  }

  const handleSendPasswordReset = async () => {
    if (!user?.email) return

    try {
      await sendPasswordReset(user.email)
      toast.success('Email đặt lại mật khẩu đã được gửi!', 'Vui lòng kiểm tra hộp thư của bạn')
    } catch (error: any) {
      toast.error('Gửi email thất bại', error.message)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Đang tải thông tin..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="mt-2 text-gray-600">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Thông tin cá nhân
            </h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="btn-outline text-sm"
            >
              {isEditMode ? 'Hủy' : 'Chỉnh sửa'}
            </button>
          </div>

          {isEditMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="input-field"
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="input-field"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary flex-1"
                >
                  {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xl font-semibold">
                      {user.displayName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.displayName || 'Chưa có tên'}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                  <p className="text-gray-900">{user.phoneNumber || 'Chưa có'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Đăng nhập cuối</p>
                  <p className="text-gray-900">
                    {new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Security */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Bảo mật tài khoản
          </h2>

          <div className="space-y-4">
            {/* Email Verification */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Xác thực email</p>
                <p className="text-sm text-gray-600">
                  {user.emailVerified ? 'Email đã được xác thực' : 'Email chưa được xác thực'}
                </p>
              </div>
              <div className="flex items-center">
                {user.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Đã xác thực
                  </span>
                ) : (
                  <button
                    onClick={handleSendEmailVerification}
                    className="btn-outline text-sm"
                  >
                    Gửi email xác thực
                  </button>
                )}
              </div>
            </div>

            {/* Password Reset */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mật khẩu</p>
                <p className="text-sm text-gray-600">
                  Đổi mật khẩu để bảo mật tài khoản
                </p>
              </div>
              <button
                onClick={handleSendPasswordReset}
                className="btn-outline text-sm"
              >
                Đặt lại mật khẩu
              </button>
            </div>

            {/* Auth Providers */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-2">Phương thức đăng nhập</p>
              <div className="space-y-2">
                {user.providers.map((provider: any) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {provider === 'email_password' ? 'Email/Password' :
                       provider === 'google' ? 'Google' :
                       provider === 'sms' ? 'SMS' : provider}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Thống kê tài khoản
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {user.providers.length}
            </div>
            <div className="text-sm text-gray-600">Phương thức đăng nhập</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {user.emailVerified ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Email xác thực</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600">Ngày thành viên</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {user.disabled ? 'Bị khóa' : 'Hoạt động'}
            </div>
            <div className="text-sm text-gray-600">Trạng thái</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
