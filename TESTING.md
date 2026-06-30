# HabitForge — Manual Testing Checklist

## 1. Landing Page
- [ ] Page loads at `/`
- [ ] Hero section visible with "Build Better Habits" heading
- [ ] Features section shows 6 feature cards
- [ ] "Get Started" button links to `/signup`
- [ ] "Sign Up" and "Log In" buttons in navbar
- [ ] Dark mode toggle works
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1280px)

## 2. Authentication

### Signup
- [ ] Navigate to `/signup`
- [ ] Fill name, email, password → submit
- [ ] Validation: empty fields show errors
- [ ] Validation: weak password shows error
- [ ] Success: redirects to `/dashboard`
- [ ] "Already have an account? Sign in" link works

### Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials → redirects to `/dashboard`
- [ ] Invalid credentials → shows error message
- [ ] "Create one" link goes to `/signup`

### Google OAuth
- [ ] Google sign-in button visible
- [ ] Clicking opens Google OAuth popup
- [ ] After auth, redirects to `/dashboard`

### Logout
- [ ] Logout button in navbar
- [ ] After logout, redirects to `/`
- [ ] Cannot access `/dashboard` after logout (redirects to login)

## 3. Dashboard

### Empty State
- [ ] No habits → shows "No habits yet. Start building!"
- [ ] "Create your first habit" link works

### With Habits
- [ ] Habits displayed as cards in grid
- [ ] Each card shows: name, category badge, type badge, description
- [ ] "New Habit" button visible
- [ ] Cards responsive (1 col mobile, 2 col tablet, 3 col desktop)

## 4. Create Habit (`/habits/new`)
- [ ] All fields render: name, description, category, type, frequency, color
- [ ] Habit type "Target Count" → shows Target + Unit fields
- [ ] Habit type "Positive/Negative" → hides Target + Unit fields
- [ ] Frequency "Custom" → shows day-of-week selector (Sun–Sat)
- [ ] Frequency "Daily/Weekly" → hides day selector
- [ ] Color picker shows 8 color options
- [ ] Category dropdown has 8 categories
- [ ] Submit with empty name → validation error
- [ ] Submit valid → creates habit, redirects to dashboard
- [ ] "Back to Dashboard" link works

## 5. Habit Types

### Positive Habit
- [ ] Shows "✓" icon
- [ ] Button says "Mark Done"
- [ ] After check-in → "✓ Completed!" with green style
- [ ] Can uncheck (toggle back)

### Negative Habit
- [ ] Shows "🚫" icon
- [ ] Shows "Break habit" badge
- [ ] Button says "Mark Resisted"
- [ ] After check-in → "✓ Resisted!" with green style

### Target Count Habit
- [ ] Shows "🎯" icon
- [ ] Shows "Target: X unit" badge
- [ ] Button shows "0/X unit" initially
- [ ] Each click increments count: "1/X", "2/X", etc.
- [ ] At target → green "Completed" style
- [ ] No note button (notes not applicable)

## 6. Edit Habit (`/habits/[id]/edit`)
- [ ] Form pre-filled with existing habit data
- [ ] All fields editable
- [ ] Save changes → updates habit, redirects to dashboard
- [ ] Cancel/back link works

## 7. Delete Habit
- [ ] Delete button on habit card
- [ ] Confirmation dialog appears
- [ ] Confirm → habit removed from dashboard
- [ ] Cancel → habit stays

## 8. Check-in Notes
- [ ] "📝" note button on habit card (not target_count)
- [ ] Click → shows textarea
- [ ] Enter note → submit check-in → note saved
- [ ] Note persists (visible in logs)

## 9. Analytics (`/analytics`)
- [ ] Stats cards: Total Habits, Today's Progress, Total Completions, Completion Rate
- [ ] Weekly bar chart shows last 7 days
- [ ] Category pie chart shows habit distribution
- [ ] "No habits" state shows empty message
- [ ] "Back to Dashboard" link works

## 10. Badges (`/badges`)
- [ ] Shows all 6 badges
- [ ] Earned badges: golden style, "✓ Earned" label
- [ ] Locked badges: grayed out, lock icon
- [ ] "Back to Dashboard" link works

## 11. Routines/Groups (`/groups`)
- [ ] Empty state: "No routines yet"
- [ ] "New Routine" button opens create form
- [ ] Create form: name, description, color, habit selector
- [ ] Create → routine appears in list
- [ ] Routine shows habits with checkboxes
- [ ] Delete routine → confirmation → removed
- [ ] "Back to Dashboard" link works

## 12. Navigation
- [ ] Navbar visible on all dashboard pages
- [ ] Links: Dashboard, Analytics, Badges, Routines
- [ ] Logout button works
- [ ] Mobile: hamburger menu works

## 13. Dark Mode
- [ ] Toggle in navbar
- [ ] Persists across pages
- [ ] All components styled correctly in dark mode

## 14. Responsive Design
- [ ] Mobile (375px): all pages usable
- [ ] Tablet (768px): grid layouts adjust
- [ ] Desktop (1280px): full layout
- [ ] No horizontal scroll on any viewport

## 15. Error Handling
- [ ] 404 page for unknown routes
- [ ] Form validation errors display correctly
- [ ] Supabase errors show user-friendly messages
- [ ] Network errors handled gracefully
