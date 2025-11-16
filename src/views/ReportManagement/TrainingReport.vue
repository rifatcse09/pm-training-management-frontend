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
                  :canLoadMore="canLoadMoreTrainings"
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
                  :canLoadMore="canLoadMoreEmployees"
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
                :disabled="loading || !isFormValid"
                class="px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
                :class="{
                  'bg-blue-500 hover:bg-blue-600': !loading && isFormValid,
                  'bg-gray-400 cursor-not-allowed': loading || !isFormValid
                }"
              >
                <span v-if="!loading">Run Report</span>
                <span v-else>Loading...</span>
              </button>
            </div>

            <!-- Validation Messages -->
            <div v-if="validationErrors.length > 0" class="mt-4">
              <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <div class="text-red-800 text-sm font-medium mb-1">Please fix the following errors:</div>
                <ul class="text-red-700 text-sm space-y-1">
                  <li v-for="error in validationErrors" :key="error" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ error }}
                  </li>
                </ul>
              </div>
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
import api from '@/composables/useApi'
import { SubjectGradeHelper, ReportTypeCategory } from '@/enums/SubjectGradeMapping'

// Remove lodash.debounce import and create custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const currentPageTitle = ref("Training Report");
const filters = ref({
  subject: "",
  fiscalYears: [],
  startDate: "",
  endDate: "",
  employee_id: null,
  training_id: null,
});

