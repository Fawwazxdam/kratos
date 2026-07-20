<script setup lang="ts">
defineProps<{
  completed: boolean
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border px-5 py-4 shadow-sm transition-all hover:shadow-md"
    :class="completed
      ? 'border-green-200/80 bg-gradient-to-br from-green-50 to-emerald-50 dark:border-green-800/50 dark:from-green-950/40 dark:to-emerald-950/30'
      : 'border-gray-200/80 bg-gray-50 dark:border-gray-700/80 dark:bg-gray-800'"
  >
    <div v-if="completed" class="absolute -right-1 -top-1 text-4xl opacity-10">✅</div>
    <div class="relative flex items-center gap-3">
      <span class="text-3xl">{{ completed ? '✅' : '🏋️' }}</span>
      <div>
        <p
          class="text-lg font-bold"
          :class="completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'"
        >
          {{ completed ? 'Selesai' : 'Belum' }}
        </p>
        <p class="text-xs font-medium" :class="completed ? 'text-green-400 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'">Workout Hari Ini</p>
      </div>
    </div>
  </div>
</template>
