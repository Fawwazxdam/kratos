<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  target: number
}>()

const percentage = computed(() => Math.min((props.current / props.target) * 100, 100))

const circumference = 2 * Math.PI * 54
const dashOffset = computed(() => circumference - (percentage.value / 100) * circumference)

const isComplete = computed(() => props.current >= props.target)
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative h-32 w-32">
      <svg class="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="protein-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22c55e" />
            <stop offset="100%" stop-color="#16a34a" />
          </linearGradient>
          <filter id="protein-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#f3f4f6"
          stroke-width="10"
          class="dark:stroke-gray-700"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#protein-ring)"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :filter="isComplete ? 'url(#protein-glow)' : undefined"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{{ current }}<span class="text-sm font-medium text-gray-400">g</span></span>
        <span class="text-xs text-gray-400">/ {{ target }}g</span>
      </div>
    </div>
    <p class="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Protein</p>
    <p class="text-[10px] font-medium text-gray-400">{{ Math.round(percentage) }}% tercapai</p>
  </div>
</template>
