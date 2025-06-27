/**
 * UserRepository Interface - Defines operations for user data management
 */

import { User, FirestoreUserData, UpdateUserData } from '../entities/User'

export interface UserRepository {
  /**
   * Get user data from Firestore by user ID
   */
  getUserById(userId: string): Promise<FirestoreUserData | null>
  
  /**
   * Create or update user data in Firestore
   */
  saveUser(userData: FirestoreUserData): Promise<void>
  
  /**
   * Update user data in Firestore
   */
  updateUser(userId: string, userData: Partial<UpdateUserData>): Promise<void>
  
  /**
   * Delete user data from Firestore
   */
  deleteUser(userId: string): Promise<void>
  
  /**
   * Check if user exists in Firestore
   */
  userExists(userId: string): Promise<boolean>
}
