<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Training Assignments">
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <router-link
              to="/training-management/assign"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Assignment
            </router-link>
            <button
              @click="exportToPDF"
              :disabled="isExporting"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="isExporting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>{{ isExporting ? 'Generating...' : 'Export PDF' }}</span>
            </button>
          </div>
          <div class="relative flex items-center w-full max-w-sm">
            <input
              type="text"
              v-model="searchQuery"
              @input="debouncedSearch"
              @blur="() => fetchAssignments(pagination.value.current_page)"
              placeholder="Search assignments..."
              class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              v-else
              class="absolute right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m0 0H5m4 0h4m0 0h4" />
              </svg>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.field"
                  :class="[
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  ]"
                  @click="column.sortable ? handleSort(column.field) : null"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ column.label }}</span>
                    <div v-if="column.sortable" class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3',
                          sortField === column.field && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-400'
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                      <svg
                        :class="[
                          'w-3 h-3 transform rotate-180',
                          sortField === column.field && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-400'
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
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
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.designation_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ getWorkingPlaceName(assignment.working_place) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.organizer_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.start_date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.end_date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ assignment.total_days }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a
                    v-if="assignment.file_link"
                    :href="assignment.file_link"
                    target="_blank"
                    class="text-blue-500 underline"
                  >
                    View File
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
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
import { ref, onMounted } from 'vue';
import debounce from 'lodash.debounce';
import api from '@/composables/useApi';
import { useWorkingPlaces } from "@/composables/useWorkingPlaces";
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import Pagination from '@/components/common/Pagination.vue';

const currentPageTitle = ref('Training Assignments');
const { workingPlaces } = useWorkingPlaces();
const columns = ref([
  { field: 'training_name', label: 'Training Name', sortable: true },
  { field: 'employee_name', label: 'Employee Name', sortable: true },
  { field: 'designation_name', label: 'Designation', sortable: true },
  { field: 'working_place', label: 'Working Place', sortable: true },
  { field: 'organizer_name', label: 'Organizer', sortable: true },
  { field: 'start_date', label: 'Start Date', sortable: true },
  { field: 'end_date', label: 'End Date', sortable: true },
  { field: 'total_days', label: 'Total Days', sortable: true },
  { field: 'file_link', label: 'File Link', sortable: false },
]);

const assignments = ref([]);
const searchQuery = ref('');
const sortField = ref('');
const sortOrder = ref('asc');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
});

const isExporting = ref(false);

// Function to get the working place name by ID
const getWorkingPlaceName = (id) => {
  const place = workingPlaces.value.find((place) => place.id == id);
  return place ? place.name : "N/A";
};

const handleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
  fetchAssignments(1);
};

const fetchAssignments = async (page = 1) => {
  try {
    const params = {
      search: searchQuery.value,
      page,
      sort_field: sortField.value,
      sort_order: sortOrder.value
    };

    const response = await api.get('/trainings/assignments', { params });
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

const debouncedSearch = debounce(() => {
  fetchAssignments(1);
}, 500);

const clearSearch = () => {
  searchQuery.value = ''; // Clear the search box
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

const exportToPDF = async () => {
  isExporting.value = true;
  try {
    const params = {
      search: searchQuery.value,
      orderBy: sortField.value,
      orderDirection: sortOrder.value,
    };

    const response = await api.get('/training-assignments/pdf', {
      params,
      responseType: 'blob'
    });

    // Check if response is actually a blob (PDF) or error JSON
    if (response.headers['content-type']?.includes('application/pdf')) {
      // Handle PDF download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
      link.download = `training-assignments-report-${dateStr}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('PDF exported successfully');
    } else {
      // Handle error response
      const text = await new Response(response.data).text();
      const errorData = JSON.parse(text);
      alert(errorData.message || 'Failed to export PDF. Please try again.');
    }
  } catch (error) {
    console.error('Failed to export PDF:', error);
    if (error.response?.data) {
      try {
        const text = await new Response(error.response.data).text();
        const errorData = JSON.parse(text);
        alert(errorData.message || 'Failed to export PDF. Please try again.');
      } catch {
        alert('Failed to export PDF. Please try again.');
      }
    } else {
      alert('Failed to export PDF. Please try again.');
    }
  } finally {
    isExporting.value = false;
  }
};

onMounted(() => fetchAssignments());
</script>
