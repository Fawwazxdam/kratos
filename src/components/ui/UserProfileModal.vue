<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKratosStore } from '@/stores/kratos'
import { ACTIVITY_LEVELS, FITNESS_PROGRAMS } from '@/types'
import type { ActivityLevel, FitnessProgram, Gender } from '@/types'

const store = useKratosStore()

const isOpen = ref(false)

const weight = ref(store.profile.weight_kg)
const height = ref(store.profile.height_cm)
const age = ref(store.profile.age)
const gender = ref<Gender>(store.profile.gender)
const activityLevel = ref<ActivityLevel>(store.profile.activity_level)
const program = ref<FitnessProgram>(store.profile.program)

const customProtein = ref(store.targets.protein_target)
const customCalories = ref(store.targets.calorie_target)
const isCustomMode = ref(false)

const previewBMR = computed(() => {
  if (gender.value === 'male') {
    return Math.round(10 * weight.value + 6.25 * height.value - 5 * age.value + 5)
  }
  return Math.round(10 * weight.value + 6.25 * height.value - 5 * age.value - 161)
})

const previewTDEE = computed(() => Math.round(previewBMR.value * ACTIVITY_LEVELS[activityLevel.value].multiplier))

const previewTargets = computed(() => {
  const config = FITNESS_PROGRAMS[program.value]
  const cal = previewTDEE.value + config.calorieModifier
  const pMin = Math.round(weight.value * config.proteinRange.min)
  const pMax = Math.round(weight.value * config.proteinRange.max)
  const pMid = Math.round((pMin + pMax) / 2)
  const proteinKcal = pMid * 4
  const fatKcal = Math.round(cal * (config.macroSplit.fat / 100))
  const carbsKcal = cal - proteinKcal - fatKcal
  return {
    target_calories: cal,
    target_protein: pMid,
    protein_range: `${pMin}-${pMax}g`,
    protein_kcal: proteinKcal,
    carbs_g: Math.round(carbsKcal / 4),
    fat_g: Math.round(fatKcal / 9),
    carbs_kcal: carbsKcal,
    fat_kcal: fatKcal,
  }
})

const activityKeys = Object.keys(ACTIVITY_LEVELS) as ActivityLevel[]
const programKeys = Object.keys(FITNESS_PROGRAMS) as FitnessProgram[]

watch(() => store.profile.is_configured, (configured) => {
  if (!configured) isOpen.value = true
})

function applyRecommendation() {
  store.updateProfile({
    weight_kg: weight.value,
    height_cm: height.value,
    age: age.value,
    gender: gender.value,
    activity_level: activityLevel.value,
    program: program.value,
    is_configured: true,
  })
  isCustomMode.value = false
  customProtein.value = previewTargets.value.target_protein
  customCalories.value = previewTargets.value.target_calories
  store.applyCalculatedTargets()
  isOpen.value = false
}

function applyCustom() {
  store.updateProfile({
    weight_kg: weight.value,
    height_cm: height.value,
    age: age.value,
    gender: gender.value,
    activity_level: activityLevel.value,
    program: program.value,
    is_configured: true,
  })
  const protein = Math.max(1, Math.round(customProtein.value))
  const calories = Math.max(Math.round(previewBMR.value), Math.round(customCalories.value))
  store.targets.protein_target = protein
  store.targets.calorie_target = calories
  isOpen.value = false
}

function openModal() {
  weight.value = store.profile.weight_kg
  height.value = store.profile.height_cm
  age.value = store.profile.age
  gender.value = store.profile.gender
  activityLevel.value = store.profile.activity_level
  program.value = store.profile.program
  customProtein.value = store.targets.protein_target
  customCalories.value = store.targets.calorie_target
  isCustomMode.value = false
  isOpen.value = true
}

defineExpose({ openModal })
</script>

