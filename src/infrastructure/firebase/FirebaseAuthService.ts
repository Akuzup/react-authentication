/**
 * Firebase Auth Service - Implementation of AuthRepository using Firebase Auth
 */

import {
  EmailAuthProvider,
  User as FirebaseUser,
  GoogleAuthProvider,
  PhoneAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  unlink,
  updatePassword,
  updateProfile
} from 'firebase/auth'

import { AuthError, AuthErrorFactory } from '../../core/entities/AuthError'
import { User } from '../../core/entities/User'
import {
  AuthRepository,
  LoginCredentials,
  PasswordResetData,
  RegisterData,
  SMSVerificationResult
} from '../../core/interfaces/AuthRepository'
import { FirebaseConfigService } from './FirebaseConfig'
import { FirebaseUserMapper } from './FirebaseUserMapper'
import { FirestoreUserRepository } from './FirestoreUserRepository'

export class FirebaseAuthService implements AuthRepository {
  private authStateListeners: ((user: User | null) => void)[] = []
  private tokenRefreshListeners: ((token: string) => void)[] = []
  private errorListeners: ((error: AuthError) => void)[] = []
  private userRepository: FirestoreUserRepository

  constructor() {
    this.userRepository = new FirestoreUserRepository()
    this.setupAuthStateListener()
  }

  async loginWithEmailPassword(credentials: LoginCredentials): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      // Get additional user data from Firestore
      const firestoreData = await this.userRepository.getUserById(userCredential.user.uid)

