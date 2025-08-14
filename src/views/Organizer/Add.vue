<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="p-6">
      <form @submit.prevent="addOrganizer">
        <div class="mb-4">
          <label for="name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Name<span class="text-error-500">*</span>
          </label>
          <input
            id="name"
            v-model="organizer.name"
            type="text"
            placeholder="Enter organizer name"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          />
        </div>
        <div class="mb-4">
          <label for="place" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Place<span class="text-error-500">*</span>
          </label>
          <input
            id="place"
            v-model="organizer.place"
            type="text"
            placeholder="Enter organizer place"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          />
        </div>
        <div class="mb-4">
          <label for="isProject" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Is Project<span class="text-error-500">*</span>
          </label>
          <select
            id="isProject"
            v-model="organizer.is_project"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
            required
          >
            <option value="" disabled>Select</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import api from "@/composables/useApi";

const router = useRouter();
const currentPageTitle = ref("Add Organizer");
const organizer = ref({
  name: "",
  place: "",
  is_project: "",
});

const addOrganizer = async () => {
  try {
    const response = await api.post("/organizers", organizer.value);
    console.log("Organizer added successfully:", response.data);
    alert("Organizer added successfully!");
    router.push("/organizer-management/list");
  } catch (error) {
    console.error("Failed to add organizer:", error.response?.data || error.message);
    alert("Failed to add organizer. Please try again.");
  }
};
</script>
