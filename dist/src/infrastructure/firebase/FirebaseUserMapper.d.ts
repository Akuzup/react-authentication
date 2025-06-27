/**
 * Firebase User Mapper - Maps Firebase User to domain User entity
 */
import { User as FirebaseUser } from 'firebase/auth';
import { User, AuthProvider } from '../../core/entities/User';
export declare class FirebaseUserMapper {
    static fromFirebaseUser(firebaseUser: FirebaseUser, additionalData?: any): User;
    static toFirebaseUpdateData(user: Partial<User>): any;
    private static mapProviders;
    static getProviderDisplayName(provider: AuthProvider): string;
    static getProviderIcon(provider: AuthProvider): string;
}
//# sourceMappingURL=FirebaseUserMapper.d.ts.map