import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as null | Record<string, any>, // Restore user from localStorage
    token: localStorage.getItem('token') as null | string, // Restore token from localStorage
    tokenExpiry: localStorage.getItem('tokenExpiry') as null | string, // Restore token expiry from localStorage
  }),
  actions: {
    setAuthData(payload: { access_token: string; user: any; expires_in: number }) {
      const expiryTime = Date.now() + payload.expires_in * 1000 // Calculate expiry time in milliseconds
      this.token = payload.access_token
      this.user = payload.user
      this.tokenExpiry = expiryTime.toString()
      localStorage.setItem('token', payload.access_token) // Persist token
      localStorage.setItem('user', JSON.stringify(payload.user)) // Persist user
      localStorage.setItem('tokenExpiry', expiryTime.toString()) // Persist token expiry
    },
    async fetchUser() {
      if (!this.token || this.user) return // Skip fetching if token is missing or user is already loaded

      try {
        const response = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user)) // Persist user after fetching
      } catch (error) {
        console.error('Error fetching user:', error)
        this.logout() // Clear auth if token is invalid
      }
    },
    isTokenExpired(): boolean {
      if (!this.tokenExpiry) return true
      return Date.now() > parseInt(this.tokenExpiry, 10) // Check if current time is past the expiry time
    },
    async refreshToken() {
      try {
        const response = await api.post('/auth/refresh', null, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.setAuthData({
          access_token: response.data.access_token,
          user: this.user,
          expires_in: response.data.expires_in,
        })
      } catch (error) {
        console.error('Error refreshing token:', error)
        this.logout() // Logout if refresh fails
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.tokenExpiry = null
      localStorage.removeItem('token') // Remove token from localStorage
      localStorage.removeItem('user') // Remove user from localStorage
      localStorage.removeItem('tokenExpiry') // Remove token expiry from localStorage
    },
  },
})
