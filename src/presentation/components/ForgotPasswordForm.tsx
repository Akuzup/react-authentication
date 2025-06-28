/**
 * ForgotPasswordForm Component - Reusable forgot password form component
 */

import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthError } from '../../core/entities/AuthError'

export interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void
  onError?: (error: AuthError) => void
  onCancel?: () => void
  className?: string
  disabled?: boolean
  showBackToLogin?: boolean
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onError,
  onCancel,
  className = '',
  disabled = false,
  showBackToLogin = true
}) => {
  const { sendPasswordReset, isLoading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return false
    }
    
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email) || isSubmitting || disabled) {
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      await sendPasswordReset(email)
      setIsEmailSent(true)
      onSuccess?.(email)
    } catch (error) {
      const authError = error as AuthError
      onError?.(authError)
      setErrors({ general: authError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTryAgain = () => {
    setIsEmailSent(false)
    setEmail('')
    setErrors({})
  }

  const isFormDisabled = isLoading || isSubmitting || disabled

  if (isEmailSent) {
    return (
      <div className={`forgot-password-form ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email Sent Successfully
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleTryAgain}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Another Email
            </button>
            
            {showBackToLogin && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`forgot-password-form ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            } ${isFormDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your email address"
            autoComplete="email"
            autoFocus
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isFormDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Email'
            )}
          </button>

          {showBackToLogin && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isFormDisabled}
              className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back to Login
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
