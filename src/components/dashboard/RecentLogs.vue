<script setup lang="ts">
import type { DailyLog } from '@/types'

defineProps<{
  logs: DailyLog[]
}>()

const emit = defineEmits<{
  edit: [log: DailyLog]
  delete: [id: string]
}>()

const categoryConfig: Record<string, { icon: string; label: string; color: string }> = {
  NUTRITION: { icon: '🍗', label: 'Makan', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  WORKOUT: { icon: '🏋️', label: 'Latihan', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <h3 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Log Hari Ini</h3>
    <ul v-if="logs.length" class="space-y-2">
      <li
        v-for="log in logs"
        :key="log.id"
        class="group flex items-start justify-between gap-2 rounded-xl bg-gray-50/80 px-3 py-3 transition-all hover:bg-gray-100 hover:shadow-sm sm:px-4 dark:bg-gray-700/50 dark:hover:bg-gray-700"
      >
        <div class="flex min-w-0 flex-1 items-start gap-2.5">
          <span class="mt-0.5 shrink-0 text-lg">{{ categoryConfig[log.category]?.icon ?? '📝' }}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <p class="min-w-0 truncate text-sm font-medium text-gray-900 dark:text-white">{{ log.title }}</p>
              <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="categoryConfig[log.category]?.color ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                {{ categoryConfig[log.category]?.label ?? log.category }}
              </span>
            </div>
            <p class="mt-0.5 text-xs text-gray-400">
              {{ log.timestamp }}
              <span v-if="log.protein > 0" class="text-green-500 dark:text-green-400"> · {{ log.protein }}g protein</span>
              <span v-if="log.calories > 0" class="text-amber-500 dark:text-amber-400"> · {{ log.calories }} kcal</span>
            </p>
          </div>
        </div>
        <div class="flex shrink-0 gap-1">
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-gray-600 dark:hover:text-gray-200" @click="emit('edit', log)">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400" @click="emit('delete', log.id)">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="py-8 text-center text-sm text-gray-400 dark:text-gray-500">Belum ada log hari ini.</p>
  </div>
</template>
