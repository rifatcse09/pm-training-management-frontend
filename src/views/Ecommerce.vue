<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Full-width section -->
      <div class="col-span-12 space-y-6">
        <ecommerce-metrics />
        <!-- <monthly-target /> -->
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
//mport MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
//import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'

export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    //MonthlyTarget,
    //MonthlySale
  },
  name: 'Ecommerce',
}
</script>
