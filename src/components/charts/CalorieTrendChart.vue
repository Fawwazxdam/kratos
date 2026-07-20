<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { DailySummary } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const props = defineProps<{
  data: DailySummary[]
}>()

const isDark = ref(false)

function updateDark() {
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  updateDark()
  const observer = new MutationObserver(updateDark)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  onUnmounted(() => observer.disconnect())
})

const chartData = computed(() => ({
  labels: props.data.map((d) => {
    const date = new Date(d.date)
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
  }),
  datasets: [
    {
      label: 'Kalori',
      data: props.data.map((d) => d.total_calories),
      borderColor: '#f59e0b',
      backgroundColor: isDark.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#f59e0b',
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 600,
    easing: 'easeInOutQuart' as const,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: { color: isDark.value ? '#374151' : '#f3f4f6' },
      ticks: { font: { size: 11 }, color: isDark.value ? '#6b7280' : '#6b7280' },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: isDark.value ? '#6b7280' : '#6b7280' },
    },
  },
}))
</script>

<template>
  <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <h3 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tren Kalori</h3>
    <div class="h-48">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
