/**
 * Streak, consistency & habit strength calculation utilities for HabitForge
 */

export interface HabitLog {
  habit_id: string
  completed_date: string  // YYYY-MM-DD
  count_value?: number
}

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number  // 0-100
  consistency7d: number   // 0-100
  consistency30d: number  // 0-100
  habitStrength: number   // 0-100 (Loop-style exponential decay scoring)
  bestDay: string         // e.g. "Monday"
  dayDistribution: Record<string, number>  // day -> count
  weeklyTrend: number[]   // last 7 weeks completion counts
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function todayStr(): string {
  return formatDate(new Date())
}

function daysBetween(a: string, b: string): number {
  const da = parseDate(a)
  const db = parseDate(b)
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Calculate comprehensive streak and consistency metrics for a single habit
 */
export function calculateStreak(logs: HabitLog[], habitCreatedDate?: string): StreakResult {
  const today = todayStr()
  const uniqueDates = [...new Set(logs.map(l => l.completed_date))].sort()

  // Current streak: count backwards from today (or yesterday if today has no entry)
  let currentStreak = 0
  const checkDate = new Date()
  // If today has no entry, start from yesterday
  if (!uniqueDates.includes(formatDate(checkDate))) {
    checkDate.setDate(checkDate.getDate() - 1)
  }
  while (true) {
    const dateStr = formatDate(checkDate)
    if (uniqueDates.includes(dateStr)) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Longest streak: find longest consecutive run
  let longestStreak = 0
  let run = 0
  if (uniqueDates.length > 0) {
    run = 1
    longestStreak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const gap = daysBetween(uniqueDates[i - 1], uniqueDates[i])
      if (gap === 1) {
        run++
        longestStreak = Math.max(longestStreak, run)
      } else {
        run = 1
      }
    }
  }

  const totalCompletions = uniqueDates.length

  // Completion rate: completions / days since creation
  const startDate = habitCreatedDate || (uniqueDates[0] || today)
  const daysSinceStart = Math.max(1, daysBetween(startDate, today) + 1)
  const completionRate = Math.round((totalCompletions / daysSinceStart) * 100)

  // 7-day consistency
  const last7Days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7Days.push(formatDate(d))
  }
  const completed7d = last7Days.filter(d => uniqueDates.includes(d)).length
  const consistency7d = Math.round((completed7d / 7) * 100)

  // 30-day consistency
  const last30Days: string[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last30Days.push(formatDate(d))
  }
  const completed30d = last30Days.filter(d => uniqueDates.includes(d)).length
  const consistency30d = Math.round((completed30d / 30) * 100)

  // Habit strength score (Loop-style exponential decay)
  const habitStrength = calculateHabitStrength(uniqueDates, daysSinceStart)

  // Day of week distribution
  const dayDistribution: Record<string, number> = {}
  DAY_NAMES.forEach(d => dayDistribution[d] = 0)
  uniqueDates.forEach(dateStr => {
    const dayName = DAY_NAMES[parseDate(dateStr).getDay()]
    dayDistribution[dayName] = (dayDistribution[dayName] || 0) + 1
  })

  let bestDay = 'Monday'
  let bestCount = 0
  Object.entries(dayDistribution).forEach(([day, count]) => {
    if (count > bestCount) {
      bestCount = count
      bestDay = day
    }
  })

  // Weekly trend (last 7 weeks)
  const weeklyTrend: number[] = []
  for (let w = 6; w >= 0; w--) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (w * 7 + 6))
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() - (w * 7))
    const count = uniqueDates.filter(d => {
      const dd = parseDate(d)
      return dd >= weekStart && dd <= weekEnd
    }).length
    weeklyTrend.push(count)
  }

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
    consistency7d,
    consistency30d,
    habitStrength,
    bestDay,
    dayDistribution,
    weeklyTrend,
  }
}

/**
 * Loop-style habit strength algorithm
 * Uses exponential decay: recent completions matter more
 * Score 0-100
 */
function calculateHabitStrength(completionDates: string[], daysSinceStart: number): number {
  if (completionDates.length === 0) return 0
  if (completionDates.length === 1) return Math.min(10, Math.round(100 / daysSinceStart))

  const today = todayStr()
  const halfLife = 7 // days for score to halve without activity

  let score = 0
  for (const date of completionDates) {
    const daysAgo = daysBetween(date, today)
    score += Math.pow(0.5, daysAgo / halfLife)
  }

  // Normalize to 0-100
  const maxPossible = 1 / (1 - Math.pow(0.5, 1 / halfLife))
  return Math.min(100, Math.round((score / maxPossible) * 100))
}

/**
 * Generate heatmap data for a calendar view
 * Returns array of { date, count, level } for each day
 */
export function generateHeatmapData(
  logs: HabitLog[],
  monthsBack: number = 6
): { date: string; count: number; level: number }[] {
  const today = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - monthsBack)
  startDate.setDate(1)

  const countMap: Record<string, number> = {}
  logs.forEach(l => {
    countMap[l.completed_date] = (countMap[l.completed_date] || 0) + 1
  })

  const maxCount = Math.max(1, ...Object.values(countMap))

  const result: { date: string; count: number; level: number }[] = []
  const current = new Date(startDate)
  while (current <= today) {
    const dateStr = formatDate(current)
    const count = countMap[dateStr] || 0
    const ratio = count / maxCount
    const level = count === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4
    result.push({ date: dateStr, count, level })
    current.setDate(current.getDate() + 1)
  }

  return result
}

// Backward-compatible wrapper
export function calculateStreakLegacy(dates: string[]): { current: number; longest: number } {
  const result = calculateStreak(dates.map(d => ({ habit_id: '', completed_date: d })))
  return { current: result.currentStreak, longest: result.longestStreak }
}
