import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl">🔍</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Trang không tìm thấy
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div className="space-x-4">
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-outline"
          >
            Quay lại
          </button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với chúng tôi.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
