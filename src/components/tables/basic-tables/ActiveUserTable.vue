<template>
  <div>
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
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in activeUsers" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ user.name || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.email || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.designation || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.class || "N/A" }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.grade || "N/A" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api, { setupApiInterceptors } from "@/composables/useApi";
import { useAuthStore } from "@/stores/auth";
import { extractData } from "@/utils/apiResponseHandler";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
});

const activeUsers = ref([]);
const authStore = useAuthStore();

setupApiInterceptors(authStore);

const fetchActiveUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    activeUsers.value = extractData(response).map(user => ({
      ...user,
      designation: user.designation.name || "N/A",
      class: user.designation.class || "N/A",
      grade: user.designation.grade || "N/A",
    }));
  } catch (error) {
    console.error("Error fetching active users:", error);
  }
};

onMounted(fetchActiveUsers);
</script>
