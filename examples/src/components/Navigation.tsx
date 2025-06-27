import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@inspireui/reactore-auth'

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="content-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              ReactCore Auth
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trang chủ
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/profile') 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hồ sơ
                </Link>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Xin chào, {user?.displayName || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="btn-outline text-sm"
                  >
                    {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/login') 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`text-sm font-medium ${
                      isActive('/profile') ? 'text-primary-600' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      {user?.displayName || user?.email}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      disabled={isLoading}
                      className="btn-outline text-sm w-full"
                    >
                      {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium ${
                      isActive('/login') ? 'text-primary-600' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
