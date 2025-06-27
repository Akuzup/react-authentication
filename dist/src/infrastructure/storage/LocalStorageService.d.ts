/**
 * Local Storage Service - Implementation of StorageRepository using browser localStorage
 */
import { StorageRepository } from '../../core/interfaces/StorageRepository';
export declare class LocalStorageService implements StorageRepository {
    private prefix;
    private isSecure;
    constructor(prefix?: string, isSecure?: boolean);
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    hasItem(key: string): Promise<boolean>;
    getAllKeys(): Promise<string[]>;
    setObject<T>(key: string, value: T): Promise<void>;
    getObject<T>(key: string): Promise<T | null>;
    setToken(token: string): Promise<void>;
    getToken(): Promise<string | null>;
    removeToken(): Promise<void>;
    setUserData(userData: any): Promise<void>;
    getUserData(): Promise<any | null>;
    removeUserData(): Promise<void>;
    setRefreshToken(token: string): Promise<void>;
    getRefreshToken(): Promise<string | null>;
    removeRefreshToken(): Promise<void>;
    setSessionData(sessionData: any): Promise<void>;
    getSessionData(): Promise<any | null>;
    removeSessionData(): Promise<void>;
    clearAuthData(): Promise<void>;
    private getPrefixedKey;
    private isLocalStorageAvailable;
    private memoryStorage;
    private encrypt;
    private decrypt;
}
//# sourceMappingURL=LocalStorageService.d.ts.map