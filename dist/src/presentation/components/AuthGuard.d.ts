/**
 * AuthGuard Component - Protects routes based on authentication status
 */
import React, { ReactNode } from 'react';
export interface AuthGuardProps {
    children: ReactNode;
    requireAuth?: boolean;
    requireEmailVerification?: boolean;
    requiredPermissions?: string[];
    fallback?: ReactNode;
    loadingComponent?: ReactNode;
    unauthorizedComponent?: ReactNode;
    redirectTo?: string;
    onUnauthorized?: () => void;
}
export declare const AuthGuard: React.FC<AuthGuardProps>;
export declare const ProtectedRoute: React.FC<{
    children: ReactNode;
    fallback?: ReactNode;
}>;
export declare const PublicRoute: React.FC<{
    children: ReactNode;
}>;
export declare const VerifiedRoute: React.FC<{
    children: ReactNode;
    fallback?: ReactNode;
}>;
export default AuthGuard;
//# sourceMappingURL=AuthGuard.d.ts.map