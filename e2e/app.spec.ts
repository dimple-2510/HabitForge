import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/HabitForge/)
  })

  test('displays hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Build Better Habits')).toBeVisible()
  })

  test('has navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Get Started Free')).toBeVisible()
    // Navbar Sign In link
    await expect(page.getByRole('navigation').getByText('Sign In')).toBeVisible()
  })

  test('navigates to signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Get Started Free').click()
    await expect(page).toHaveURL(/signup/)
  })

  test('navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation').getByText('Sign In').click()
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Login Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })

  test('has email and password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('has submit button', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('has link to signup', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('main').getByRole('link', { name: 'Sign up' })).toBeVisible()
  })
})

test.describe('Signup Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  })

  test('has name, email, and password fields', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByPlaceholder('John Doe')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('Min 6 characters')).toBeVisible()
  })

  test('has submit button', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('has link to login', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('main').getByRole('link', { name: 'Sign in' })).toBeVisible()
  })
})

test.describe('Dashboard (unauthenticated)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Responsive Design', () => {
  test('landing page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByText('Build Better Habits')).toBeVisible()
  })

  test('login page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  })
})
