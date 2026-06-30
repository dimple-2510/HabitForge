'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Edit3, Plus, Minus, Check, Loader2, ExternalLink, Play, Camera, Ban, Target, Calendar, Pencil, StickyNote, PartyPopper, Lock, Undo2 } from 'lucide-react'
import Link from 'next/link'

interface HabitLink {
  url: string
  type: 'youtube' | 'instagram' | 'generic'
  label: string
}

interface Habit {
  id: string
  name: string
  description: string | null
  category: string
  color: string
  icon: string
  habit_type: string
  target_value: number | null
  target_unit: string | null
  links?: HabitLink[]
}

export default function HabitCard({ habit, isCompleted: initialCompleted, todayCount, userId, selectedDate }: {
  habit: Habit; isCompleted: boolean; todayCount?: number; userId: string; selectedDate?: string
}) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [count, setCount] = useState(todayCount || 0)
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const date = selectedDate || new Date().toISOString().split('T')[0]
  const isPast = date < new Date().toISOString().split('T')[0]
  const isFuture = date > new Date().toISOString().split('T')[0]

  // Sync state when props change
  useEffect(() => { setCompleted(initialCompleted) }, [initialCompleted])
  useEffect(() => { setCount(todayCount || 0) }, [todayCount])

  const isTargetCount = habit.habit_type === 'target_count'
  const isNegative = habit.habit_type === 'negative'
  const target = habit.target_value || 0
  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0

  const checkAndAwardBadges = useCallback(async () => {
    try {
      const { data } = await supabase.rpc('award_badges', { p_user_id: userId })
      if (data && data.length > 0) {
        console.log('Badges earned:', data.map((b: any) => b.badge_name).join(', '))
      }
    } catch (e) {
      console.error('Badge award error:', e)
    }
  }, [userId, supabase])

  const logCount = async (newCount: number) => {
    if (isFuture) return
    setLoading(true)
    const clamped = Math.max(0, Math.min(newCount, target * 2))

    setCount(clamped)
    if (clamped >= target) setCompleted(true)

    const { error } = await supabase.from('habit_logs').upsert({
      habit_id: habit.id,
      user_id: userId,
      completed_date: date,
      count_value: clamped,
      note: note || null,
    }, { onConflict: 'habit_id,completed_date' })

    if (error) {
      console.error('logCount error:', error)
      setCount(count)
      setCompleted(false)
    } else {
      checkAndAwardBadges()
    }

    setLoading(false)
    setShowNote(false)
    setNote('')
    setShowCustomInput(false)
    setCustomValue('')
  }

  const toggleCheckIn = async () => {
    if (isTargetCount || isFuture) return
    setLoading(true)

    if (completed) {
      setCompleted(false)
      const { error } = await supabase.from('habit_logs').delete().eq('habit_id', habit.id).eq('user_id', userId).eq('completed_date', date)
      if (error) {
        console.error('undo check-in error:', error)
        setCompleted(true)
      }
    } else {
      setCompleted(true)
      const { error } = await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        user_id: userId,
        completed_date: date,
        note: note || null,
      })
      if (error) {
        console.error('check-in error:', error)
        setCompleted(false)
      } else {
        checkAndAwardBadges()
      }
    }

    setLoading(false)
    setShowNote(false)
    setNote('')
  }

  const handleCustomSubmit = () => {
    const val = parseInt(customValue)
    if (!isNaN(val) && val >= 0) logCount(val)
  }

  const increment = () => logCount(count + 1)
  const decrement = () => count > 0 && logCount(count - 1)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [undoVisible, setUndoVisible] = useState(false)
  const [undoHabitId, setUndoHabitId] = useState<string | null>(null)
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const deleteHabit = async () => {
    setShowDeleteConfirm(false)
    setUndoHabitId(habit.id)
    setUndoVisible(true)

    // Soft delete after 5 seconds if undo not clicked
    undoTimeoutRef.current = setTimeout(async () => {
      await supabase.from('habits').update({ is_active: false }).eq('id', habit.id)
      setUndoVisible(false)
      router.refresh()
    }, 5000)
  }

  const undoDelete = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
      undoTimeoutRef.current = null
    }
    setUndoVisible(false)
    setUndoHabitId(null)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
    }
  }, [])

  const getCardIcon = () => {
    if (isNegative) return <Ban className="h-4 w-4 text-red-500" />
    if (isTargetCount) return <Target className="h-4 w-4 text-purple-500" />
    return <Check className="h-4 w-4 text-green-500" />
  }

  const getButtonText = () => {
    if (loading) return '...'
    if (isFuture) return 'Locked'
    if (completed) return isNegative ? '✓ Resisted!' : '✓ Completed!'
    return isNegative ? 'Mark Resisted' : 'Mark Done'
  }

  const getButtonStyle = () => {
    if (isFuture) return 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
    return completed
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Play className="h-3.5 w-3.5 text-red-500" />
      case 'instagram': return <Camera className="h-3.5 w-3.5 text-pink-500" />
      default: return <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
    }
  }

  const links: HabitLink[] = habit.links || []

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 sm:p-5 hover:shadow-md transition-shadow ${isPast ? 'border-amber-200 dark:border-amber-800' : 'border-gray-200 dark:border-gray-700'}`}>
      {/* Past date indicator */}
      {isPast && (
        <div className="flex items-center gap-1.5 mb-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>Viewing past date — edits affect this day only</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl shrink-0" style={{ backgroundColor: habit.color + '20' }}>
            {getCardIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{habit.name}</h3>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">{habit.category}</span>
              {isNegative && <span className="text-[10px] sm:text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">Break habit</span>}
              {isTargetCount && <span className="text-[10px] sm:text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">Target: {target} {habit.target_unit}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <Link href={`/habits/${habit.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Link>
          <button onClick={() => setShowDeleteConfirm(true)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
        </div>
      </div>

      {habit.description && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{habit.description}</p>}

      {/* Links */}
      {links.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {getLinkIcon(link.type)}
              <span className="truncate max-w-[100px]">{link.label || link.type}</span>
            </a>
          ))}
        </div>
      )}

      {/* Target Count UI */}
      {isTargetCount ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className={`text-xs sm:text-sm font-bold ${count >= target ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {count}/{target} {habit.target_unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${count >= target ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {count >= target && (
              <div className="flex items-center gap-1 mt-1 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium">
                <Check className="h-3 w-3" /> Target reached! <PartyPopper className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={decrement} disabled={loading || count <= 0 || isFuture}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0">
              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <div className="flex-1 text-center min-w-0">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
              <span className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">/ {target}</span>
            </div>
            <button onClick={increment} disabled={loading || isFuture}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-50 shrink-0">
              {loading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
            <button onClick={() => setShowCustomInput(!showCustomInput)}
              className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-purple-400 hover:text-purple-500 dark:hover:border-purple-500 dark:hover:text-purple-400 transition-colors shrink-0"
              title="Log custom value">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          {showCustomInput && (
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
              <input type="number" min="0" value={customValue} onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                placeholder={`Enter ${habit.target_unit || 'value'}...`}
                className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus />
              <button onClick={handleCustomSubmit}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0">
                Log
              </button>
            </div>
          )}

          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {[1, 2, 5].filter(n => n <= target).map(n => (
              <button key={n} onClick={() => logCount(count + n)} disabled={loading || isFuture}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors disabled:opacity-50">
                +{n} {habit.target_unit}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Standard / Negative habit UI */
        <>
          {showNote && (
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note (optional)..."
              className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          )}
          <div className="flex gap-2">
            <button onClick={toggleCheckIn} disabled={loading || isFuture}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base ${getButtonStyle()}`}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {getButtonText()}
            </button>
            {!isFuture && (
              <button onClick={() => setShowNote(!showNote)}
                className="px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                title="Add note">
                <StickyNote className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">Delete Habit?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              "{habit.name}" will be permanently deleted. You can undo this within 5 seconds.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={deleteHabit} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo toast */}
      {undoVisible && undoHabitId === habit.id && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[110] bg-gray-900 dark:bg-gray-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md mx-auto md:mx-0 animate-[slideUp_0.3s_ease-out]">
          <Trash2 className="h-4 w-4 text-red-400 shrink-0" />
          <span className="text-sm flex-1">Habit deleted</span>
          <button onClick={undoDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </button>
        </div>
      )}
    </div>
  )
}
