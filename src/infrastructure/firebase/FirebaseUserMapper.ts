/**
 * Firebase User Mapper - Maps Firebase User to domain User entity
 */

import { User as FirebaseUser } from 'firebase/auth'
import { AuthProvider, FirestoreUserData, User } from '../../core/entities/User'

export class FirebaseUserMapper {
  static fromFirebaseUser(firebaseUser: FirebaseUser, additionalData?: any): User {
    // Map Firebase providers to our AuthProvider enum
    const providers = this.mapProviders(firebaseUser.providerData)

    // Extract metadata
    const metadata = firebaseUser.metadata
    const createdAt = metadata.creationTime ? new Date(metadata.creationTime) : new Date()
    const lastLoginAt = metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date()

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      firstName: additionalData?.firstName,
      lastName: additionalData?.lastName,
      username: additionalData?.username,
      photoURL: firebaseUser.photoURL || undefined,
      phoneNumber: firebaseUser.phoneNumber || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt,
      lastLoginAt,
      updatedAt: additionalData?.updatedAt,
      providers,
      deviceToken: additionalData?.deviceToken,
      customClaims: additionalData?.customClaims,
      locale: additionalData?.locale,
      timezone: additionalData?.timezone,
      disabled: false, // Firebase doesn't expose this in client SDK
      metadata: {
        ...additionalData?.metadata,
        firebaseUid: firebaseUser.uid,
        isAnonymous: firebaseUser.isAnonymous,
        tenantId: firebaseUser.tenantId
      }
    }
  }

  static fromFirebaseUserWithFirestore(
    firebaseUser: FirebaseUser,
    firestoreData?: FirestoreUserData | null,
    additionalData?: any
  ): User {
    // Parse Firestore timestamps
    let createdAt = new Date()
    let updatedAt: Date | undefined

    if (firestoreData?.CreatedAt) {
      try {
        createdAt = new Date(firestoreData.CreatedAt)
      } catch (error) {
        console.warn('Failed to parse CreatedAt from Firestore:', error)
      }
    }

    if (firestoreData?.UpdatedAt) {
      try {
        updatedAt = new Date(firestoreData.UpdatedAt)
      } catch (error) {
        console.warn('Failed to parse UpdatedAt from Firestore:', error)
      }
    }

    // Map Firebase providers to our AuthProvider enum
    const providers = this.mapProviders(firebaseUser.providerData)

    // Extract metadata
    const metadata = firebaseUser.metadata
    const lastLoginAt = metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date()

    return {
      id: firebaseUser.uid,
      email: firestoreData?.Email || firebaseUser.email || '',
      displayName: firestoreData?.DisplayName || firebaseUser.displayName || undefined,
      firstName: firestoreData?.FirstName,
      lastName: firestoreData?.LastName,
      username: firestoreData?.Username,
      photoURL: firestoreData?.ProfilePicture || firebaseUser.photoURL || undefined,
      phoneNumber: firestoreData?.PhoneNumber || firebaseUser.phoneNumber || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt,
      updatedAt,
      lastLoginAt,
      providers,
      deviceToken: firestoreData?.deviceToken,
      customClaims: additionalData?.customClaims,
      locale: additionalData?.locale,
      timezone: additionalData?.timezone,
      disabled: false, // Firebase doesn't expose this in client SDK
      metadata: {
        ...additionalData?.metadata,
        firebaseUid: firebaseUser.uid,
        isAnonymous: firebaseUser.isAnonymous,
        tenantId: firebaseUser.tenantId
      }
    }
  }

  static toFirebaseUpdateData(user: Partial<User>): any {
    const updateData: any = {}

    if (user.displayName !== undefined) {
      updateData.displayName = user.displayName
    }

    if (user.photoURL !== undefined) {
      updateData.photoURL = user.photoURL
    }

    return updateData
  }

  private static mapProviders(providerData: any[]): AuthProvider[] {
    const providers: AuthProvider[] = []

    providerData.forEach(provider => {
      switch (provider.providerId) {
        case 'password':
          providers.push(AuthProvider.EMAIL_PASSWORD)
          break
        case 'google.com':
          providers.push(AuthProvider.GOOGLE)
          break
        case 'phone':
          providers.push(AuthProvider.SMS)
          break
        case 'facebook.com':
          providers.push(AuthProvider.FACEBOOK)
          break
        case 'apple.com':
          providers.push(AuthProvider.APPLE)
          break
        default:
          // Unknown provider, skip
          break
      }
    })

    // If no providers found but user exists, assume email/password
    if (providers.length === 0) {
      providers.push(AuthProvider.EMAIL_PASSWORD)
    }

    return providers
  }

  static getProviderDisplayName(provider: AuthProvider): string {
    switch (provider) {
      case AuthProvider.EMAIL_PASSWORD:
        return 'Email/Password'
      case AuthProvider.GOOGLE:
        return 'Google'
      case AuthProvider.SMS:
        return 'SMS'
      case AuthProvider.FACEBOOK:
        return 'Facebook'
      case AuthProvider.APPLE:
        return 'Apple'
      default:
        return 'Unknown'
    }
  }

  static getProviderIcon(provider: AuthProvider): string {
    switch (provider) {
      case AuthProvider.EMAIL_PASSWORD:
        return '✉️'
      case AuthProvider.GOOGLE:
        return '🔍'
      case AuthProvider.SMS:
        return '📱'
      case AuthProvider.FACEBOOK:
        return '📘'
      case AuthProvider.APPLE:
        return '🍎'
      default:
        return '❓'
    }
  }
}
