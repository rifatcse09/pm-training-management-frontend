<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Edit Employee" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="updateEmployee" class="text-left">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 text-left">Name</label>
                <input
                  id="name"
                  v-model="employee.name"
                  type="text"
                  placeholder="Enter employee name"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <label for="designation" class="block text-sm font-medium text-gray-700 text-left">Designation</label>
                <select
                  id="designation"
                  v-model="employee.designation_id"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select designation</option>
                  <option v-for="designation in designations" :key="designation.id" :value="designation.id">
                    {{ designation.name + ' ' + designation.grade }}
                  </option>
                </select>
              </div>
              <div>
                <label for="mobile" class="block text-sm font-medium text-gray-700 text-left">Mobile</label>
                <input
                  id="mobile"
                  v-model="employee.mobile"
                  type="text"
                  placeholder="Enter mobile number"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 text-left">Email</label>
                <input
                  id="email"
                  v-model="employee.email"
                  type="email"
                  placeholder="Enter employee email"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <label for="workingPlace" class="block text-sm font-medium text-gray-700 text-left">Working Place</label>
                <select
                  id="workingPlace"
                  v-model="employee.working_place"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select working place</option>
                  <option v-for="place in workingPlaces" :key="place.id" :value="place.id">
                    {{ place.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mt-6 flex justify-start">
              <button
                type="submit"
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
              >
                Save Changes
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWorkingPlaces } from "@/composables/useWorkingPlaces"; // Import the composable
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import api from "@/composables/useApi";

const route = useRoute();
const router = useRouter();
const currentPageTitle = ref("Edit Employee");
const employee = ref({
  name: "",
  designation_id: "",
  mobile: "",
  email: "",
  working_place: "",
});

const designations = ref([]);
const { workingPlaces } = useWorkingPlaces(); // Use the composable to get workingPlaces

const fetchEmployee = async () => {
  try {
    const response = await api.get(`/employees/${route.params.id}`);
    employee.value = response.data.data || {};
  } catch (error) {
    console.error("Failed to fetch employee:", error.response?.data || error.message);
    alert("Failed to load employee data.");
  }
};

const updateEmployee = async () => {
  try {
    await api.put(`/employees/${route.params.id}`, employee.value);
    alert("Employee updated successfully!");
    router.push("/employee-management/list");
  } catch (error) {
    console.error("Failed to update employee:", error.response?.data || error.message);
    alert("Failed to update employee. Please try again.");
  }
};

onMounted(() => {
  fetchEmployee();
});
</script>
