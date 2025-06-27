/**
 * Dependency Injection Container - Manages all dependencies for the auth module
 */

import { AuthConfig } from '../../config/AuthConfig'

// Core interfaces
import { AuthRepository } from '../../core/interfaces/AuthRepository'
import { AuthService } from '../../core/interfaces/AuthService'
import { StorageRepository } from '../../core/interfaces/StorageRepository'
import { ValidationService } from '../../core/interfaces/ValidationService'

// Use cases
import {
    GoogleLoginUseCase,
    LoginUseCase,
    LogoutUseCase,
    RegisterUseCase,
    SMSLoginUseCase
} from '../../core/usecases'

// Infrastructure
import { FirebaseAuthService, FirebaseConfigService } from '../../infrastructure/firebase'
import { LocalStorageService } from '../../infrastructure/storage'
import { ValidationServiceImpl } from '../../infrastructure/validation'

// Adapters
import { AuthRepositoryAdapter } from '../repositories/AuthRepositoryAdapter'
import { AuthServiceAdapter } from '../services/AuthServiceAdapter'

export class DIContainer {
  private static instance: DIContainer | null = null
  private dependencies = new Map<string, any>()
  private config: AuthConfig | null = null

  private constructor() {}

  static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer()
    }
    return this.instance
  }

  initialize(config: AuthConfig): void {
    this.config = config
    this.setupDependencies()
  }

  private setupDependencies(): void {
    if (!this.config) {
      throw new Error('Configuration not provided')
    }

    // Initialize Firebase
    FirebaseConfigService.initialize(
      this.config.firebase,
      this.config.environment === 'development'
    )

    // Register infrastructure services
    this.register('ValidationService', new ValidationServiceImpl())
    this.register('StorageRepository', new LocalStorageService(
      this.config.storage.prefix,
      this.config.storage.secure
    ))
    this.register('FirebaseAuthService', new FirebaseAuthService())

    // Register repository adapters
    this.register('AuthRepository', new AuthRepositoryAdapter(
      this.resolve('FirebaseAuthService')
    ))

    // Register use cases
    this.register('LoginUseCase', new LoginUseCase(
      this.resolve('AuthRepository'),
      this.resolve('ValidationService'),
      this.resolve('StorageRepository')
    ))

    this.register('RegisterUseCase', new RegisterUseCase(
      this.resolve('AuthRepository'),
      this.resolve('ValidationService'),
      this.resolve('StorageRepository')
    ))

    this.register('GoogleLoginUseCase', new GoogleLoginUseCase(
      this.resolve('AuthRepository'),
      this.resolve('StorageRepository')
    ))

    this.register('SMSLoginUseCase', new SMSLoginUseCase(
      this.resolve('AuthRepository'),
      this.resolve('ValidationService'),
      this.resolve('StorageRepository')
    ))

    this.register('LogoutUseCase', new LogoutUseCase(
      this.resolve('AuthRepository'),
      this.resolve('StorageRepository')
    ))

    // Register service adapters
    this.register('AuthService', new AuthServiceAdapter(
      this.resolve('LoginUseCase'),
      this.resolve('RegisterUseCase'),
      this.resolve('GoogleLoginUseCase'),
      this.resolve('SMSLoginUseCase'),
      this.resolve('LogoutUseCase'),
      this.resolve('AuthRepository')
    ))
  }

  register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance)
  }

  resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key)
    if (!dependency) {
      throw new Error(`Dependency '${key}' not found`)
    }
    return dependency as T
  }

  // Convenience methods for common dependencies
  getAuthService(): AuthService {
    return this.resolve<AuthService>('AuthService')
  }

  getAuthRepository(): AuthRepository {
    return this.resolve<AuthRepository>('AuthRepository')
  }

  getStorageRepository(): StorageRepository {
    return this.resolve<StorageRepository>('StorageRepository')
  }

  getValidationService(): ValidationService {
    return this.resolve<ValidationService>('ValidationService')
  }

  getLoginUseCase(): LoginUseCase {
    return this.resolve<LoginUseCase>('LoginUseCase')
  }

  getRegisterUseCase(): RegisterUseCase {
    return this.resolve<RegisterUseCase>('RegisterUseCase')
  }

  getGoogleLoginUseCase(): GoogleLoginUseCase {
    return this.resolve<GoogleLoginUseCase>('GoogleLoginUseCase')
  }

  getSMSLoginUseCase(): SMSLoginUseCase {
    return this.resolve<SMSLoginUseCase>('SMSLoginUseCase')
  }

  getLogoutUseCase(): LogoutUseCase {
    return this.resolve<LogoutUseCase>('LogoutUseCase')
  }

  // Cleanup method
  destroy(): void {
    FirebaseConfigService.destroy()
    this.dependencies.clear()
    this.config = null
    DIContainer.instance = null
  }

  // Get current configuration
  getConfig(): AuthConfig | null {
    return this.config
  }

  // Check if container is initialized
  isInitialized(): boolean {
    return this.config !== null && this.dependencies.size > 0
  }
}
