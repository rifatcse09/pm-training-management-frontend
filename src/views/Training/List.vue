<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Training List">
        <div class="flex justify-between items-center mb-4">
          <div class="relative flex items-center w-full max-w-sm">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="fetchTrainings"
              placeholder="Search trainings..."
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
          </div>
          <router-link
            v-if="canCreate"
            to="/training-management/add"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Add Training
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Organization
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="training in trainings" :key="training.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ training.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ training.type === "1" ? 'স্থানীয়' : 'বৈদেশিক' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ training.organization_name|| 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <router-link
                    v-if="canCreate"
                    :to="`/training-management/edit/${training.id}`"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="canDelete"
                    @click="confirmDelete(training.id)"
                    class="ml-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="trainings.length === 0">
                <td
                  colspan="4"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No trainings found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="pagination" :changePage="changePage" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/composables/useApi';
import debounce from "lodash.debounce";
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import { usePermissions } from '@/composables/usePermissions'

const { canCreate, canDelete } = usePermissions()

const currentPageTitle = ref('Training Management');
const trainings = ref([]);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
});

const fetchTrainings = async (page = 1) => {
  try {
    const response = await api.get('/trainings', {
      params: {
        search: searchQuery.value,
        page,
      },
    });
    trainings.value = response.data.data;
    pagination.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  } catch (error) {
    console.error('Failed to fetch trainings:', error.response?.data || error.message);
    // Reset pagination to default values in case of an error
    pagination.value = {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  }
};

// Watch for changes in the search query and fetch trainings
watch(searchQuery, () => {
  debouncedSearch(); // Debounced fetch for typing
});

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim() !== "") {
    fetchTrainings(1);
  }
}, 1000);

const changePage = (page) => {
  fetchTrainings(page); // Fetch employees for the selected page
};

const clearSearch = () => {
  searchQuery.value = '';
  fetchTrainings(1); // Reset to the first page and fetch all trainings
};

const confirmDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this training?')) return;

  try {
    await api.delete(`/trainings/${id}`);
    alert('Training deleted successfully!');
    // Remove the deleted training from the list without reloading the page
    trainings.value = trainings.value.filter(training => training.id !== id);
    // Update pagination if necessary
    if (trainings.value.length === 0 && pagination.value.current_page > 1) {
      fetchTrainings(pagination.value.current_page - 1);
    }
  } catch (error) {
    console.error('Failed to delete training:', error.response?.data || error.message);
    alert('Failed to delete training. Please try again.');
  }
};

onMounted(() => {
  fetchTrainings();
});
</script>
