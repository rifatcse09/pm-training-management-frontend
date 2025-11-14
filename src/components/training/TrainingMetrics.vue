<template>
  <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
    <div v-for="i in 3" :key="i" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="animate-pulse">
        <div class="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
        <div class="mt-5">
          <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
          <div class="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16 mt-2"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
    <!-- Debug info -->
    <!-- <div class="col-span-full text-xs text-gray-500 mb-2">
      Debug: {{ JSON.stringify(stats) }}
    </div> -->

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
      >
      <svg
          class="fill-gray-800 dark:fill-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5h-2v5H7v-6.5H5.5L12 5l6.5 5.5H17V16h-2v-5h-2v5h-2z"
            fill=""
          />
        </svg>
      </div>

      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">মোট প্রশিক্ষণ</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {{ stats.data?.total_trainings_this_year || 0 }}
          </h4>
        </div>
      </div>
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
      >
      <svg
          class="fill-gray-800 dark:fill-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5h-2v5H7v-6.5H5.5L12 5l6.5 5.5H17V16h-2v-5h-2v5h-2z"
            fill=""
          />
        </svg>
      </div>

      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">স্থানীয় প্রশিক্ষণ</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {{ stats.data?.local_trainings || 0 }}
          </h4>
        </div>
      </div>
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
      >
        <svg
          class="fill-gray-800 dark:fill-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5h-2v5H7v-6.5H5.5L12 5l6.5 5.5H17V16h-2v-5h-2v5h-2z"
            fill=""
          />
        </svg>
      </div>

      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">বৈদেশিক প্রশিক্ষণ</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {{ stats.data?.remote_trainings || 0 }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  stats: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>
