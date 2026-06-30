'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogOut, LayoutDashboard, PlusCircle, Moon, Sun, BarChart3, Award, ListChecks, Menu, X, Calendar, Repeat, MoreHorizontal, ChevronDown, Settings } from 'lucide-react'

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('habitforge-dark')
  if (saved !== null) return saved === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const supabase = createClient()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const isDark = getInitialDark()
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const toggleDark = () => {
    const newDark = !dark
    setDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('habitforge-dark', String(newDark))
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  // Close menus on navigation
  const closeAll = () => { setMobileOpen(false); setMoreOpen(false) }

  return (
    <>
      {/* ── Top Nav Bar (desktop + mobile) ── */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
          <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            HabitForge
          </Link>

          {/* Desktop nav — full links */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                <Link href="/dashboard" className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/groups" className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/groups') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <ListChecks className="h-4 w-4" /> Routines
                </Link>
                <Link href="/calendar" className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/calendar') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Calendar className="h-4 w-4" /> Calendar
                </Link>
                <Link href="/analytics" className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/analytics') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <BarChart3 className="h-4 w-4" /> Analytics
                </Link>

                {/* More dropdown on desktop */}
                <div className="relative">
                  <button onClick={() => setMoreOpen(!moreOpen)}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive('/events') || isActive('/badges') || isActive('/habits/new') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <MoreHorizontal className="h-4 w-4" /> More <ChevronDown className="h-3 w-3" />
                  </button>
                  {moreOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                        <Link href="/events" onClick={() => setMoreOpen(false)} className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive('/events') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <Repeat className="h-4 w-4" /> Events
                        </Link>
                        <Link href="/badges" onClick={() => setMoreOpen(false)} className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive('/badges') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <Award className="h-4 w-4" /> Badges
                        </Link>
                        <Link href="/habits/new" onClick={() => setMoreOpen(false)} className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive('/habits/new') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <PlusCircle className="h-4 w-4" /> New Habit
                        </Link>
                        <Link href="/settings" onClick={() => setMoreOpen(false)} className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive('/settings') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <Settings className="h-4 w-4" /> Settings
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors">Sign In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile: dark toggle + hamburger (kept for non-tab pages) */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile hamburger menu — for pages NOT in bottom tabs */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 space-y-1">
            {user ? (
              <>
                <Link href="/events" onClick={closeAll} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/events') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Repeat className="h-4 w-4" /> Events
                </Link>
                <Link href="/badges" onClick={closeAll} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/badges') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Award className="h-4 w-4" /> Badges
                </Link>
                <Link href="/habits/new" onClick={closeAll} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/habits/new') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <PlusCircle className="h-4 w-4" /> New Habit
                </Link>
                <Link href="/settings" onClick={closeAll} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/settings') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeAll} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Sign In</Link>
                <Link href="/signup" onClick={closeAll} className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white text-center">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ── Mobile Bottom Tab Bar ── */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
          <div className="flex items-center justify-around h-16 px-2">
            <Link href="/dashboard" className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${isActive('/dashboard') && !isActive('/habits/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/groups" className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${isActive('/groups') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <ListChecks className="h-5 w-5" />
              <span className="text-[10px] font-medium">Routines</span>
            </Link>
            <Link href="/habits/new" className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${isActive('/habits/new') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-3 shadow-lg">
                <PlusCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">Add</span>
            </Link>
            <Link href="/calendar" className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${isActive('/calendar') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Calendar className="h-5 w-5" />
              <span className="text-[10px] font-medium">Calendar</span>
            </Link>
            <Link href="/analytics" className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${isActive('/analytics') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <BarChart3 className="h-5 w-5" />
              <span className="text-[10px] font-medium">Analytics</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
