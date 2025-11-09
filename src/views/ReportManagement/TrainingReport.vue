<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Training Report" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="generateReport" class="text-left">
            <div class="grid grid-cols-1 gap-6">

              <!-- Report Subject Selection: Choose the type of training report to generate -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 text-left">Subject</label>
                <select
                  id="subject"
                  v-model="filters.subject"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>

              <!-- Conditional Training Selection: Only shown for specific subject-based reports (3,6,9,12) -->
              <div v-if="showTrainingDropdown">
                <label for="training" class="block text-sm font-medium text-gray-700 text-left">Select Training</label>
                <CustomDropdown
                  :options="filteredTrainings"
                  v-model="filters.training_id"
                  :reduce="training => training.value"
                  :fetchMore="loadMoreTrainings"
                  :loading="trainingLoading"
                  @search="handleTrainingSearch"
                  placeholder="Search and select training..."
                />
              </div>

              <!-- Fiscal Year Selection: Choose multiple fiscal years for report filtering -->
              <div>
                <label for="fiscalYear" class="block text-sm font-medium text-gray-700 text-left">Fiscal Year</label>
                <MultipleSelect
                  id="fiscalYear"
                  v-model="filters.fiscalYears"
                  :options="uniqueFiscalYears"
                  :reduce="year => year.value"
                  placeholder="Select fiscal years..."
                />
              </div>

              <!-- Employee Selection: Choose specific employee for individual reports - Only for subjects 2,5,8,11 -->
              <div v-if="showEmployeeDropdown">
                <label for="employee" class="block text-sm font-medium text-gray-700 text-left">Employee</label>
                <CustomDropdown
                  :options="filteredEmployees"
                  v-model="filters.employee_id"
                  :reduce="employee => employee.value"
                  :fetchMore="loadMoreEmployees"
                  :loading="employeeLoading"
                  @search="handleEmployeeSearch"
                  placeholder="Search and select employee..."
                />
              </div>

              <!-- Date Range Selection: Define the period for training data in the report -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Report Start Date: Beginning of the reporting period -->
                <div>
                  <label for="start_date" class="block text-sm font-medium text-gray-700 text-left">Start Date</label>
                  <flat-pickr
                    v-model="filters.startDate"
                    :config="flatpickrConfig"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                    placeholder="Select start date"
                  />
                </div>
                <!-- Report End Date: End of the reporting period -->
                <div>
                  <label for="end_date" class="block text-sm font-medium text-gray-700 text-left">End Date</label>
                  <flat-pickr
                    v-model="filters.endDate"
                    :config="flatpickrConfig"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                    placeholder="Select end date"
                  />
                </div>
              </div>
            </div>

            <!-- Report Generation Button: Process filters and generate PDF report -->
            <div class="mt-6 flex justify-start">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
              >
                <span v-if="!loading">Run Report</span>
                <span v-else>Loading...</span>
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import MultipleSelect from "@/components/forms/FormElements/MultipleSelect.vue";
import CustomDropdown from "@/components/forms/FormElements/CustomDropdown.vue";
import debounce from "lodash.debounce";
import api from '@/composables/useApi'

const currentPageTitle = ref("Training Report");
const filters = ref({
  subject: "",
  fiscalYears: [],
  startDate: "",
  endDate: "",
  employee_id: null,
  training_id: null, // Add training_id to filters
});

const subjects = ref([
  { id: 1, name: "৯ম-তদুর্ধ্ব গ্রেডের সকল কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 2, name: "৯ম-তদুর্ধ্ব গ্রেডের একক কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 3, name: "৯ম-তদুর্ধ্ব গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 4, name: "১০ম গ্রেডের সকল কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 5, name: "১০ম গ্রেডের একক কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 6, name: "১০ম গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 7, name: "১১-১৬তম গ্রেডের সকল কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 8, name: "১১-১৬তম গ্রেডের একক কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 9, name: "১১-১৬তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 10, name: "১৭-২০তম গ্রেডের সকল কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 11, name: "১৭-২০তম গ্রেডের একক কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 12, name: "১৭-২০তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 13, name: "প্রকল্প অনুসারে মোট প্রশিক্ষনের প্রতিবেদন" }
]);

// Generate recent past and present fiscal years dynamically
const generateFiscalYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 10; i >= 0; i--) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    years.push({ value: `${startYear}-${endYear}`, label: `${startYear}-${endYear}` });
  }
  return years;
};

const fiscalYears = ref(generateFiscalYears());

// Ensure unique fiscal years in the dropdown
const uniqueFiscalYears = computed(() => {
  const unique = new Set(fiscalYears.value.map(year => year.value));
  return Array.from(unique).map(value => {
    return fiscalYears.value.find(year => year.value === value);
  });
});

