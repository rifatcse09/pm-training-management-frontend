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
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in activeUsers" :key="user.id">
          <!-- Edit mode -->
          <template v-if="editingUserId === user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                v-model="editForm.name"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                v-model="editForm.email"
                type="email"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-model="editForm.designation_id"
                @change="onDesignationChange"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Designation</option>
                <option v-for="designation in designations" :key="designation.id" :value="designation.id">
                  {{ designation.name }} - Grade {{ designation.grade }}
                </option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ editForm.class || "N/A" }}</td>
            <!-- <td class="px-6 py-4 whitespace-nowrap">{{ editForm.grade || "N/A" }}</td> -->
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-model="editForm.role_id"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <button
                @click="saveUser(user.id)"
                class="text-green-600 hover:text-green-900"
              >
                Save
              </button>
              <button
                @click="cancelEdit()"
                class="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </td>
          </template>
          <!-- View mode -->
          <template v-else>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.name || "N/A" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email || "N/A" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.designation || "N/A" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.class || "N/A" }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ user.role || "No Role" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="editUser(user)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
            </td>
          </template>
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
const designations = ref([]);
const authStore = useAuthStore();
const editingUserId = ref(null);
const editForm = ref({
  name: "",
  email: "",
  designation_id: "",
  class: "",
  grade: "",
  role_id: ""
});

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Officer" },
  { id: 3, name: "Operator" }
];

setupApiInterceptors(authStore);

const fetchDesignations = async () => {
  try {
    const response = await api.get("/designations");
    designations.value = extractData(response);
  } catch (error) {
    console.error("Error fetching designations:", error);
  }
};

const fetchActiveUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    console.log("Fetched active users:", response.data);

    activeUsers.value = extractData(response).map(user => ({
      ...user,
      designation: user.designation?.name ? `${user.designation.name} - Grade ${user.designation.grade}` : "N/A",
      class: user.designation?.class || "N/A",
      role: user.role?.name || "No Role",
      designation_id: user.designation?.id || null,
      role_id: user.role?.id || null,
    }));
  } catch (error) {
    console.error("Error fetching active users:", error);
  }
};

const onDesignationChange = () => {
  const selectedDesignation = designations.value.find(d => d.id === editForm.value.designation_id);
  if (selectedDesignation) {
    editForm.value.class = selectedDesignation.class;
    editForm.value.grade = selectedDesignation.grade;
  }
};

const editUser = (user) => {
  editingUserId.value = user.id;
  editForm.value = {
    name: user.name,
    email: user.email,
    designation_id: user.designation_id || "",
    class: user.class,
    role_id: user.role_id || ""
  };
};

const saveUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, editForm.value);
    console.log("User updated successfully");

    // Update the user in the local array with fresh data from API
    const userIndex = activeUsers.value.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const updatedUser = extractData(response);
      activeUsers.value[userIndex] = {
        ...updatedUser,
        designation: updatedUser.designation?.name ? `${updatedUser.designation.name} - Grade ${updatedUser.designation.grade}` : "N/A",
        class: updatedUser.designation?.class || "N/A",
        role: updatedUser.role?.name || "No Role",
        designation_id: updatedUser.designation?.id || null,
        role_id: updatedUser.role?.id || null,
      };
    }

    cancelEdit();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const cancelEdit = () => {
  editingUserId.value = null;
  editForm.value = {
    name: "",
    email: "",
    designation_id: "",
    class: "",
    // grade: "",
    role_id: ""
  };
};

onMounted(() => {
  fetchDesignations();
  fetchActiveUsers();
});
</script>
