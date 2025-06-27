/**
 * LogoutUseCase - Handles user logout
 * This use case encapsulates the business logic for user logout
 */
import { AuthRepository } from '../interfaces/AuthRepository';
import { StorageRepository } from '../interfaces/StorageRepository';
export interface LogoutRequest {
    clearAllSessions?: boolean;
    redirectUrl?: string;
}
export interface LogoutResponse {
    success: boolean;
    redirectUrl?: string;
}
export declare class LogoutUseCase {
    private authRepository;
    private storageRepository;
    constructor(authRepository: AuthRepository, storageRepository: StorageRepository);
    execute(request?: LogoutRequest): Promise<LogoutResponse>;
    private clearLocalData;
}
//# sourceMappingURL=LogoutUseCase.d.ts.map