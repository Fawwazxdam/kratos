<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { DailySummary } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

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
      label: 'Protein (g)',
      data: props.data.map((d) => d.total_protein),
      backgroundColor: '#16a34a',
      borderRadius: 6,
      barPercentage: 0.6,
    },
    {
      label: 'Kalori (÷100)',
      data: props.data.map((d) => Math.round(d.total_calories / 100)),
      backgroundColor: '#f59e0b',
      borderRadius: 6,
      barPercentage: 0.6,
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
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 16,
        font: { size: 12 },
        color: isDark.value ? '#9ca3af' : '#374151',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
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
    <h3 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Nutrisi 7 Hari Terakhir</h3>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
