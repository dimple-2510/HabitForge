'use client'
import { useEffect, useState, useCallback } from 'react'
import { Award, Lock, Trophy, Star, Zap, Crown, Shield, RefreshCw, Check } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Badge {
  id: string
  name: string
  description: string
  requirement_type: string
  requirement_value: number
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'First Step': <Star className="h-7 w-7 sm:h-8 sm:w-8" />,
  'Week Warrior': <Zap className="h-7 w-7 sm:h-8 sm:w-8" />,
  'Monthly Master': <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />,
  'Century Club': <Award className="h-7 w-7 sm:h-8 sm:w-8" />,
  'Habit Builder': <Shield className="h-7 w-7 sm:h-8 sm:w-8" />,
  'Dedicated': <Crown className="h-7 w-7 sm:h-8 sm:w-8" />,
}

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const fetchBadges = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const [badgesRes, earnedRes] = await Promise.all([
      supabase.from('badges').select('*').order('requirement_value'),
      supabase.from('user_badges').select('badge_id').eq('user_id', user.id),
    ])

    if (badgesRes.data) setAllBadges(badgesRes.data)
    if (earnedRes.data) setEarnedIds(new Set(earnedRes.data.map((e: any) => e.badge_id)))
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchBadges() }, [fetchBadges])

  // Auto-refresh every 10 seconds to catch newly earned badges
  useEffect(() => {
    const interval = setInterval(fetchBadges, 10000)
    return () => clearInterval(interval)
  }, [fetchBadges])

  const manualRefresh = async () => {
    setRefreshing(true)
    await fetchBadges()
    setRefreshing(false)
  }

  const earnedCount = earnedIds.size
  const totalCount = allBadges.length

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Badges & Achievements</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Earn badges by maintaining streaks and completing habits</p>
        </div>
        <button onClick={manualRefresh} disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title="Refresh badges">
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {totalCount > 0 && (
        <div className="mt-4 flex items-center gap-3 mb-6">
          <div className="flex-1 max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${(earnedCount / totalCount) * 100}%` }} />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{earnedCount}/{totalCount} earned</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {allBadges.map(badge => {
          const earned = earnedIds.has(badge.id)
          return (
            <div key={badge.id} className={`relative rounded-xl border p-4 sm:p-6 text-center transition-all duration-200 hover:-translate-y-1 ${
              earned
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-md shadow-yellow-100 dark:shadow-yellow-900/20'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}>
              {earned && (
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                earned ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {earned ? (BADGE_ICONS[badge.name] || <Award className="h-7 w-7 sm:h-8 sm:w-8" />) : <Lock className="h-7 w-7 sm:h-8 sm:w-8" />}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{badge.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
              {earned && (
                <span className="inline-block mt-2 sm:mt-3 text-xs font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 justify-center">
                  <Check className="h-3 w-3" /> Earned
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
