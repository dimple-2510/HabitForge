'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import {
  Flame, Target, TrendingUp, Award, Calendar, Clock,
  Zap, ChevronDown, ChevronUp, ArrowLeft, Trophy, CheckCircle, BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { calculateStreak, generateHeatmapData } from '@/lib/streaks'

// ─── Constants ───────────────────────────────────────────────────────────────

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

const HEATMAP_COLORS = [
  'bg-gray-100 dark:bg-gray-800',     // 0 — no activity
  'bg-emerald-200 dark:bg-emerald-900', // 1 — low
  'bg-emerald-300 dark:bg-emerald-700', // 2 — medium
  'bg-emerald-400 dark:bg-emerald-600', // 3 — high
  'bg-emerald-500 dark:bg-emerald-500', // 4 — very high
]

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']  // sparse labels for heatmap

type TimeRange = 'week' | 'month' | 'year'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Habit {
  id: string
  name: string
  category: string
  color: string
  habit_type: string
  target_value: number | null
  created_at: string
}

interface Log {
  habit_id: string
  completed_date: string
  count_value: number
}

interface HabitAnalytics extends Habit {
  currentStreak: number
  longestStreak: number
  completionRate: number
  consistency7d: number
  consistency30d: number
  habitStrength: number
  bestDay: string
  totalCompletions: number
  heatmap: { date: string; count: number; level: number }[]
}

// ─── Components ──────────────────────────────────────────────────────────────

