<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Add Training">
        <form @submit.prevent="addTraining" enctype="multipart/form-data">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="training.name"
                type="text"
                id="name"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
              <select
                v-model="training.type"
                id="type"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select Type</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
            </div>
            <div>
              <label for="organization_id" class="block text-sm font-medium text-gray-700">Organization</label>
              <select
                v-model="training.organization_id"
                id="organization_id"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select Organization</option>
                <option v-for="org in organizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
              <flat-pickr
                v-model="training.start_date"
                :config="flatpickrConfig"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                placeholder="Select start date"
              />
            </div>
            <div>
              <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
              <flat-pickr
                v-model="training.end_date"
                :config="flatpickrConfig"
                class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                placeholder="Select end date"
              />
            </div>
            <div>
              <label for="total_days" class="block text-sm font-medium text-gray-700">Total Days</label>
              <input
                v-model="training.total_days"
                type="number"
                id="total_days"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <FileInput name="file_link" @file-selected="handleFileUpload" />
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Add Training
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import api from '@/composables/useApi'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const router = useRouter()
const currentPageTitle = ref('Add Training')
const training = ref({
  name: '',
  type: '',
  organization_id: '',
  start_date: '',
  end_date: '',
  total_days: '',
  file_link: null, // File object or null
})

const organizations = ref([])

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

const handleFileUpload = (file) => {
  if (file) {
    console.log('File selected:', file.name) // Debugging log
    training.value.file_link = file
  } else {
    console.error('No file selected')
  }
}

const addTraining = async () => {
  const formData = new FormData()
  for (const key in training.value) {
    if (key === 'file_link' && training.value[key] === null) {
      continue // Skip appending file_link if it is null
    }
    formData.append(key, training.value[key])
  }

  try {
    await api.post('/trainings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Training added successfully!')
    router.push('/training-management/list')
  } catch (error) {
    console.error('Failed to add training:', error.response?.data || error.message)
    alert('Failed to add training. Please try again.')
  }
}

onMounted(() => fetchOrganizations())
</script>