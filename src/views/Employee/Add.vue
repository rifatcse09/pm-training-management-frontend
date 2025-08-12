<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="p-6">
      <form @submit.prevent="addEmployee">
        <div class="mb-4">
          <label for="name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Name<span class="text-error-500">*</span>
          </label>
          <input
            id="name"
            v-model="employee.name"
            type="text"
            placeholder="Enter employee name"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          />
        </div>
        <div class="mb-4">
          <label for="designation" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Designation<span class="text-error-500">*</span>
          </label>
          <select
            id="designation"
            v-model="employee.designation_id"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          >
            <option value="" disabled>Select designation</option>
            <option v-for="designation in designations" :key="designation.id" :value="designation.id">
              {{ designation.name+' '+designation.grade }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="mobile" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Mobile<span class="text-error-500">*</span>
          </label>
          <input
            id="mobile"
            v-model="employee.mobile"
            type="text"
            placeholder="Enter mobile number"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Email<span class="text-error-500">*</span>
          </label>
          <input
            id="email"
            v-model="employee.email"
            type="email"
            placeholder="Enter employee email"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          />
        </div>
        <div class="mb-4">
          <label for="workingPlace" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Working Place<span class="text-error-500">*</span>
          </label>
          <select
            id="workingPlace"
            v-model="employee.working_place"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          >
            <option value="" disabled>Select working place</option>
            <option v-for="place in workingPlaces" :key="place.id" :value="place.id">
              {{ place.name }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import api from "@/composables/useApi";

const router = useRouter();
const currentPageTitle = ref("Add Employee");
const employee = ref({
  name: "",
  designation_id: "",
  mobile: "",
  email: "",
  working_place: "",
});

const designations = ref([]);
const workingPlaces = ref([
  { id: 1, name: "Place 1" },
  { id: 2, name: "Place 2" },
  { id: 3, name: "Place 3" },
  { id: 4, name: "Place 4" },
  { id: 5, name: "Place 5" },
  { id: 6, name: "Place 6" },
  { id: 7, name: "Place 7" },
  { id: 8, name: "Place 8" },
]);

onMounted(async () => {
  try {
    const response = await api.get("/designations");
    designations.value = response.data;
  } catch (error) {
    console.error("Failed to fetch designations:", error);
    alert("Failed to load designations.");
  }
});

const addEmployee = async () => {
  try {
    const response = await api.post("/employees", employee.value);
    console.log("Employee added successfully:", response.data);
    alert("Employee added successfully!");
    router.push("/employee-management/list");
  } catch (error) {
    console.error("Failed to add employee:", error.response?.data || error.message);
    alert("Failed to add employee. Please try again.");
  }
};
</script>
