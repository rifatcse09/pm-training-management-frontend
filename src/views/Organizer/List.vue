<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Organizer List">
        <div class="flex justify-between items-center mb-4">
          <router-link
            to="/organizer-management/add"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Organizer
          </router-link>
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
                    :to="`/organizer-management/edit/${organizer.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </router-link>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="confirmDelete(organizer.id)"
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
import usePagination from "@/composables/usePagination";
import api from "@/composables/useApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Pagination from "@/components/common/Pagination.vue";

const currentPageTitle = ref("Organizer List");
const columns = ref([
  { field: "name", label: "Name" },
  { field: "place", label: "Place" },
  { field: "is_project", label: "Is Project" },
]);

const searchQuery = ref("");
const { items: organizers, pagination, fetchItems: fetchOrganizers, changePage } = usePagination(api.get.bind(null, "/organizers"));

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim() !== "") {
    fetchOrganizers(1, searchQuery.value);
  }
}, 1000);

watch(searchQuery, () => {
  debouncedSearch(); // Debounced fetch for typing
});

const searchOrganizers = () => {
  if (searchQuery.value.trim() !== "") {
    fetchOrganizers(1, searchQuery.value); // Immediate fetch
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

const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this organizer?")) {
    deleteOrganizer(id);
  }
};

const deleteOrganizer = async (id) => {
  try {
    await api.delete(`/organizers/${id}`);
    fetchOrganizers(pagination.currentPage); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting organizer:", error.response?.data || error.message);
  }
};

onMounted(() => fetchOrganizers());
</script>
