/**
 * LoginUseCase - Handles user authentication with email/password
 * This use case encapsulates the business logic for user login
 */
import { User } from '../entities/User';
import { AuthRepository } from '../interfaces/AuthRepository';
import { LoginRequest } from '../interfaces/AuthService';
import { StorageRepository } from '../interfaces/StorageRepository';
import { ValidationService } from '../interfaces/ValidationService';
export interface LoginResponse {
    user: User;
    token: string;
    refreshToken?: string;
}
export declare class LoginUseCase {
    private authRepository;
    private validationService;
    private storageRepository;
    constructor(authRepository: AuthRepository, validationService: ValidationService, storageRepository: StorageRepository);
    execute(request: LoginRequest): Promise<LoginResponse>;
    private validateInput;
}
//# sourceMappingURL=LoginUseCase.d.ts.map