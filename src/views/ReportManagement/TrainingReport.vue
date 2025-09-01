<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex justify-start">
      <div class="w-full max-w-2xl space-y-5 sm:space-y-6">
        <ComponentCard title="Training Report" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <form @submit.prevent="filterReport" class="text-left">
            <div class="grid grid-cols-1 gap-6">
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
              <div>
                <label for="fiscalYear" class="block text-sm font-medium text-gray-700 text-left">Fiscal Year</label>
                <MultipleSelect
                  id="fiscalYear"
                  v-model="filters.fiscalYears"
                  :options="fiscalYears"
                  :reduce="year => year.value"
                  placeholder="Select fiscal years..."
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="start_date" class="block text-sm font-medium text-gray-700 text-left">Start Date</label>
                  <flat-pickr
                    v-model="filters.startDate"
                    :config="flatpickrConfig"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                    placeholder="Select start date"
                  />
                </div>
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
            <div class="mt-6 flex justify-start">
              <button
                type="submit"
                class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left"
              >
                Run Report
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import MultipleSelect from "@/components/forms/FormElements/MultipleSelect.vue";

const currentPageTitle = ref("Training Report");
const filters = ref({
  subject: "",
  fiscalYears: [],
  startDate: "",
  endDate: "",
});

const subjects = ref([
  { id: 1, name: "কর্মচারী/কর্মকর্তা ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
  { id: 2, name: "প্রকল্প অনুসারে মোট প্রশিক্ষনের প্রতিবেদন" },
  { id: 3, name: "৬০ ঘন্টা ১১ তম গ্রেডের কর্মচারীদের বিষয় ভিত্তিক প্রশিক্ষনের প্রতিবেদন" },
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

const flatpickrConfig = {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
};

const filterReport = () => {
  console.log("Filters applied:", filters.value);
  alert("Report filtered successfully!");
};
</script>
