import { AuthProvider } from '@inspireui/reactore-auth'
import { useState } from 'react'
import FirebaseSetupGuide from './components/FirebaseSetupGuide'
import { Toaster } from './components/Toaster'
import { authConfig } from './config/auth-config'
import AppRouter from './router/AppRouter'

function App() {
  console.log('🚀 App starting with config:', authConfig)
  console.log('🔧 Firebase config:', authConfig.firebase)

  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false)

  const handleAuthError = (error: any) => {
    console.error('❌ Auth error:', error)
    console.error('❌ Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })

    // Check if bypass mode is enabled
    const bypassMode = localStorage.getItem('bypass_firebase_error')
    if (bypassMode) {
      console.log('🔧 Bypass mode enabled, ignoring Firebase error')
      return
    }

    // Show Firebase setup guide for network errors
    if (error.code === 'auth/network-request-failed' || error.code === 'auth/network-error') {
      console.log('🔥 Network error detected, showing Firebase guide')
      setShowFirebaseGuide(true)
    }
  }

  if (showFirebaseGuide) {
    return (
      <div className="App">
        <FirebaseSetupGuide />
        <Toaster />
      </div>
    )
  }

  return (
    <AuthProvider
      config={authConfig}
      onAuthStateChange={(state: any) => {
        console.log('📊 Auth state changed:', state)
        console.log('📊 User:', state.user)
        console.log('📊 Loading:', state.isLoading)
        console.log('📊 Error:', state.error)
      }}
      onError={handleAuthError}
    >
      <div className="App">
        <AppRouter />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
