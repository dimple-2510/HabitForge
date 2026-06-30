'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Grid3X3, List, X } from 'lucide-react'
import Link from 'next/link'

type ViewMode = 'month' | 'week'

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const startOfMonth = new Date(year, month, 1)
        const endOfMonth = new Date(year, month + 1, 0)
        const fetchStart = new Date(startOfMonth)
        fetchStart.setDate(fetchStart.getDate() - 7)
        const fetchEnd = new Date(endOfMonth)
        fetchEnd.setDate(fetchEnd.getDate() + 7)

        const [habitsRes, logsRes, eventsRes] = await Promise.all([
          supabase.from('habits').select('id, name, color, habit_type, target_value').eq('user_id', user.id).eq('is_active', true),
          supabase.from('habit_logs').select('habit_id, completed_date, count_value').eq('user_id', user.id)
            .gte('completed_date', fetchStart.toISOString().split('T')[0])
            .lte('completed_date', fetchEnd.toISOString().split('T')[0]),
          supabase.from('events').select('*').eq('user_id', user.id).eq('is_active', true),
        ])

        if (habitsRes.error) console.error('Habits fetch error:', habitsRes.error)
        if (logsRes.error) console.error('Logs fetch error:', logsRes.error)
        if (eventsRes.error) console.error('Events fetch error:', eventsRes.error)
        if (habitsRes.data) setHabits(habitsRes.data)
        if (logsRes.data) setLogs(logsRes.data)
        if (eventsRes.data) setEvents(eventsRes.data)
      } catch (e) {
        console.error('Calendar fetch exception:', e)
      }
      setLoading(false)
    }
    fetchData()
  }, [currentDate, supabase])

  // Build a map: date -> { completed: number, total: number, habitStatuses: [] }
  const dayStatusMap = useMemo(() => {
    const map: Record<string, { completed: number; total: number; habitStatuses: { id: string; name: string; color: string; completed: boolean; count: number; target: number }[] }> = {}

    // Initialize with all habits
    const dates = new Set(logs.map(l => l.completed_date))
    dates.add(today)

    dates.forEach(date => {
      map[date] = { completed: 0, total: habits.length, habitStatuses: [] }
      habits.forEach(h => {
        const log = logs.find(l => l.habit_id === h.id && l.completed_date === date)
        const count = log?.count_value || 0
        const isCompleted = h.habit_type === 'target_count' ? count >= (h.target_value || 0) : !!log
        if (isCompleted) map[date].completed++
        map[date].habitStatuses.push({ id: h.id, name: h.name, color: h.color, completed: isCompleted, count, target: h.target_value || 0 })
      })
    })

    return map
  }, [habits, logs, today])

  // Get events for a specific date
  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => {
      if (!event.last_start_date) return false
      if (event.type === 'period' && event.cycle_length_days) {
        const lastStart = new Date(event.last_start_date + 'T00:00:00')
        const checkDate = new Date(dateStr + 'T00:00:00')
        const diffDays = Math.floor((checkDate.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays < 0) return false
        const cyclePos = diffDays % event.cycle_length_days
        return cyclePos < event.duration_days
      }
      return event.last_start_date === dateStr
    })
  }

  // Month view calculations
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDow = firstDay.getDay() // 0=Sun
    const days: { date: string; inMonth: boolean; dateObj: Date }[] = []

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d.toISOString().split('T')[0], inMonth: false, dateObj: d })
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateObj = new Date(year, month, d)
      days.push({ date: dateObj.toISOString().split('T')[0], inMonth: true, dateObj })
    }

    // Next month padding to fill 6 weeks (42 cells)
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const dateObj = new Date(year, month + 1, d)
      days.push({ date: dateObj.toISOString().split('T')[0], inMonth: false, dateObj })
    }

    return days
  }, [currentDate])

  // Week view calculations
  const weekDays = useMemo(() => {
    const start = new Date(currentDate)
    const dow = start.getDay()
    start.setDate(start.getDate() - dow)
    const days: { date: string; dateObj: Date }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push({ date: d.toISOString().split('T')[0], dateObj: d })
    }
    return days
  }, [currentDate])

  const goToPrev = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrentDate(d)
    setSelectedDay(null)
  }

  const goToNext = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrentDate(d)
    setSelectedDay(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDay(null)
  }

  const getDayColor = (dateStr: string) => {
    const status = dayStatusMap[dateStr]
    if (!status || status.total === 0) return 'bg-gray-100 dark:bg-gray-800'
    const pct = status.completed / status.total
    if (pct === 1) return 'bg-emerald-400 dark:bg-emerald-600'
    if (pct >= 0.5) return 'bg-emerald-300 dark:bg-emerald-700'
    if (pct > 0) return 'bg-amber-300 dark:bg-amber-700'
    return 'bg-red-200 dark:bg-red-900'
  }

  const monthName = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  )

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your habits and events at a glance</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewMode === 'month' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              <Grid3X3 className="h-3.5 w-3.5" /> Month
            </button>
            <button onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewMode === 'week' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              <List className="h-3.5 w-3.5" /> Week
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPrev} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{monthName}</h2>
          <button onClick={goToToday}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            Today
          </button>
        </div>
        <button onClick={goToNext} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900" />
        <div className="w-3 h-3 rounded-sm bg-amber-300 dark:bg-amber-700" />
        <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
        <span>More</span>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, i) => {
              const isToday = day.date === today
              const isSelected = day.date === selectedDay
              const dayEvents = getEventsForDate(day.date)
              const status = dayStatusMap[day.date]

              return (
                <button key={i}
                  onClick={() => setSelectedDay(isSelected ? null : day.date)}
                  className={`relative aspect-square rounded-lg p-1 text-xs transition-all flex flex-col items-center justify-start gap-0.5
                    ${day.inMonth ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-30'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'ring-2 ring-purple-500' : ''}
                  `}>
                  <span className={`text-xs font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : day.inMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                    {day.dateObj.getDate()}
                  </span>
                  {/* Habit dot */}
                  {status && status.total > 0 && (
                    <div className={`w-2 h-2 rounded-full ${getDayColor(day.date)}`} />
                  )}
                  {/* Event indicators */}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev: any, ei: number) => (
                        <div key={ei} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ev.color }} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekDays.map((day, i) => {
            const isToday = day.date === today
            const isSelected = day.date === selectedDay
            const dayEvents = getEventsForDate(day.date)
            const status = dayStatusMap[day.date]

            return (
              <button key={i}
                onClick={() => setSelectedDay(isSelected ? null : day.date)}
                className={`rounded-xl p-2 sm:p-3 text-center transition-all border
                  ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
                  ${isSelected ? 'ring-2 ring-purple-500' : ''}
                  hover:shadow-md
                `}>
                <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase">
                  {day.dateObj.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className={`text-lg sm:text-2xl font-bold mt-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                  {day.dateObj.getDate()}
                </div>
                {/* Progress bar */}
                {status && status.total > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${status.completed === status.total ? 'bg-emerald-500' : status.completed > 0 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${(status.completed / status.total) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{status.completed}/{status.total}</p>
                  </div>
                )}
                {/* Event bars */}
                {dayEvents.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {dayEvents.map((ev: any, ei: number) => (
                      <div key={ei} className="h-1 rounded-full" style={{ backgroundColor: ev.color }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Selected Day Detail */}
      {selectedDay && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button onClick={() => setSelectedDay(null)} className="text-xs text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
          </div>

          {/* Habits for this day */}
          {dayStatusMap[selectedDay] ? (
            <div className="space-y-2">
              {dayStatusMap[selectedDay].habitStatuses.map((h: any) => (
                <div key={h.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${h.completed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <span className={`truncate ${h.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{h.name}</span>
                  {h.target > 0 && <span className="text-xs text-gray-400 ml-auto shrink-0">{h.count}/{h.target}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No habits tracked for this day</p>
          )}

          {/* Events for this day */}
          {getEventsForDate(selectedDay).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Events</p>
              {getEventsForDate(selectedDay).map((ev: any) => (
                <div key={ev.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                  <span className="text-gray-700 dark:text-gray-300">{ev.name}</span>
                  <span className="text-xs text-gray-400 capitalize">{ev.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick link to dashboard for that day */}
          {selectedDay !== today && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <a href={`/dashboard?date=${selectedDay}`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                → Edit habits for this day on Dashboard
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
