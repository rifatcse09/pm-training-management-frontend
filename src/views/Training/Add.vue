<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Add Training" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="addTraining" class="text-left">
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
                <label for="organization_id" class="block text-sm font-medium text-gray-700 text-left">Organization</label>
                <select
                  id="organization_id"
                  v-model="training.organization_id"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                  required
                >
                  <option value="" disabled>Select Organization</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">
                    {{ org.name }}
                  </option>
                </select>
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
                Add Training
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
import { useRouter } from "vue-router";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import FileInput from "@/components/forms/FormElements/FileInput.vue";
import api from "@/composables/useApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import MultipleSelect from "@/components/forms/FormElements/MultipleSelect.vue";

const router = useRouter();
const currentPageTitle = ref("Add Training");
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
const countries = ref([]);
const errors = ref({});

const flatpickrConfig = {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
};

const fetchOrganizations = async () => {
  try {
    const response = await api.get("/organizers");
    organizations.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch organizations:", error.response?.data || error.message);
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

const addTraining = async () => {
  training.value.countries = selectedCountries.value.map((country) => country.value || country);

  const formData = new FormData();
  Object.entries(training.value).forEach(([key, val]) => {
    if (key === "countries") return;
    if (key === "file_link" && !val) return;
    formData.append(key, val);
  });

  if (Array.isArray(training.value.countries)) {
    training.value.countries.forEach((id) => formData.append("countries[]", id));
  }

  try {
    await api.post("/trainings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Training added successfully!");
    router.push("/training-management/list");
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error("Failed to add training:", error.response?.data || error.message);
      alert("Failed to add training. Please try again.");
    }
  }
};

onMounted(() => {
  fetchOrganizations();
  if (training.value.type === "2") {
    fetchCountries();
  }
});
</script>