      return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreData)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const provider = FirebaseConfigService.getGoogleProvider()

      const userCredential: UserCredential = await signInWithPopup(auth, provider)

      // Get additional user data from Firestore
      const firestoreData = await this.userRepository.getUserById(userCredential.user.uid)

      return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreData)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async sendSMSVerification(phoneNumber: string): Promise<SMSVerificationResult> {
    try {
      const auth = FirebaseConfigService.getAuth()

      // Create reCAPTCHA verifier
      const recaptchaVerifier = FirebaseConfigService.getRecaptchaVerifier('recaptcha-container')

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      )

      return {
        verificationId: confirmationResult.verificationId,
        timeout: 60 // 60 seconds timeout
      }
    } catch (error: any) {
      FirebaseConfigService.clearRecaptchaVerifier()
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async verifySMSCode(verificationId: string, code: string): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const credential = PhoneAuthProvider.credential(verificationId, code)
      const userCredential: UserCredential = await signInWithCredential(auth, credential)

      FirebaseConfigService.clearRecaptchaVerifier()
      return FirebaseUserMapper.fromFirebaseUser(userCredential.user)
    } catch (error: any) {
      FirebaseConfigService.clearRecaptchaVerifier()
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )

      // Update profile with additional data
      if (userData.displayName || userData.photoURL) {
        await updateProfile(userCredential.user, {
          displayName: userData.displayName || null,
          photoURL: userData.photoURL || null
        })
      }

      // Create user document in Firestore
      const firestoreUserData = {
        id: userCredential.user.uid,
        Email: userData.email,
        DisplayName: userData.displayName || '',
        FirstName: userData.firstName || '',
        LastName: userData.lastName || '',
        Username: userData.username || '',
        PhoneNumber: userData.phoneNumber || '',
        ProfilePicture: userData.photoURL || '',
        CreatedAt: new Date().toISOString(),
        deviceToken: userData.deviceToken || ''
      }

      await this.userRepository.saveUser(firestoreUserData)

      return FirebaseUserMapper.fromFirebaseUserWithFirestore(userCredential.user, firestoreUserData, userData)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async logout(): Promise<void> {
    try {
      const auth = FirebaseConfigService.getAuth()
      await signOut(auth)
      FirebaseConfigService.clearRecaptchaVerifier()
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const firebaseUser = auth.currentUser

      if (!firebaseUser) {
        return null
      }

      // Get additional user data from Firestore
      const firestoreData = await this.userRepository.getUserById(firebaseUser.uid)

      return FirebaseUserMapper.fromFirebaseUserWithFirestore(firebaseUser, firestoreData)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      const token = await user.getIdToken(true) // Force refresh
      this.notifyTokenRefreshListeners(token)
      return token
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        return null
      }

      return await user.getIdToken()
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Firebase automatically validates tokens
      // We can check if current user exists and token is not expired
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        return false
      }

      const currentToken = await user.getIdToken()
      return currentToken === token
    } catch (error) {
      return false
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const auth = FirebaseConfigService.getAuth()
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async resetPassword(data: PasswordResetData): Promise<void> {
    // Firebase handles password reset via email link
    // This method is for compatibility with the interface
    throw new Error('Password reset with token not supported by Firebase. Use sendPasswordResetEmail instead.')
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user || !user.email) {
        throw new Error('No authenticated user')
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      await sendEmailVerification(user)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async verifyEmail(token: string): Promise<void> {
    // Firebase handles email verification via email link
    // This method is for compatibility with the interface
    throw new Error('Email verification with token not supported by Firebase. Email verification is handled automatically.')
  }

  async updateProfile(userData: any): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      await updateProfile(user, {
        displayName: userData.displayName || user.displayName,
        photoURL: userData.photoURL || user.photoURL
      })

      // Reload user to get updated data
      await user.reload()

      return FirebaseUserMapper.fromFirebaseUser(user)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      await deleteUser(user)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async linkProvider(provider: string, credentials: any): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      let credential
      switch (provider) {
        case 'google':
          credential = GoogleAuthProvider.credential(credentials.idToken, credentials.accessToken)
          break
        case 'phone':
          credential = PhoneAuthProvider.credential(credentials.verificationId, credentials.code)
          break
        default:
          throw new Error(`Unsupported provider: ${provider}`)
      }

      const userCredential = await linkWithCredential(user, credential)
      return FirebaseUserMapper.fromFirebaseUser(userCredential.user)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  async unlinkProvider(provider: string): Promise<User> {
    try {
      const auth = FirebaseConfigService.getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('No authenticated user')
      }

      const updatedUser = await unlink(user, provider)
      return FirebaseUserMapper.fromFirebaseUser(updatedUser)
    } catch (error: any) {
      const authError = AuthErrorFactory.fromFirebaseError(error)
      this.notifyErrorListeners(authError)
      throw authError
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback)

    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
    }
  }

  onTokenRefresh(callback: (token: string) => void): () => void {
    this.tokenRefreshListeners.push(callback)

    return () => {
      const index = this.tokenRefreshListeners.indexOf(callback)
      if (index > -1) {
        this.tokenRefreshListeners.splice(index, 1)
      }
    }
  }

  onAuthError(callback: (error: AuthError) => void): () => void {
    this.errorListeners.push(callback)

    return () => {
      const index = this.errorListeners.indexOf(callback)
      if (index > -1) {
        this.errorListeners.splice(index, 1)
      }
    }
  }

  private setupAuthStateListener(): void {
    const auth = FirebaseConfigService.getAuth()

    onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      try {
        const user = firebaseUser ? FirebaseUserMapper.fromFirebaseUser(firebaseUser) : null
        this.notifyAuthStateListeners(user)
      } catch (error) {
        console.error('Error in auth state change:', error)
      }
    })
  }

  private notifyAuthStateListeners(user: User | null): void {
    this.authStateListeners.forEach(callback => {
      try {
        callback(user)
      } catch (error) {
        console.error('Error in auth state listener:', error)
      }
    })
  }

  private notifyTokenRefreshListeners(token: string): void {
    this.tokenRefreshListeners.forEach(callback => {
      try {
        callback(token)
      } catch (error) {
        console.error('Error in token refresh listener:', error)
      }
    })
  }

  private notifyErrorListeners(error: AuthError): void {
    this.errorListeners.forEach(callback => {
      try {
        callback(error)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })
  }
}
