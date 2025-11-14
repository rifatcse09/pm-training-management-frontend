<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <EcommerceMetrics :stats="trainingStats" :loading="loading" />
      <MonthlySale :chartData="monthlyChartData" :loading="chartLoading" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/composables/useApi";
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '../components/ecommerce/MonthlySale.vue'

const currentPageTitle = ref("Training Dashboard");
const trainingStats = ref({});
const loading = ref(false);
const monthlyChartData = ref({});
const chartLoading = ref(false);

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

const fetchMonthlyChartData = async () => {
  chartLoading.value = true;
  try {
    console.log('Fetching monthly chart data...');
    const currentYear = new Date().getFullYear();
    const response = await api.get(`/dashboard/monthly-chart?designation_type=ninth_grade&year=${currentYear}`);
    console.log('Chart API Response:', response);
    monthlyChartData.value = response.data || {};
  } catch (error) {
    console.error('Failed to fetch monthly chart data:', error);
    monthlyChartData.value = {};
  } finally {
    chartLoading.value = false;
  }
};

onMounted(() => {
  fetchTrainingStats();
  fetchMonthlyChartData();
});
</script>
