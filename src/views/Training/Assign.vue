<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
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
                <label for="employees" class="block text-sm font-medium text-gray-700 text-left">Select Employees</label>
                <MultipleSelect
                  :options="filteredEmployees"
                  v-model="selectedEmployees"
                  placeholder="Search and select employees..."
                />
              </div>
            </div>
            <div class="mt-6 flex justify-start">
              <button
                type="submit"
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
              >
                Assign
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import debounce from "lodash.debounce";
import api from "@/composables/useApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import MultipleSelect from "@/components/forms/FormElements/MultipleSelect.vue";
import CustomDropdown from "@/components/forms/FormElements/CustomDropdown.vue";

const currentPageTitle = ref("Assign Employees to Training");
const selectedTraining = ref(null);
const selectedEmployees = ref([]);
const trainings = ref([]);
const employees = ref([]);
const filteredTrainings = ref([]);
const filteredEmployees = ref([]);
const trainingSearchQuery = ref("");
const loading = ref(false);
const errors = ref({});

const fetchTrainings = async (query = "", page = 1) => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await api.get("/trainings", { params: { search: query, page } });
    const data = response.data;

    if (page === 1) {
      trainings.value = data.data || [];
    } else {
      trainings.value = [...trainings.value, ...(data.data || [])];
    }

    filteredTrainings.value = trainings.value.map((training) => ({
      value: training.id,
      label: training.name,
    }));
  } catch (error) {
    console.error("Failed to fetch trainings:", error.response?.data || error.message);
  } finally {
    loading.value = false;
  }
};

const fetchEmployees = async () => {
  try {
    const response = await api.get("/employees");
    employees.value = response.data.data.map((employee) => ({
      value: employee.id,
      label: employee.name || "Unnamed Employee",
    }));
    filteredEmployees.value = employees.value;
  } catch (error) {
    console.error("Failed to fetch employees:", error.response?.data || error.message);
  }
};

const handleTrainingSearch = debounce((query) => {
  trainingSearchQuery.value = query;
  fetchTrainings(query, 1);
}, 500);

const loadMoreTrainings = () => {
  fetchTrainings(trainingSearchQuery.value, 2); // Fetch next page
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

  try {
    await api.post("/trainings/assign", {
      training_id: selectedTraining.value,
      employee_ids: selectedEmployees.value.map((e) => e.value),
    });
    alert("Employees assigned successfully!");
  } catch (error) {
    console.error("Failed to assign employees:", error.response?.data || error.message);
    alert("Failed to assign employees. Please try again.");
  }
};

onMounted(() => {
  fetchTrainings();
  fetchEmployees();
});
</script>
