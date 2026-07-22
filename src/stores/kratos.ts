import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  DailyLog,
  DailySummary,
  UserTargets,
  UserBodyStats,
  CalculatedTargets,
  Gender,
  ActivityLevel,
  FitnessProgram,
} from '@/types'
import { ACTIVITY_LEVELS, FITNESS_PROGRAMS } from '@/types'
import { buildHeatmapWeeks } from '@/utils/heatmap'

function relativeDate(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

function relativeTimestamp(offset: number, hours: number, minutes: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hours, minutes, 0, 0)
  return d.toTimeString().slice(0, 5)
}

const defaultLogs: DailyLog[] = [
  {
    id: 'log-001',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 7, 30),
    category: 'NUTRITION',
    title: 'Telur Rebus (3) + Roti Gandum',
    protein: 24,
    calories: 350,
    notes: 'Sarapan',
  },
  {
    id: 'log-002',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 8, 0),
    category: 'WORKOUT',
    title: 'Push Workout',
    protein: 0,
    calories: 320,
    notes: 'Chest, Shoulders, Triceps — 60 menit',
  },
  {
    id: 'log-003',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 10, 30),
    category: 'NUTRITION',
    title: 'Whey Protein + Pisang',
    protein: 30,
    calories: 250,
    notes: 'Post-workout shake',
  },
  {
    id: 'log-004',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 12, 30),
    category: 'NUTRITION',
    title: 'Dada Ayam + Nasi + Brokoli',
    protein: 45,
    calories: 480,
    notes: 'Makan siang',
  },
  {
    id: 'log-005',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 15, 30),
    category: 'NUTRITION',
    title: 'Greek Yogurt + Almond',
    protein: 18,
    calories: 200,
    notes: 'Camilan sore',
  },
  {
    id: 'log-006',
    date: relativeDate(0),
    timestamp: relativeTimestamp(0, 19, 0),
    category: 'NUTRITION',
    title: 'Salmon + Sweet Potato + Salad',
    protein: 40,
    calories: 520,
    notes: 'Makan malam',
  },
  {
    id: 'log-010',
    date: relativeDate(-1),
    timestamp: relativeTimestamp(-1, 8, 0),
    category: 'WORKOUT',
    title: 'Pull Day',
    protein: 0,
    calories: 400,
    notes: 'Back & Biceps',
  },
  {
    id: 'log-011',
    date: relativeDate(-1),
    timestamp: relativeTimestamp(-1, 7, 0),
    category: 'NUTRITION',
    title: 'Oatmeal + Whey',
    protein: 35,
    calories: 420,
    notes: 'Sarapan',
  },
  {
    id: 'log-012',
    date: relativeDate(-1),
    timestamp: relativeTimestamp(-1, 12, 0),
    category: 'NUTRITION',
    title: 'Nasi + Ikan + Sayur',
    protein: 40,
    calories: 500,
    notes: 'Makan siang',
  },
  {
    id: 'log-013',
    date: relativeDate(-1),
    timestamp: relativeTimestamp(-1, 18, 30),
    category: 'NUTRITION',
    title: 'Ayam Panggang + Ubi',
    protein: 38,
    calories: 450,
    notes: 'Makan malam',
  },
  {
    id: 'log-020',
    date: relativeDate(-2),
    timestamp: relativeTimestamp(-2, 7, 30),
    category: 'NUTRITION',
    title: 'Telur + Roti + Susu',
    protein: 30,
    calories: 380,
    notes: 'Sarapan',
  },
  {
    id: 'log-021',
    date: relativeDate(-2),
    timestamp: relativeTimestamp(-2, 12, 0),
    category: 'NUTRITION',
    title: 'Chicken Bowl',
    protein: 42,
    calories: 520,
    notes: 'Makan siang',
  },
  {
    id: 'log-022',
    date: relativeDate(-3),
    timestamp: relativeTimestamp(-3, 8, 0),
    category: 'WORKOUT',
    title: 'Leg Day',
    protein: 0,
    calories: 500,
    notes: 'Squat, Deadlift, Lunges',
  },
  {
    id: 'log-023',
    date: relativeDate(-3),
    timestamp: relativeTimestamp(-3, 7, 0),
    category: 'NUTRITION',
    title: 'Smoothie Bowl',
    protein: 25,
    calories: 300,
    notes: 'Sarapan',
  },
  {
    id: 'log-024',
    date: relativeDate(-4),
    timestamp: relativeTimestamp(-4, 12, 30),
    category: 'NUTRITION',
    title: 'Tuna Sandwich + Salad',
    protein: 35,
    calories: 400,
    notes: 'Makan siang',
  },
  {
    id: 'log-025',
    date: relativeDate(-5),
    timestamp: relativeTimestamp(-5, 7, 30),
    category: 'NUTRITION',
    title: 'Protein Bar + Banana',
    protein: 28,
    calories: 350,
    notes: 'Cepat & praktis',
  },
]

