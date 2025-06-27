/**
 * SMSLoginUseCase - Handles SMS-based authentication
 * This use case encapsulates the business logic for SMS login
 */
import { User } from '../entities/User';
import { AuthRepository } from '../interfaces/AuthRepository';
import { SMSLoginRequest, SMSVerificationRequest } from '../interfaces/AuthService';
import { StorageRepository } from '../interfaces/StorageRepository';
import { ValidationService } from '../interfaces/ValidationService';
export interface SMSLoginInitResponse {
    verificationId: string;
    timeout: number;
    phoneNumber: string;
}
export interface SMSLoginCompleteResponse {
    user: User;
    token: string;
    isNewUser: boolean;
}
export declare class SMSLoginUseCase {
    private authRepository;
    private validationService;
    private storageRepository;
    constructor(authRepository: AuthRepository, validationService: ValidationService, storageRepository: StorageRepository);
    initiate(request: SMSLoginRequest): Promise<SMSLoginInitResponse>;
    complete(request: SMSVerificationRequest): Promise<SMSLoginCompleteResponse>;
    private validatePhoneNumber;
    private validateVerificationCode;
}
//# sourceMappingURL=SMSLoginUseCase.d.ts.map