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
                  Enter your new password to reset your account.
                </p>
              </div>
              <div>
                <form @submit.prevent="submit">
                  <div class="space-y-5">
                    <!-- New Password -->
                    <div>
                      <label
                        for="password"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        New Password<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="password"
                        type="password"
                        id="password"
                        placeholder="Enter new password"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required
                      />
                    </div>
                    <!-- Confirm Password -->
                    <div>
                      <label
                        for="password_confirmation"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Confirm Password<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="password_confirmation"
                        type="password"
                        id="password_confirmation"
                        placeholder="Confirm new password"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required
                      />
                    </div>
                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        :disabled="loading"
                      >
                        {{ loading ? 'Resetting...' : 'Reset Password' }}
                      </button>
                    </div>
                  </div>
                </form>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Remembered your password?
                    <router-link
                      to="/signin"
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

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import api from '@/composables/useApi'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const email = route.query.email

const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)
const msg = ref('')

async function submit() {
  loading.value = true
  try {
    await api.post('/reset-password', {
      token,
      email,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })
    msg.value = 'Password reset successful.'
    setTimeout(() => router.push('/'), 1200)
  } catch (e) {
    msg.value = 'Reset failed. The link may be invalid or expired.'
  } finally {
    loading.value = false
  }
}
</script>
