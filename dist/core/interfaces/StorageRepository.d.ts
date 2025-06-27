/**
 * StorageRepository Interface - Defines the contract for local storage operations
 * This interface abstracts storage operations for authentication data
 */
export interface StorageRepository {
    /**
     * Store a value with the given key
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * Retrieve a value by key
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Remove a value by key
     */
    removeItem(key: string): Promise<void>;
    /**
     * Clear all stored values
     */
    clear(): Promise<void>;
    /**
     * Check if a key exists in storage
     */
    hasItem(key: string): Promise<boolean>;
    /**
     * Get all keys in storage
     */
    getAllKeys(): Promise<string[]>;
    /**
     * Store an object as JSON
     */
    setObject<T>(key: string, value: T): Promise<void>;
    /**
     * Retrieve an object from JSON
     */
    getObject<T>(key: string): Promise<T | null>;
    /**
     * Store authentication token
     */
    setToken(token: string): Promise<void>;
    /**
     * Retrieve authentication token
     */
    getToken(): Promise<string | null>;
    /**
     * Remove authentication token
     */
    removeToken(): Promise<void>;
    /**
     * Store user data
     */
    setUserData(userData: any): Promise<void>;
    /**
     * Retrieve user data
     */
    getUserData(): Promise<any | null>;
    /**
     * Remove user data
     */
    removeUserData(): Promise<void>;
    /**
     * Store refresh token
     */
    setRefreshToken(token: string): Promise<void>;
    /**
     * Retrieve refresh token
     */
    getRefreshToken(): Promise<string | null>;
    /**
     * Remove refresh token
     */
    removeRefreshToken(): Promise<void>;
    /**
     * Store session data
     */
    setSessionData(sessionData: any): Promise<void>;
    /**
     * Retrieve session data
     */
    getSessionData(): Promise<any | null>;
    /**
     * Remove session data
     */
    removeSessionData(): Promise<void>;
    /**
     * Clear all authentication-related data
     */
    clearAuthData(): Promise<void>;
}
//# sourceMappingURL=StorageRepository.d.ts.map