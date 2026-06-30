import { calculateStreak, generateHeatmapData } from '@/lib/streaks'

describe('calculateStreak', () => {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]
  const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0]
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
  const sixDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const toLogs = (dates: string[]) => dates.map(d => ({ habit_id: 'h1', completed_date: d }))

  it('returns zero streaks for empty array', () => {
    const result = calculateStreak([])
    expect(result.currentStreak).toBe(0)
    expect(result.longestStreak).toBe(0)
  })

  it('calculates current streak ending today', () => {
    const result = calculateStreak(toLogs([today, yesterday, twoDaysAgo]))
    expect(result.currentStreak).toBe(3)
  })

  it('calculates current streak ending yesterday', () => {
    const result = calculateStreak(toLogs([yesterday, twoDaysAgo, threeDaysAgo]))
    expect(result.currentStreak).toBe(3)
  })

  it('returns zero current streak if last entry is 2+ days ago', () => {
    const result = calculateStreak(toLogs([twoDaysAgo, threeDaysAgo, fourDaysAgo]))
    expect(result.currentStreak).toBe(0)
  })

  it('calculates longest streak with a gap', () => {
    const dates = toLogs([
      today, yesterday, twoDaysAgo,  // streak of 3
      fiveDaysAgo, sixDaysAgo,        // streak of 2 (gap at 3-4 days ago)
    ])
    const result = calculateStreak(dates)
    expect(result.longestStreak).toBe(3)
  })

  it('handles single date', () => {
    const result = calculateStreak(toLogs([today]))
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(1)
  })

  it('handles duplicate dates', () => {
    const result = calculateStreak(toLogs([today, today, yesterday, yesterday]))
    expect(result.currentStreak).toBe(2)
  })

  it('calculates 7-day streak correctly', () => {
    const dates = toLogs([
      today, yesterday, twoDaysAgo, threeDaysAgo,
      fourDaysAgo, fiveDaysAgo, sixDaysAgo,
    ])
    const result = calculateStreak(dates)
    expect(result.currentStreak).toBe(7)
    expect(result.longestStreak).toBe(7)
  })

  it('longest streak is at least current streak', () => {
    const result = calculateStreak(toLogs([today, yesterday, twoDaysAgo]))
    expect(result.longestStreak).toBeGreaterThanOrEqual(result.currentStreak)
  })

  it('calculates completion rate', () => {
    const dates = toLogs([today, yesterday, twoDaysAgo])
    const result = calculateStreak(dates, threeDaysAgo)
    // 3 completions / 4 days (3 days ago to today inclusive) = 75%
    expect(result.completionRate).toBe(75)
  })

  it('calculates 7-day consistency', () => {
    const dates = toLogs([today, yesterday, twoDaysAgo, threeDaysAgo, fourDaysAgo])
    const result = calculateStreak(dates)
    expect(result.consistency7d).toBeGreaterThan(0)
    expect(result.consistency7d).toBeLessThanOrEqual(100)
  })

  it('habit strength is between 0 and 100', () => {
    const dates = toLogs([today, yesterday, twoDaysAgo])
    const result = calculateStreak(dates)
    expect(result.habitStrength).toBeGreaterThanOrEqual(0)
    expect(result.habitStrength).toBeLessThanOrEqual(100)
  })

  it('returns a best day of week', () => {
    const result = calculateStreak(toLogs([today, yesterday]))
    expect(typeof result.bestDay).toBe('string')
    expect(result.bestDay.length).toBeGreaterThan(0)
  })

  it('returns day distribution', () => {
    const result = calculateStreak(toLogs([today]))
    expect(Object.keys(result.dayDistribution).length).toBe(7)
  })

  it('returns weekly trend with 7 entries', () => {
    const result = calculateStreak(toLogs([today]))
    expect(result.weeklyTrend.length).toBe(7)
  })
})

describe('generateHeatmapData', () => {
  it('returns empty array for no logs', () => {
    const result = generateHeatmapData([], 1)
    expect(result.length).toBeGreaterThan(0) // still generates days in range
    expect(result.every(d => d.count === 0)).toBe(true)
  })

  it('generates correct number of days for 1 month', () => {
    const result = generateHeatmapData([], 1)
    // From 1st of previous month to today = ~50-60 days
    expect(result.length).toBeGreaterThanOrEqual(45)
    expect(result.length).toBeLessThanOrEqual(65)
  })

  it('counts completions correctly', () => {
    const logs = [
      { habit_id: 'h1', completed_date: new Date().toISOString().split('T')[0] },
      { habit_id: 'h1', completed_date: new Date().toISOString().split('T')[0] },
    ]
    const result = generateHeatmapData(logs, 1)
    const todayEntry = result.find(d => d.date === new Date().toISOString().split('T')[0])
    expect(todayEntry?.count).toBe(2)
  })

  it('assigns levels 0-4', () => {
    const today = new Date().toISOString().split('T')[0]
    const logs = [{ habit_id: 'h1', completed_date: today }]
    const result = generateHeatmapData(logs, 1)
    const todayEntry = result.find(d => d.date === today)
    expect(todayEntry?.level).toBeGreaterThanOrEqual(0)
    expect(todayEntry?.level).toBeLessThanOrEqual(4)
  })
})
