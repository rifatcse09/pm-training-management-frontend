<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Training List">
        <div class="flex justify-between items-center mb-4">
          <router-link
            to="/training-management/add"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Training
          </router-link>
          <div class="relative flex items-center">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="fetchTrainings"
              placeholder="Search trainings..."
              class="border border-gray-300 rounded px-4 py-2 text-sm w-64"
            />
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="column in columns" :key="column.field" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ column.label }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="training in trainings" :key="training.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ training.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatType(training.type) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(training.start_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(training.end_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    v-if="training.file_link"
                    @click="openFileInNewTab(training.file_link)"
                    class="text-blue-500 underline"
                  >
                    Open
                  </button>
                  <span v-else class="text-gray-500">No File</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <router-link
                    :to="`/training-management/assign/${training.id}`"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Assign Employees
                  </router-link>
                  <router-link
                    :to="`/training-management/edit/${training.id}`"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(training.id)"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="pagination" :changePage="fetchTrainings" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Pagination from '@/components/common/Pagination.vue'

const currentPageTitle = ref('Training List')
const columns = ref([
  { field: 'name', label: 'Name' },
  { field: 'type', label: 'Type' },
  { field: 'start_date', label: 'Start Date' },
  { field: 'end_date', label: 'End Date' },
])

const trainings = ref([])
const searchQuery = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
})

const fetchTrainings = async (page = 1) => {
  try {
    const response = await api.get('/trainings', { params: { search: searchQuery.value, page } })
    trainings.value = response.data.data || []
    pagination.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    }
  } catch (error) {
    console.error('Failed to fetch trainings:', error.response?.data || error.message)
    trainings.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    }
  }
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this training?')) {
    try {
      await api.delete(`/trainings/${id}`)
      fetchTrainings(pagination.value.current_page)
    } catch (error) {
      console.error('Failed to delete training:', error.response?.data || error.message)
    }
  }
}

const openFileInNewTab = (fileLink) => {
  window.open(fileLink, '_blank');
}

// Helper methods for formatting data
const formatType = (type) => {
  return type === '1' ? 'Type 1' : 'Type 2'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => fetchTrainings())
</script>
