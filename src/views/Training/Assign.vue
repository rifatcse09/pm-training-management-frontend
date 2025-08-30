<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Assign Employees to Training -->
      <div>
        <ComponentCard title="Assign Employees to Training" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="assignEmployees" class="text-left">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="training" class="block text-sm font-medium text-gray-700 text-left">Select Training</label>
                <CustomDropdown
                  :options="filteredTrainings"
                  v-model="selectedTraining"
                  :reduce="training => training.value"
                  :fetchMore="loadMoreTrainings"
                  :loading="loading"
                  @search="handleTrainingSearch"
                  placeholder="Search and select training..."
                />
                <p v-if="errors.training" class="text-red-500 text-sm mt-1">{{ errors.training[0] }}</p>
              </div>
              <div>
                <label for="start_date" class="block text-sm font-medium text-gray-700 text-left">Start Date</label>
                <flat-pickr
                  v-model="assignment.start_date"
                  :config="flatpickrConfig"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  placeholder="Select start date"
                />
                <p v-if="errors.start_date" class="text-red-500 text-sm mt-1">{{ errors.start_date[0] }}</p>
              </div>
              <div>
                <label for="end_date" class="block text-sm font-medium text-gray-700 text-left">End Date</label>
                <flat-pickr
                  v-model="assignment.end_date"
                  :config="flatpickrConfig"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  placeholder="Select end date"
                />
                <p v-if="errors.end_date" class="text-red-500 text-sm mt-1">{{ errors.end_date[0] }}</p>
              </div>
              <div>
                <label for="total_days" class="block text-sm font-medium text-gray-700 text-left">Total Days</label>
                <input
                  id="total_days"
                  v-model="assignment.total_days"
                  type="number"
                  placeholder="Enter total days"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
                <p v-if="errors.total_days" class="text-red-500 text-sm mt-1">{{ errors.total_days[0] }}</p>
              </div>
              <div>
                <FileInput
                  name="file_link"
                  label="Upload Training Document"
                  helperText="Accepted formats: PDF, DOC, DOCX. Max size: 2MB."
                  @file-selected="handleFileUpload"
                />
                <p v-if="errors.file_link" class="text-red-500 text-sm mt-1">{{ errors.file_link[0] }}</p>
              </div>
              <div>
                <label for="employees" class="block text-sm font-medium text-gray-700 text-left">Select Employees</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="workingPlace" class="block text-sm font-medium text-gray-700 text-left">Filter by Working Place</label>
                    <select
                      id="workingPlace"
                      v-model="selectedWorkingPlace"
                      class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                      required
                    >
                      <option value="" disabled>Select working place</option>
                      <option v-for="place in workingPlaces" :key="place.id" :value="place.id">
                        {{ place.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="designation" class="block text-sm font-medium text-gray-700 text-left">Filter by Designation</label>
                    <CustomDropdown
                      :options="designations"
                      v-model="selectedDesignation"
                      :reduce="designation => designation.value"
                      placeholder="Select designation..."
                    />
                  </div>
                </div>
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" @change="toggleAllEmployees" />
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="employee in filteredEmployees" :key="employee.value">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" v-model="selectedEmployees" :value="employee" />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">{{ employee.label }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">{{ employee.designation + ' ' + employee.grade }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">{{ getWorkingPlaceName(employee.workingPlace) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </ComponentCard>
      </div>

      <!-- Right Column: Selected Employees -->
      <div>
        <ComponentCard title="Selected Employees" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-700">Selected Employees</h3>
            <button
              class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              @click="assignEmployees"
            >
              Assign Selected
            </button>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Place</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in selectedEmployees" :key="employee.value">
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.label }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ employee.designation + ' ' + employee.grade }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ getWorkingPlaceName(employee.workingPlace) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    class="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    @click="removeFromSelectedTable(employee)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import debounce from "lodash.debounce";
import api from "@/composables/useApi";
import { useWorkingPlaces } from "@/composables/useWorkingPlaces";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import CustomDropdown from "@/components/forms/FormElements/CustomDropdown.vue";
import flatPickr from "vue-flatpickr-component";
import FileInput from "@/components/forms/FormElements/FileInput.vue";

const router = useRouter();
const currentPageTitle = ref("Assign Employees to Training");
const selectedTraining = ref(null);
const selectedEmployees = ref([]);
const selectedTableEmployees = ref([]);
const trainings = ref([]);
const employees = ref([]);
const filteredEmployees = ref([]);
const designations = ref([]);
const selectedWorkingPlace = ref("");
const selectedDesignation = ref(null);
const trainingSearchQuery = ref("");
const loading = ref(false);
const errors = ref({});
const { workingPlaces } = useWorkingPlaces();
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const assignment = ref({
  start_date: "",
  end_date: "",
  total_days: "",
  file_link: null,
});

const flatpickrConfig = {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
};

const handleFileUpload = (file) => {
  if (file) {
    assignment.value.file_link = file;
  }
};

const assignEmployees = async () => {
  if (!selectedTraining.value) {
    alert("Please select a training.");
    return;
  }
  if (selectedEmployees.value.length === 0) {
    alert("Please select at least one employee.");
    return;
  }

  const formData = new FormData();
  formData.append("training_id", selectedTraining.value);
  formData.append("start_date", assignment.value.start_date);
  formData.append("end_date", assignment.value.end_date);
  formData.append("total_days", assignment.value.total_days);
  if (assignment.value.file_link) {
    formData.append("file_link", assignment.value.file_link);
  }
  selectedEmployees.value.forEach((employee) => {
    formData.append("employee_ids[]", employee.value);
  });

  try {
    await api.post("/trainings/assign", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Employees assigned successfully!");
    router.push("/training-management/assign-list");
  } catch (error) {
    console.error("Failed to assign employees:", error.response?.data || error.message);
    errors.value = error.response?.data?.errors || {};
  }
};

const getWorkingPlaceName = (id) => {
  const place = workingPlaces.value.find((place) => place.id == id);
  return place ? place.name : "N/A";
};

const addToSelectedTable = (employee) => {
  if (!selectedTableEmployees.value.find((e) => e.value === employee.value)) {
    selectedTableEmployees.value.push(employee);
  }
};

const removeFromSelectedTable = (employee) => {
  selectedTableEmployees.value = selectedTableEmployees.value.filter((e) => e.value !== employee.value);
};

const fetchTrainings = async (query = "", page = 1) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const response = await api.get("/trainings", { params: { search: query, page } });
    const data = response.data;
    if (page === 1) {
      trainings.value = data.data.map((training) => ({
        value: training.id,
        label: training.name,
      }));
    } else {
      trainings.value = [
        ...trainings.value,
        ...data.data.map((training) => ({
          value: training.id,
          label: training.name,
        })),
      ];
    }
    pagination.value = data.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  } catch (error) {
    console.error("Failed to fetch trainings:", error.response?.data || error.message);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchTrainings = debounce((query) => {
  fetchTrainings(query, 1);
}, 500);

const handleTrainingSearch = (query) => {
  trainingSearchQuery.value = query;
  debouncedFetchTrainings(query);
};

const loadMoreTrainings = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    fetchTrainings(trainingSearchQuery.value, pagination.value.current_page + 1);
  }
};

const filteredTrainings = computed(() => {
  return trainings.value;
});

const fetchDesignations = async () => {
  try {
    const response = await api.get("/designations");
    designations.value = response.data.data.map((designation) => ({
      value: designation.id,
      label: designation.name,
    }));
  } catch (error) {
    console.error("Failed to fetch designations:", error.response?.data || error.message);
  }
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await api.get("/employees", {
      params: {
        working_place: selectedWorkingPlace.value || null,
        designation_id: selectedDesignation.value || null,
      },
    });
    employees.value = response.data.data.map((employee) => ({
      value: employee.id,
      label: employee.name || "Unnamed Employee",
      designation: employee.designation_name,
      grade: employee.grade,
      workingPlace: employee.working_place,
    }));
    filteredEmployees.value = employees.value;
  } catch (error) {
    console.error("Failed to fetch employees:", error.response?.data || error.message);
  } finally {
    loading.value = false;
  }
};

const toggleAllEmployees = (event) => {
  if (event.target.checked) {
    selectedEmployees.value = filteredEmployees.value.map((employee) => employee.value);
  } else {
    selectedEmployees.value = [];
  }
};

// Watchers for working place and designation changes
watch(selectedWorkingPlace, fetchEmployees);
watch(selectedDesignation, fetchEmployees);

onMounted(() => {
  fetchTrainings();
  fetchDesignations();
  fetchEmployees();
});
</script>
