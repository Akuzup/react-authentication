/**
 * FirestoreUserRepository - Implementation of UserRepository using Firestore
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { FirebaseConfigService } from './FirebaseConfig'
import { UserRepository } from '../../core/interfaces/UserRepository'
import { FirestoreUserData, UpdateUserData } from '../../core/entities/User'

export class FirestoreUserRepository implements UserRepository {
  private readonly COLLECTION_NAME = 'Users'

  async getUserById(userId: string): Promise<FirestoreUserData | null> {
    try {
      const db = FirebaseConfigService.getFirestore()
      const userDoc = doc(db, this.COLLECTION_NAME, userId)
      const docSnap = await getDoc(userDoc)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          Email: data.Email || '',
          DisplayName: data.DisplayName,
          FirstName: data.FirstName,
          LastName: data.LastName,
          Username: data.Username,
          PhoneNumber: data.PhoneNumber,
          ProfilePicture: data.ProfilePicture,
          CreatedAt: data.CreatedAt,
          UpdatedAt: data.UpdatedAt,
          deviceToken: data.deviceToken
        }
      }

      return null
    } catch (error) {
      console.error('Error getting user from Firestore:', error)
      throw error
    }
  }

  async saveUser(userData: FirestoreUserData): Promise<void> {
    try {
      const db = FirebaseConfigService.getFirestore()
      const userDoc = doc(db, this.COLLECTION_NAME, userData.id)
      
      const dataToSave = {
        ...userData,
        UpdatedAt: serverTimestamp()
      }

      await setDoc(userDoc, dataToSave, { merge: true })
    } catch (error) {
      console.error('Error saving user to Firestore:', error)
      throw error
    }
  }

  async updateUser(userId: string, userData: Partial<UpdateUserData>): Promise<void> {
    try {
      const db = FirebaseConfigService.getFirestore()
      const userDoc = doc(db, this.COLLECTION_NAME, userId)
      
      const updateData: any = {
        UpdatedAt: serverTimestamp()
      }

      // Map update data to Firestore field names
      if (userData.displayName !== undefined) {
        updateData.DisplayName = userData.displayName
      }
      if (userData.firstName !== undefined) {
        updateData.FirstName = userData.firstName
      }
      if (userData.lastName !== undefined) {
        updateData.LastName = userData.lastName
      }
      if (userData.username !== undefined) {
        updateData.Username = userData.username
      }
      if (userData.phoneNumber !== undefined) {
        updateData.PhoneNumber = userData.phoneNumber
      }
      if (userData.photoURL !== undefined) {
        updateData.ProfilePicture = userData.photoURL
      }
      if (userData.deviceToken !== undefined) {
        updateData.deviceToken = userData.deviceToken
      }

      await updateDoc(userDoc, updateData)
    } catch (error) {
      console.error('Error updating user in Firestore:', error)
      throw error
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const db = FirebaseConfigService.getFirestore()
      const userDoc = doc(db, this.COLLECTION_NAME, userId)
      await deleteDoc(userDoc)
    } catch (error) {
      console.error('Error deleting user from Firestore:', error)
      throw error
    }
  }

  async userExists(userId: string): Promise<boolean> {
    try {
      const db = FirebaseConfigService.getFirestore()
      const userDoc = doc(db, this.COLLECTION_NAME, userId)
      const docSnap = await getDoc(userDoc)
      return docSnap.exists()
    } catch (error) {
      console.error('Error checking if user exists in Firestore:', error)
      return false
    }
  }
}
