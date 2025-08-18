<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @input="filterOptions"
      @focus="expandList"
      @blur="collapseList"
      placeholder="Search..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
    <ul
      v-if="isListExpanded && filteredOptions.length > 0"
      class="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="option in filteredOptions"
        :key="option.value"
        @mousedown.prevent="selectOption(option)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
      >
        {{ option.label }}
      </li>
    </ul>
    <p v-if="modelValue" class="mt-2 text-sm text-gray-600">Selected: {{ modelValue.label }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const filteredOptions = ref([])
const isListExpanded = ref(false)

const filterOptions = () => {
  filteredOptions.value = props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const selectOption = (option) => {
  emit('update:modelValue', option)
  searchQuery.value = option.label
  isListExpanded.value = false
}

const expandList = () => {
  isListExpanded.value = true
  filterOptions()
}

const collapseList = () => {
  setTimeout(() => {
    isListExpanded.value = false
  }, 200) // Delay to allow click events on options to register
}

watch(() => props.options, filterOptions, { immediate: true })
</script>
