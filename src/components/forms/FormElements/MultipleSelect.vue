<template>
  <div class="relative" ref="multiSelectRef">
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2 border rounded-lg cursor-pointer bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <span class="text-gray-500" v-if="selectedItems.length === 0">Select items...</span>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in selectedItems"
          :key="item.value"
          class="flex items-center px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-full"
        >
          {{ item.label }}
          <button
            @click.stop="removeItem(item)"
            class="ml-1 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </span>
      </div>
      <svg
        class="w-5 h-5 text-gray-500"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
    >
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="w-full px-4 py-2 border-b border-gray-300 focus:outline-none"
      />
      <ul class="max-h-60 overflow-y-auto">
        <li
          v-for="item in filteredOptions"
          :key="item.value"
          @click="toggleItem(item)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          <span>{{ item.label }}</span>
          <svg
            v-if="isSelected(item)"
            class="w-5 h-5 text-blue-500 float-right"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectedItems = ref([...props.modelValue])
const multiSelectRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const toggleItem = (item) => {
  const index = selectedItems.value.findIndex((selected) => selected.value === item.value)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
  emit('update:modelValue', selectedItems.value)
}

const removeItem = (item) => {
  const index = selectedItems.value.findIndex((selected) => selected.value === item.value)
  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    emit('update:modelValue', selectedItems.value)
  }
}

const isSelected = (item) => {
  return selectedItems.value.some((selected) => selected.value === item.value)
}

const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleClickOutside = (event) => {
  if (multiSelectRef.value && !multiSelectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
