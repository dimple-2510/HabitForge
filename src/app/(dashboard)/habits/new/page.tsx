'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check, Ban, Target, Play, Camera, Link as LinkIcon, X } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Finance', 'General']
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
const HABIT_TYPES = [
  { value: 'positive', label: 'Positive', desc: 'Build a new good habit', icon: <Check className="h-4 w-4 text-green-500" /> },
  { value: 'negative', label: 'Negative', desc: 'Break an existing bad habit', icon: <Ban className="h-4 w-4 text-red-500" /> },
  { value: 'target_count', label: 'Target Count', desc: 'Track a number (e.g., 8 glasses of water)', icon: <Target className="h-4 w-4 text-purple-500" /> },
]
const UNIT_SUGGESTIONS: Record<string, string[]> = {
  Health: ['glasses', 'servings', 'pills', 'steps'],
  Fitness: ['mins', 'reps', 'sets', 'km', 'calories'],
  Learning: ['mins', 'pages', 'chapters', 'hours'],
  Productivity: ['mins', 'tasks', 'hours', 'pomodoros'],
  Mindfulness: ['mins', 'breaths', 'sessions'],
  General: ['times', 'items', 'mins'],
}
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

export default function NewHabitPage() {
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
  const router = useRouter()
  const supabase = createClient()

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form submitted', { name, habitType, targetValue, targetUnit })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('habits').insert({
      user_id: user.id,
      name,
      description,
      category,
      color,
      frequency,
      habit_type: habitType,
      target_value: habitType === 'target_count' ? parseInt(targetValue) || null : null,
      target_unit: habitType === 'target_count' ? targetUnit || null : null,
      days_of_week: frequency === 'custom' && selectedDays.length > 0 ? selectedDays : null,
      links: links.length > 0 ? links : [],
    })
    if (error) console.error('Habit creation error:', error)
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

  const selectedType = HABIT_TYPES.find(t => t.value === habitType)

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Habit</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Define a new habit to track</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Habit Type *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {HABIT_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setHabitType(t.value)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                    habitType === t.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                  <span className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">{t.icon}{t.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name & Description */}
          <div className="space-y-4">
            <div>
              <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Habit Name *</label>
              <input id="habit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g., Morning Exercise" />
            </div>
            <div>
              <label htmlFor="habit-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea id="habit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Why is this habit important to you?" />
            </div>
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="habit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select id="habit-category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
              <div className="flex gap-2 pt-1">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>

          {/* Target Count */}
          {habitType === 'target_count' && (
            <div className="p-4 sm:p-5 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300">Target Count Settings</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="habit-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Daily Target *</label>
                  <input id="habit-target" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} min="1" required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g., 8" />
                </div>
                <div>
                  <label htmlFor="habit-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit *</label>
                  <input id="habit-unit" type="text" value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)} required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g., glasses" />
                </div>
              </div>
              {/* Unit suggestions */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Suggestions for {category}:</p>
                <div className="flex gap-2 flex-wrap">
                  {(UNIT_SUGGESTIONS[category] || UNIT_SUGGESTIONS['General']).map(unit => (
                    <button key={unit} type="button" onClick={() => setTargetUnit(unit)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${targetUnit === unit ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400'}`}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              {/* Live preview */}
              {targetValue && targetUnit && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">0/{targetValue} {targetUnit}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Frequency */}
          <div>
            <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frequency</label>
            <select id="habit-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom (pick days)</option>
            </select>
          </div>

          {/* Custom Days */}
          {frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Days *</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(d => (
                  <button key={d.value} type="button" onClick={() => toggleDay(d.value)}
                    className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      selectedDays.includes(d.value)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
              {selectedDays.length === 0 && <p className="text-xs text-gray-400 mt-2">Select at least one day</p>}
            </div>
          )}

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Links (optional)</label>
            <p className="text-xs text-gray-400 mb-2">Add YouTube videos, Instagram posts, or any URLs related to this habit</p>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5">
            {loading ? 'Creating...' : 'Create Habit'}
          </button>
        </form>
      </div>
    </div>
  )
}
