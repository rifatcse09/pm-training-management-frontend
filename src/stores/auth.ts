import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as null | Record<string, any>, // Restore user from localStorage
    token: localStorage.getItem('token') as null | string, // Restore token from localStorage
  }),
  actions: {
    setAuthData(payload: { access_token: string; user: any }) {
      this.token = payload.access_token
      this.user = payload.user
      localStorage.setItem('token', payload.access_token) // Persist token
      localStorage.setItem('user', JSON.stringify(payload.user)) // Persist user
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
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token') // Remove token from localStorage
      localStorage.removeItem('user') // Remove user from localStorage
    },
  },
})
