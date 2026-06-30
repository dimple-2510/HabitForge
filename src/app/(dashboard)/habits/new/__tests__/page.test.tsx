import { render, screen, fireEvent } from '@testing-library/react'
import NewHabitPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
}))

describe('NewHabitPage', () => {
  it('renders the form heading', () => {
    render(<NewHabitPage />)
    expect(screen.getByText('Create New Habit')).toBeInTheDocument()
  })

  it('renders the name input', () => {
    render(<NewHabitPage />)
    expect(screen.getByLabelText('Habit Name *')).toBeInTheDocument()
  })

  it('renders the description textarea', () => {
    render(<NewHabitPage />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('renders the category select', () => {
    render(<NewHabitPage />)
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
  })

  it('renders the frequency select', () => {
    render(<NewHabitPage />)
    expect(screen.getByLabelText('Frequency')).toBeInTheDocument()
  })

  it('renders the color picker', () => {
    render(<NewHabitPage />)
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<NewHabitPage />)
    expect(screen.getByRole('button', { name: 'Create Habit' })).toBeInTheDocument()
  })

  it('renders habit type selector buttons', () => {
    render(<NewHabitPage />)
    expect(screen.getByText('Positive')).toBeInTheDocument()
    expect(screen.getByText('Negative')).toBeInTheDocument()
    expect(screen.getByText('Target Count')).toBeInTheDocument()
  })

  it('shows target fields when target_count type is selected', () => {
    render(<NewHabitPage />)
    // Click the Target Count button
    fireEvent.click(screen.getByText('Target Count'))
    expect(screen.getByLabelText('Daily Target *')).toBeInTheDocument()
    expect(screen.getByLabelText('Unit *')).toBeInTheDocument()
  })

  it('hides target fields when positive type is selected', () => {
    render(<NewHabitPage />)
    // First select target count
    fireEvent.click(screen.getByText('Target Count'))
    // Then select positive
    fireEvent.click(screen.getByText('Positive'))
    expect(screen.queryByLabelText('Daily Target *')).not.toBeInTheDocument()
  })

  it('shows day selector when custom frequency is selected', () => {
    render(<NewHabitPage />)
    const freqSelect = screen.getByLabelText('Frequency')
    fireEvent.change(freqSelect, { target: { value: 'custom' } })
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })
})
