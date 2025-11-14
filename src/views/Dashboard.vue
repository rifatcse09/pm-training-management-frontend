<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Full-width section -->
      <div class="col-span-12 space-y-6">
        <dashboard-metrics />
        <monthly-target />
        <monthly-sale />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import DashboardMetrics from '../components/dashboard/DashboardMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'

export default {
  components: {
    AdminLayout,
    DashboardMetrics,
    MonthlyTarget,
    MonthlySale
  },
  name: 'DashboardMetrics',
}
</script>
