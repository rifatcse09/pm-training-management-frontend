import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // Import the auth store

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache', // Disable caching
    Pragma: 'no-cache',          // HTTP 1.0 compatibility
    Expires: '0',                // Expire immediately
  },
})

// Export a setup function to initialize interceptors
interface AuthStore {
  token: string | null;
}

export function setupApiInterceptors(authStore: AuthStore) {
  api.interceptors.request.use((config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      if (error.response?.status === 401) { // Check for unauthorized error
        const authStoreInstance = useAuthStore() // Access the auth store
        authStoreInstance.logout() // Log out the user
      }
      return Promise.reject(error) // Reject the error for further handling
    }
  )
}

export default api
