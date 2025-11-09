<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Organizer List">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Organizer List</h1>
          <router-link 
            v-if="canCreate"
            to="/organizer-management/add" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Organizer
          </router-link>
        </div>
        <div class="relative flex items-center">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="searchOrganizers"
            @input="handleSearchInput"
            placeholder="Search organizers..."
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
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.field"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ column.label }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="organizer in organizers" :key="organizer.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ organizer.name || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ organizer.place || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ organizer.is_project ? "Yes" : "No" }}</td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <router-link
                    v-if="canCreate"
                    :to="`/organizer-management/edit/${organizer.id}`"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="canDelete"
                    @click="confirmDelete(organizer.id)"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  >
                    Delete
                  </button>
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
import { ref, onMounted, watch } from "vue";
import debounce from "lodash.debounce";
import api from "@/composables/useApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Pagination from "@/components/common/Pagination.vue";
import { usePermissions } from '@/composables/usePermissions'

const { canCreate, canDelete } = usePermissions()

const currentPageTitle = ref("Organizer List");
const columns = ref([
  { field: "name", label: "Name" },
  { field: "place", label: "Place" },
  { field: "is_project", label: "Is Project" },
]);

const organizers = ref([]);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10,
});

const fetchOrganizers = async (page = 1) => {
  try {
    const response = await api.get('/organizers', { params: { search: searchQuery.value, page } });
    organizers.value = response.data.data || [];
    pagination.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  } catch (error) {
    console.error('Failed to fetch organizers:', error.response?.data || error.message);
    organizers.value = [];
    pagination.value = {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
    };
  }
};

const changePage = (page) => {
  fetchOrganizers(page); // Fetch organizers for the selected page
};

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim() !== "") {
    fetchOrganizers(1);
  }
}, 1000);

watch(searchQuery, () => {
  debouncedSearch(); // Debounced fetch for typing
});

const searchOrganizers = () => {
  if (searchQuery.value.trim() !== "") {
    fetchOrganizers(1); // Immediate fetch
  }
};

const handleSearchInput = () => {
  if (searchQuery.value.trim() === "") {
    fetchOrganizers(1); // Reset to default state when search box is cleared
  }
};

const clearSearch = () => {
  searchQuery.value = ""; // Clear the search box
  fetchOrganizers(1); // Reset to default state
};

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this organizer?')) {
    try {
      await api.delete(`/organizers/${id}`);
      fetchOrganizers(pagination.value.current_page);
    } catch (error) {
      console.error('Failed to delete organizer:', error.response?.data || error.message);
    }
  }
};

onMounted(() => fetchOrganizers());
</script>
