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
            <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
              <button
                @click="editUser(user)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                v-if="canDelete"
                @click="confirmDelete(user.id)"
                class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
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
import { usePermissions } from "@/composables/usePermissions";

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

const { canDelete } = usePermissions();

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

const confirmDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

  try {
    await api.delete(`/admin/users/${id}`);
    alert('User deleted successfully!');
    // Remove the deleted user from the list without reloading the page
    activeUsers.value = activeUsers.value.filter(user => user.id !== id);
  } catch (error) {
    console.error('Failed to delete user:', error.response?.data || error.message);
    alert('Failed to delete user. Please try again.');
  }
};

onMounted(() => {
  fetchDesignations();
  fetchActiveUsers();
});
</script>
