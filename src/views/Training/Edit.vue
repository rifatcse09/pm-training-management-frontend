<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Edit Training">
        <form @submit.prevent="updateTraining" enctype="multipart/form-data">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
            </div>
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
              <select
                v-model="form.type"
                id="type"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select Type</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
              <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type[0] }}</p>
            </div>
            <div>
              <label for="organization_id" class="block text-sm font-medium text-gray-700">Organization</label>
              <select
                v-model="form.organization_id"
                id="organization_id"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select Organization</option>
                <option v-for="org in organizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </select>
              <p v-if="errors.organization_id" class="text-red-500 text-sm mt-1">{{ errors.organization_id[0] }}</p>
            </div>
            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
              <flat-pickr
                v-model="form.start_date"
                :config="flatpickrConfig"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                placeholder="Select start date"
              />
              <p v-if="errors.start_date" class="text-red-500 text-sm mt-1">{{ errors.start_date[0] }}</p>
            </div>
            <div>
              <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
              <flat-pickr
                v-model="form.end_date"
                :config="flatpickrConfig"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                placeholder="Select end date"
              />
              <p v-if="errors.end_date" class="text-red-500 text-sm mt-1">{{ errors.end_date[0] }}</p>
            </div>
            <div>
              <label for="total_days" class="block text-sm font-medium text-gray-700">Total Days</label>
              <input
                v-model="form.total_days"
                type="number"
                id="total_days"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p v-if="errors.total_days" class="text-red-500 text-sm mt-1">{{ errors.total_days[0] }}</p>
            </div>
            <div>
              <label for="file_link" class="block text-sm font-medium text-gray-700">File</label>
              <div v-if="form.file_link && typeof form.file_link === 'string'" class="mt-1">
                <a
                  :href="form.file_link"
                  target="_blank"
                  class="text-blue-500 underline"
                >
                  {{ form.file_name || 'View Uploaded File' }}
                </a>
              </div>
              <FileInput name="file_link" @file-selected="handleFileUpload" />
              <p v-if="errors.file_link" class="text-red-500 text-sm mt-1">{{ errors.file_link[0] }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Update Training
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import api from '@/composables/useApi'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const route = useRoute() // Access the route object
const router = useRouter() // Access the router object
const currentPageTitle = ref('Edit Training')
const form = ref({
  name: '',
  type: '',
  organization_id: '',
  start_date: '',
  end_date: '',
  total_days: '',
  file_link: null, // File object or null
  file_name: null, // File name or null
})

const organizations = ref([])
const errors = ref({})

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
}

const fetchOrganizations = async () => {
  try {
    const response = await api.get('/organizers')
    organizations.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch organizations:', error.response?.data || error.message)
  }
}

const fetchTraining = async (id) => {
  try {
    const response = await api.get(`/trainings/${id}`)
    form.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch training:', error.response?.data || error.message)
  }
}

const handleFileUpload = (file) => {
  if (file) {
    console.log('File selected:', file.name) // Debugging log
    form.value.file_link = file
  } else {
    console.error('No file selected')
  }
}

const updateTraining = async () => {
  const formData = new FormData()

  // Debug: what you're about to send (raw form state)
  console.log('Form before submission:', { ...form.value })

  // Spoof PUT (so Laravel routes to update, but PHP parses as POST multipart)
  formData.append('_method', 'PUT')

  // Append only updatable fields
  for (const key in form.value) {
    const val = form.value[key]

    // Skip server-controlled / non-updatable keys
    if (['id', 'file_name', 'created_at', 'updated_at'].includes(key)) continue

    if (key === 'file_link') {
      if (val instanceof File) formData.append('file_link', val)
    } else if (val !== null && val !== undefined) {
      formData.append(key, val)
    }
  }

  // Optional: inspect actual FormData
  for (const [k, v] of formData.entries()) {
    console.log('FD:', k, v instanceof File ? `(file) ${v.name}` : v)
  }

  try {
    const { data } = await api.post(`/trainings/${form.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Training updated successfully!')
    router.push('/training-management/list')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Failed to update training:', error.response?.data || error.message)
    }
  }
};

onMounted(() => {
  const trainingId = route.params.id // Dynamically get the training ID from the route
  fetchOrganizations()
  fetchTraining(trainingId)
})
</script>
