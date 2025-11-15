<template>
  <div class="relative">
    <div
      @click="toggleDropdown"
      class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left cursor-pointer bg-white"
      :class="{ 'ring-2 ring-blue-500 border-blue-500': isOpen }"
    >
      <span v-if="selectedOption" class="block truncate">{{ selectedOption.label }}</span>
      <span v-else class="block truncate text-gray-400">{{ placeholder }}</span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
    >
      <!-- Search Input -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-3 py-2">
        <input
          ref="searchInput"
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          :placeholder="searchPlaceholder"
        />
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="px-3 py-2 text-center text-gray-500">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>

      <!-- Options -->
      <div
        ref="optionsContainer"
        @scroll="handleScroll"
        class="max-h-40 overflow-y-auto"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
          :class="{
            'bg-blue-50 text-blue-900': selectedOption && selectedOption.value === option.value,
            'text-gray-900': !selectedOption || selectedOption.value !== option.value
          }"
        >
          <span class="block truncate">{{ option.label }}</span>
          <span
            v-if="selectedOption && selectedOption.value === option.value"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>

        <!-- No results message -->
        <div v-if="!loading && options.length === 0" class="px-3 py-2 text-gray-500 text-center">
          No results found
        </div>

        <!-- Load more indicator -->
        <div
          v-if="!loading && canLoadMore"
          ref="loadMoreTrigger"
          class="px-3 py-2 text-center text-gray-500"
        >
          <div class="text-sm">Scroll down for more...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  reduce: {
    type: Function,
    default: (option) => option.value
  },
  loading: {
    type: Boolean,
    default: false
  },
  fetchMore: {
    type: Function,
    default: null
  },
  canLoadMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const optionsContainer = ref(null)
const loadMoreTrigger = ref(null)
const lastScrollTop = ref(0)

const selectedOption = computed(() => {
  if (!props.modelValue) return null
  return props.options.find(option => props.reduce(option) === props.modelValue)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectOption = (option) => {
  emit('update:modelValue', props.reduce(option))
  isOpen.value = false
  searchQuery.value = ''
}

const handleSearch = () => {
  console.log('Search query changed:', searchQuery.value)
  emit('search', searchQuery.value)
}

const handleScroll = () => {
  if (!optionsContainer.value || props.loading) {
    return
  }

  const container = optionsContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight

  console.log('Scroll event:', {
    scrollTop,
    scrollHeight,
    clientHeight,
    threshold: scrollHeight - clientHeight - 10,
    canLoadMore: props.canLoadMore,
    hasMoreFunction: !!props.fetchMore
  })

  // Check if scrolled near bottom (within 10px)
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    console.log('Near bottom, attempting to load more')
    
    if (props.fetchMore && props.canLoadMore && !props.loading) {
      console.log('Calling fetchMore function')
      props.fetchMore()
    }
  }

  lastScrollTop.value = scrollTop
}

// Use Intersection Observer as backup for infinite scroll
const setupIntersectionObserver = () => {
  if (!loadMoreTrigger.value || !props.fetchMore) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.canLoadMore && !props.loading) {
          console.log('Load more trigger intersected, calling fetchMore')
          props.fetchMore()
        }
      })
    },
    {
      root: optionsContainer.value,
      rootMargin: '0px',
      threshold: 0.1
    }
  )

  observer.observe(loadMoreTrigger.value)

  return observer
}

let intersectionObserver = null

watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      intersectionObserver = setupIntersectionObserver()
    })
  } else {
    if (intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
    }
  }
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})
</script>
