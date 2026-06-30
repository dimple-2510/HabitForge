'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Ban, Target, Play, Camera, Link as LinkIcon, X } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Finance', 'General']
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
const HABIT_TYPES = [
  { value: 'positive', label: 'Positive (build a habit)' },
  { value: 'negative', label: 'Negative (break a habit)' },
  { value: 'target_count', label: 'Target Count (track a number)' },
]
const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' }, { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' }, { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' }, { value: 6, label: 'Sat' },
]

interface HabitLink { url: string; type: 'youtube' | 'instagram' | 'generic'; label: string }

function detectLinkType(url: string): 'youtube' | 'instagram' | 'generic' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('instagram.com')) return 'instagram'
  return 'generic'
}

export default function EditHabitPage() {
  const params = useParams()
  const id = params.id as string
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [color, setColor] = useState('#3B82F6')
  const [frequency, setFrequency] = useState('daily')
  const [habitType, setHabitType] = useState('positive')
  const [targetValue, setTargetValue] = useState('')
  const [targetUnit, setTargetUnit] = useState('')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [links, setLinks] = useState<HabitLink[]>([])
  const [linkUrl, setLinkUrl] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  useEffect(() => {
    const fetchHabit = async () => {
      const { data } = await supabase.from('habits').select('*').eq('id', id).single()
      if (data) {
        setName(data.name)
        setDescription(data.description || '')
        setCategory(data.category)
        setColor(data.color)
        setFrequency(data.frequency)
        setHabitType(data.habit_type || 'positive')
        setTargetValue(data.target_value?.toString() || '')
        setTargetUnit(data.target_unit || '')
        setSelectedDays(data.days_of_week || [])
        setLinks(data.links || [])
      }
      setFetching(false)
    }
    fetchHabit()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('habits').update({
      name, description, category, color, frequency,
      habit_type: habitType,
      target_value: habitType === 'target_count' ? parseInt(targetValue) || null : null,
      target_unit: habitType === 'target_count' ? targetUnit || null : null,
      days_of_week: frequency === 'custom' && selectedDays.length > 0 ? selectedDays : null,
      links: links.length > 0 ? links : [],
    }).eq('id', id)
    if (error) alert(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  const addLink = () => {
    if (!linkUrl.trim()) return
    const url = linkUrl.trim().startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
    setLinks([...links, { url, type: detectLinkType(url), label: linkLabel.trim() || '' }])
    setLinkUrl('')
    setLinkLabel('')
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  if (fetching) return <div className="text-center py-16 text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-1">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 sm:mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Edit Habit</h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Habit Name *</label>
            <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="edit-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Habit Type</label>
              <select id="edit-type" value={habitType} onChange={(e) => setHabitType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                {HABIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          {habitType === 'target_count' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
              <div>
                <label htmlFor="edit-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target *</label>
                <input id="edit-target" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g., 8" />
              </div>
              <div>
                <label htmlFor="edit-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit *</label>
                <input id="edit-unit" type="text" value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g., glasses" />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="edit-freq" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frequency</label>
            <select id="edit-freq" value={frequency} onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom (pick days)</option>
            </select>
          </div>
          {frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Days</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(d => (
                  <button key={d.value} type="button" onClick={() => toggleDay(d.value)}
                    className={`h-11 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedDays.includes(d.value)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Links (optional)</label>
            {links.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs">
                    <span>{link.type === 'youtube' ? <Play className="h-3.5 w-3.5 text-red-500" /> : link.type === 'instagram' ? <Camera className="h-3.5 w-3.5 text-pink-500" /> : <LinkIcon className="h-3.5 w-3.5 text-gray-400" />}</span>
                    <span className="truncate flex-1 text-gray-600 dark:text-gray-300">{link.label || link.url}</span>
                    <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-600 shrink-0"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" value={linkLabel} onChange={e => setLinkLabel(e.target.value)}
                placeholder="Label (optional)"
                className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="button" onClick={addLink}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0">
                + Add
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-600/20">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
