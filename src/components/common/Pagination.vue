<template>
  <div class="mt-4 flex justify-between items-center">
    <button
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded"
      :disabled="pagination.currentPage === 1"
      @click="changePage(pagination.currentPage - 1)"
    >
      Previous
    </button>
    <span class="text-sm text-gray-700">
      Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
    </span>
    <button
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded"
      :disabled="pagination.currentPage === pagination.lastPage"
      @click="changePage(pagination.currentPage + 1)"
    >
      Next
    </button>
    <div class="flex items-center space-x-2 ml-4">
      <label for="pageInput" class="text-sm text-gray-700">Go to page:</label>
      <input
        id="pageInput"
        type="number"
        class="border border-gray-300 rounded px-2 py-1 text-sm"
        v-model.number="specificPage"
        min="1"
        :max="pagination.lastPage"
      />
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded"
        @click="goToSpecificPage"
      >
        Go
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  changePage: {
    type: Function,
    required: true,
  },
});

const specificPage = ref(1);

const goToSpecificPage = () => {
  if (specificPage.value < 1 || specificPage.value > props.pagination.lastPage) {
    alert("Invalid page number.");
    return;
  }
  props.changePage(specificPage.value);
};
</script>
