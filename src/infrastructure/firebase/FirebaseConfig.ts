/**
 * Firebase Configuration - Setup and initialization for Firebase services
 */

import { FirebaseApp, getApps, initializeApp } from 'firebase/app'
import {
    Auth,
    connectAuthEmulator,
    getAuth,
    GoogleAuthProvider,
    RecaptchaVerifier
} from 'firebase/auth'
import {
    connectFirestoreEmulator,
    Firestore,
    getFirestore
} from 'firebase/firestore'
import { FirebaseConfig } from '../../config/AuthConfig'

export class FirebaseConfigService {
  private static app: FirebaseApp | null = null
  private static auth: Auth | null = null
  private static firestore: Firestore | null = null
  private static googleProvider: GoogleAuthProvider | null = null
  private static recaptchaVerifier: RecaptchaVerifier | null = null

  static initialize(config: FirebaseConfig, useEmulator = false): void {
    try {
      // Check if Firebase is already initialized
      if (getApps().length === 0) {
        this.app = initializeApp(config)
      } else {
        this.app = getApps()[0] || null
      }

      // Initialize Auth
      this.auth = getAuth(this.app || undefined)

      // Initialize Firestore
      this.firestore = getFirestore(this.app!)

      // Connect to emulator in development
      if (useEmulator && !this.isEmulatorConnected()) {
        connectAuthEmulator(this.auth, 'http://localhost:9099')
        connectFirestoreEmulator(this.firestore, 'localhost', 8080)
      }

      // Initialize Google provider
      this.googleProvider = new GoogleAuthProvider()
      this.googleProvider.addScope('email')
      this.googleProvider.addScope('profile')

    } catch (error) {
      console.error('Failed to initialize Firebase:', error)
      throw new Error('Firebase initialization failed')
    }
  }

  static getAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized. Call initialize() first.')
    }
    return this.auth
  }

  static getFirestore(): Firestore {
    if (!this.firestore) {
      throw new Error('Firestore not initialized. Call initialize() first.')
    }
    return this.firestore
  }

  static getGoogleProvider(): GoogleAuthProvider {
    if (!this.googleProvider) {
      throw new Error('Google provider not initialized. Call initialize() first.')
    }
    return this.googleProvider
  }

  static getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized')
    }

    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
          this.recaptchaVerifier = null
        }
      })
    }

    return this.recaptchaVerifier
  }

  static clearRecaptchaVerifier(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear()
      this.recaptchaVerifier = null
    }
  }

  static isInitialized(): boolean {
    return this.app !== null && this.auth !== null && this.firestore !== null
  }

  private static isEmulatorConnected(): boolean {
    // Check if emulator is already connected
    return (this.auth as any)?._config?.emulator !== undefined
  }

  static destroy(): void {
    this.clearRecaptchaVerifier()
    this.app = null
    this.auth = null
    this.firestore = null
    this.googleProvider = null
  }
}
