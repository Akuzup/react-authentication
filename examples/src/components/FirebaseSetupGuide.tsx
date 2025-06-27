import React from 'react'

const FirebaseSetupGuide: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-lg font-semibold text-yellow-800">
            Firebase Setup Required
          </h2>
        </div>

        <div className="text-yellow-700 space-y-4">
          <p>
            Để sử dụng authentication, bạn cần setup Firebase Authentication:
          </p>

          <div className="bg-white rounded-md p-4 border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-2">
              🔧 Các bước setup:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Truy cập{' '}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Firebase Console
                </a>
              </li>
              <li>Chọn project: <code className="bg-gray-100 px-1 rounded">fluxstore-serverless</code></li>
              <li>Vào <strong>Authentication</strong> → <strong>Get started</strong></li>
              <li>
                Enable các Sign-in methods:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Email/Password</li>
                  <li>Google (optional)</li>
                </ul>
              </li>
              <li>
                Vào <strong>Settings</strong> → <strong>Authorized domains</strong>
                <br />
                Thêm: <code className="bg-gray-100 px-1 rounded">localhost</code>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              📋 Firebase Config hiện tại:
            </h3>
            <div className="text-xs font-mono bg-white p-2 rounded border overflow-x-auto">
              <div>Project ID: <span className="text-green-600">fluxstore-serverless</span></div>
              <div>Auth Domain: <span className="text-green-600">fluxstore-serverless.firebaseapp.com</span></div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              🔄 Thử lại
            </button>
            <a
              href="https://console.firebase.google.com/project/fluxstore-serverless/authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm"
            >
              🚀 Mở Firebase Console
            </a>
            <button
              onClick={() => {
                // Bypass Firebase error for demo
                localStorage.setItem('bypass_firebase_error', 'true')
                window.location.reload()
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              🔧 Demo Mode (Bypass)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirebaseSetupGuide
