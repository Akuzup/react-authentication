/**
 * Local Storage Service - Implementation of StorageRepository using browser localStorage
 */

import { StorageRepository } from '../../core/interfaces/StorageRepository'

export class LocalStorageService implements StorageRepository {
  private prefix: string
  private isSecure: boolean

  constructor(prefix = 'auth_', isSecure = true) {
    this.prefix = prefix
    this.isSecure = isSecure
    
    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Using in-memory storage.')
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const processedValue = this.isSecure ? this.encrypt(value) : value
      
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(prefixedKey, processedValue)
      } else {
        this.memoryStorage.set(prefixedKey, processedValue)
      }
    } catch (error) {
      console.error('Failed to set item in storage:', error)
      throw new Error('Storage operation failed')
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      let value: string | null
      
      if (this.isLocalStorageAvailable()) {
        value = localStorage.getItem(prefixedKey)
      } else {
        value = this.memoryStorage.get(prefixedKey) || null
      }
      
      if (value === null) {
        return null
      }
      
      return this.isSecure ? this.decrypt(value) : value
    } catch (error) {
      console.error('Failed to get item from storage:', error)
      return null
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(prefixedKey)
      } else {
        this.memoryStorage.delete(prefixedKey)
      }
    } catch (error) {
      console.error('Failed to remove item from storage:', error)
      throw new Error('Storage operation failed')
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isLocalStorageAvailable()) {
        // Only clear items with our prefix
        const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
        keys.forEach(key => localStorage.removeItem(key))
      } else {
        // Clear memory storage
        const keys = Array.from(this.memoryStorage.keys()).filter(key => key.startsWith(this.prefix))
        keys.forEach(key => this.memoryStorage.delete(key))
      }
    } catch (error) {
      console.error('Failed to clear storage:', error)
      throw new Error('Storage operation failed')
    }
  }

  async hasItem(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key)
      return value !== null
    } catch (error) {
      console.error('Failed to check item existence:', error)
      return false
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      let keys: string[]
      
      if (this.isLocalStorageAvailable()) {
        keys = Object.keys(localStorage)
      } else {
        keys = Array.from(this.memoryStorage.keys())
      }
      
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length))
    } catch (error) {
      console.error('Failed to get all keys:', error)
      return []
    }
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonString = JSON.stringify(value)
      await this.setItem(key, jsonString)
    } catch (error) {
      console.error('Failed to set object in storage:', error)
      throw new Error('Failed to serialize and store object')
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonString = await this.getItem(key)
      if (jsonString === null) {
        return null
      }
      
      return JSON.parse(jsonString) as T
    } catch (error) {
      console.error('Failed to get object from storage:', error)
      return null
    }
  }

  // Authentication-specific methods
  async setToken(token: string): Promise<void> {
    await this.setItem('token', token)
  }

  async getToken(): Promise<string | null> {
    return await this.getItem('token')
  }

  async removeToken(): Promise<void> {
    await this.removeItem('token')
  }

  async setUserData(userData: any): Promise<void> {
    await this.setObject('user', userData)
  }

  async getUserData(): Promise<any | null> {
    return await this.getObject('user')
  }

  async removeUserData(): Promise<void> {
    await this.removeItem('user')
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setItem('refresh_token', token)
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.getItem('refresh_token')
  }

  async removeRefreshToken(): Promise<void> {
    await this.removeItem('refresh_token')
  }

  async setSessionData(sessionData: any): Promise<void> {
    await this.setObject('session', sessionData)
  }

  async getSessionData(): Promise<any | null> {
    return await this.getObject('session')
  }

  async removeSessionData(): Promise<void> {
    await this.removeItem('session')
  }

  async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeUserData(),
      this.removeRefreshToken(),
      this.removeSessionData()
    ])
  }

  // Private methods
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (error) {
      return false
    }
  }

  // In-memory storage fallback
  private memoryStorage = new Map<string, string>()

  // Simple encryption/decryption (for demonstration - use proper encryption in production)
  private encrypt(value: string): string {
    if (!this.isSecure) return value
    
    try {
      // Simple base64 encoding (NOT secure - replace with proper encryption)
      return btoa(value)
    } catch (error) {
      console.warn('Encryption failed, storing as plain text')
      return value
    }
  }

  private decrypt(value: string): string {
    if (!this.isSecure) return value
    
    try {
      // Simple base64 decoding (NOT secure - replace with proper decryption)
      return atob(value)
    } catch (error) {
      console.warn('Decryption failed, returning as is')
      return value
    }
  }
}
