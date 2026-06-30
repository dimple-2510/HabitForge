# Major Project Synopsis

**Course:** Master of Computer Applications (MCA) — 4th Semester
**Subject Code:** 23ONMCR-753
**Project Title:** HabitForge — A Full-Stack Habit Tracking Web Application

---

## 1. Title of the Project

**HabitForge** — A Full-Stack Habit Tracking Web Application

---

## 2. Objectives

1. To develop a full-stack web application that helps users build and maintain positive habits through daily tracking, streak monitoring, and data-driven insights.
2. To implement a responsive, user-friendly interface with authentication, real-time data updates, and interactive analytics dashboards.
3. To apply Software Development Life Cycle (SDLC) methodologies — from requirement analysis through design, implementation, testing, and deployment.
4. To demonstrate proficiency in modern web development technologies including Next.js, Supabase (PostgreSQL), and Tailwind CSS.
5. To incorporate gamification elements (badges, streak milestones) that improve user engagement and retention.
6. To support diverse habit types including positive habits to build, negative habits to break, target-count habits, and scheduled routines.

---

## 3. Scope of the Project

**Included:**
- User authentication (email/password + Google OAuth)
- Habit management (CRUD operations — create, read, update, delete habits)
- **Multiple habit types:**
  - ✅ **Positive habits** — habits to build (e.g., "Drink 8 glasses of water")
  - 🚫 **Negative habits** — habits to break (e.g., "No smoking", "No junk food") — tracks days without the habit
  - 🎯 **Target count habits** — track progress toward a daily number (e.g., "Read 20 pages", "Drink 8 glasses")
  - 📋 **Habit groups/routines** — bundle multiple habits into a routine (e.g., "Morning Routine" = meditate + journal + exercise)
- **Flexible scheduling:**
  - Daily, Weekly, Custom frequency
  - Specific days of week (e.g., Mon/Wed/Fri only)
- Daily check-in system with calendar heatmap visualization
- **Notes per check-in** — add a quick journal entry when checking off a habit
- Streak tracking (current streak, longest streak, total completions)
- Analytics dashboard with charts (weekly/monthly completion rates, category breakdown)
- Gamification — badges for milestone streaks (7-day, 30-day, 100-day) and total completions
- Responsive design (mobile, tablet, desktop)
- Dark/light mode toggle

**Habit Categories:** Health, Fitness, Learning, Productivity, Mindfulness, Social, Finance, General

**Example Habits Users Can Track:**

| Category | Positive Habit | Negative Habit | Target Count |
|----------|---------------|----------------|--------------|
| Health | Take vitamins | No sugar day | Drink 8 glasses |
| Fitness | Morning run | No junk food | 100 pushups |
| Learning | Practice coding | No social media before noon | Read 20 pages |
| Productivity | Inbox zero | No phone during meals | Complete 5 tasks |
| Mindfulness | Meditate 10 min | No negative self-talk | Write 3 gratitudes |
| Finance | Log expenses | No impulse purchases | Save ₹100 |

**Excluded (out of scope):**
- Native mobile app (iOS/Android)
- Social features (friend groups, shared challenges)
- Push notifications (browser notifications only if time permits)
- Multi-language support

---

## 4. Hardware Requirements

| Component | Minimum Specification |
|-----------|-----------------------|
| Processor | Intel Core i3 or equivalent (Pentium IV+) |
| RAM | 4 GB |
| Storage | 50 GB available disk space |
| Display | 1366x768 resolution |
| Internet | Broadband connection for cloud services |

---

## 5. Software Requirements

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | Next.js 14 (React 18) |
| **Styling** | Tailwind CSS 3.x |
| **Backend / BaaS** | Supabase (PostgreSQL 15) |
| **Authentication** | Supabase Auth (Email + Google OAuth) |
| **Database** | PostgreSQL (via Supabase) |
| **Charts / Analytics** | Recharts |
| **Icons** | Lucide React |
| **State Management** | React Context API + Supabase Realtime |
| **Hosting / Deployment** | Vercel |
| **Version Control** | Git + GitHub |
| **IDE** | Visual Studio Code |
| **OS** | Windows 10 / macOS / Linux |
| **Browser** | Chrome, Firefox, Edge (latest) |

