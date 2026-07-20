<script setup lang="ts">
import { computed } from 'vue'
import { useKratosStore } from '@/stores/kratos'
import { FITNESS_PROGRAMS } from '@/types'

const store = useKratosStore()

const proteinRemaining = computed(() => Math.max(0, store.targets.protein_target - store.todayProtein))
const calorieRemaining = computed(() => store.targets.calorie_target - store.todayCalories)
const calorieStatus = computed(() => {
  if (calorieRemaining.value > 0) return 'under'
  if (calorieRemaining.value === 0) return 'perfect'
  return 'over'
})

const proteinPct = computed(() => Math.min((store.todayProtein / store.targets.protein_target) * 100, 100))
const caloriePct = computed(() => Math.min((store.todayCalories / store.targets.calorie_target) * 100, 100))

const programName = computed(() => {
  if (!store.calculatedTargets) return null
  return FITNESS_PROGRAMS[store.profile.program]
})

const totalMacros = computed(() => {
  if (!store.calculatedTargets) return null
  const ms = store.calculatedTargets.macro_split
  return ms.protein_g + ms.carbs_g + ms.fat_g
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-sm dark:bg-emerald-900/30">🎯</span>
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Harian</span>
      </div>
      <span
        v-if="programName"
        class="rounded-full px-2 py-0.5 text-[10px] font-bold"
        :class="store.profile.program === 'lean_bulk'
          ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
          : store.profile.program === 'fat_loss'
            ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
      >
        {{ programName.icon }} {{ programName.name }}
      </span>
    </div>

    <div class="space-y-4">
      <div>
        <div class="mb-1.5 flex flex-wrap items-baseline justify-between gap-1">
          <div class="flex items-baseline gap-2">
            <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Protein</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ store.todayProtein }}g / {{ store.targets.protein_target }}g</span>
          </div>
          <span
            v-if="proteinRemaining > 0"
            class="text-xs font-medium text-gray-400 dark:text-gray-500"
          >
            Sisa <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ proteinRemaining }}g</span>
          </span>
          <span
            v-else
            class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          >
            Tercapai ✓
          </span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="proteinPct >= 100 ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'"
            :style="{ width: `${proteinPct}%` }"
          />
        </div>
      </div>

      <div>
        <div class="mb-1.5 flex flex-wrap items-baseline justify-between gap-1">
          <div class="flex items-baseline gap-2">
            <span class="text-sm font-semibold text-amber-600 dark:text-amber-400">Kalori</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ store.todayCalories.toLocaleString() }} / {{ store.targets.calorie_target.toLocaleString() }} kcal</span>
          </div>
          <span
            v-if="calorieStatus === 'over'"
            class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
          >
            +{{ Math.abs(calorieRemaining) }}kcal over
          </span>
          <span
            v-else-if="calorieStatus === 'perfect'"
            class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          >
            Pas ✓
          </span>
          <span
            v-else
            class="text-xs font-medium text-gray-400 dark:text-gray-500"
          >
            Sisa <span class="font-bold text-amber-600 dark:text-amber-400">{{ calorieRemaining }}kcal</span>
          </span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="calorieStatus === 'over' ? 'bg-gradient-to-r from-red-400 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-amber-400 to-amber-500'"
            :style="{ width: `${caloriePct}%` }"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-3 sm:gap-4 dark:border-gray-700">
        <div class="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-50 px-2.5 py-2 sm:gap-2.5 sm:px-3 dark:bg-gray-700/50">
          <span class="text-lg sm:text-xl">{{ store.todaySummary.workout_completed ? '✅' : '🏋️' }}</span>
          <div class="min-w-0">
            <p class="text-xs font-semibold truncate" :class="store.todaySummary.workout_completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
              {{ store.todaySummary.workout_completed ? 'Selesai' : 'Belum' }}
            </p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500">Workout</p>
          </div>
        </div>
        <div class="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-50 px-2.5 py-2 sm:gap-2.5 sm:px-3 dark:bg-gray-700/50">
          <span class="text-lg sm:text-xl">🔥</span>
          <div class="min-w-0">
            <p class="text-xs font-bold tabular-nums text-orange-600 dark:text-orange-400">{{ store.streak }} Hari</p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500">Streak</p>
          </div>
        </div>
        <div v-if="store.calculatedTargets" class="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-50 px-2.5 py-2 sm:gap-2.5 sm:px-3 dark:bg-gray-700/50">
          <span class="text-lg sm:text-xl">📊</span>
          <div class="min-w-0">
            <p class="text-xs font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{{ totalMacros }}g</p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500">Total Macro</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
