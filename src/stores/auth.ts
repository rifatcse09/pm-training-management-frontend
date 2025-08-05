import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | Record<string, any>,
    token: null as null | string,
  }),
  actions: {
    setAuthData(payload: { access_token: string; user: any }) {
      this.token = payload.access_token
      this.user = payload.user
      localStorage.setItem('token', payload.access_token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
