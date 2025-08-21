<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Add Organizer" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="addOrganizer" class="text-left">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 text-left">Name</label>
                <input
                  id="name"
                  v-model="organizer.name"
                  type="text"
                  placeholder="Enter organizer name"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <label for="place" class="block text-sm font-medium text-gray-700 text-left">Place</label>
                <input
                  id="place"
                  v-model="organizer.place"
                  type="text"
                  placeholder="Enter organizer place"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                />
              </div>
              <div>
                <label for="isProject" class="block text-sm font-medium text-gray-700 text-left">Is Project</label>
                <select
                  id="isProject"
                  v-model="organizer.is_project"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select</option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </div>
            </div>
            <div class="mt-6 flex justify-start">
              <button
                type="submit"
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
              >
                Add Organizer
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import api from "@/composables/useApi";

const router = useRouter();
const currentPageTitle = ref("Add Organizer");
const organizer = ref({
  name: "",
  place: "", // Optional field
  is_project: "",
});

const addOrganizer = async () => {
  try {
    await api.post("/organizers", organizer.value);
    alert("Organizer added successfully!");
    router.push("/organizer-management/list");
  } catch (error) {
    console.error("Failed to add organizer:", error.response?.data || error.message);
    alert("Failed to add organizer. Please try again.");
  }
};
</script>
