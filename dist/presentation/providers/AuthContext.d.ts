/**
 * Auth Context - React Context for authentication state and actions
 */
import React, { ReactNode } from 'react';
import { AuthConfig } from '../../config/AuthConfig';
import { AuthError } from '../../core/entities/AuthError';
import { AuthState } from '../../core/entities/AuthState';
import { User } from '../../core/entities/User';
export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: AuthError | null;
    isInitialized: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
    loginWithGoogle: () => Promise<User>;
    initiateSMSLogin: (phoneNumber: string, countryCode?: string) => Promise<{
        verificationId: string;
    }>;
    completeSMSLogin: (verificationId: string, code: string) => Promise<User>;
    register: (data: {
        email: string;
        password: string;
        confirmPassword: string;
        displayName?: string;
        phoneNumber?: string;
        acceptTerms: boolean;
    }) => Promise<User>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<User>;
    sendPasswordReset: (email: string) => Promise<void>;
    sendEmailVerification: () => Promise<void>;
    updateProfile: (data: any) => Promise<User>;
    hasPermission: (permission: string) => boolean;
    getUserPermissions: () => string[];
}
export interface AuthProviderProps {
    config: AuthConfig;
    children: ReactNode;
    onAuthStateChange?: (state: AuthState) => void;
    onError?: (error: AuthError) => void;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuth: () => AuthContextValue;
export declare const useAuthContext: () => AuthContextValue;
//# sourceMappingURL=AuthContext.d.ts.map