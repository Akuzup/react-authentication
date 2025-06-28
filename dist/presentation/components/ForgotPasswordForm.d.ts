/**
 * ForgotPasswordForm Component - Reusable forgot password form component
 */
import React from 'react';
import { AuthError } from '../../core/entities/AuthError';
export interface ForgotPasswordFormProps {
    onSuccess?: (email: string) => void;
    onError?: (error: AuthError) => void;
    onCancel?: () => void;
    className?: string;
    disabled?: boolean;
    showBackToLogin?: boolean;
}
export declare const ForgotPasswordForm: React.FC<ForgotPasswordFormProps>;
export default ForgotPasswordForm;
//# sourceMappingURL=ForgotPasswordForm.d.ts.map