<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Name</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profile.name || "N/A" }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profile.email || "N/A" }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profile.role || "N/A" }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Designation</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profile.designation?.name || "N/A" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  profile: {
    type: Object,
    required: true,
  },
});
</script>
