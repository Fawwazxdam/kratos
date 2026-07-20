<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  target: number
}>()

const percentage = computed(() => Math.min((props.current / props.target) * 100, 100).toFixed(0))
const isOver = computed(() => props.current > props.target)
</script>

<template>
  <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-sm dark:bg-amber-900/30">🔥</span>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Kalori</span>
      </div>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-bold"
        :class="isOver ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'"
      >
        {{ percentage }}%
      </span>
    </div>
    <div class="mt-3">
      <span class="text-3xl font-bold tabular-nums text-gray-900 dark:text-white">{{ current.toLocaleString() }}</span>
      <span class="text-sm text-gray-400"> / {{ target.toLocaleString() }}</span>
    </div>
    <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="isOver ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