const flatpickrConfig = {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
};

const loading = ref(false);
const employeeLoading = ref(false);
const trainingLoading = ref(false); // Add training loading state

// Training-related reactive variables
const trainings = ref([]);
const filteredTrainings = ref([]);
const trainingSearchQuery = ref("");
const trainingPagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

// Computed property to show employee dropdown conditionally
const showEmployeeDropdown = computed(() => {
  return [2, 5, 8, 11].includes(filters.value.subject);
});

// Computed property to show training dropdown conditionally
const showTrainingDropdown = computed(() => {
  return [3, 6, 9, 12].includes(filters.value.subject);
});

// Training fetching functions
const fetchTrainings = async (query = "", page = 1, append = false) => {
  if (trainingLoading.value && append) return;

  trainingLoading.value = true;
  try {
    const response = await api.get("/trainings", {
      params: {
        search: query,
        page,
        per_page: trainingPagination.value.per_page
      }
    });

    const data = response.data;
    const newTrainings = data.data.map((training) => ({
      value: training.id,
      label: training.name,
    }));

    if (append) {
      trainings.value = [...trainings.value, ...newTrainings];
    } else {
      trainings.value = newTrainings;
    }

    const paginationData = data.meta || data;
    trainingPagination.value = {
      current_page: paginationData.current_page || page,
      last_page: paginationData.last_page || 1,
      per_page: paginationData.per_page || trainingPagination.value.per_page,
      total: paginationData.total || 0,
    };

    filteredTrainings.value = trainings.value;
  } catch (error) {
    console.error("Failed to fetch trainings:", error.response?.data || error.message);
    if (!append) {
      trainings.value = [];
      filteredTrainings.value = [];
    }
  } finally {
    trainingLoading.value = false;
  }
};

const debouncedFetchTrainings = debounce((query) => {
  trainingPagination.value.current_page = 1;
  fetchTrainings(query, 1, false);
}, 300);

const handleTrainingSearch = (query) => {
  trainingSearchQuery.value = query;
  if (query.trim() === "") {
    trainingPagination.value.current_page = 1;
    fetchTrainings("", 1, false);
  } else {
    debouncedFetchTrainings(query);
  }
};

const loadMoreTrainings = async () => {
  if (trainingLoading.value) return;
  if (trainingPagination.value.current_page >= trainingPagination.value.last_page) return;

  const nextPage = trainingPagination.value.current_page + 1;
  await fetchTrainings(trainingSearchQuery.value, nextPage, true);
};