function StatsCard({ title, value, subtitle, icon, color = 'blue' }: {
  title: string; value: string | number; subtitle?: string; icon: React.ReactNode; color?: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function StrengthBadge({ score }: { score: number }) {
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Building' : score >= 20 ? 'Weak' : 'New'
  const color = score >= 80 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400'
    : score >= 50 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400'
    : score >= 20 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
    : 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
}

function HeatmapCell({ level, date, count }: { level: number; date: string; count: number }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <div
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${HEATMAP_COLORS[level]} cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {count} completion{count !== 1 ? 's' : ''} on {new Date(date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  )
}

function HeatmapCalendar({ data, title }: { data: { date: string; count: number; level: number }[]; title: string }) {
  // Group by weeks (columns) and days of week (rows)
  const weeks: { date: string; count: number; level: number }[][] = []
  let currentWeek: { date: string; count: number; level: number }[] = []

  // Pad the first week
  if (data.length > 0) {
    const firstDay = new Date(data[0].date + 'T00:00:00').getDay()
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', count: -1, level: -1 })
    }
  }

  data.forEach(day => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1, level: -1 })
    }
    weeks.push(currentWeek)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Less</span>
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-fit">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 pt-0">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex items-center text-[9px] text-gray-400 dark:text-gray-500">
                {label}
              </div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div key={di} className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                  {day.level >= 0 ? (
                    <HeatmapCell level={day.level} date={day.date} count={day.count} />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Month labels */}
      <div className="flex gap-[3px] mt-2 ml-5">
        {weeks.map((week, wi) => {
          const firstValidDay = week.find(d => d.date)
          if (!firstValidDay) return <div key={wi} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          const month = new Date(firstValidDay.date + 'T00:00:00').getMonth()
          const showLabel = wi === 0 || (() => {
            const prevWeek = weeks[wi - 1]?.find(d => d.date)
            return prevWeek && new Date(prevWeek.date + 'T00:00:00').getMonth() !== month
          })()
          return (
            <div key={wi} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[8px] text-gray-400">
              {showLabel ? MONTH_NAMES[month] : ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HabitAnalyticsCard({ habit }: { habit: HabitAnalytics }) {
  const [expanded, setExpanded] = useState(false)

  const streakIcon = <Flame className="h-4 w-4 text-orange-500" />

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color || '#3B82F6' }} />
          <div className="text-left min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{habit.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{habit.category}</span>
              <StrengthBadge score={habit.habitStrength} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{habit.currentStreak}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{habit.completionRate}%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Rate</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{habit.habitStrength}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Strength</p>
            </div>
          </div>
          {/* Mobile: just show streak */}
          <div className="sm:hidden text-right">
            <p className="text-lg font-bold text-orange-500 flex items-center justify-end gap-1">{habit.currentStreak}<Flame className="h-4 w-4" /></p>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 sm:p-5 space-y-4">
          {/* Mobile stats row */}
          <div className="grid grid-cols-4 gap-2 sm:hidden">
            {[
              { label: 'Streak', value: habit.currentStreak },
              { label: 'Best', value: habit.longestStreak },
              { label: 'Rate', value: `${habit.completionRate}%` },
              { label: '7-day', value: `${habit.consistency7d}%` },
            ].map(stat => (
              <div key={stat.label} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Desktop stats grid */}
          <div className="hidden sm:grid grid-cols-6 gap-3">
            {[
              { label: 'Current Streak', value: `${habit.currentStreak} days`, icon: <Flame className="h-4 w-4 text-orange-500" /> },
              { label: 'Longest Streak', value: `${habit.longestStreak} days`, icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
              { label: 'Total Done', value: habit.totalCompletions, icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
              { label: 'Completion Rate', value: `${habit.completionRate}%`, icon: <BarChart3 className="h-4 w-4 text-blue-500" /> },
              { label: '7-Day Consistency', value: `${habit.consistency7d}%`, icon: <Zap className="h-4 w-4 text-purple-500" /> },
              { label: '30-Day Consistency', value: `${habit.consistency30d}%`, icon: <Calendar className="h-4 w-4 text-teal-500" /> },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Strength bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Habit Strength</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{habit.habitStrength}/100</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${habit.habitStrength}%`,
                  background: habit.habitStrength >= 80 ? '#10B981' : habit.habitStrength >= 50 ? '#3B82F6' : habit.habitStrength >= 20 ? '#F59E0B' : '#9CA3AF',
                }}
              />
            </div>
          </div>

          {/* Best day */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Most active on <strong className="text-gray-700 dark:text-gray-300">{habit.bestDay}s</strong></span>
          </div>

          {/* Mini heatmap for this habit */}
          {habit.heatmap.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Last 3 Months</p>
              <div className="flex gap-[2px] flex-wrap">
                {habit.heatmap.slice(-90).map(day => (
                  <div key={day.date} className="w-2.5 h-2.5 sm:w-3 sm:h-3">
                    <HeatmapCell level={day.level} date={day.date} count={day.count} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [habitsRes, logsRes] = await Promise.all([
        supabase.from('habits').select('id, name, category, color, habit_type, target_value, created_at').eq('user_id', user.id),
        supabase.from('habit_logs').select('habit_id, completed_date, count_value').eq('user_id', user.id),
      ])

      if (habitsRes.data) setHabits(habitsRes.data as Habit[])
      if (logsRes.data) setLogs(logsRes.data as Log[])
      setLoading(false)
    }
    fetchData()
  }, [])

  // ─── Aggregate analytics ──────────────────────────────────────────────────

  const analytics = useMemo(() => {
    const totalHabits = habits.length
    const today = new Date().toISOString().split('T')[0]
    const todayLogs = logs.filter(l => l.completed_date === today)
    const todayCompletions = todayLogs.length

    // Total completions: count distinct habit-days (not raw log rows)
    const totalCompletions = logs.reduce((sum, l) => sum + (l.count_value || 1), 0)
    const avgCompletionRate = totalHabits > 0
      ? Math.round(habits.reduce((sum, h) => {
          const hLogs = logs.filter(l => l.habit_id === h.id)
          const createdDate = h.created_at.split('T')[0]
          const streak = calculateStreak(hLogs, createdDate)
          return sum + streak.completionRate
        }, 0) / totalHabits)
      : 0

    // Overall consistency (7-day)
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })
    const daysWithActivity = last7.filter(d => logs.some(l => l.completed_date === d)).length
    const overallConsistency = Math.round((daysWithActivity / 7) * 100)

    // Average habit strength
    const avgStrength = totalHabits > 0
      ? Math.round(habits.reduce((sum, h) => {
          const hLogs = logs.filter(l => l.habit_id === h.id)
          const createdDate = h.created_at.split('T')[0]
          return sum + calculateStreak(hLogs, createdDate).habitStrength
        }, 0) / totalHabits)
      : 0

    // Weekly completions bar chart
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const count = logs.filter(l => l.completed_date === dateStr).length
      return { day: d.toLocaleDateString('en', { weekday: 'short' }), completions: count }
    })

    // Monthly trend (last 4 weeks)
    const monthData = Array.from({ length: 4 }, (_, wi) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - ((3 - wi) * 7 + 6))
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() - ((3 - wi) * 7))
      const count = logs.filter(l => {
        const d = new Date(l.completed_date + 'T00:00:00')
        return d >= weekStart && d <= weekEnd
      }).length
      return { week: `W${wi + 1}`, completions: count }
    })

    // Category distribution
    const categoryMap: Record<string, number> = {}
    habits.forEach(h => { categoryMap[h.category] = (categoryMap[h.category] || 0) + 1 })
    const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

    // Overall heatmap (6 months)
    const heatmapData = generateHeatmapData(logs, 6)

    // Per-habit analytics
    const habitAnalytics: HabitAnalytics[] = habits.map(h => {
      const hLogs = logs.filter(l => l.habit_id === h.id)
      const createdDate = h.created_at.split('T')[0] // Extract YYYY-MM-DD from ISO timestamp
      const streak = calculateStreak(hLogs, createdDate)
      const hHeatmap = generateHeatmapData(hLogs, 3)
      return { ...h, ...streak, heatmap: hHeatmap }
    }).sort((a, b) => b.habitStrength - a.habitStrength)  // strongest first

    return {
      totalHabits, todayCompletions, totalCompletions, avgCompletionRate,
      overallConsistency, avgStrength, weekData, monthData, pieData,
      heatmapData, habitAnalytics,
    }
  }, [habits, logs])

  // ─── Loading state ────────────────────────────────────────────────────────

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
      </div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  )

  // ─── Empty state ──────────────────────────────────────────────────────────

  if (habits.length === 0) {
    return (
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No habits to analyze</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first habit to start tracking your progress.</p>
          <Link href="/habits/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
            <Target className="h-4 w-4" /> Create Habit
          </Link>
        </div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep insights into your habit patterns</p>
        </div>
        {/* Time range toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 self-start">
          {(['week', 'month', 'year'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatsCard
          title="Today"
          value={`${analytics.todayCompletions}/${analytics.totalHabits}`}
          subtitle="completions"
          icon={<Target className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="blue"
        />
        <StatsCard
          title="7-Day Consistency"
          value={`${analytics.overallConsistency}%`}
          subtitle={`${analytics.totalHabits} habits tracked`}
          icon={<Zap className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="emerald"
        />
        <StatsCard
          title="Avg Strength"
          value={analytics.avgStrength}
          subtitle="habit strength score"
          icon={<Flame className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="orange"
        />
        <StatsCard
          title="Total Done"
          value={analytics.totalCompletions}
          subtitle="all-time completions"
          icon={<Award className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="purple"
        />
      </div>

      {/* ── Heatmap Calendar ──────────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <HeatmapCalendar data={analytics.heatmapData} title="Activity Heatmap" />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Weekly bar chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} axisLine={{ stroke: '#E5E7EB' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px' }} />
              <Bar dataKey="completions" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">Habits by Category</h3>
          {analytics.pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={analytics.pieData}
                    cx="50%" cy="50%"
                    outerRadius={55}
                    innerRadius={25}
                    dataKey="value"
                    paddingAngle={3}
                    label={false}
                  >
                    {analytics.pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
                    formatter={(value: any, name: any) => [`${value} habit${value !== 1 ? 's' : ''}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend below chart */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 justify-center">
                {analytics.pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="truncate max-w-[80px]">{entry.name}</span>
                    <span className="text-gray-400 dark:text-gray-500">({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* ── 4-Week Trend ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">4-Week Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={analytics.monthData}>
            <defs>
              <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} axisLine={{ stroke: '#E5E7EB' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px' }} />
            <Area type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} fill="url(#colorCompletions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Per-Habit Breakdown ───────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Habit Breakdown</h2>
        <div className="space-y-3">
          {analytics.habitAnalytics.map(habit => (
            <HabitAnalyticsCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>
    </div>
  )
}
