<template>
  <div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <!-- Ensure columns are rendered dynamically -->
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
        <tr v-for="user in pendingUsers" :key="user.id">
          <!-- Render Designation, Class, and Grade separately -->
          <td class="px-6 py-4 whitespace-nowrap">{{ user.name || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.email || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.designation || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.class || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.grade || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900" @click="activateUser(user.id)">
              Activate
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api, { setupApiInterceptors } from "@/composables/useApi";
import { useAuthStore } from "@/stores/auth";
import { extractData } from "@/utils/apiResponseHandler"; // Use the TypeScript utility

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
});

const pendingUsers = ref([]);
const authStore = useAuthStore(); // Use the authStore to access the token

setupApiInterceptors(authStore);

const fetchPendingUsers = async () => {
  try {
    const response = await api.get("/admin/pending-users"); // Use api instance
    console.log("Fetched pending users:", response.data); // Debugging log

    pendingUsers.value = extractData(response).map(user => ({
      ...user,
      designation: user.designation.name|| "N/A", // Ensure 'designation' is mapped correctly
      class: user.designation.class || "N/A", // Ensure 'class' is mapped correctly
      grade: user.designation.grade || "N/A", // Ensure 'grade' is mapped correctly
    }));
  } catch (error) {
    console.error("Error fetching pending users:", error);
  }
};

const activateUser = async (userId) => {
  try {
    await api.post(`/admin/activate-user/${userId}`); // Use api instance
    pendingUsers.value = pendingUsers.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error("Error activating user:", error);
  }
};

onMounted(fetchPendingUsers);
</script>
