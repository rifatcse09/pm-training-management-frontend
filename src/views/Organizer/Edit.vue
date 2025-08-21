<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Edit Organizer" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="updateOrganizer" class="text-left">
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
                <label for="is_project" class="block text-sm font-medium text-gray-700 text-left">Is Project</label>
                <select
                  id="is_project"
                  v-model="organizer.is_project"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
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
import api from "@/composables/useApi";
import { extractData } from "@/utils/apiResponseHandler";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";

const route = useRoute();
const router = useRouter();
const currentPageTitle = ref("Edit Organizer");
const organizer = ref({
  name: "",
  place: "",
  is_project: false,
});

const fetchOrganizer = async () => {
  try {
    const response = await api.get(`/organizers/${route.params.id}`);
    const data = extractData(response);
    organizer.value = {
      name: data.name,
      place: data.place,
      is_project: data.is_project === 1 || data.is_project === "1", // Convert numeric or string '1' to true
    };
  } catch (error) {
    console.error("Error fetching organizer:", error.response?.data || error.message);
    alert("Failed to load organizer data.");
  }
};

const updateOrganizer = async () => {
  try {
    await api.put(`/organizers/${route.params.id}`, organizer.value);
    alert("Organizer updated successfully!");
    router.push("/organizer-management/list"); // Redirect after successful update
  } catch (error) {
    console.error("Error updating organizer:", error.response?.data || error.message);
    alert("Failed to update organizer. Please try again.");
  }
};

onMounted(() => fetchOrganizer());
</script>
