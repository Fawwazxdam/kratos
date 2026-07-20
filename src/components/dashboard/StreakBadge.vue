<script setup lang="ts">
defineProps<{
  streak: number
}>()
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-4 shadow-sm transition-shadow hover:shadow-md dark:border-orange-800/50 dark:from-orange-950/40 dark:to-amber-950/30 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="absolute -right-2 -top-2 text-5xl opacity-10">🔥</div>
    <div class="relative flex items-center gap-3">
      <span class="text-3xl">🔥</span>
      <div>
        <p class="text-2xl font-bold tabular-nums text-orange-600 dark:text-orange-400">{{ streak }} <span class="text-sm font-medium text-orange-400 dark:text-orange-500">Hari</span></p>
        <p class="text-xs font-medium text-orange-400 dark:text-orange-500">Daily Streak</p>
      </div>
    </div>
  </div>
</template>
