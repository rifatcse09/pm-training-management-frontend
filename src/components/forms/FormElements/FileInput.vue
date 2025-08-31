<template>
  <div class="file-input-wrapper">
    <label
      :for="name"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      type="file"
      :name="name"
      :accept="accept"
      @change="onFileSelected"
      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <p v-if="helperText" class="text-sm text-gray-500 mt-1">{{ helperText }}</p>
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Define props
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
  error: {
    type: String,
    default: "",
  },
  accept: {
    type: String,
    default: "", // Specify accepted file types (e.g., "application/pdf, .doc, .docx")
  },
});

// Define emits
const emit = defineEmits(["file-selected"]);

// Handle file selection
const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit("file-selected", file); // Emit the selected file
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
