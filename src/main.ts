import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { setupApiInterceptors } from '@/composables/useApi'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()
setupApiInterceptors(authStore)

app.use(router)
app.use(VueApexCharts)

app.mount('#app')
