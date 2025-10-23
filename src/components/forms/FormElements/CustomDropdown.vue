<template>
  <div class="relative">
    <!-- Selected Option Display -->
    <div
      class="flex items-center justify-between border rounded px-4 py-2 cursor-pointer"
      @click="toggleDropdown"
    >
      <span class="text-gray-700 truncate">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        placeholder="Search employees..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    <!-- Dropdown List -->
    <div v-if="dropdownVisible" class="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
      <ul
        v-if="options.length"
        class="max-h-60 overflow-y-auto"
        @scroll="onScroll"
        ref="scrollContainer"
      >
        <li
          v-for="(option, index) in options"
          :key="option.value"
          @click="selectOption(option)"
          :class="{
            'px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0': true,
            'hover:bg-gray-50': highlightedIndex !== index,
            'bg-blue-50': highlightedIndex === index,
          }"
        >
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ option.name }}</span>
            <span class="text-sm text-gray-500">
              Grade: {{ option.grade || 'N/A' }}
              <span v-if="option.designation" class="ml-2">| {{ option.designation }}</span>
            </span>
          </div>
        </li>
        <!-- Loading indicator -->
        <li v-if="loading" class="px-4 py-2 text-center text-gray-500 border-t border-gray-200">
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more...
          </div>
        </li>
      </ul>
      <p v-if="!options.length && !loading" class="text-sm text-gray-500 px-4 py-2">No employees found.</p>
      <p v-if="!options.length && loading" class="text-sm text-gray-500 px-4 py-2">Loading employees...</p>
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
  fetchMore: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

const searchQuery = ref("");
const dropdownVisible = ref(false);
const highlightedIndex = ref(-1);
const selectedOption = ref(null);
const scrollContainer = ref(null);
const isLoadingMore = ref(false);

const onSearch = () => {
  emit("search", searchQuery.value);
};

const selectOption = (option) => {
  selectedOption.value = option;
  emit("update:modelValue", props.reduce(option));
  searchQuery.value = "";
  dropdownVisible.value = false;
};

const selectHighlightedOption = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < props.options.length) {
    selectOption(props.options[highlightedIndex.value]);
  }
};

const navigateDropdown = (direction) => {
  if (!dropdownVisible.value) {
    dropdownVisible.value = true;
    return;
  }

  if (direction === "down") {
    highlightedIndex.value = (highlightedIndex.value + 1) % props.options.length;
  } else if (direction === "up") {
    highlightedIndex.value = (highlightedIndex.value - 1 + props.options.length) % props.options.length;
  }
};

const onScroll = (event) => {
  if (!props.fetchMore) {
    console.log("No fetchMore function provided");
    return;
  }
  
  if (isLoadingMore.value || props.loading) {
    console.log("Already loading, skipping scroll trigger");
    return;
  }
  
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  const threshold = 50; // Increased threshold for better detection
  const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - threshold;
  
  console.log("Scroll event:", {
    scrollTop,
    scrollHeight,
    clientHeight,
    threshold,
    scrolledToBottom,
    loading: props.loading
  });
  
  if (scrolledToBottom) {
    console.log("Triggering fetchMore...");
    isLoadingMore.value = true;
    
    // Ensure fetchMore returns a promise
    const result = props.fetchMore();
    if (result && typeof result.finally === 'function') {
      result.finally(() => {
        isLoadingMore.value = false;
        console.log("fetchMore completed");
      });
    } else {
      // If fetchMore doesn't return a promise, reset loading state after a delay
      setTimeout(() => {
        isLoadingMore.value = false;
        console.log("fetchMore completed (timeout)");
      }, 1000);
    }
  }
};

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
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
        selectedOption.value = matchedOption;
      }
    } else {
      selectedOption.value = null;
    }
  },
  { immediate: true }
);
</script>
