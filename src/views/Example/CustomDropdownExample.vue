<template>
  <CustomDropdown
    :options="options"
    v-model="selectedOption"
    :reduce="option => option.id"
    :fetchMore="fetchMoreOptions"
    :loading="loading"
    @search="handleSearch"
  />
  <p class="mt-4">Selected Option: {{ selectedOption }}</p>
</template>

<script setup>
import { ref } from "vue";
import CustomDropdown from "@/components/forms/FormElements/CustomDropdown.vue";

const options = ref([
  { id: 1, label: "Option 1" },
  { id: 2, label: "Option 2" },
  { id: 3, label: "Option 3" },
]);

const selectedOption = ref(null);
const loading = ref(false);

const handleSearch = (query) => {
  console.log("Search query:", query);
  // Implement search logic here
};

const fetchMoreOptions = () => {
  console.log("Fetching more options...");
  // Implement fetch more logic here
};
</script>
