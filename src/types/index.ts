export type LogCategory = 'NUTRITION' | 'WORKOUT'

export interface DailyLog {
  id: string
  date: string
  timestamp: string
  category: LogCategory
  title: string
  protein: number
  calories: number
  notes: string
}

export interface DailySummary {
  date: string
  total_protein: number
  total_calories: number
  workout_completed: boolean
  target_achieved: boolean
  reflection_note: string
}

export interface UserTargets {
  protein_target: number
  calorie_target: number
  workout_days_per_week: number
}

export type Gender = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | 'athlete'

export const ACTIVITY_LEVELS: Record<ActivityLevel, { label: string; multiplier: number; description: string }> = {
  sedentary: { label: 'Sedentary', multiplier: 1.2, description: 'Banyak duduk, kerja depan laptop' },
  light: { label: 'Lightly Active', multiplier: 1.375, description: 'Olahraga ringan 1-3x/minggu' },
  moderate: { label: 'Moderately Active', multiplier: 1.55, description: 'Olahraga 3-4x/minggu' },
  active: { label: 'Very Active', multiplier: 1.725, description: 'Olahraga 5-6x/minggu' },
  very_active: { label: 'Extra Active', multiplier: 1.9, description: 'Olahraga 6-7x/minggu atau kerja fisik' },
  athlete: { label: 'Athlete', multiplier: 2.1, description: 'Atlet kompetitif, 2x sehari' },
}

export type FitnessProgram = 'lean_bulk' | 'fat_loss' | 'maintenance'

export interface ProgramConfig {
  name: string
  icon: string
  focus: string
  calorieModifier: number
  proteinRange: { min: number; max: number }
  macroSplit: { protein: number; carbs: number; fat: number }
  description: string
}

export const FITNESS_PROGRAMS: Record<FitnessProgram, ProgramConfig> = {
  lean_bulk: {
    name: 'Lean Bulk',
    icon: '🔥',
    focus: 'Nambah massa otot tanpa nambah banyak lemak',
    calorieModifier: 300,
    proteinRange: { min: 1.6, max: 2.2 },
    macroSplit: { protein: 30, carbs: 45, fat: 25 },
    description: 'Kalori surplus ringan dengan protein tinggi untuk membangun otot secara clean.',
  },
  fat_loss: {
    name: 'Fat Loss & Recomp',
    icon: '✂️',
    focus: 'Turunin kadar lemak, pertahankan otot',
    calorieModifier: -400,
    proteinRange: { min: 1.8, max: 2.4 },
    macroSplit: { protein: 35, carbs: 35, fat: 30 },
    description: 'Kalori defisit dengan protein lebih tinggi untuk menjaga massa otot saat cutting.',
  },
  maintenance: {
    name: 'Maintenance',
    icon: '🛡️',
    focus: 'Menjaga stamina, performa gym, & kebiasaan',
    calorieModifier: 0,
    proteinRange: { min: 1.4, max: 1.8 },
    macroSplit: { protein: 25, carbs: 45, fat: 30 },
    description: 'Kalori sesuai kebutuhan tubuh untuk menjaga performa dan komposisi tubuh saat ini.',
  },
}

export interface UserBodyStats {
  weight_kg: number
  height_cm: number
  age: number
  gender: Gender
  activity_level: ActivityLevel
  program: FitnessProgram
  is_configured: boolean
}

export interface CalculatedTargets {
  bmr: number
  tdee: number
  target_calories: number
  target_protein_min: number
  target_protein_max: number
  target_protein_mid: number
  macro_split: { protein_g: number; carbs_g: number; fat_g: number; protein_kcal: number; carbs_kcal: number; fat_kcal: number }
}
