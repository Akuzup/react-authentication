/**
 * LoginForm Component - Reusable login form component
 */
import React from 'react';
import { AuthError } from '../../core/entities/AuthError';
export interface LoginFormProps {
    onSuccess?: () => void;
    onError?: (error: AuthError) => void;
    showRememberMe?: boolean;
    showGoogleLogin?: boolean;
    showSMSLogin?: boolean;
    className?: string;
    disabled?: boolean;
}
export declare const LoginForm: React.FC<LoginFormProps>;
export default LoginForm;
//# sourceMappingURL=LoginForm.d.ts.map