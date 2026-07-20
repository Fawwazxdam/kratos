<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKratosStore } from '@/stores/kratos'
import { PROTEIN_SOURCES } from '@/utils/nutritionMatrix'
import { WORKOUT_TEMPLATES } from '@/utils/workoutMatrix'
import type { DailyLog, LogCategory } from '@/types'

const props = defineProps<{
  editingLog?: DailyLog | null
}>()

const emit = defineEmits<{
  'update:editingLog': [value: DailyLog | null]
}>()

const store = useKratosStore()

const isOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')

const category = ref<LogCategory>('NUTRITION')
const title = ref('')
const protein = ref(0)
const calories = ref(0)
const notes = ref('')

const isExactMode = ref(false)
const selectedSource = ref<keyof typeof PROTEIN_SOURCES>('AYAM')
const portionCount = ref(1)

const selectedWorkout = ref<keyof typeof WORKOUT_TEMPLATES>('PUSH_DAY')
const workoutDuration = ref(60)
const workoutIntensity = ref<'Rendah' | 'Sedang' | 'Tinggi'>('Tinggi')
const workoutNotes = ref('')

const estimatedValues = computed(() => {
  const source = PROTEIN_SOURCES[selectedSource.value]!
  const multiplier = Number(portionCount.value) || 0
  return {
    protein: Math.round(source.protein * multiplier),
    calories: Math.round(source.calories * multiplier),
  }
})

const estimatedPreview = computed(() => {
  const source = PROTEIN_SOURCES[selectedSource.value]!
  return `${source.name} x${portionCount.value}`
})

const workoutCalories = computed(() => {
  const tpl = WORKOUT_TEMPLATES[selectedWorkout.value]!
  return Math.round(workoutDuration.value * tpl.kcalPerMinute)
})

const workoutPreview = computed(() => {
  const tpl = WORKOUT_TEMPLATES[selectedWorkout.value]!
  return `${tpl.icon} ~${workoutCalories.value} kcal · ${workoutDuration.value} menit`
})

watch([selectedSource, portionCount, isExactMode], () => {
  if (!isExactMode.value && category.value === 'NUTRITION') {
    protein.value = estimatedValues.value.protein
    calories.value = estimatedValues.value.calories
    if (!title.value.trim()) {
      title.value = PROTEIN_SOURCES[selectedSource.value]!.name
    }
  }
}, { immediate: true })

watch(selectedWorkout, (key) => {
  if (category.value === 'WORKOUT') {
    const tpl = WORKOUT_TEMPLATES[key]!
    title.value = tpl.name
    workoutDuration.value = tpl.defaultDuration
    workoutIntensity.value = tpl.intensity
    calories.value = workoutCalories.value
    protein.value = 0
  }
})

watch([workoutDuration, workoutIntensity], () => {
  if (category.value === 'WORKOUT') {
    calories.value = workoutCalories.value
  }
})

watch(() => props.editingLog, (log) => {
  if (log) {
    isEditing.value = true
    editingId.value = log.id
    category.value = log.category
    title.value = log.title
    protein.value = log.protein
    calories.value = log.calories
    notes.value = log.notes
    isExactMode.value = true
    isOpen.value = true
  }
})

function buildWorkoutNotes(): string {
  const parts: string[] = []
  parts.push(`${workoutDuration.value} menit`)
  parts.push(`Intensitas: ${workoutIntensity.value}`)
  if (workoutNotes.value.trim()) {
    parts.push(workoutNotes.value.trim())
  }
  return parts.join(' · ')
}

function submit() {
  if (!title.value.trim()) return
  const finalNotes = category.value === 'WORKOUT' ? buildWorkoutNotes() : notes.value.trim()
  const finalTitle = category.value === 'WORKOUT' ? title.value.trim() : title.value.trim()
  const finalProtein = category.value === 'WORKOUT' ? 0 : protein.value
  const finalCalories = category.value === 'WORKOUT' ? workoutCalories.value : calories.value

  if (isEditing.value) {
    store.updateLog(editingId.value, {
      category: category.value,
      title: finalTitle,
      protein: finalProtein,
      calories: finalCalories,
      notes: finalNotes,
    })
  } else {
    store.addLog({
      category: category.value,
      title: finalTitle,
      protein: finalProtein,
      calories: finalCalories,
      notes: finalNotes,
    })
  }
  resetForm()
  isOpen.value = false
}

function handleReset() {
  if (confirm('Reset semua data ke mock data awal?')) {
    store.resetToDefaults()
    isOpen.value = false
  }
}

