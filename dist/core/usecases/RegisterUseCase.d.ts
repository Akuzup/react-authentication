/**
 * RegisterUseCase - Handles user registration
 * This use case encapsulates the business logic for user registration
 */
import { User } from '../entities/User';
import { AuthRepository } from '../interfaces/AuthRepository';
import { RegisterRequest } from '../interfaces/AuthService';
import { StorageRepository } from '../interfaces/StorageRepository';
import { ValidationService } from '../interfaces/ValidationService';
export interface RegisterResponse {
    user: User;
    token: string;
    emailVerificationSent: boolean;
}
export declare class RegisterUseCase {
    private authRepository;
    private validationService;
    private storageRepository;
    constructor(authRepository: AuthRepository, validationService: ValidationService, storageRepository: StorageRepository);
    execute(request: RegisterRequest): Promise<RegisterResponse>;
    private validateInput;
}
//# sourceMappingURL=RegisterUseCase.d.ts.map