<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Trainings Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Total Trainings</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ loading ? '...' : trainingStats.total_trainings_this_year }}
          </p>
        </div>
      </div>
    </div>

    <!-- Local Trainings Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Local Trainings</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ loading ? '...' : trainingStats.local_trainings }}
          </p>
        </div>
      </div>
    </div>

    <!-- Remote Trainings Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 7v10a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1V5a3 3 0 00-3-3H9a3 3 0 00-3 3v2H5a2 2 0 00-2 2z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Remote Trainings</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ loading ? '...' : trainingStats.remote_trainings }}
          </p>
        </div>
      </div>
    </div>

    <!-- Year Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Current Year</p>
          <p class="text-2xl font-semibold text-gray-900">
            {{ loading ? '...' : trainingStats.year }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DashboardMetrics',
  data() {
    return {
      loading: true,
      trainingStats: {
        total_trainings_this_year: 0,
        local_trainings: 0,
        remote_trainings: 0,
        year: new Date().getFullYear()
      }
    }
  },
  async mounted() {
    await this.fetchTrainingStats()
  },
  methods: {
    async fetchTrainingStats() {
      try {
        this.loading = true
        const response = await axios.get('/api/v1/dashboard/training-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })

        if (response.data.status === 'success' || response.data.status === 200) {
          this.trainingStats = response.data.data
        }
      } catch (error) {
        console.error('Error fetching training stats:', error)
        // Handle error - maybe show a notification
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
