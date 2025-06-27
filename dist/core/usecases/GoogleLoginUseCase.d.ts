/**
 * GoogleLoginUseCase - Handles Google OAuth authentication
 * This use case encapsulates the business logic for Google login
 */
import { User } from '../entities/User';
import { AuthRepository } from '../interfaces/AuthRepository';
import { StorageRepository } from '../interfaces/StorageRepository';
export interface GoogleLoginRequest {
    rememberMe?: boolean;
}
export interface GoogleLoginResponse {
    user: User;
    token: string;
    isNewUser: boolean;
}
export declare class GoogleLoginUseCase {
    private authRepository;
    private storageRepository;
    constructor(authRepository: AuthRepository, storageRepository: StorageRepository);
    execute(request?: GoogleLoginRequest): Promise<GoogleLoginResponse>;
}
//# sourceMappingURL=GoogleLoginUseCase.d.ts.map