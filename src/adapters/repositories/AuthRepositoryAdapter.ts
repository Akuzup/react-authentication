/**
 * Auth Repository Adapter - Adapts Firebase Auth Service to AuthRepository interface
 */

import { AuthRepository } from '../../core/interfaces/AuthRepository'
import { FirebaseAuthService } from '../../infrastructure/firebase/FirebaseAuthService'

export class AuthRepositoryAdapter implements AuthRepository {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  // Delegate all methods to Firebase Auth Service
  async loginWithEmailPassword(credentials: any) {
    return this.firebaseAuthService.loginWithEmailPassword(credentials)
  }

  async loginWithGoogle() {
    return this.firebaseAuthService.loginWithGoogle()
  }

  async sendSMSVerification(phoneNumber: string) {
    return this.firebaseAuthService.sendSMSVerification(phoneNumber)
  }

  async verifySMSCode(verificationId: string, code: string) {
    return this.firebaseAuthService.verifySMSCode(verificationId, code)
  }

  async register(userData: any) {
    return this.firebaseAuthService.register(userData)
  }

  async logout() {
    return this.firebaseAuthService.logout()
  }

  async getCurrentUser() {
    return this.firebaseAuthService.getCurrentUser()
  }

  async refreshToken() {
    return this.firebaseAuthService.refreshToken()
  }

  async getToken() {
    return this.firebaseAuthService.getToken()
  }

  async validateToken(token: string) {
    return this.firebaseAuthService.validateToken(token)
  }

  async sendPasswordResetEmail(email: string) {
    return this.firebaseAuthService.sendPasswordResetEmail(email)
  }

  async resetPassword(data: any) {
    return this.firebaseAuthService.resetPassword(data)
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.firebaseAuthService.changePassword(currentPassword, newPassword)
  }

  async sendEmailVerification() {
    return this.firebaseAuthService.sendEmailVerification()
  }

  async verifyEmail(token: string) {
    return this.firebaseAuthService.verifyEmail(token)
  }

  async updateProfile(userData: any) {
    return this.firebaseAuthService.updateProfile(userData)
  }

  async deleteAccount() {
    return this.firebaseAuthService.deleteAccount()
  }

  async linkProvider(provider: string, credentials: any) {
    return this.firebaseAuthService.linkProvider(provider, credentials)
  }

  async unlinkProvider(provider: string) {
    return this.firebaseAuthService.unlinkProvider(provider)
  }

  onAuthStateChanged(callback: (user: any) => void) {
    return this.firebaseAuthService.onAuthStateChanged(callback)
  }

  onTokenRefresh(callback: (token: string) => void) {
    return this.firebaseAuthService.onTokenRefresh(callback)
  }

  onAuthError(callback: (error: any) => void) {
    return this.firebaseAuthService.onAuthError(callback)
  }
}
