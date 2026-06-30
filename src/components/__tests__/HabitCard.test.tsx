import { render, screen } from '@testing-library/react'
import HabitCard from '@/components/HabitCard'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const MockIcon = ({ className }: { className?: string }) => <span data-testid="mock-icon" className={className} />
  return {
    Trash2: MockIcon,
    Edit3: MockIcon,
    Plus: MockIcon,
    Minus: MockIcon,
    Check: MockIcon,
  }
})

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    insert: jest.fn().mockResolvedValue({ error: null }),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  }),
}))

const baseHabit = {
  id: 'habit-1',
  name: 'Morning Exercise',
  description: '30 min workout',
  category: 'Fitness',
  color: '#3B82F6',
  icon: '✓',
  habit_type: 'positive',
  target_value: null,
  target_unit: null,
}

describe('HabitCard', () => {
  it('renders habit name and category', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    expect(screen.getByText('Morning Exercise')).toBeInTheDocument()
    expect(screen.getByText('Fitness')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    expect(screen.getByText('30 min workout')).toBeInTheDocument()
  })

  it('shows "Mark Done" button for incomplete positive habit', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    expect(screen.getByText('Mark Done')).toBeInTheDocument()
  })

  it('shows "Completed!" button for completed positive habit', () => {
    render(<HabitCard habit={baseHabit} isCompleted={true} />)
    expect(screen.getByText('✓ Completed!')).toBeInTheDocument()
  })

  it('shows "Mark Resisted" for negative habit', () => {
    const negativeHabit = { ...baseHabit, habit_type: 'negative' }
    render(<HabitCard habit={negativeHabit} isCompleted={false} />)
    expect(screen.getByText('Mark Resisted')).toBeInTheDocument()
  })

  it('shows "Resisted!" for completed negative habit', () => {
    const negativeHabit = { ...baseHabit, habit_type: 'negative' }
    render(<HabitCard habit={negativeHabit} isCompleted={true} />)
    expect(screen.getByText('✓ Resisted!')).toBeInTheDocument()
  })

  it('shows target count for target_count habit type', () => {
    const targetHabit = {
      ...baseHabit,
      habit_type: 'target_count',
      target_value: 8,
      target_unit: 'glasses',
    }
    render(<HabitCard habit={targetHabit} isCompleted={false} />)
    expect(screen.getByText('Target: 8 glasses')).toBeInTheDocument()
  })

  it('shows count/target for target_count habit', () => {
    const targetHabit = {
      ...baseHabit,
      habit_type: 'target_count',
      target_value: 8,
      target_unit: 'glasses',
    }
    render(<HabitCard habit={targetHabit} isCompleted={false} todayCount={3} />)
    expect(screen.getByText('3/8 glasses')).toBeInTheDocument()
  })

  it('shows edit link and delete button', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    const links = screen.getAllByRole('link')
    const buttons = screen.getAllByRole('button')
    expect(links.length).toBeGreaterThan(0)
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows note button for non-target habits', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    expect(screen.getByTitle('Add note')).toBeInTheDocument()
  })

  it('does not show note button for target_count habits', () => {
    const targetHabit = {
      ...baseHabit,
      habit_type: 'target_count',
      target_value: 8,
      target_unit: 'glasses',
    }
    render(<HabitCard habit={targetHabit} isCompleted={false} />)
    expect(screen.queryByTitle('Add note')).not.toBeInTheDocument()
  })

  it('applies correct color to icon container', () => {
    render(<HabitCard habit={baseHabit} isCompleted={false} />)
    const iconContainer = screen.getByText('✓').parentElement
    expect(iconContainer).toHaveStyle({ backgroundColor: expect.stringContaining('59') })
  })
})