const defaultTargets: UserTargets = {
  protein_target: 150,
  calorie_target: 2200,
  workout_days_per_week: 4,
}

const defaultProfile: UserBodyStats = {
  weight_kg: 70,
  height_cm: 175,
  age: 25,
  gender: 'male',
  activity_level: 'moderate',
  program: 'lean_bulk',
  is_configured: false,
}

function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_LEVELS[activityLevel].multiplier
}

function calculateTargets(
  bmr: number,
  tdee: number,
  weight: number,
  program: FitnessProgram,
): CalculatedTargets {
  const config = FITNESS_PROGRAMS[program]
  const targetCalories = Math.round(tdee + config.calorieModifier)
  const proteinMin = Math.round(weight * config.proteinRange.min)
  const proteinMax = Math.round(weight * config.proteinRange.max)
  const proteinMid = Math.round((proteinMin + proteinMax) / 2)
  const proteinKcal = proteinMid * 4
  const fatKcal = Math.round(targetCalories * (config.macroSplit.fat / 100))
  const carbsKcal = targetCalories - proteinKcal - fatKcal
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target_calories: targetCalories,
    target_protein_min: proteinMin,
    target_protein_max: proteinMax,
    target_protein_mid: proteinMid,
    macro_split: {
      protein_g: proteinMid,
      carbs_g: Math.round(carbsKcal / 4),
      fat_g: Math.round(fatKcal / 9),
      protein_kcal: proteinKcal,
      carbs_kcal: carbsKcal,
      fat_kcal: fatKcal,
    },
  }
}