---

## 6. SDLC Methodology

**Agile (Iterative) Model** — The project will be developed in iterative sprints:

- **Sprint 1:** Project setup, Supabase configuration, database schema design
- **Sprint 2:** Authentication system (signup, login, protected routes)
- **Sprint 3:** Habit CRUD operations and UI (all habit types)
- **Sprint 4:** Daily check-in system, notes, and streak tracking logic
- **Sprint 5:** Analytics dashboard with charts
- **Sprint 6:** Gamification (badges, achievements)
- **Sprint 7:** UI polish, responsive design, dark mode
- **Sprint 8:** Testing, bug fixes, deployment

---

## 7. Database Schema (Key Tables)

**users** (managed by Supabase Auth)
- id (UUID, PK) | email | created_at

**habits**
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (VARCHAR)
- description (TEXT)
- **habit_type** (ENUM: positive, negative, target_count) — type of habit
- **target_value** (INTEGER, nullable) — e.g., 8 for "drink 8 glasses"
- **target_unit** (VARCHAR, nullable) — e.g., "glasses", "pages", "minutes"
- frequency (ENUM: daily, weekly, custom)
- **days_of_week** (INTEGER[], nullable) — [0,2,4] for Mon/Wed/Fri (0=Sunday)
- category (VARCHAR)
- icon (VARCHAR)
- color (VARCHAR)
- created_at (TIMESTAMP)
- is_active (BOOLEAN)

**habit_groups** (for routines)
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (VARCHAR) — e.g., "Morning Routine"
- description (TEXT)
- icon (VARCHAR)
- color (VARCHAR)
- created_at (TIMESTAMP)

**habit_group_items** (links habits to groups)
- id (UUID, PK)
- group_id (UUID, FK → habit_groups.id)
- habit_id (UUID, FK → habits.id)
- sort_order (INTEGER)

**habit_logs**
- id (UUID, PK)
- habit_id (UUID, FK → habits.id)
- user_id (UUID, FK → users.id)
- completed_date (DATE)
- **count_value** (INTEGER, nullable) — for target_count habits (e.g., 5 of 8 glasses)
- **note** (TEXT, nullable) — journal entry for the check-in
- created_at (TIMESTAMP)

**badges**
- id (UUID, PK) | name (VARCHAR) | description (TEXT) | icon (VARCHAR)
- requirement_type (ENUM: streak, total_completions)
- requirement_value (INTEGER)

**user_badges**
- id (UUID, PK) | user_id (FK) | badge_id (FK) | earned_at (TIMESTAMP)

---

## 8. Expected Outcomes

1. A fully functional, deployed habit tracking web application accessible via URL
2. User authentication with secure session management
3. Support for 4 habit types: positive, negative, target-count, and grouped routines
4. Flexible scheduling with specific days of week
5. Daily check-in with optional journal notes
6. Interactive dashboard showing completion analytics and streak data
7. Gamification system that rewards consistency with badges
8. Complete project documentation (SRS, design docs, test cases, user manual)
9. Source code with proper structure, comments, and README

---

## 9. Evaluation Readiness

| Deliverable | Status |
|-------------|--------|
| Synopsis | ✅ Ready for PEP 1 |
| SRS Document | ⏳ Sprint 1-2 |
| Design Documents (UML, ERD, DFD) | ⏳ Sprint 2-3 |
| Source Code | ⏳ Sprint 3-7 |
| Test Cases & Results | ⏳ Sprint 8 |
| Project Report (~60 pages) | ⏳ Post-development |
| Presentation PPT | ⏳ Pre-viva |
| Deployed Application | ⏳ Sprint 8 |

---

*Prepared for submission to Centre for Distance & Online Education, Chandigarh University.*
