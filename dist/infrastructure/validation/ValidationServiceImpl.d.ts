/**
 * Validation Service Implementation - Handles all input validation
 */
import { PasswordStrength, ValidationResult, ValidationService } from '../../core/interfaces/ValidationService';
export declare class ValidationServiceImpl implements ValidationService {
    private emailRegex;
    private phoneRegex;
    private urlRegex;
    validateEmail(email: string): ValidationResult;
    validatePassword(password: string): ValidationResult;
    checkPasswordStrength(password: string): PasswordStrength;
    validatePhoneNumber(phoneNumber: string, countryCode?: string): ValidationResult;
    validateDisplayName(displayName: string): ValidationResult;
    validateRegistrationData(data: {
        email: string;
        password: string;
        confirmPassword: string;
        displayName?: string;
        phoneNumber?: string;
    }): ValidationResult;
    validateLoginCredentials(email: string, password: string): ValidationResult;
    validateSMSCode(code: string): ValidationResult;
    validateProfileData(data: {
        displayName?: string;
        phoneNumber?: string;
        photoURL?: string;
    }): ValidationResult;
    validatePasswordChange(data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }): ValidationResult;
    sanitizeInput(input: string): string;
    validateURL(url: string): ValidationResult;
    validatePasswordMatch(password: string, confirmPassword: string): ValidationResult;
    validateTermsAcceptance(accepted: boolean): ValidationResult;
}
//# sourceMappingURL=ValidationServiceImpl.d.ts.map