export const useKratosStore = defineStore('kratos', () => {
  const logs = ref<DailyLog[]>([...defaultLogs])
  const targets = ref<UserTargets>({ ...defaultTargets })
  const profile = ref<UserBodyStats>({...defaultProfile})

  const todayLogs = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return logs.value.filter((log) => log.date === today)
  })

  const todayProtein = computed(() => {
    return todayLogs.value.reduce((sum, log) => sum + log.protein, 0)
  })

  const todayCalories = computed(() => {
    return todayLogs.value
      .filter((log) => log.category === 'NUTRITION')
      .reduce((sum, log) => sum + log.calories, 0)
  })

  const todayWorkoutCalories = computed(() => {
    return todayLogs.value
      .filter((log) => log.category === 'WORKOUT')
      .reduce((sum, log) => sum + log.calories, 0)
  })

  const netCalories = computed(() => {
    return todayCalories.value - todayWorkoutCalories.value
  })

  const proteinProgress = computed(() => {
    if (targets.value.protein_target === 0) return 0
    return (todayProtein.value / targets.value.protein_target) * 100
  })

  const weeklySummaries = computed<DailySummary[]>(() => {
    const summaries: DailySummary[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayLogs = logs.value.filter((log) => log.date === dateStr)
      const nutritionLogs = dayLogs.filter((log) => log.category === 'NUTRITION')
      const workoutLogs = dayLogs.filter((log) => log.category === 'WORKOUT')
      const totalProtein = nutritionLogs.reduce((sum, log) => sum + log.protein, 0)
      const totalCalories = nutritionLogs.reduce((sum, log) => sum + log.calories, 0)
      const workoutCalories = workoutLogs.reduce((sum, log) => sum + log.calories, 0)
      summaries.push({
        date: dateStr,
        total_protein: totalProtein,
        total_calories: totalCalories - workoutCalories,
        workout_completed: workoutLogs.length > 0,
        target_achieved: totalProtein >= targets.value.protein_target,
        reflection_note: reflections.value[dateStr] ?? '',
      })
    }
    return summaries
  })

  const heatmapData = computed(() => {
    const counts = new Map<string, number>()
    for (const log of logs.value) {
      counts.set(log.date, (counts.get(log.date) ?? 0) + 1)
    }
    const result: Record<string, number> = {}
    counts.forEach((count, date) => {
      result[date] = count <= 2 ? 1 : count <= 4 ? 2 : 3
    })
    return result
  })

  const heatmapWeeks = computed(() => buildHeatmapWeeks(logs.value))

  const streak = computed(() => {
    const daySet = new Set(logs.value.map((l) => l.date))
    let count = 0
    const d = new Date()
    while (daySet.has(d.toISOString().slice(0, 10))) {
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })

  const reflections = ref<Record<string, string>>({})

  const todayReflection = computed(() => {
    const key = new Date().toISOString().slice(0, 10)
    return reflections.value[key] ?? ''
  })

  const calculatedTargets = computed<CalculatedTargets | null>(() => {
    if (!profile.value.is_configured) return null
    const bmr = calculateBMR(
      profile.value.weight_kg,
      profile.value.height_cm,
      profile.value.age,
      profile.value.gender,
    )
    const tdee = calculateTDEE(bmr, profile.value.activity_level)
    return calculateTargets(bmr, tdee, profile.value.weight_kg, profile.value.program)
  })

  const todaySummary = computed<DailySummary>(() => {
    const key = new Date().toISOString().slice(0, 10)
    return {
      date: key,
      total_protein: todayProtein.value,
      total_calories: netCalories.value,
      workout_completed: todayLogs.value.some((l) => l.category === 'WORKOUT'),
      target_achieved: todayProtein.value >= targets.value.protein_target,
      reflection_note: todayReflection.value,
    }
  })

  function addLog(log: Omit<DailyLog, 'id' | 'date' | 'timestamp'>) {
    const now = new Date()
    logs.value.push({
      ...log,
      id: `log-${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      timestamp: now.toTimeString().slice(0, 5),
    })
  }

  function updateLog(id: string, data: Partial<Omit<DailyLog, 'id'>>) {
    const log = logs.value.find((l) => l.id === id)
    if (log) Object.assign(log, data)
  }

  function deleteLog(id: string) {
    logs.value = logs.value.filter((l) => l.id !== id)
  }

  function setReflection(note: string) {
    const key = new Date().toISOString().slice(0, 10)
    const updated = { ...reflections.value, [key]: note }
    reflections.value = updated
  }

  function updateProfile(data: Partial<UserBodyStats>) {
    Object.assign(profile.value, data)
  }

  function applyCalculatedTargets() {
    if (calculatedTargets.value) {
      targets.value.protein_target = calculatedTargets.value.target_protein_mid
      targets.value.calorie_target = calculatedTargets.value.target_calories
    }
  }

  function resetToDefaults() {
    localStorage.removeItem('kratos-store')
    logs.value = [...defaultLogs]
    targets.value = { ...defaultTargets }
    reflections.value = {}
    profile.value = { ...defaultProfile }
  }

  return {
    logs,
    targets,
    profile,
    calculatedTargets,
    todayLogs,
    todayProtein,
    todayCalories,
    todayWorkoutCalories,
    netCalories,
    proteinProgress,
    weeklySummaries,
    heatmapData,
    heatmapWeeks,
    streak,
    todaySummary,
    todayReflection,
    reflections,
    addLog,
    updateLog,
    deleteLog,
    setReflection,
    updateProfile,
    applyCalculatedTargets,
    resetToDefaults,
  }
}, {
  persist: {
    key: 'kratos-store',
    pick: ['logs', 'targets', 'reflections', 'profile'],
  },
})
