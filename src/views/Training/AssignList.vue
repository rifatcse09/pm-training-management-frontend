<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Training Assignments">
        <div class="flex justify-between items-center mb-4">
          <router-link
            to="/training-management/assign"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Assignment
          </router-link>
          <div class="relative flex items-center">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="fetchAssignments"
              placeholder="Search assignments..."
              class="border border-gray-300 rounded px-4 py-2 text-sm w-64"
            />
            <button
              @click="clearSearch"
              class="absolute right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="column in columns" :key="column.field" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ column.label }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="assignment in assignments" :key="assignment.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.training_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.employee_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(assignment.assigned_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <router-link
                    :to="`/training-management/assign/edit/${assignment.id}`"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(assignment.id)"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination 
          :pagination="pagination" 
          :changePage="fetchAssignments" 
        />
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

const currentPageTitle = ref('Training Assignments')
const columns = ref([
  { field: 'training_name', label: 'Training Name' },
  { field: 'employee_name', label: 'Employee Name' },
  { field: 'assigned_date', label: 'Assigned Date' },
])

const assignments = ref([])
const searchQuery = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
})

const fetchAssignments = async (page = 1) => {
  try {
    const response = await api.get('/trainings/assignments', { params: { search: searchQuery.value, page } });
    assignments.value = response.data.data || [];
    pagination.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  } catch (error) {
    console.error('Failed to fetch assignments:', error.response?.data || error.message);
    assignments.value = [];
    pagination.value = {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  }
};

const clearSearch = () => {
  searchQuery.value = ""; // Clear the search box
  fetchAssignments(1); // Reset to default state
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this assignment?')) {
    try {
      await api.delete(`/trainings/assignments/${id}`);
      fetchAssignments(pagination.value.current_page);
    } catch (error) {
      console.error('Failed to delete assignment:', error.response?.data || error.message);
    }
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => fetchAssignments())
</script>
