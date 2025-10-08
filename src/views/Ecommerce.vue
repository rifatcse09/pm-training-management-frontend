<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <!-- Debug info -->
      <!-- <div class="text-xs text-gray-500 mb-2">
        Loading: {{ loading }}, Stats: {{ JSON.stringify(trainingStats) }}
      </div> -->
      <EcommerceMetrics :stats="trainingStats" :loading="loading" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/composables/useApi";
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'

const currentPageTitle = ref("Training Dashboard");
const trainingStats = ref({});
const loading = ref(false);

const fetchTrainingStats = async () => {
  loading.value = true;
  try {
    console.log('Fetching training stats...');
    const response = await api.get('/dashboard/training-stats');
    console.log('API Response:', response);
    trainingStats.value = response.data || {};
    console.log('Training stats set to:', trainingStats.value);
  } catch (error) {
    console.error('Failed to fetch training stats:', error);
    console.error('Error response:', error.response?.data);
    trainingStats.value = {};
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchTrainingStats());
</script>
