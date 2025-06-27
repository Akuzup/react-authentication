/**
 * Dependency Injection Container - Manages all dependencies for the auth module
 */
import { AuthConfig } from '../../config/AuthConfig';
import { AuthRepository } from '../../core/interfaces/AuthRepository';
import { StorageRepository } from '../../core/interfaces/StorageRepository';
import { ValidationService } from '../../core/interfaces/ValidationService';
import { AuthService } from '../../core/interfaces/AuthService';
import { LoginUseCase, RegisterUseCase, GoogleLoginUseCase, SMSLoginUseCase, LogoutUseCase } from '../../core/usecases';
export declare class DIContainer {
    private static instance;
    private dependencies;
    private config;
    private constructor();
    static getInstance(): DIContainer;
    initialize(config: AuthConfig): void;
    private setupDependencies;
    register<T>(key: string, instance: T): void;
    resolve<T>(key: string): T;
    getAuthService(): AuthService;
    getAuthRepository(): AuthRepository;
    getStorageRepository(): StorageRepository;
    getValidationService(): ValidationService;
    getLoginUseCase(): LoginUseCase;
    getRegisterUseCase(): RegisterUseCase;
    getGoogleLoginUseCase(): GoogleLoginUseCase;
    getSMSLoginUseCase(): SMSLoginUseCase;
    getLogoutUseCase(): LogoutUseCase;
    destroy(): void;
    getConfig(): AuthConfig | null;
    isInitialized(): boolean;
}
//# sourceMappingURL=DIContainer.d.ts.map