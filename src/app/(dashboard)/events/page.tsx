'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Edit3, Trash2, Clock, Calendar, Pin, Repeat } from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  name: string
  type: string
  color: string
  cycle_length_days: number | null
  last_start_date: string | null
  duration_days: number
  notes: string | null
}

const EVENT_COLORS = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

const PRESET_TEMPLATES = [
  { name: 'Menstrual Cycle', cycle_length_days: 28, duration_days: 5, color: '#EC4899' },
  { name: 'Ovulation', cycle_length_days: 28, duration_days: 2, color: '#F59E0B' },
  { name: 'Medication', cycle_length_days: 1, duration_days: 1, color: '#3B82F6' },
  { name: 'Therapy Session', cycle_length_days: 7, duration_days: 1, color: '#8B5CF6' },
  { name: 'Custom', cycle_length_days: 7, duration_days: 1, color: '#10B981' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', type: 'custom', color: '#EC4899', cycle_length_days: 7, last_start_date: '', duration_days: 1, notes: '',
  })
  const supabase = createClient()

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data, error } = await supabase.from('events').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at')
      if (error) console.error('Events fetch error:', error)
      if (data) setEvents(data)
    } catch (e) {
      console.error('Events fetch exception:', e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const resetForm = () => {
    setForm({ name: '', type: 'custom', color: '#EC4899', cycle_length_days: 7, last_start_date: '', duration_days: 1, notes: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setForm({
      ...form,
      name: template.name === 'Custom' ? form.name : template.name,
      type: template.name === 'Custom' ? 'custom' : template.name.toLowerCase().includes('menstrual') ? 'period' : template.name.toLowerCase().includes('ovulation') ? 'ovulation' : 'custom',
      cycle_length_days: template.cycle_length_days,
      duration_days: template.duration_days,
      color: template.color,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingId) {
      const { error } = await supabase.from('events').update({
        name: form.name, type: 'custom', color: form.color,
        cycle_length_days: form.cycle_length_days,
        last_start_date: form.last_start_date || null,
        duration_days: form.duration_days,
        notes: form.notes || null,
      }).eq('id', editingId).select().single()
      if (error) console.error('Update error:', error)
    } else {
      const { error } = await supabase.from('events').insert({
        user_id: user.id, name: form.name, type: 'custom', color: form.color,
        cycle_length_days: form.cycle_length_days,
        last_start_date: form.last_start_date || null,
        duration_days: form.duration_days,
        notes: form.notes || null,
      })
      if (error) console.error('Insert error:', error)
    }
    resetForm()
    fetchEvents()
  }

  const startEdit = (event: Event) => {
    setForm({
      name: event.name, type: event.type || 'custom', color: event.color,
      cycle_length_days: event.cycle_length_days || 7,
      last_start_date: event.last_start_date || '',
      duration_days: event.duration_days,
      notes: event.notes || '',
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const deleteEvent = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id)
      return
    }
    const { error } = await supabase.from('events').update({ is_active: false }).eq('id', id)
    if (error) console.error('Delete error:', error)
    setDeleteConfirmId(null)
    fetchEvents()
  }

  const getNextOccurrence = (event: Event) => {
    if (!event.last_start_date || !event.cycle_length_days) return null
    const last = new Date(event.last_start_date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
    const cyclePos = diffDays % event.cycle_length_days
    const daysUntilNext = cyclePos === 0 ? 0 : event.cycle_length_days - cyclePos
    const nextDate = new Date(today)
    nextDate.setDate(nextDate.getDate() + daysUntilNext)
    return { daysUntil: daysUntilNext, date: nextDate }
  }

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-3">
        {[1, 2].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
      </div>
    </div>
  )

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Recurring Events</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Track any recurring event — cycles, reminders, and more</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm">
            <Plus className="h-4 w-4" /> Add Event
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editingId ? 'Edit Event' : 'New Recurring Event'}</h2>

          {/* Preset Templates */}
          {!editingId && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Start Templates</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEMPLATES.map(t => (
                  <button key={t.name} type="button" onClick={() => applyTemplate(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    style={{ borderColor: form.name === t.name && form.color === t.color ? t.color : undefined }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., My Cycle, Medication, Workout..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Repeats Every (days)</label>
                <input type="number" value={form.cycle_length_days} onChange={e => setForm({ ...form, cycle_length_days: parseInt(e.target.value) || 7 })} min="1" max="365"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label>
                <input type="date" value={form.last_start_date} onChange={e => setForm({ ...form, last_start_date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration (days)</label>
                <input type="number" value={form.duration_days} onChange={e => setForm({ ...form, duration_days: parseInt(e.target.value) || 1 })} min="1" max="30"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
              <div className="flex gap-2 flex-wrap">
                {EVENT_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Optional notes..." />
            </div>

            <div className="flex gap-2">
              <button type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm">
                {editingId ? 'Save Changes' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Repeat className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No recurring events yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Track any recurring event — medication, cycles, workouts, reminders, and more.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm">
            <Plus className="h-4 w-4" /> Create your first event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => {
            const next = getNextOccurrence(event)
            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: event.color + '20' }}>
                      <Pin className="h-5 w-5" style={{ color: event.color }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{event.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {event.cycle_length_days && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Repeat className="h-3 w-3" /> Every {event.cycle_length_days} day{event.cycle_length_days !== 1 ? 's' : ''}
                          </span>
                        )}
                        {event.duration_days > 0 && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {event.duration_days} day{event.duration_days !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(event)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteEvent(event.id)}
                      className={`p-1.5 rounded transition-colors ${deleteConfirmId === event.id ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-600'}`}
                      title={deleteConfirmId === event.id ? 'Click again to confirm' : 'Delete'}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Next occurrence info */}
                {next && event.cycle_length_days && (
                  <div className="mt-3 p-2.5 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: event.color + '15' }}>
                    {next.daysUntil === 0 ? (
                      <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: event.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                        {event.name} may start today
                      </p>
                    ) : (
                      <p className="text-xs flex items-center gap-1.5" style={{ color: event.color }}>
                        <Clock className="h-3.5 w-3.5" />
                        Next in <strong>{next.daysUntil} day{next.daysUntil !== 1 ? 's' : ''}</strong> ({next.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })})
                      </p>
                    )}
                  </div>
                )}

                {event.last_start_date && !event.cycle_length_days && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Date: {new Date(event.last_start_date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
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
