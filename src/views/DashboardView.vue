<script setup lang="ts">
import { ref } from 'vue'
import ProteinGauge from '@/components/dashboard/ProteinGauge.vue'
import CalorieCard from '@/components/dashboard/CalorieCard.vue'
import StreakBadge from '@/components/dashboard/StreakBadge.vue'
import WorkoutStatus from '@/components/dashboard/WorkoutStatus.vue'
import MacroSplitCard from '@/components/dashboard/MacroSplitCard.vue'
import DailyProgressCard from '@/components/dashboard/DailyProgressCard.vue'
import NutritionChart from '@/components/charts/NutritionChart.vue'
import CalorieTrendChart from '@/components/charts/CalorieTrendChart.vue'
import HabitHeatmap from '@/components/dashboard/HabitHeatmap.vue'
import RecentLogs from '@/components/dashboard/RecentLogs.vue'
import DailyReflection from '@/components/dashboard/DailyReflection.vue'
import QuickLogButton from '@/components/ui/QuickLogButton.vue'
import DarkModeToggle from '@/components/ui/DarkModeToggle.vue'
import UserProfileModal from '@/components/ui/UserProfileModal.vue'
import { useKratosStore } from '@/stores/kratos'
import { useDarkMode } from '@/utils/darkMode'
import type { DailyLog } from '@/types'

const store = useKratosStore()
const { isDark, toggle } = useDarkMode()
const editingLog = ref<DailyLog | null>(null)

function handleEdit(log: DailyLog) {
  editingLog.value = { ...log }
}

function handleDelete(id: string) {
  if (confirm('Hapus log ini?')) {
    store.deleteLog(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <header class="border-b border-gray-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-900/80">
      <div class="mx-auto flex max-w-5xl items-center justify-between">
        <h1 class="flex items-center gap-2.5 text-xl font-bold text-gray-900 dark:text-white">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-base text-white shadow-md shadow-green-200 dark:shadow-green-900/30">⚔️</span>
          <span class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">Kratos</span>
        </h1>
        <div class="flex items-center gap-3">
          <p class="text-sm font-medium text-gray-400 dark:text-gray-500">
            {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
          <UserProfileModal />
          <DarkModeToggle :is-dark="isDark" @toggle="toggle" />
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl space-y-8 p-6">
      <section>
        <h2 class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          <span class="h-1 w-1 rounded-full bg-emerald-400"></span>
          Ringkasan Hari Ini
        </h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DailyProgressCard />
          <div class="space-y-4">
            <div class="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
              <ProteinGauge :current="store.todayProtein" :target="store.targets.protein_target" />
            </div>
            <CalorieCard :current="store.todayCalories" :target="store.targets.calorie_target" />
          </div>
        </div>
        <div v-if="store.calculatedTargets" class="mt-4">
          <MacroSplitCard />
        </div>
      </section>

      <section>
        <h2 class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          <span class="h-1 w-1 rounded-full bg-blue-400"></span>
          Grafik
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <NutritionChart :data="store.weeklySummaries" />
          <CalorieTrendChart :data="store.weeklySummaries" />
        </div>
      </section>

      <section>
        <HabitHeatmap :logs="store.logs" />
      </section>

      <section>
        <h2 class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          <span class="h-1 w-1 rounded-full bg-indigo-400"></span>
          Aktivitas & Refleksi
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <RecentLogs :logs="store.todayLogs" @edit="handleEdit" @delete="handleDelete" />
          <DailyReflection :note="store.todayReflection" @save="store.setReflection" />
        </div>
      </section>
    </main>

    <QuickLogButton :editing-log="editingLog" @update:editing-log="editingLog = $event" />
  </div>
</template>
