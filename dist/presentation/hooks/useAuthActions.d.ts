/**
 * useAuthActions Hook - Hook for auth actions only (no state)
 */
export declare const useAuthActions: () => {
    login: (email: string, password: string, rememberMe?: boolean) => Promise<import("..").User>;
    loginWithGoogle: () => Promise<import("..").User>;
    initiateSMSLogin: (phoneNumber: string, countryCode?: string) => Promise<{
        verificationId: string;
    }>;
    completeSMSLogin: (verificationId: string, code: string) => Promise<import("..").User>;
    register: (data: {
        email: string;
        password: string;
        confirmPassword: string;
        displayName?: string;
        phoneNumber?: string;
        acceptTerms: boolean;
    }) => Promise<import("..").User>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<import("..").User>;
    sendPasswordReset: (email: string) => Promise<void>;
    sendEmailVerification: () => Promise<void>;
    updateProfile: (data: any) => Promise<import("..").User>;
    hasPermission: (permission: string) => boolean;
    getUserPermissions: () => string[];
};
export default useAuthActions;
//# sourceMappingURL=useAuthActions.d.ts.map