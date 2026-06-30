'use client'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Plus, Trash2, ClipboardList, Check, ChevronDown, ChevronUp, Play } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Habit {
  id: string
  name: string
  color: string
  habit_type: string
  target_value: number | null
}

interface Group {
  id: string
  name: string
  description: string | null
  color: string
  habits: Habit[]
}

interface HabitLog {
  habit_id: string
  completed_date: string
  count_value: number
}

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4']

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColor, setNewColor] = useState('#8B5CF6')
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [groupsRes, habitsRes, itemsRes, logsRes] = await Promise.all([
      supabase.from('habit_groups').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('habits').select('id, name, color, habit_type, target_value').eq('user_id', user.id).eq('is_active', true).order('name'),
      supabase.from('habit_group_items').select('group_id, habit_id'),
      supabase.from('habit_logs').select('habit_id, completed_date, count_value').eq('user_id', user.id).eq('completed_date', today),
    ])

    if (habitsRes.data) setHabits(habitsRes.data)
    if (logsRes.data) setTodayLogs(logsRes.data)

    if (groupsRes.data) {
      const groupItems = itemsRes.data || []
      const habitsByGroup: Record<string, Habit[]> = {}
      for (const item of groupItems) {
        const habit = habitsRes.data?.find(h => h.id === item.habit_id)
        if (habit) {
          if (!habitsByGroup[item.group_id]) habitsByGroup[item.group_id] = []
          habitsByGroup[item.group_id].push(habit)
        }
      }
      setGroups(groupsRes.data.map((g: any) => ({
        ...g,
        habits: habitsByGroup[g.id] || [],
      })))
    }
    setLoading(false)
  }, [today])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const isHabitDone = (habitId: string) => {
    return todayLogs.some(l => l.habit_id === habitId)
  }

  const getGroupProgress = (group: Group) => {
    if (group.habits.length === 0) return { done: 0, total: 0, pct: 0 }
    const done = group.habits.filter(h => isHabitDone(h.id)).length
    return { done, total: group.habits.length, pct: Math.round((done / group.habits.length) * 100) }
  }

  const toggleHabitInRoutine = async (habitId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const alreadyDone = isHabitDone(habitId)

    if (alreadyDone) {
      // Undo: remove today's log for this habit
      await supabase.from('habit_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('habit_id', habitId)
        .eq('completed_date', today)
    } else {
      // Mark done: insert log
      await supabase.from('habit_logs').insert({
        user_id: user.id,
        habit_id: habitId,
        completed_date: today,
        count_value: 1,
      })
    }

    // Refresh logs
    const { data } = await supabase.from('habit_logs')
      .select('habit_id, completed_date, count_value')
      .eq('user_id', user.id)
      .eq('completed_date', today)
    if (data) setTodayLogs(data)
  }

  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev =>
      prev.includes(habitId) ? prev.filter(h => h !== habitId) : [...prev, habitId]
    )
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSubmitting(false); return }

    const { data: group, error } = await supabase.from('habit_groups').insert({
      user_id: user.id,
      name: newName.trim(),
      description: newDesc.trim() || null,
      color: newColor,
    }).select().single()

    if (!error && group && selectedHabits.length > 0) {
      await supabase.from('habit_group_items').insert(
        selectedHabits.map(hid => ({
          group_id: group.id,
          habit_id: hid,
        }))
      )
    }

    setShowCreate(false)
    setNewName('')
    setNewDesc('')
    setSelectedHabits([])
    setSubmitting(false)
    fetchData()
  }

  const deleteGroup = async (groupId: string) => {
    if (deleteConfirmId !== groupId) {
      setDeleteConfirmId(groupId)
      return
    }
    await supabase.from('habit_groups').delete().eq('id', groupId)
    setDeleteConfirmId(null)
    fetchData()
  }

  const startRoutine = (group: Group) => {
    setExpandedGroups(prev => ({ ...prev, [group.id]: true }))
  }

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-4">
        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Routines</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Group habits into daily routines and track them together</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm sm:text-base">
          <Plus className="h-5 w-5" /> New Routine
        </button>
      </div>

      {showCreate && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Create New Routine</h2>
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Routine Name *</label>
              <input id="group-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g., Morning Routine" />
            </div>
            <div>
              <label htmlFor="group-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea id="group-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setNewColor(c)}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${newColor === c ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            {habits.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Habits to Routine</label>
                <div className="space-y-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-600 p-2">
                  {habits.map(habit => (
                    <label key={habit.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedHabits.includes(habit.id) ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <input type="checkbox" checked={selectedHabits.includes(habit.id)} onChange={() => toggleHabit(habit.id)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{habit.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleCreate} disabled={submitting || !newName.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Creating...' : 'Create Routine'}
              </button>
              <button type="button" onClick={() => { setShowCreate(false); setSelectedHabits([]); setNewName(''); setNewDesc(''); }}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 && !showCreate ? (
        <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ClipboardList className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No routines yet</h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto px-4">Group related habits together and track them as a daily routine</p>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
            <Plus className="h-5 w-5" /> Create your first routine
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {groups.map(group => {
            const progress = getGroupProgress(group)
            const isExpanded = expandedGroups[group.id] ?? false
            const allDone = progress.total > 0 && progress.done === progress.total

            return (
              <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                {/* Group Header */}
                <div className="p-4 sm:p-5 cursor-pointer" style={{ borderLeftWidth: '4px', borderLeftColor: group.color }} onClick={() => toggleGroup(group.id)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{group.name}</h2>
                        {allDone && (
                          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Done
                          </span>
                        )}
                      </div>
                      {group.description && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{group.description}</p>}

                      {/* Progress bar */}
                      {progress.total > 0 && (
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {progress.done}/{progress.total} habits today
                            </span>
                            <span className="text-xs font-semibold" style={{ color: allDone ? '#10B981' : group.color }}>
                              {progress.pct}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress.pct}%`,
                                backgroundColor: allDone ? '#10B981' : group.color,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); startRoutine(group); }}
                        className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 px-2 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        title="Start this routine">
                        <Play className="h-3.5 w-3.5" /> Start
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${deleteConfirmId === group.id ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                        title={deleteConfirmId === group.id ? 'Click again to confirm delete' : 'Delete routine'}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded: Habits with checkboxes */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-3 sm:p-4 space-y-1">
                    {group.habits.length === 0 ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No habits in this routine yet</p>
                    ) : (
                      group.habits.map(habit => {
                        const done = isHabitDone(habit.id)
                        return (
                          <button
                            key={habit.id}
                            onClick={(e) => toggleHabitInRoutine(habit.id, e)}
                            className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all text-left ${done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}`}>
                              {done && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
                            <span className={`text-sm truncate ${done ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                              {habit.name}
                            </span>
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
