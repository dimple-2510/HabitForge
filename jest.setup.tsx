import '@testing-library/jest-dom'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useParams() {
    return {}
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  return MockLink
})

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const MockIcon = ({ className }: { className?: string }) =>
    '<span data-testid="mock-icon" className={className} />'
  return {
    __esModule: true,
    ArrowLeft: MockIcon,
    PlusCircle: MockIcon,
    Trash2: MockIcon,
    Edit3: MockIcon,
    GripVertical: MockIcon,
    Award: MockIcon,
    Lock: MockIcon,
    Flame: MockIcon,
    Target: MockIcon,
    TrendingUp: MockIcon,
    Menu: MockIcon,
    X: MockIcon,
    Sun: MockIcon,
    Moon: MockIcon,
    Chrome: MockIcon,
    Mail: MockIcon,
    LockIcon: MockIcon,
    User: MockIcon,
    Eye: MockIcon,
    EyeOff: MockIcon,
  }
})

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
      signUp: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithOAuth: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
}))
