import type { DailyLog } from '@/types'

export interface HeatmapDay {
  date: string
  level: number
  tooltip: string
}

export type HeatmapWeek = HeatmapDay[]

function toKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function calcLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  return 3
}

export function buildHeatmapWeeks(logs: DailyLog[], endDate?: Date): HeatmapWeek[] {
  if (logs.length === 0) return []

  const counts = new Map<string, number>()
  for (const log of logs) {
    counts.set(log.date, (counts.get(log.date) ?? 0) + 1)
  }

  const lastDate = endDate ?? new Date(Math.max(...logs.map((l) => new Date(l.date).getTime())))
  const firstDate = new Date(Math.min(...logs.map((l) => new Date(l.date).getTime())))

  const startDate = new Date(firstDate)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const weeks: HeatmapWeek[] = []
  let currentWeek: HeatmapDay[] = []
  const d = new Date(startDate)

  while (d <= lastDate) {
    if (d.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    const key = toKey(d)
    const count = counts.get(key) ?? 0
    currentWeek.push({
      date: key,
      level: calcLevel(count),
      tooltip: `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}: ${count} log`,
    })
    d.setDate(d.getDate() + 1)
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}
