/**
 * FirestoreUserRepository - Implementation of UserRepository using Firestore
 */
import { UserRepository } from '../../core/interfaces/UserRepository';
import { FirestoreUserData, UpdateUserData } from '../../core/entities/User';
export declare class FirestoreUserRepository implements UserRepository {
    private readonly COLLECTION_NAME;
    getUserById(userId: string): Promise<FirestoreUserData | null>;
    saveUser(userData: FirestoreUserData): Promise<void>;
    updateUser(userId: string, userData: Partial<UpdateUserData>): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    userExists(userId: string): Promise<boolean>;
}
//# sourceMappingURL=FirestoreUserRepository.d.ts.map