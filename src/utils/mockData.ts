import type { DailyLog, DailySummary, UserTargets } from '@/types'

export const userTargets: UserTargets = {
  protein_target: 150,
  calorie_target: 2200,
  workout_days_per_week: 4,
}

export const todayLogs: DailyLog[] = [
  {
    id: 'log-001',
    date: '2026-07-20',
    timestamp: '07:30',
    category: 'NUTRITION',
    title: 'Telur Rebus (3) + Roti Gandum',
    protein: 24,
    calories: 350,
    notes: 'Sarapan',
  },
  {
    id: 'log-002',
    date: '2026-07-20',
    timestamp: '08:00',
    category: 'WORKOUT',
    title: 'Push Workout',
    protein: 0,
    calories: 320,
    notes: 'Chest, Shoulders, Triceps — 60 menit',
  },
  {
    id: 'log-003',
    date: '2026-07-20',
    timestamp: '10:30',
    category: 'NUTRITION',
    title: 'Whey Protein + Pisang',
    protein: 30,
    calories: 250,
    notes: 'Post-workout shake',
  },
  {
    id: 'log-004',
    date: '2026-07-20',
    timestamp: '12:30',
    category: 'NUTRITION',
    title: 'Dada Ayam + Nasi + Brokoli',
    protein: 45,
    calories: 480,
    notes: 'Makan siang',
  },
  {
    id: 'log-005',
    date: '2026-07-20',
    timestamp: '15:30',
    category: 'NUTRITION',
    title: 'Greek Yogurt + Almond',
    protein: 18,
    calories: 200,
    notes: 'Camilan sore',
  },
  {
    id: 'log-006',
    date: '2026-07-20',
    timestamp: '19:00',
    category: 'NUTRITION',
    title: 'Salmon + Sweet Potato + Salad',
    protein: 40,
    calories: 520,
    notes: 'Makan malam',
  },
]

export const todaySummary: DailySummary = {
  date: '2026-07-20',
  total_protein: 157,
  total_calories: 2120,
  workout_completed: true,
  target_achieved: true,
  reflection_note: 'Energy tinggi hari ini. Push workout keras, semua set tercapai. Besok jadwal pull day.',
}

export const weeklySummaries: DailySummary[] = [
  { date: '2026-07-14', total_protein: 132, total_calories: 1980, workout_completed: false, target_achieved: false, reflection_note: '' },
  { date: '2026-07-15', total_protein: 148, total_calories: 2150, workout_completed: true, target_achieved: false, reflection_note: 'Leg day brutal' },
  { date: '2026-07-16', total_protein: 155, total_calories: 2200, workout_completed: false, target_achieved: true, reflection_note: '' },
  { date: '2026-07-17', total_protein: 140, total_calories: 2050, workout_completed: true, target_achieved: false, reflection_note: 'Chest day lancar' },
  { date: '2026-07-18', total_protein: 160, total_calories: 2280, workout_completed: false, target_achieved: true, reflection_note: '' },
  { date: '2026-07-19', total_protein: 125, total_calories: 1900, workout_completed: true, target_achieved: false, reflection_note: 'Hari libur, makan kurang' },
  { date: '2026-07-20', total_protein: 157, total_calories: 2120, workout_completed: true, target_achieved: true, reflection_note: 'Push workout keras' },
]

export const heatmapData: Record<string, number> = (() => {
  const data: Record<string, number> = {}
  const start = new Date('2026-01-01')
  const end = new Date('2026-07-20')
  const d = new Date(start)
  while (d <= end) {
    const key = d.toISOString().split('T')[0] as string
    const day = d.getDay()
    if (day === 0 || day === 6) {
      data[key] = Math.random() > 0.4 ? 2 : 0
    } else {
      data[key] = Math.random() > 0.2 ? (Math.random() > 0.5 ? 3 : 2) : Math.random() > 0.5 ? 1 : 0
    }
    d.setDate(d.getDate() + 1)
  }
  return data
})()
