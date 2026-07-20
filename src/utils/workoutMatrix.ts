export interface WorkoutTemplate {
  name: string
  defaultDuration: number
  intensity: 'Rendah' | 'Sedang' | 'Tinggi'
  icon: string
  kcalPerMinute: number
}

export const WORKOUT_TEMPLATES: Record<string, WorkoutTemplate> = {
  PUSH_DAY: {
    name: 'Push Day (Dada, Bahu, Triceps)',
    defaultDuration: 60,
    intensity: 'Tinggi',
    icon: '🏋️',
    kcalPerMinute: 8,
  },
  PULL_DAY: {
    name: 'Pull Day (Punggung, Biceps)',
    defaultDuration: 60,
    intensity: 'Tinggi',
    icon: '💪',
    kcalPerMinute: 8,
  },
  LEG_DAY: {
    name: 'Leg Day (Kaki, Core)',
    defaultDuration: 60,
    intensity: 'Tinggi',
    icon: '🦵',
    kcalPerMinute: 8,
  },
  UPPER_BODY: {
    name: 'Upper Body Workout',
    defaultDuration: 45,
    intensity: 'Sedang',
    icon: '👕',
    kcalPerMinute: 6,
  },
  CARDIO_RUN: {
    name: 'Cardio / Lari / Treadmill',
    defaultDuration: 30,
    intensity: 'Sedang',
    icon: '🏃',
    kcalPerMinute: 7,
  },
  CUSTOM: {
    name: 'Latihan Lainnya (Custom)',
    defaultDuration: 30,
    intensity: 'Sedang',
    icon: '⚡',
    kcalPerMinute: 5,
  },
}
