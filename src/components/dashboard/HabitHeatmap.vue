<script setup lang="ts">
import { computed } from 'vue'
import { buildHeatmapWeeks } from '@/utils/heatmap'
import type { DailyLog } from '@/types'

const props = defineProps<{
  logs: DailyLog[]
}>()

const weeks = computed(() => buildHeatmapWeeks(props.logs))

const levelColors = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-red-200 dark:bg-red-900/50',
  'bg-amber-300 dark:bg-amber-700/60',
  'bg-green-500 dark:bg-green-600',
]
</script>

<template>
  <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="mb-4 flex items-center gap-2">
      <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-sm dark:bg-emerald-900/30">📊</span>
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Konsistensi Aktivitas</h3>
    </div>

    <div class="overflow-x-auto rounded-xl bg-gray-50/50 p-3 dark:bg-gray-900/50">
      <div class="inline-flex gap-[3px]">
        <div v-for="(week, wi) in weeks" :key="wi" class="flex flex-col gap-[3px]">
          <div
            v-for="day in week"
            :key="day.date"
            class="h-3 w-3 rounded-[3px] transition-colors hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
            :class="levelColors[day.level] ?? levelColors[0]"
            :title="day.tooltip"
          />
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
      <span>Sedikit</span>
      <div v-for="(color, i) in levelColors" :key="i" class="h-2.5 w-2.5 rounded-sm" :class="color" />
      <span>Banyak</span>
    </div>
  </div>
</template>
