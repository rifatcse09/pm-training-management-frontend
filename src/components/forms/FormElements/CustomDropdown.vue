<template>
  <div class="relative">
    <!-- Selected Option Display -->
    <div
      class="flex items-center justify-between border rounded px-4 py-2 cursor-pointer"
      @click="toggleDropdown"
    >
      <span class="text-gray-700">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Search Input -->
    <div v-if="dropdownVisible" class="mt-2">
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        @keydown.down.prevent="navigateDropdown('down')"
        @keydown.up.prevent="navigateDropdown('up')"
        @keydown.enter.prevent="selectHighlightedOption"
        placeholder="Search..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    <!-- Dropdown List -->
    <div v-if="dropdownVisible" class="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
      <ul
        v-if="filteredOptions.length"
        class="max-h-60 overflow-y-auto"
        @scroll="onScroll"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.id"
          @click="selectOption(option)"
          :class="{
            'px-4 py-2 cursor-pointer': true,
            'hover:bg-gray-100': highlightedIndex !== index,
            'bg-blue-100': highlightedIndex === index,
          }"
        >
          {{ option.label }}
        </li>
      </ul>
      <p v-if="!filteredOptions.length && !loading" class="text-sm text-gray-500 px-4 py-2">No options found.</p>
      <p v-if="loading" class="text-sm text-gray-500 px-4 py-2">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  reduce: {
    type: Function,
    required: true,
  },
  modelValue: {
    type: [String, Number, Object],
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Search...",
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

const searchQuery = ref("");
const dropdownVisible = ref(false); // State to control dropdown visibility
const highlightedIndex = ref(-1); // Tracks the currently highlighted option
const selectedOption = ref(null); // Tracks the currently selected option

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const onSearch = () => {
  emit("search", searchQuery.value); // Emit the search query
};

const selectOption = (option) => {
  selectedOption.value = option; // Update the selected option
  emit("update:modelValue", props.reduce(option)); // Emit the selected value
  searchQuery.value = ""; // Clear the search input
  dropdownVisible.value = false; // Hide the dropdown
};

const selectHighlightedOption = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value]); // Select the highlighted option
  }
};

const navigateDropdown = (direction) => {
  if (!dropdownVisible.value) {
    dropdownVisible.value = true;
    return;
  }

  if (direction === "down") {
    highlightedIndex.value =
      (highlightedIndex.value + 1) % filteredOptions.value.length; // Move down
  } else if (direction === "up") {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length; // Move up
  }
};

const onScroll = (event) => {
  if (props.fetchMore) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      props.fetchMore(); // Trigger fetchMore when scrolled to the bottom
    }
  }
};

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value; // Toggle the dropdown visibility
};

// Watch for changes in the modelValue and update the selectedOption
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const matchedOption = props.options.find(
        (option) => props.reduce(option) === newValue
      );
      if (matchedOption) {
        selectedOption.value = matchedOption; // Set the selected option
      }
    }
  },
  { immediate: true }
);
</script>
