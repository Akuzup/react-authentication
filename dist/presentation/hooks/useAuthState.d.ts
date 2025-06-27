/**
 * useAuthState Hook - Hook for auth state only (no actions)
 */
export declare const useAuthState: () => {
    user: import("..").User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: import("..").AuthError | null;
    isInitialized: boolean;
};
export default useAuthState;
//# sourceMappingURL=useAuthState.d.ts.map