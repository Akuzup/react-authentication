/**
 * RegisterForm Component - Reusable registration form component
 */
import React from 'react';
import { AuthError } from '../../core/entities/AuthError';
export interface RegisterFormProps {
    onSuccess?: () => void;
    onError?: (error: AuthError) => void;
    showDisplayName?: boolean;
    showPhoneNumber?: boolean;
    requireTermsAcceptance?: boolean;
    className?: string;
    disabled?: boolean;
}
export declare const RegisterForm: React.FC<RegisterFormProps>;
export default RegisterForm;
//# sourceMappingURL=RegisterForm.d.ts.map