function resetForm() {
  isEditing.value = false
  editingId.value = ''
  category.value = 'NUTRITION'
  title.value = ''
  protein.value = 0
  calories.value = 0
  notes.value = ''
  isExactMode.value = false
  selectedSource.value = 'AYAM'
  portionCount.value = 1
  selectedWorkout.value = 'PUSH_DAY'
  workoutDuration.value = 60
  workoutIntensity.value = 'Tinggi'
  workoutNotes.value = ''
  emit('update:editingLog', null)
}

function openNew() {
  resetForm()
  isOpen.value = true
}
</script>

<template>
  <button
    class="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-green-700 hover:shadow-xl active:scale-95"
    title="Quick Add"
    @click="openNew"
  >
    <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
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
        <div class="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:bg-gray-900">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Log' : 'Quick Log' }}</h2>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="isOpen = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="submit">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                  :class="category === 'NUTRITION'
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                  @click="category = 'NUTRITION'"
                >
                  NUTRITION
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                  :class="category === 'WORKOUT'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                  @click="category = 'WORKOUT'"
                >
                  WORKOUT
                </button>
              </div>
            </div>

            <div v-if="category === 'NUTRITION'">
              <label for="title" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama / Title</label>
              <input
                id="title"
                v-model="title"
                type="text"
                required
                placeholder="Dada Ayam 200g"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            <div v-if="category === 'NUTRITION'" class="flex items-center justify-between rounded-lg bg-slate-100 p-2 text-sm dark:bg-gray-800">
              <span class="font-medium text-slate-600 dark:text-gray-400">Mode Input:</span>
              <button
                type="button"
                class="rounded px-2.5 py-1 text-xs font-semibold transition"
                :class="isExactMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 shadow-sm dark:bg-gray-700 dark:text-gray-300'"
                @click="isExactMode = !isExactMode"
              >
                {{ isExactMode ? '🎯 Input Manual' : '⚡ Estimator Porsi' }}
              </button>
            </div>

            <div v-if="!isExactMode && category === 'NUTRITION'" class="space-y-3">
              <div>
                <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Sumber Protein</label>
                <select v-model="selectedSource" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400">
                  <option v-for="(item, key) in PROTEIN_SOURCES" :key="key" :value="key">
                    {{ item.name }} — {{ item.protein }}g / {{ item.calories }} kcal
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Jumlah Porsi</label>
                <input
                  v-model="portionCount"
                  type="number"
                  min="0.5"
                  step="0.5"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                />
              </div>

              <div class="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                <span>{{ estimatedPreview }}</span>
                <span class="font-semibold">{{ estimatedValues.protein }}g · {{ estimatedValues.calories }} kcal</span>
              </div>
            </div>

            <div v-if="isExactMode && category === 'NUTRITION'" class="grid grid-cols-2 gap-3">
              <div>
                <label for="protein" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Protein (g)</label>
                <input
                  id="protein"
                  v-model.number="protein"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                />
              </div>
              <div>
                <label for="calories" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kalori (kcal)</label>
                <input
                  id="calories"
                  v-model.number="calories"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400"
                />
              </div>
            </div>

            <div v-if="category === 'WORKOUT'" class="space-y-3">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">Template Latihan</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="(template, key) in WORKOUT_TEMPLATES"
                    :key="key"
                    type="button"
                    class="flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition"
                    :class="selectedWorkout === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm dark:bg-blue-900/30 dark:text-blue-400'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'"
                    @click="selectedWorkout = key as keyof typeof WORKOUT_TEMPLATES"
                  >
                    <span>{{ template.icon }}</span>
                    <span class="truncate">{{ template.name }}</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                <div>
                  <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Durasi (Menit)</label>
                  <input
                    v-model.number="workoutDuration"
                    type="number"
                    min="5"
                    step="5"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Intensitas</label>
                  <select v-model="workoutIntensity" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400">
                    <option value="Rendah">Rendah (Light)</option>
                    <option value="Sedang">Sedang (Moderate)</option>
                    <option value="Tinggi">Tinggi (Hard / RPE 8+)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300">
                <span>{{ WORKOUT_TEMPLATES[selectedWorkout]!.name }}</span>
                <span class="font-semibold">{{ workoutPreview }}</span>
              </div>

              <div>
                <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Catatan Progress (Opsional)</label>
                <input
                  v-model="workoutNotes"
                  type="text"
                  placeholder="Bench press 60kg 4x8, feeling bagus"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div v-if="category === 'NUTRITION'">
              <label for="notes" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
              <input
                id="notes"
                v-model="notes"
                type="text"
                placeholder="Opsional"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors active:scale-[0.98]"
              :class="category === 'WORKOUT' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
            >
              {{ isEditing ? 'Update Log' : 'Simpan Log' }}
            </button>

            <button
              type="button"
              class="w-full rounded-lg border border-red-200 px-4 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/20"
              @click="handleReset"
            >
              Reset to Mock Data
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
