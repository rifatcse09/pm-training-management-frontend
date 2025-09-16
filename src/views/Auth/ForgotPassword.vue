<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Reset Password
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email to reset your password.
                </p>
              </div>
              <div>
                <div v-if="errorMessage" class="text-sm text-error-500 mb-4">
                  {{ errorMessage }}
                </div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label
                        for="email"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Email<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="info@gmail.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </form>
                <div v-if="successMessage" class="mt-5 text-sm text-success-500">
                  {{ successMessage }}
                </div>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Remembered your password?
                    <router-link
                      to="/"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Sign In</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/composables/useApi'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref('')
const errorMessage = ref('') // Reactive variable for error messages
const successMessage = ref('') // Reactive variable for success messages

// Submit reset password form
const handleSubmit = async () => {
  errorMessage.value = '' // Clear previous error message
  successMessage.value = '' // Clear previous success message
  try {
    await api.post('/forgot-password', { email: email.value })
    successMessage.value = 'An email has been sent to reset your password.'
  } catch (error: any) {
    console.error('Reset password failed:', error.response?.data || error.message)
    errorMessage.value = error.response?.data?.error || 'Unknown error' // Display API error message
  }
}
</script>