const subjects = ref([
  { id: 1, name: "৯ম-তদুর্ধ্ব গ্রেডের সকল কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 2, name: "৯ম-তদুর্ধ্ব গ্রেডের একক কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 3, name: "৯ম-তদুর্ধ্ব গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 4, name: "১০ম গ্রেডের সকল কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 5, name: "১০ম গ্রেডের একক কর্মকর্তার প্রশিক্ষনের প্রতিবেদন" },
  { id: 6, name: "১০ম গ্রেডের সকল কর্মকর্তার একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 7, name: "১১-১৮তম গ্রেডের সকল কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 8, name: "১১-১৮তম গ্রেডের একক কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 9, name: "১১-১৮তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 10, name: "১৯-২০তম গ্রেডের সকল কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 11, name: "১৯-২০তম গ্রেডের একক কর্মচারীর প্রশিক্ষনের প্রতিবেদন" },
  { id: 12, name: "১৯-২০তম গ্রেডের সকল কর্মচারীর একক বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 13, name: "প্রকল্প অনুসারে মোট প্রশিক্ষনের প্রতিবেদন" }
]);

// Generate recent past and present fiscal years dynamically
const generateFiscalYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 3; i >= 0; i--) {
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
const trainingLoading = ref(false);

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

// Employee-related reactive variables
const employees = ref([]);
const filteredEmployees = ref([]);
const employeeSearchQuery = ref("");
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

// Computed property to show employee dropdown conditionally
const showEmployeeDropdown = computed(() => {
  return SubjectGradeHelper.requiresEmployee(filters.value.subject);
});

// Computed property to show training dropdown conditionally
const showTrainingDropdown = computed(() => {
  return SubjectGradeHelper.requiresTraining(filters.value.subject);
});

// Computed properties for canLoadMore
const canLoadMoreEmployees = computed(() => {
  return pagination.value.current_page < pagination.value.last_page;
});

const canLoadMoreTrainings = computed(() => {
  return trainingPagination.value.current_page < trainingPagination.value.last_page;
});

// Map subject IDs to grade queries using enum
const getGradeQueryBySubjectId = (subjectId) => {
  return SubjectGradeHelper.getGradeCategory(subjectId) || "";
};

// Employee functions with fixes
const fetchEmployees = async (query = "", page = 1, append = false) => {
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
      employees.value = [...employees.value, ...newEmployees];
      console.log(`Appended ${newEmployees.length} employees`);
    } else {
      employees.value = newEmployees;
      console.log(`Loaded ${newEmployees.length} employees`);
    }

    // Update pagination
    const paginationData = data.meta || data;
    pagination.value = {
      current_page: paginationData.current_page || page,
      last_page: paginationData.last_page || 1,
      per_page: paginationData.per_page || pagination.value.per_page,
      total: paginationData.total || 0,
    };

    filteredEmployees.value = employees.value;
    console.log("Updated pagination:", pagination.value);

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

// Create debounced function properly
const debouncedFetchEmployees = debounce(async (query, gradeQuery) => {
  console.log(`Debounced search triggered - Query: "${query}", Grade: "${gradeQuery}"`);

  // Determine final query
  let finalQuery = query.trim();
  if (!finalQuery && gradeQuery) {
    finalQuery = gradeQuery;
  }

  // Reset pagination for new search
  pagination.value.current_page = 1;
  await fetchEmployees(finalQuery, 1, false);
}, 500);

const handleEmployeeSearch = (query) => {
  console.log(`Employee search handler called with: "${query}"`);
  employeeSearchQuery.value = query;

  // Get grade-based query from selected subject
  const gradeQuery = getGradeQueryBySubjectId(filters.value.subject);

  console.log(`Grade query: "${gradeQuery}"`);

  if (!query.trim() && !gradeQuery) {
    // If no query and no grade filter, load initial employees
    pagination.value.current_page = 1;
    fetchEmployees("", 1, false);
  } else {
    // Use debounced search
    debouncedFetchEmployees(query, gradeQuery);
  }
};

const loadMoreEmployees = async () => {
  console.log("=== loadMoreEmployees called ===");
  console.log("Employee loading state:", employeeLoading.value);
  console.log("Current page:", pagination.value.current_page);
  console.log("Last page:", pagination.value.last_page);
  console.log("Can load more:", canLoadMoreEmployees.value);
  console.log("Current employees count:", employees.value.length);
  console.log("Total employees:", pagination.value.total);

  // Prevent loading if already loading or no more pages
  if (employeeLoading.value) {
    console.log("Already loading, aborting");
    return Promise.resolve();
  }

  if (!canLoadMoreEmployees.value) {
    console.log("No more pages to load");
    return Promise.resolve();
  }

  const nextPage = pagination.value.current_page + 1;
  console.log("Loading page:", nextPage);

  // Determine current query for pagination
  const gradeQuery = getGradeQueryBySubjectId(filters.value.subject);
  let currentQuery = employeeSearchQuery.value.trim();

  if (!currentQuery && gradeQuery) {
    currentQuery = gradeQuery;
  }

  console.log("Using query for load more:", currentQuery);

  try {
    await fetchEmployees(currentQuery, nextPage, true);
    console.log("Successfully loaded more employees");
    console.log("New employee count:", employees.value.length);
  } catch (error) {
    console.error("Error in loadMoreEmployees:", error);
  }
};

// Training functions
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

const debouncedFetchTrainings = debounce(async (query) => {
  trainingPagination.value.current_page = 1;
  await fetchTrainings(query, 1, false);
}, 500);

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
  console.log("=== loadMoreTrainings called ===");
  console.log("Training loading state:", trainingLoading.value);
  console.log("Current page:", trainingPagination.value.current_page);
  console.log("Last page:", trainingPagination.value.last_page);
  console.log("Can load more:", canLoadMoreTrainings.value);

  if (trainingLoading.value) {
    console.log("Already loading, aborting");
    return Promise.resolve();
  }

  if (!canLoadMoreTrainings.value) {
    console.log("No more pages to load");
    return Promise.resolve();
  }

  const nextPage = trainingPagination.value.current_page + 1;
  console.log("Loading page:", nextPage);

  try {
    await fetchTrainings(trainingSearchQuery.value, nextPage, true);
    console.log("Successfully loaded more trainings");
  } catch (error) {
    console.error("Error in loadMoreTrainings:", error);
  }
};

// Generate report function
const generateReport = async () => {
  // Additional validation before submission
  if (!isFormValid.value) {
    alert('Please complete all required fields before generating the report.')
    return
  }

  loading.value = true
  try {
    const params = {
      subject: filters.value.subject,
      fiscal_years: [...new Set(filters.value.fiscalYears.map(fy => fy.value))],
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
    }

    // Include employee_id only for subjects 2, 5, 8, 11
    if (showEmployeeDropdown.value && filters.value.employee_id) {
      params.employee_id = filters.value.employee_id
    }

    // Include training_id only for subjects 3, 6, 9, 11
    if (showTrainingDropdown.value && filters.value.training_id) {
      params.training_id = filters.value.training_id
    }

    console.log('Generating report with params:', params)

    const response = await api.get('/training-reports', {
      params,
      headers: { 'Accept': 'application/pdf' },
      responseType: 'blob',
    })

    // Extract filename and download
    const contentDisposition = response.headers['content-disposition']
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
    const filename = filenameMatch ? filenameMatch[1] : 'training_report.pdf'

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to generate report."
    alert(`${errorMessage}`)
    console.error('Report generation error:', err)
  } finally {
    loading.value = false
  }
}

// Watch for subject changes
watch(
  () => filters.value.subject,
  (newSubjectId) => {
    console.log(`Subject changed to: ${newSubjectId}`)
    console.log(`Show employee dropdown: ${showEmployeeDropdown.value}`)
    console.log(`Show training dropdown: ${showTrainingDropdown.value}`)

    // Reset selections
    filters.value.employee_id = null
    filters.value.training_id = null

    // Handle training dropdown
    if (showTrainingDropdown.value) {
      console.log('Loading trainings for subject:', newSubjectId)
      trainingPagination.value.current_page = 1
      trainingSearchQuery.value = ""
      fetchTrainings("", 1, false)
    }

    // Handle employee dropdown
    if (showEmployeeDropdown.value) {
      const gradeQuery = getGradeQueryBySubjectId(newSubjectId)
      console.log(`Loading employees for subject ${newSubjectId} with grade query: "${gradeQuery}"`)

      // Reset state
      pagination.value.current_page = 1
      employeeSearchQuery.value = ""

      // Fetch employees with grade filter
      if (gradeQuery) {
        fetchEmployees(gradeQuery, 1, false)
      } else {
        fetchEmployees("", 1, false)
      }
    }
  },
  { immediate: true }
)

// Also add better debugging for the computed properties
watch(showEmployeeDropdown, (newValue) => {
  console.log('showEmployeeDropdown changed to:', newValue)
  console.log('Current subject:', filters.value.subject)
})

watch(showTrainingDropdown, (newValue) => {
  console.log('showTrainingDropdown changed to:', newValue)
  console.log('Current subject:', filters.value.subject)
})

// Add form validation computed properties and methods
const validationErrors = computed(() => {
  const errors = []

  // Subject is required
  if (!filters.value.subject) {
    errors.push('Subject selection is required')
  }

  // Employee is required for specific subjects
  if (SubjectGradeHelper.requiresEmployee(filters.value.subject) && !filters.value.employee_id) {
    errors.push('Employee selection is required for this report type')
  }

  // Training is required for specific subjects
  if (SubjectGradeHelper.requiresTraining(filters.value.subject) && !filters.value.training_id) {
    errors.push('Training selection is required for this report type')
  }

  return errors
})

const isFormValid = computed(() => {
  // Basic validation
  if (!filters.value.subject) return false

  // Employee validation for specific subjects
  if (SubjectGradeHelper.requiresEmployee(filters.value.subject) && !filters.value.employee_id) {
    return false
  }

  // Training validation for specific subjects
  if (SubjectGradeHelper.requiresTraining(filters.value.subject) && !filters.value.training_id) {
    return false
  }

  return true
})
</script>
