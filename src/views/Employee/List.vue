<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Employee List">
        <div class="flex justify-between items-center mb-4">
          <router-link
            to="/employee-management/add"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Employee
          </router-link>
          <div class="relative flex items-center">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="searchEmployees"
              @input="handleSearchInput"
              placeholder="Search employees..."
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
              <tr v-for="employee in employees" :key="employee.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.name || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.email || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.mobile || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.designation_name || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.grade || "N/A" }}</td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <router-link
                    :to="`/employee-management/edit/${employee.id}`"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(employee.id)"
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
import usePagination from "@/composables/usePagination";
import api from "@/composables/useApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Pagination from "@/components/common/Pagination.vue";

const currentPageTitle = ref("Employee List");
const columns = ref([
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "mobile", label: "Mobile" },
  { field: "designation_name", label: "Designation" },
  { field: "grade", label: "Grade" },
]);

const searchQuery = ref("");
const { items: employees, pagination, fetchItems: fetchEmployees, changePage } = usePagination(api.get.bind(null, "/employees"));

const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim() !== "") {
    fetchEmployees(1, searchQuery.value);
  }
}, 1000);

watch(searchQuery, () => {
  debouncedSearch(); // Debounced fetch for typing
});

const searchEmployees = () => {
  if (searchQuery.value.trim() !== "") {
    fetchEmployees(1, searchQuery.value); // Immediate fetch
  }
};

const handleSearchInput = () => {
  if (searchQuery.value.trim() === "") {
    fetchEmployees(1); // Reset to default state when search box is cleared
  }
};

const clearSearch = () => {
  searchQuery.value = ""; // Clear the search box
  fetchEmployees(1); // Reset to default state
};

const confirmDelete = (id) => {
  if (confirm("Are you sure you want to delete this employee?")) {
    deleteEmployee(id);
  }
};

const deleteEmployee = async (id) => {
  try {
    await api.delete(`/employees/${id}`);
    fetchEmployees(pagination.currentPage); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting employee:", error.response?.data || error.message);
  }
};

onMounted(() => fetchEmployees());
</script>
