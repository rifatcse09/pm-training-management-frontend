<template>
  <div class="flex justify-between items-center mt-4">
    <div>
      <p class="text-sm text-gray-600">
        Showing {{ startItem }} to {{ endItem }} of {{ pagination.total }} entries
      </p>
    </div>
    <div class="flex space-x-2">
      <button
        :disabled="pagination.current_page === 1"
        @click="changePage(pagination.current_page - 1)"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <button
        :disabled="pagination.current_page === pagination.last_page"
        @click="changePage(pagination.current_page + 1)"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

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

const startItem = computed(() => {
  return (props.pagination.current_page - 1) * props.pagination.per_page + 1;
});

const endItem = computed(() => {
  return Math.min(
    props.pagination.current_page * props.pagination.per_page,
    props.pagination.total
  );
});
</script>
