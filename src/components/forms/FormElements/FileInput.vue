<template>
  <div class="file-input-wrapper">
    <label
      for="file-input"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>
    <input
      id="file-input"
      type="file"
      :name="name"
      @change="onFileSelected"
      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <p v-if="helperText" class="text-sm text-gray-500 mt-1">{{ helperText }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "Choose a file",
  },
  helperText: {
    type: String,
    default: "",
  },
});

defineEmits(["file-selected"]);

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit("file-selected", file);
  }
};
</script>

<style scoped>
.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="file"] {
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
