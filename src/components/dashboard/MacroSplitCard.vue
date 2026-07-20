<script setup lang="ts">
import { computed } from 'vue'
import { useKratosStore } from '@/stores/kratos'
import { FITNESS_PROGRAMS } from '@/types'

const store = useKratosStore()

const targets = computed(() => store.calculatedTargets)
const programConfig = computed(() => {
  if (!targets.value) return null
  return FITNESS_PROGRAMS[store.profile.program]
})
</script>

<template>
  <div
    v-if="targets"
    class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20"
  >
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-sm dark:bg-indigo-900/30">📊</span>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Macro Split</span>
      </div>
      <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
        {{ programConfig?.icon }} {{ programConfig?.name }}
      </span>
    </div>

    <div class="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
      <div
        class="h-full bg-emerald-500 transition-all duration-500"
        :style="{ width: `${programConfig?.macroSplit.protein || 0}%` }"
        :title="`Protein: ${targets.macro_split.protein_g}g`"
      />
      <div
        class="h-full bg-amber-400 transition-all duration-500"
        :style="{ width: `${programConfig?.macroSplit.carbs || 0}%` }"
        :title="`Karbo: ${targets.macro_split.carbs_g}g`"
      />
      <div
        class="h-full bg-red-400 transition-all duration-500"
        :style="{ width: `${programConfig?.macroSplit.fat || 0}%` }"
        :title="`Lemak: ${targets.macro_split.fat_g}g`"
      />
    </div>

    <div class="grid grid-cols-3 gap-2">
      <div class="text-center">
        <div class="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Protein</div>
        <div class="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ targets.macro_split.protein_g }}g</div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ targets.macro_split.protein_kcal }} kcal</div>
      </div>
      <div class="text-center">
        <div class="text-[10px] font-medium uppercase tracking-wider text-amber-500 dark:text-amber-400">Karbo</div>
        <div class="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ targets.macro_split.carbs_g }}g</div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ targets.macro_split.carbs_kcal }} kcal</div>
      </div>
      <div class="text-center">
        <div class="text-[10px] font-medium uppercase tracking-wider text-red-500 dark:text-red-400">Lemak</div>
        <div class="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ targets.macro_split.fat_g }}g</div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ targets.macro_split.fat_kcal }} kcal</div>
      </div>
    </div>

    <div class="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
      BMR: {{ targets.bmr }} kcal &middot; TDEE: {{ targets.tdee }} kcal &middot; Target: {{ targets.target_calories }} kcal
    </div>
  </div>
</template>
