'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PlusCircle, ChevronLeft, ChevronRight, Calendar, RotateCcw, Lock, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import HabitCard from '@/components/HabitCard'

export default function DashboardPage() {
  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]
  const isToday = selectedDate === today
  const isFuture = selectedDate > today
  const isPast = selectedDate < today

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: true }),
      supabase.from('habit_logs').select('habit_id, count_value').eq('user_id', user.id).eq('completed_date', selectedDate),
    ])

    if (habitsRes.data) setHabits(habitsRes.data)
    if (logsRes.data) setLogs(logsRes.data)
    setLoading(false)
  }, [selectedDate, supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const goToPrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00')
    d.setDate(d.getDate() + 1)
    const next = d.toISOString().split('T')[0]
    if (next <= today) setSelectedDate(next)
  }

  const goToToday = () => setSelectedDate(today)

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const todayDate = new Date(today + 'T00:00:00')
    const diff = Math.floor((todayDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff > 1 && diff <= 7) return `${diff} days ago`
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const completedMap = new Map<string, boolean>()
  const countMap = new Map<string, number>()
  for (const log of logs) {
    const count = log.count_value || 1
    countMap.set(log.habit_id, count)
    completedMap.set(log.habit_id, true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            {isToday ? 'Track your habits for today' : isPast ? `Viewing ${formatDateLabel(selectedDate)}` : 'Future date'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Navigation */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button onClick={goToPrevDay} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors min-w-[100px] justify-center">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{formatDateLabel(selectedDate)}</span>
              <span className="sm:hidden">{isToday ? 'Today' : formatDateLabel(selectedDate).split(' ')[0]}</span>
            </button>
            <button onClick={goToNextDay} disabled={isToday}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {!isToday && (
            <button onClick={goToToday}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <RotateCcw className="h-3 w-3" />
              Today
            </button>
          )}

          {isToday && (
            <Link href="/habits/new" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm sm:text-base">
              <PlusCircle className="h-5 w-5" /> New Habit
            </Link>
          )}
        </div>
      </div>

      {/* Date Picker Dropdown */}
      {showDatePicker && (
        <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <input type="date" value={selectedDate} max={today}
            onChange={(e) => { setSelectedDate(e.target.value); setShowDatePicker(false) }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              { label: 'Today', offset: 0 },
              { label: 'Yesterday', offset: 1 },
              { label: '2 days ago', offset: 2 },
              { label: '3 days ago', offset: 3 },
              { label: '1 week ago', offset: 7 },
            ].map(({ label, offset }) => {
              const d = new Date()
              d.setDate(d.getDate() - offset)
              const dateStr = d.toISOString().split('T')[0]
              return (
                <button key={label} onClick={() => { setSelectedDate(dateStr); setShowDatePicker(false) }}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${selectedDate === dateStr ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Future date warning */}
      {isFuture && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          <Lock className="h-4 w-4 shrink-0" />
          Future dates are view-only. You can only log habits for today or past dates.
        </div>
      )}

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
      ) : !habits || habits.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No habits yet</h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto px-4">Start building better habits today. Create your first habit and begin your journey!</p>
          <Link href="/habits/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base">
            <PlusCircle className="h-5 w-5" /> Create your first habit
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active habits — pending/in-progress at top */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {habits.filter(habit => {
              const todayCount = countMap.get(habit.id) || 0
              return habit.habit_type === 'target_count'
                ? todayCount < (habit.target_value || 0)
                : completedMap.get(habit.id) !== true
            }).map(habit => {
              const todayCount = countMap.get(habit.id) || 0
              const isCompleted = false

              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isCompleted}
                  todayCount={todayCount}
                  userId={habit.user_id}
                  selectedDate={selectedDate}
                />
              )
            })}
          </div>

          {/* Completed habits — at bottom with dimmed styling */}
          {habits.some(habit => {
            const todayCount = countMap.get(habit.id) || 0
            return habit.habit_type === 'target_count'
              ? todayCount >= (habit.target_value || 0)
              : completedMap.get(habit.id) === true
          }) && (
            <div>
              <div className="flex items-center gap-3 mb-4 mt-8">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Completed</span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {habits.filter(habit => {
                  const todayCount = countMap.get(habit.id) || 0
                  return habit.habit_type === 'target_count'
                    ? todayCount >= (habit.target_value || 0)
                    : completedMap.get(habit.id) === true
                }).map(habit => {
                  const todayCount = countMap.get(habit.id) || 0
                  const isCompleted = true

                  return (
                    <div key={habit.id} className="opacity-60 hover:opacity-100 transition-opacity">
                      <HabitCard
                        habit={habit}
                        isCompleted={isCompleted}
                        todayCount={todayCount}
                        userId={habit.user_id}
                        selectedDate={selectedDate}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
