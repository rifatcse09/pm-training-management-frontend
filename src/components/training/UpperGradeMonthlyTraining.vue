<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">10th Grade to Upper - This Year {{ new Date().getFullYear() }} Month wise Total Employee Training</h3>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
      <div v-else id="chartTwo" class="-ml-5 min-w-[400px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="300" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const series = computed(() => {
  if (props.chartData?.data?.series) {
    return props.chartData.data.series
  }
  return [
    {
      name: 'Training Data',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
})

const chartOptions = ref({
  colors: ['#10b981'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 20,
      bottom: 20,
      left: 10,
      right: 10,
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return val.toString()
      },
    },
  },
})
</script>
