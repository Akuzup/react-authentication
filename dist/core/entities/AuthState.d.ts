/**
 * AuthState Entity - Represents the current authentication state
 * This entity encapsulates all authentication-related state information
 */
import { User } from './User';
import { AuthError } from './AuthError';
export interface AuthState {
    /** Currently authenticated user, null if not authenticated */
    user: User | null;
    /** Whether an authentication operation is in progress */
    isLoading: boolean;
    /** Whether a user is currently authenticated */
    isAuthenticated: boolean;
    /** Current authentication error, if any */
    error: AuthError | null;
    /** Whether the auth state has been initialized */
    isInitialized: boolean;
    /** Whether the current session is valid */
    isSessionValid: boolean;
    /** Timestamp of the last authentication check */
    lastChecked?: Date;
    /** Current session token (if available) */
    sessionToken?: string;
    /** Token expiration time */
    tokenExpiresAt?: Date;
}
export interface AuthStateUpdate {
    user?: User | null;
    isLoading?: boolean;
    error?: AuthError | null;
    isInitialized?: boolean;
    isSessionValid?: boolean;
    sessionToken?: string;
    tokenExpiresAt?: Date;
}
export declare enum AuthStateStatus {
    IDLE = "idle",
    LOADING = "loading",
    AUTHENTICATED = "authenticated",
    UNAUTHENTICATED = "unauthenticated",
    ERROR = "error"
}
export interface AuthStateSnapshot {
    status: AuthStateStatus;
    user: User | null;
    error: AuthError | null;
    timestamp: Date;
}
//# sourceMappingURL=AuthState.d.ts.map