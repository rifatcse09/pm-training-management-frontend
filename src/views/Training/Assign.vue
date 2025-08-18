<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Assign Employees to Training'" />
    <div class="space-y-6">
      <ComponentCard title="Assign Employees">
        <form @submit.prevent="assignEmployees" class="space-y-6">
          <!-- Training Selection -->
          <div>
            <label for="training" class="block text-sm font-medium text-gray-700 mb-2">Select Training</label>
            <div class="relative">
              <input
                type="text"
                v-model="trainingSearchQuery"
                @input="filterTrainings"
                placeholder="Search and select training..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ul
                v-if="trainingSearchQuery.length > 0 && filteredTrainings.length > 0"
                class="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <li
                  v-for="training in filteredTrainings"
                  :key="training.id"
                  @click="selectTraining(training)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ training.name }}
                </li>
              </ul>
            </div>
            <p v-if="selectedTraining" class="mt-2 text-sm text-gray-600">Selected: {{ selectedTraining.name }}</p>
          </div>

          <!-- Employee Selection -->
          <div>
            <label for="employees" class="block text-sm font-medium text-gray-700 mb-2">Select Employees</label>
            <MultipleSelect
              :options="filteredEmployees"
              v-model="selectedEmployees"
              placeholder="Search and select employees..."
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Assign
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/composables/useApi'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'

const router = useRouter()

// State variables
const trainings = ref([])
const employees = ref([])
const filteredTrainings = ref([])
const filteredEmployees = ref([])
const selectedTraining = ref(null)
const selectedEmployees = ref([])
const trainingSearchQuery = ref('')
const employeeSearchQuery = ref('')

// Fetch training list
const fetchTrainings = async () => {
  try {
    const response = await api.get('/trainings')
    trainings.value = response.data.data || []
    filteredTrainings.value = trainings.value
  } catch (error) {
    console.error('Failed to fetch trainings:', error.response?.data || error.message)
  }
}

// Fetch employee list
const fetchEmployees = async () => {
  try {
    const response = await api.get('/employees')
    // Ensure employees is an array and map to the correct format for MultipleSelect
    employees.value = Array.isArray(response.data.data) ? response.data.data.map(employee => ({
      value: employee.id,
      label: employee.name || 'Unnamed Employee', // Handle cases where name might be null
    })) : []
    filterEmployees() // Update the filtered list after fetching
  } catch (error) {
    console.error('Failed to fetch employees:', error.response?.data || error.message)
    employees.value = [] // Reset employees to an empty array on error
    filteredEmployees.value = [] // Reset filtered employees
  }
}

// Filter training list based on search query
const filterTrainings = () => {
  filteredTrainings.value = trainings.value.filter(training =>
    training.name.toLowerCase().includes(trainingSearchQuery.value.toLowerCase())
  )
}

// Filter employee list based on search query
const filterEmployees = () => {
  filteredEmployees.value = employees.value.filter(employee =>
    employee.label.toLowerCase().includes(employeeSearchQuery.value.toLowerCase())
  )
}

// Select training
const selectTraining = (training) => {
  selectedTraining.value = training
  trainingSearchQuery.value = training.name
  filteredTrainings.value = []
}

// Assign employees to training
const assignEmployees = async () => {
  if (!selectedTraining.value) {
    alert('Please select a training.')
    return
  }
  if (selectedEmployees.value.length === 0) {
    alert('Please select at least one employee.')
    return
  }
  try {
    await api.post('/trainings/assign', {
      training_id: selectedTraining.value.id,
      employee_ids: selectedEmployees.value.map(e => e.value),
    })
    alert('Employees assigned successfully!')
    router.push('/training-management/list')
  } catch (error) {
    console.error('Failed to assign employees:', error.response?.data || error.message)
  }
}

// Fetch initial data on mount
onMounted(() => {
  fetchTrainings()
  fetchEmployees()
})
</script>
