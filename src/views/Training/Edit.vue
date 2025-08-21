<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Edit Training" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="updateTraining" class="text-left">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 text-left">Name</label>
                <input
                  id="name"
                  v-model="training.name"
                  type="text"
                  placeholder="Enter training name"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 text-left">Type</label>
                <select
                  id="type"
                  v-model="training.type"
                  @change="handleTypeChange"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select Type</option>
                  <option value="1">স্থানীয়</option>
                  <option value="2">বৈদেশিক</option>
                </select>
              </div>
              <div v-if="training.type === '2'">
                <label for="countries" class="block text-sm font-medium text-gray-700 text-left">Countries</label>
                <MultipleSelect
                  id="countries"
                  v-model="selectedCountries"
                  :options="countries"
                  :reduce="country => country.value"
                  placeholder="Search and select countries..."
                />
                <p v-if="errors.countries" class="text-red-500 text-sm mt-1">{{ errors.countries[0] }}</p>
              </div>
              <div>
                <label for="organization_id" class="block text-sm font-medium text-gray-700 mb-2">Select Organization</label>
                <CustomDropdown
                  :options="filteredOrganizations"
                  v-model="training.organization_id"
                  :reduce="org => org.id"
                  :fetchMore="loadMoreOrganizations"
                  :loading="loading"
                  @search="handleOrganizationSearch"
                  placeholder="Search and select organization..."
                />
                <p v-if="errors.organization_id" class="text-red-500 text-sm mt-1">{{ errors.organization_id[0] }}</p>
              </div>
              <div>
                <label for="start_date" class="block text-sm font-medium text-gray-700 text-left">Start Date</label>
                <flat-pickr
                  v-model="training.start_date"
                  :config="flatpickrConfig"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label for="end_date" class="block text-sm font-medium text-gray-700 text-left">End Date</label>
                <flat-pickr
                  v-model="training.end_date"
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
                  v-model="training.total_days"
                  type="number"
                  placeholder="Enter total days"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                />
              </div>
              <div>
                <FileInput name="file_link" @file-selected="handleFileUpload" />
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import debounce from "lodash.debounce";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import FileInput from "@/components/forms/FormElements/FileInput.vue";
import api from "@/composables/useApi";
import { extractData } from "@/utils/apiResponseHandler";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import MultipleSelect from "@/components/forms/FormElements/MultipleSelect.vue";
import CustomDropdown from "@/components/forms/FormElements/CustomDropdown.vue";

const route = useRoute();
const router = useRouter();
const currentPageTitle = ref("Edit Training");
const training = ref({
  name: "",
  type: "",
  organization_id: "",
  start_date: "",
  end_date: "",
  total_days: "",
  file_link: null,
  countries: [],
});

const selectedCountries = ref([]);
const organizations = ref([]);
const filteredOrganizations = computed(() => {
  return organizations.value.map((org) => ({
    id: org.id,
    label: org.name,
  }));
});
const countries = ref([]);
const errors = ref({});
const searchQuery = ref("");
const loading = ref(false);

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

const flatpickrConfig = {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
};

const fetchTraining = async () => {
  try {
    const response = await api.get(`/trainings/${route.params.id}`);
    const data = extractData(response);

    training.value = {
      name: data.name,
      type: data.type.toString(),
      organization_id: data.organization_id,
      start_date: data.start_date,
      end_date: data.end_date,
      total_days: data.total_days,
      file_link: null,
      countries: data.countries || [],
    };

    // Ensure the selected organization is in the dropdown options
    if (!organizations.value.find((org) => org.id === training.value.organization_id)) {
      organizations.value.push({
        id: training.value.organization_id,
        name: data.organization_name || "Unknown Organization",
      });
    }

    // Set selectedCountries to an array of country IDs if type is 2
    if (training.value.type === "2") {
      selectedCountries.value = training.value.countries.map((country) => ({
        value: country.id,
        label: country.name,
      }));
      fetchCountries(); // Ensure countries options are loaded
    }
  } catch (error) {
    console.error("Failed to fetch training:", error.response?.data || error.message);
    alert("Failed to load training data.");
  }
};

const fetchOrganizations = async (query = "", page = 1) => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await api.get("/organizers", { params: { search: query, page } });
    const data = response.data;

    if (page === 1) {
      organizations.value = data.data || [];
    } else {
      organizations.value = [...organizations.value, ...(data.data || [])];
    }

    pagination.value = data.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  } catch (error) {
    console.error("Failed to fetch organizations:", error.response?.data || error.message);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchOrganizations = debounce((query) => {
  fetchOrganizations(query, 1);
}, 500);

const handleOrganizationSearch = (query) => {
  searchQuery.value = query;
  debouncedFetchOrganizations(query);
};

const loadMoreOrganizations = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    fetchOrganizations(searchQuery.value, pagination.value.current_page + 1);
  }
};

const fetchCountries = async () => {
  try {
    const response = await api.get("/countries");
    countries.value = response.data.data.map((country) => ({
      value: country.id,
      label: country.name,
    }));
  } catch (error) {
    console.error("Failed to fetch countries:", error.response?.data || error.message);
  }
};

const handleFileUpload = (file) => {
  if (file) {
    training.value.file_link = file;
  }
};

const handleTypeChange = () => {
  if (training.value.type === "2") {
    fetchCountries();
  }
};

const updateTraining = async () => {
  // Map selectedCountries to an array of country IDs if type is 2
  if (training.value.type === "2") {
    training.value.countries = selectedCountries.value.map((country) => country.value || country);
  } else {
    training.value.countries = []; // Clear countries if type is not 2
  }

  const formData = new FormData();
  formData.append('_method', 'PUT'); // Spoof PUT for Laravel

  Object.entries(training.value).forEach(([key, val]) => {
    if (key === "countries") return; // Handle countries separately
    if (key === "file_link") {
      if (val instanceof File) {
        formData.append(key, val); // Append file only if it's a valid File object
      }
    } else if (val !== null && val !== undefined) {
      formData.append(key, val);
    }
  });

  // Append countries as an array if type is 2
  if (Array.isArray(training.value.countries)) {
    training.value.countries.forEach((id) => formData.append("countries[]", id));
  }

  try {
    await api.post(`/trainings/${route.params.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Training updated successfully!");
    router.push("/training-management/list");
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error("Failed to update training:", error.response?.data || error.message);
      alert("Failed to update training. Please try again.");
    }
  }
};

onMounted(() => {
  fetchTraining();
  fetchOrganizations();
});
</script>