<template>
  <button
    class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-400 shadow-sm transition-all hover:border-gray-300 hover:text-gray-600 hover:shadow-md dark:border-gray-700/80 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
    title="Profile & Target Settings"
    @click="openModal"
  >
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center dark:bg-black/70" @click.self="isOpen = false">
        <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl dark:bg-gray-900">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Profile & Target</h2>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="isOpen = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-5">
            <div class="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700/80 dark:bg-gray-800/50">
              <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Data Fisik</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Berat Badan (kg)</label>
                  <input
                    v-model.number="weight"
                    type="number"
                    min="30"
                    max="200"
                    step="0.5"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Tinggi Badan (cm)</label>
                  <input
                    v-model.number="height"
                    type="number"
                    min="100"
                    max="250"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Umur</label>
                  <input
                    v-model.number="age"
                    type="number"
                    min="14"
                    max="80"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Gender</label>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                      :class="gender === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                      @click="gender = 'male'"
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      class="flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                      :class="gender === 'female'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                      @click="gender = 'female'"
                    >
                      Perempuan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700/80 dark:bg-gray-800/50">
              <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Tingkat Aktivitas Harian</h3>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  v-for="key in activityKeys"
                  :key="key"
                  type="button"
                  class="rounded-lg border p-2 text-left text-xs transition-all"
                  :class="activityLevel === key
                    ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                  @click="activityLevel = key"
                >
                  <div class="font-semibold">{{ ACTIVITY_LEVELS[key].label }}</div>
                  <div class="mt-0.5 text-[10px] leading-tight text-gray-400 dark:text-gray-500">{{ ACTIVITY_LEVELS[key].description }}</div>
                </button>
              </div>
            </div>

            <div class="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700/80 dark:bg-gray-800/50">
              <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Program / Goal</h3>
              <div class="space-y-2">
                <button
                  v-for="key in programKeys"
                  :key="key"
                  type="button"
                  class="w-full rounded-lg border p-3 text-left transition-all"
                  :class="program === key
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:bg-emerald-900/30'
                    : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'"
                  @click="program = key"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ FITNESS_PROGRAMS[key].icon }}</span>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ FITNESS_PROGRAMS[key].name }}</span>
                  </div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ FITNESS_PROGRAMS[key].focus }}</div>
                </button>
              </div>
            </div>

            <div class="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/10">
              <h3 class="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Preview Hasil Kalkulasi</h3>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">BMR</div>
                  <div class="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ previewBMR }}</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">kcal/hari</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">TDEE</div>
                  <div class="text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ previewTDEE }}</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">kcal/hari</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Target Kalori</div>
                  <div class="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{{ previewTargets.target_calories }}</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">kcal/hari</div>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-3 border-t border-emerald-200/60 pt-3 dark:border-emerald-800/40">
                <div class="text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400">Protein</div>
                  <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ previewTargets.protein_range }}</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ previewTargets.protein_kcal }} kcal</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400">Karbohidrat</div>
                  <div class="text-sm font-bold text-amber-600 dark:text-amber-400">{{ previewTargets.carbs_g }}g</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ previewTargets.carbs_kcal }} kcal</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400">Lemak</div>
                  <div class="text-sm font-bold text-red-500 dark:text-red-400">{{ previewTargets.fat_g }}g</div>
                  <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ previewTargets.fat_kcal }} kcal</div>
                </div>
              </div>
            </div>

            <div v-if="isCustomMode" class="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-800/50 dark:bg-amber-900/10">
              <div class="mb-2 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-amber-700 dark:text-amber-400">Custom Override</h3>
                <button class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400" @click="isCustomMode = false">Kembali</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Target Protein (g)</label>
                  <input
                    v-model.number="customProtein"
                    type="number"
                    :min="Math.round(weight)"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-amber-400 dark:focus:ring-amber-400"
                  />
                  <div class="mt-1 text-[10px] text-gray-400 dark:text-gray-500">Min: {{ weight }}g (1g/kg BB)</div>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Target Kalori (kcal)</label>
                  <input
                    v-model.number="customCalories"
                    type="number"
                    :min="previewBMR"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-amber-400 dark:focus:ring-amber-400"
                  />
                  <div class="mt-1 text-[10px] text-gray-400 dark:text-gray-500">Min: {{ previewBMR }}kcal (BMR)</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <button
                type="button"
                class="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
                @click="applyRecommendation"
              >
                ⚡ Terapkan Rekomendasi
              </button>
              <button
                type="button"
                class="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                @click="isCustomMode = !isCustomMode"
              >
                ✏️ {{ isCustomMode ? 'Tutup Custom' : 'Custom Target Sendiri' }}
              </button>
              <button
                v-if="isCustomMode"
                type="button"
                class="w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98]"
                @click="applyCustom"
              >
                💾 Simpan Custom Target
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