const generateReport = async () => {
  loading.value = true;
  try {
    const params = {
      subject: filters.value.subject,
      fiscal_years: [...new Set(filters.value.fiscalYears.map(fy => fy.value))],
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
      employee_id: filters.value.employee_id,
    };

    // Include training_id only for subjects 3, 6, 9, and 12
    if ([3, 6, 9, 12].includes(filters.value.subject) && filters.value.training_id) {
      params.training_id = filters.value.training_id;
    }

    const response = await api.get('/training-reports', {
      params,
      headers: { 'Accept': 'application/pdf' },
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'training_report.pdf';

    // Create a Blob from the response and download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Use the extracted filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to generate report.";
    alert(`${errorMessage}`);
  } finally {
    loading.value = false;
  }
};

const employees = ref([]);
const filteredEmployees = ref([]);
const employeeSearchQuery = ref("");
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const fetchEmployees = async (query = "", page = 1, append = false) => {
  // Prevent duplicate requests
  if (employeeLoading.value && append) {
    console.log("Already loading, skipping request");
    return;
  }

  employeeLoading.value = true;
  console.log(`Fetching employees - Query: "${query}", Page: ${page}, Append: ${append}`);

  try {
    const response = await api.get("/employees", {
      params: {
        search: query,
        page,
        per_page: pagination.value.per_page
      }
    });

    console.log("API Response:", response.data);
    const data = response.data;

    const newEmployees = data.data.map((employee) => ({
      value: employee.id,
      label: `${employee.name} (Grade: ${employee.grade || employee.designation_name || 'N/A'})`,
      name: employee.name,
      grade: employee.grade,
      designation: employee.designation_name,
    }));

    if (append) {
      // Append for pagination
      employees.value = [...employees.value, ...newEmployees];
      console.log(`Appended ${newEmployees.length} employees`);
    } else {
      // Replace for new search
      employees.value = newEmployees;
      console.log(`Loaded ${newEmployees.length} employees`);
    }

    // Update pagination from response - handle both data structure formats
    const paginationData = data.meta || data;
    pagination.value = {
      current_page: paginationData.current_page || page,
      last_page: paginationData.last_page || 1,
      per_page: paginationData.per_page || pagination.value.per_page,
      total: paginationData.total || 0,
    };

    filteredEmployees.value = employees.value;
    console.log("Updated pagination:", pagination.value);
    console.log("Total employees loaded:", employees.value.length);

  } catch (error) {
    console.error("Failed to fetch employees:", error.response?.data || error.message);
    if (!append) {
      employees.value = [];
      filteredEmployees.value = [];
    }
  } finally {
    employeeLoading.value = false;
  }
};

// Map subject IDs to grade queries
const getGradeQueryBySubjectId = (subjectId) => {
  const gradeMapping = {
    1: "grade-9",
    2: "grade-9",
    3: "grade-9",      // ৯ম-তদুর্ধ্ব গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন
    4: "grade-10",
    5: "grade-10",
    6: "grade-10",     // ১০ম গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন
    7: "grade-11-16",
    8: "grade-11-16",
    9: "grade-11-16",  // ১১-১৬তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন
    10: "grade-17-20",
    11: "grade-17-20",
    12: "grade-17-20"  // ১৭-২০তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন
  };

  return gradeMapping[subjectId] || "";
};

const debouncedFetchEmployees = debounce((query) => {
  // Reset pagination for new search
  pagination.value.current_page = 1;
  fetchEmployees(query, 1, false);
}, 300);

const handleEmployeeSearch = (query) => {
  employeeSearchQuery.value = query;

  // Get grade-based query from selected subject
  const gradeQuery = getGradeQueryBySubjectId(filters.value.subject);

  // Combine user search with grade filter
  let finalQuery = query.trim();
  if (gradeQuery && finalQuery) {
    // If both grade filter and user search exist, prioritize user search
    finalQuery = query.trim();
  } else if (gradeQuery) {
    // If only grade filter exists, use it
    finalQuery = gradeQuery;
  }

  console.log(`Employee search - User query: "${query}", Grade query: "${gradeQuery}", Final query: "${finalQuery}"`);

  if (finalQuery === "") {
    // If no query, load initial employees
    pagination.value.current_page = 1;
    fetchEmployees("", 1, false);
  } else {
    // Use debounced search
    debouncedFetchEmployees(finalQuery);
  }
};

const loadMoreEmployees = async () => {
  console.log("=== loadMoreEmployees called ===");
  console.log("Current page:", pagination.value.current_page);
  console.log("Last page:", pagination.value.last_page);
  console.log("Employee loading:", employeeLoading.value);
  console.log("Current employees count:", employees.value.length);

  if (employeeLoading.value) {
    console.log("Already loading, aborting");
    return;
  }

  if (pagination.value.current_page >= pagination.value.last_page) {
    console.log("No more pages to load");
    return;
  }

  const nextPage = pagination.value.current_page + 1;
  console.log("Loading page:", nextPage);

  // Get current query for pagination
  const gradeQuery = getGradeQueryBySubjectId(filters.value.subject);
  let currentQuery = employeeSearchQuery.value.trim();

  if (gradeQuery && !currentQuery) {
    currentQuery = gradeQuery;
  }

  try {
    await fetchEmployees(currentQuery, nextPage, true);
    console.log("Successfully loaded more employees");
  } catch (error) {
    console.error("Error in loadMoreEmployees:", error);
  }
};

// Watch for subject changes and update employee list accordingly
watch(
  () => filters.value.subject,
  (newSubjectId) => {
    console.log(`Subject changed to: ${newSubjectId}`);

    // Reset employee selection when subject changes
    filters.value.employee_id = null;

    // Reset training selection when subject changes
    filters.value.training_id = null;

    // Fetch trainings if training dropdown should be shown
    if (showTrainingDropdown.value) {
      trainingPagination.value.current_page = 1;
      trainingSearchQuery.value = "";
      fetchTrainings("", 1, false);
    }

    // Only fetch employees if employee dropdown should be shown
    if (showEmployeeDropdown.value) {
      // Get grade query for the new subject
      const gradeQuery = getGradeQueryBySubjectId(newSubjectId);

      if (gradeQuery) {
        console.log(`Loading employees for grade: ${gradeQuery}`);
        // Reset pagination and search query
        pagination.value.current_page = 1;
        employeeSearchQuery.value = "";

        // Fetch employees with grade filter
        fetchEmployees(gradeQuery, 1, false);
      } else {
        console.log("No grade filter for this subject, loading all employees");
        // Reset pagination and search query
        pagination.value.current_page = 1;
        employeeSearchQuery.value = "";

        // Fetch all employees
        fetchEmployees("", 1, false);
      }
    }
  }
);

onMounted(() => {
  fetchEmployees();
  // Fetch trainings on mount if needed
  if (showTrainingDropdown.value) {
    fetchTrainings();
  }
});
</script>
