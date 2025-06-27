import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@inspireui/reactore-auth'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'
import LoadingSpinner from '../components/LoadingSpinner'

const AppRouter: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/profile" 
          element={
            <AuthGuard 
              requireAuth={true}
              loadingComponent={<LoadingSpinner />}
              fallback={<LoginPage />}
            >
              <ProfilePage />
            </AuthGuard>
          } 
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default AppRouter
