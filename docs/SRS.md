# Software Requirements Specification (SRS)

## HabitForge — A Full-Stack Habit Tracking Web Application

**Document Version:** 1.0
**Date:** June 21, 2026
**Prepared by:** Vyanko AI LLP
**Course:** MCA 4th Semester, Subject Code: 23ONMCR-753
**Credits:** 12

---

## Table of Contents

1. [Introduction](#1-introduction)
   1.1 [Purpose](#11-purpose)
   1.2 [Scope](#12-scope)
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   1.4 [References](#14-references)
   1.5 [Overview](#15-overview)
2. [Overall Description](#2-overall-description)
   2.1 [Product Perspective](#21-product-perspective)
   2.2 [Product Functions](#22-product-functions)
   2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
   2.4 [Operating Environment](#24-operating-environment)
   2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   2.6 [Assumptions and Dependencies](#26-assumptions-and-dependencies)
3. [Specific Requirements](#3-specific-requirements)
   3.1 [External Interface Requirements](#31-external-interface-requirements)
   3.2 [Functional Requirements](#32-functional-requirements)
   3.3 [Non-Functional Requirements](#33-non-functional-requirements)
   3.4 [Database Requirements](#34-database-requirements)
4. [System Models](#4-system-models)
   4.1 [Use Case Model](#41-use-case-model)
   4.2 [Data Flow Model](#42-data-flow-model)
   4.3 [Entity Relationship Model](#43-entity-relationship-model)
5. [Appendices](#5-appendices)
   5.1 [Appendix A — Wireframes](#51-appendix-a--wireframes)
   5.2 [Appendix B — Traceability Matrix](#52-appendix-b--traceability-matrix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the **HabitForge** web application. It defines the functional and non-functional requirements, system architecture, data models, and external interfaces for the purpose of:

- Serving as a contractual agreement between the developer and evaluators for MCA Major Project (23ONMCR-753)
- Providing a reference for system design and implementation
- Establishing the basis for validation and verification during testing
- Documenting the complete system for academic evaluation (PEP 3 — Report, 40 marks)

This document follows the **IEEE 830-1998** recommended practice for SRS format.

### 1.2 Scope

**HabitForge** is a full-stack, responsive web application that helps users build positive habits, break negative ones, and track daily progress through gamification and analytics.

The application delivers:

1. **User Authentication** — Secure registration and login via email/password and Google OAuth
2. **Habit Management** — CRUD operations for four habit types:
   - ✅ Positive habits (to build)
   - 🚫 Negative habits (to break)
   - 🎯 Target-count habits (with numeric goals)
   - 📋 Habit groups/routines (bundled habits)
3. **Daily Check-in System** — Mark habits complete with optional journal notes
4. **Streak Tracking** — Current streak, longest streak, total completions per habit
5. **Analytics Dashboard** — Charts, heatmaps, habit strength scores, consistency metrics
6. **Gamification** — 6 milestone badges for streaks and total completions
7. **Responsive Design** — Mobile-first approach with dark/light mode toggle
8. **Real-time Data** — Supabase-powered PostgreSQL with Row-Level Security

The application is deployed on **Vercel** and accessible via public URL. Source code is maintained on **Git + GitHub** with full version history.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| API | Application Programming Interface |
| BaaS | Backend as a Service |
| CNC | Consume and Carry (product type for equity delivery) |
| CRUD | Create, Read, Update, Delete |
| DFD | Data Flow Diagram |
| ERD | Entity Relationship Diagram |
| FK | Foreign Key |
| GUI | Graphical User Interface |
| ISO | International Organization for Standardization |
| LSP | Language Server Protocol |
| MCA | Master of Computer Applications |
| OAuth | Open Authorization |
| OTP | One-Time Password |
| PEP | Project Evaluation Phase (5 phases: PEP 1–5) |
| PK | Primary Key |
| PostgREST | RESTful API for PostgreSQL |
| RLS | Row Level Security |
| SDLC | Software Development Life Cycle |
| SL | Stop Loss |
| SPA | Single Page Application |
| SRS | Software Requirements Specification |
| SSR | Server-Side Rendering |
| UI | User Interface |
| UML | Unified Modeling Language |
| UPI | Unified Payments Interface |
| UUID | Universally Unique Identifier |
| VLE | Virtual Learning Environment |

### 1.4 References

1. IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications
2. Next.js 14 Documentation — https://nextjs.org/docs
3. Supabase Documentation — https://supabase.com/docs
4. Tailwind CSS v4 Documentation — https://tailwindcss.com/docs
5. Recharts Documentation — https://recharts.org/
6. Chandigarh University MCA Project Evaluation Guidelines (23ONMCR-753)
7. Project Work Assignment 1 — Major Project Guidelines Document

### 1.5 Overview

This SRS is organized as follows:
- **Section 2 (Overall Description)** provides a high-level view of the product, its context, user classes, and operating environment
- **Section 3 (Specific Requirements)** details every functional and non-functional requirement with traceability IDs
- **Section 4 (System Models)** presents UML diagrams, data flow diagrams, and entity-relationship models
- **Section 5 (Appendices)** contains wireframes and the requirements traceability matrix

---

## 2. Overall Description

### 2.1 Product Perspective

HabitForge is a **standalone, self-contained web application** built with modern cloud-native architecture. It does not require any existing system and does not interface with third-party habit tracking services.

**System Context:**
- **Frontend:** Next.js 14 (App Router) with React 18, rendered via SSR and client components
- **Backend/BaaS:** Supabase — provides PostgreSQL database, authentication, and auto-generated REST/GraphQL APIs via PostgREST
- **Deployment:** Vercel — serverless deployment with automatic CI/CD from Git repository
- **Data Flow:** Browser ↔ Next.js (SSR/Client) ↔ Supabase Client SDK ↔ Supabase PostgreSQL (with RLS)

**Key Architectural Decisions:**
1. **Supabase over custom backend** — Eliminates need for separate backend server; Supabase provides auth, database, and realtime APIs out of the box
2. **Next.js 14 App Router** — Enables hybrid SSR/CSR rendering; server components for data fetching, client components for interactivity
3. **PostgREST** — Supabase auto-generates REST API from PostgreSQL schema; client SDK wraps PostgREST calls
4. **Row Level Security (RLS)** — Database-level access control ensures users can only access their own data

### 2.2 Product Functions

The following is a detailed summary of the system's major functional areas:

**F1 — Authentication & Authorization**
- F1.1: User registration with email/password
- F1.2: User login with email/password
- F1.3: Google OAuth login/registration
- F1.4: Session management with automatic token refresh
- F1.5: Protected route middleware (redirect unauthenticated users to login)
- F1.6: Password hashing and secure credential storage (handled by Supabase Auth)

**F2 — Habit Management**
- F2.1: Create habit with name, description, type (positive/negative/target_count), target value, target unit, frequency, category, icon, color
- F2.2: View all active habits on dashboard
- F2.3: Edit habit details
- F2.4: Soft-delete habit (mark as inactive)
- F2.5: Support flexible scheduling: daily, weekly, custom days

**F3 — Daily Check-in System**
- F3.1: Mark positive/negative habit as complete/incomplete for today
- F3.2: Increment/decrement target_count habit progress
- F3.3: Add optional journal note with each check-in
- F3.4: Prevent duplicate check-ins per habit per day (upsert logic)
- F3.5: Undo today's check-in

**F4 — Streak Tracking**
- F4.1: Calculate current streak (consecutive days with completion)
- F4.2: Track longest streak achieved
- F4.3: Display total completions count
- F4.4: Calculate completion rate (completions / days since habit creation)
- F4.5: Calculate habit strength score (0–100) based on consistency patterns

**F5 — Analytics Dashboard**
- F5.1: Weekly completion bar chart
- F5.2: Monthly trend (4-week area chart)
- F5.3: Category distribution pie chart
- F5.4: Calendar heatmap (6 months)
- F5.5: Per-habit analytics cards with expandable details
- F5.6: Overall statistics: today's completions, total completions, average completion rate, 7-day consistency, average habit strength

**F6 — Gamification (Badges)**
- F6.1: Display all available badges with lock/earn status
- F6.2: Award streak-based badges (7-day, 30-day, 100-day)
- F6.3: Award completion-based badges (1, 50, 100 total completions)
- F6.4: Show earned count progress bar

**F7 — Habit Groups/Routines**
- F7.1: Create a named routine with description and color
- F7.2: Add existing habits to a routine
- F7.3: View all routines with their member habits
- F7.4: Delete a routine

**F8 — User Interface**
- F8.1: Responsive design (mobile, tablet, desktop)
- F8.2: Dark/light mode toggle with localStorage persistence
- F8.3: System preference detection for dark mode
- F8.4: Mobile-first navigation

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Expertise |
|-----------|-------------|-------------------|
| **Primary User** | Individual who wants to build/break habits | Low — expects mobile-first, intuitive UI |
| **MCA Evaluator** | Professor evaluating the project (PEP 1–5) | High — expects proper SDLC documentation, clean code, deployed app |
| **Future Developer** | Anyone reading/modifying the codebase | Medium — expects documented code, README, clear structure |

**Primary User Characteristics:**
- Primarily accesses via smartphone (mobile-first design is critical)
- May not be technically sophisticated
- Needs immediate visual feedback for check-ins
- Values streaks and badges as motivation
- Needs to create and manage 5–20 habits

### 2.4 Operating Environment

**Client-Side Requirements:**
| Component | Minimum Specification |
|-----------|----------------------|
| Browser | Chrome 100+, Firefox 100+, Edge 100+, Safari 15+ |
| Screen Resolution | 320px width (mobile) minimum |
| JavaScript | Must be enabled |
| Internet | Required for all operations |

**Server-Side / Cloud:**
| Component | Technology |
|-----------|-----------|
| Application Server | Vercel (serverless Edge Functions) |
| Database | Supabase PostgreSQL 15 |
| Auth Provider | Supabase Auth (Email + Google OAuth 2.0) |
| CDN | Vercel Edge Network |

**Development Environment:**
| Component | Technology |
|-----------|-----------|
| IDE | Visual Studio Code |
| OS | macOS / Windows 10 / Linux |
| Runtime | Node.js 20+ |
| Package Manager | npm |
| Version Control | Git + GitHub |
| Node.js Module | next (14.x), react (18.x), @supabase/supabase-js, @supabase/ssr, recharts, lucide-react, tailwindcss (4.x) |

### 2.5 Design and Implementation Constraints

1. **Framework Constraint:** Must use Next.js 14 with App Router (not Pages Router)
2. **Database Constraint:** Must use Supabase (PostgreSQL) — no custom backend server
3. **Styling Constraint:** Must use Tailwind CSS — no CSS-in-JS libraries (styled-components, emotion)
4. **Auth Constraint:** Must use Supabase Auth — no custom auth implementation
5. **Deployment Constraint:** Must deploy on Vercel
6. **Responsive Constraint:** Must be fully functional on 320px wide screens
7. **Security Constraint:** All database queries must use RLS policies
8. **Individual Work:** Strictly individual project — no group work permitted
9. **Academic Constraint:** Must follow full SDLC documentation (SRS, UML, ERD, DFD, ~60 page report)

### 2.6 Assumptions and Dependencies

**Assumptions:**
1. Users have a modern web browser with JavaScript enabled
2. Users have internet connectivity for all operations
3. Users have a valid email address for registration
4. Supabase free tier (or pro) provides sufficient resources for the project
5. Vercel free tier provides sufficient bandwidth and build minutes
6. Users understand basic habit tracking concepts (streaks, daily check-ins)

**Dependencies:**
1. **Supabase Service** — If Supabase is unavailable, the application cannot function
2. **Vercel Platform** — Deployment depends on Vercel's availability
3. **Google OAuth** — Google login depends on Google's OAuth service
4. **Node.js Ecosystem** — npm packages (next, react, recharts, etc.) must remain available
5. **PostgreSQL** — Supabase's underlying database must be operational

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces

**Landing Page (`/`):**
- Hero section with app tagline and call-to-action buttons
- Feature highlights (habit types, analytics, badges, dark mode)
- Navigation bar with Login/Sign Up links
- Responsive: stacks vertically on mobile

**Login Page (`/login`):**
- Email and password input fields
- "Continue with Google" OAuth button
- Error message display for invalid credentials
- Link to Sign Up page
- Centered card layout with gradient background

**Signup Page (`/signup`):**
- Full name, email, and password input fields
- Password confirmation
- "Continue with Google" OAuth button
- Link to Login page

**Dashboard (`/dashboard`):**
- Navigation bar with links to all sections
- Grid of habit cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each habit card shows: name, category, type badge, check-in button or counter controls
- Dark/light mode toggle in navbar

**Analytics (`/analytics`):**
- Back to Dashboard link
- Stats cards row (today, total, consistency, strength)
- Weekly bar chart and monthly trend chart
- Category pie chart
- Calendar heatmap (6 months)
- Per-habit analytics cards (expandable)

**Badges (`/badges`):**
- Progress bar showing earned/total badges
- Grid of badge cards with lock/earn status
- Earned badges highlighted with golden gradient

**Routines (`/groups`):**
- "New Routine" button
- List of routine cards with member habits
- Create routine form with name, description, color picker, habit selector

**New Habit (`/habits/new`):**
- Form with all habit fields
- Type selector (positive/negative/target_count)
- Dynamic fields based on type (target_value, target_unit for target_count)
- Color picker and category selector

**Edit Habit (`/habits/[id]/edit`):**
- Pre-populated form with existing habit data
- Same fields as New Habit form

#### 3.1.2 Hardware Interfaces

The application is a web-based software system with no direct hardware interface requirements. It runs on standard client devices (smartphones, tablets, laptops, desktops) through a web browser.

#### 3.1.3 Software Interfaces

| Interface | Direction | Description |
|-----------|-----------|-------------|
| Supabase Auth API | Bidirectional | User registration, login, session management, OAuth |
| Supabase PostgREST API | Bidirectional | CRUD operations on habits, logs, badges, groups |
| Google OAuth 2.0 | Bidirectional | Google sign-in flow |
| Vercel Deployment API | Unidirectional (push) | Git-triggered deployment |
| Browser localStorage | Client-side read/write | Dark mode preference persistence |

#### 3.1.4 Communication Interfaces

- **HTTPS** — All client-server communication encrypted via TLS
- **HTTP/2** — Supported by Vercel's edge network
- **WebSocket** — Available via Supabase Realtime (not currently used but available for future features)
- **OAuth 2.0** — Google authentication flow with redirect-based authorization

### 3.2 Functional Requirements

#### FR-1: User Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | The system shall allow users to register with email and password | High |
| FR-1.2 | The system shall validate email format and minimum password length (6 characters) | High |
| FR-1.3 | The system shall allow users to log in with registered email and password | High |
| FR-1.4 | The system shall display appropriate error messages for invalid credentials | High |
| FR-1.5 | The system shall support Google OAuth login/registration | Medium |
| FR-1.6 | The system shall maintain user sessions with automatic token refresh | High |
| FR-1.7 | The system shall redirect unauthenticated users to the login page when accessing protected routes | High |
| FR-1.8 | The system shall allow users to log out | High |

#### FR-2: Habit Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | The system shall allow users to create a habit with: name (required), description, type (positive/negative/target_count), target_value, target_unit, frequency (daily/weekly/custom), days_of_week, category, color | High |
| FR-2.2 | The system shall display all active habits on the dashboard | High |
| FR-2.3 | The system shall allow users to edit any habit's details | High |
| FR-2.4 | The system shall allow users to soft-delete habits (mark as inactive) | High |
| FR-2.5 | The system shall support 8 habit categories: Health, Fitness, Learning, Productivity, Mindfulness, Social, Finance, General | Medium |
| FR-2.6 | The system shall display habit type badges (positive/negative/target_count) on each card | Medium |

#### FR-3: Daily Check-in

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | The system shall allow users to mark a positive/negative habit as complete for today | High |
| FR-3.2 | The system shall allow users to undo today's check-in | High |
| FR-3.3 | The system shall allow users to increment/decrement target_count habit progress | High |
| FR-3.4 | The system shall allow users to set a custom count value for target_count habits | Medium |
| FR-3.5 | The system shall allow users to add an optional journal note with each check-in | Medium |
| FR-3.6 | The system shall prevent duplicate check-ins per habit per day (upsert) | High |
| FR-3.7 | The system shall display visual feedback (progress bar, completion status) for target_count habits | High |

#### FR-4: Streak Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | The system shall calculate and display the current streak for each habit | High |
| FR-4.2 | The system shall track and display the longest streak achieved per habit | Medium |
| FR-4.3 | The system shall display total completions count per habit | High |
| FR-4.4 | The system shall calculate completion rate as (total completions / days since creation) × 100 | Medium |
| FR-4.5 | The system shall calculate habit strength score (0–100) based on consistency patterns | Medium |

#### FR-5: Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | The system shall display a weekly completion bar chart (last 7 days) | High |
| FR-5.2 | The system shall display a monthly trend chart (last 4 weeks) | Medium |
| FR-5.3 | The system shall display a category distribution pie chart | Medium |
| FR-5.4 | The system shall display a calendar heatmap of activity (last 6 months) | High |
| FR-5.5 | The system shall display per-habit analytics cards with expandable details | High |
| FR-5.6 | The system shall show overall statistics: today's completions, total completions, average completion rate, 7-day consistency, average habit strength | High |
| FR-5.7 | The system shall display an empty state with call-to-action when no habits exist | Medium |

#### FR-6: Gamification

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | The system shall display all 6 available badges with lock/earn status | High |
| FR-6.2 | The system shall award "First Step" badge after 1 total completion | High |
| FR-6.3 | The system shall award "Week Warrior" badge after a 7-day streak | Medium |
| FR-6.4 | The system shall award "Monthly Master" badge after a 30-day streak | Medium |
| FR-6.5 | The system shall award "Century Club" badge after a 100-day streak | Low |
| FR-6.6 | The system shall award "Dedicated" badge after 50 total completions | Medium |
| FR-6.7 | The system shall display earned count progress bar | Medium |

#### FR-7: Habit Groups/Routines

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | The system shall allow users to create a named routine with description and color | High |
| FR-7.2 | The system shall allow users to add existing habits to a routine | High |
| FR-7.3 | The system shall display all routines with their member habits | High |
| FR-7.4 | The system shall allow users to delete a routine | Medium |

#### FR-8: UI/UX

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | The system shall be fully responsive (320px to 1920px width) | High |
| FR-8.2 | The system shall provide dark/light mode toggle | High |
| FR-8.3 | The system shall persist dark mode preference in localStorage | Medium |
| FR-8.4 | The system shall detect system color scheme preference on first visit | Medium |
| FR-8.5 | The system shall provide loading states (skeleton screens) during data fetch | Medium |
| FR-8.6 | The system shall provide empty states with call-to-action where appropriate | Medium |

### 3.3 Non-Functional Requirements

#### NFR-1: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | Page load time (First Contentful Paint) | < 2 seconds on 4G |
| NFR-1.2 | Time to Interactive | < 3 seconds on 4G |
| NFR-1.3 | API response time (Supabase queries) | < 500ms for 95th percentile |
| NFR-1.4 | Lighthouse Performance Score | > 80 |
| NFR-1.5 | Concurrent users supported | 100+ (Supabase free tier) |

#### NFR-2: Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-2.1 | All data transmission | HTTPS/TLS 1.2+ |
| NFR-2.2 | Password storage | bcrypt hashing (Supabase Auth) |
| NFR-2.3 | Database access control | Row Level Security on all tables |
| NFR-2.4 | Session management | JWT with automatic refresh |
| NFR-2.5 | XSS prevention | React auto-escaping + Next.js CSP |
| NFR-2.6 | CSRF protection | SameSite cookies + Supabase token validation |
| NFR-2.7 | SQL injection prevention | Parameterized queries via Supabase SDK |

#### NFR-3: Usability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-3.1 | Mobile-first design | All features usable on 320px screens |
| NFR-3.2 | Touch-friendly controls | Minimum 44px touch targets |
| NFR-3.3 | Accessibility | WCAG 2.1 AA compliance (semantic HTML, ARIA labels) |
| NFR-3.4 | Browser compatibility | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-3.5 | Error messages | User-friendly, non-technical language |

#### NFR-4: Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-4.1 | Uptime | 99.9% (Vercel SLA) |
| NFR-4.2 | Data durability | 99.999999999% (Supabase/PostgreSQL) |
| NFR-4.3 | Error handling | Graceful degradation with user feedback |
| NFR-4.4 | Data backup | Automated daily backups (Supabase) |

#### NFR-5: Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-5.1 | Code organization | Feature-based folder structure |
| NFR-5.2 | Type safety | Full TypeScript coverage |
| NFR-5.3 | Test coverage | > 80% unit test coverage |
| NFR-5.4 | Documentation | README, inline comments, this SRS |
| NFR-5.5 | Build | Zero-error production build |

#### NFR: Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-6.1 | Horizontal scaling | Serverless (Vercel Edge) — automatic |
| NFR-6.2 | Database scaling | Supabase connection pooling |
| NFR-6.3 | CDN | Vercel Edge Network — global |

### 3.4 Database Requirements

#### 3.4.1 Logical Data Model

The system uses **6 main tables** in PostgreSQL (via Supabase):

**1. `habits`** — Stores user habits
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Habit name |
| description | TEXT | NULL | Optional description |
| habit_type | VARCHAR(20) | CHECK (positive, negative, target_count) | Type of habit |
| target_value | INTEGER | NULL | e.g., 8 for "drink 8 glasses" |
| target_unit | VARCHAR(30) | NULL | e.g., "glasses", "pages" |
| frequency | VARCHAR(20) | CHECK (daily, weekly, custom) | How often |
| days_of_week | INTEGER[] | NULL | [0,2,4] for Mon/Wed/Fri |
| category | VARCHAR(50) | DEFAULT 'general' | Habit category |
| icon | VARCHAR(50) | DEFAULT 'check-circle' | Display icon |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Hex color |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| is_active | BOOLEAN | DEFAULT true | Soft delete flag |

**2. `habit_logs`** — Daily completion records
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| habit_id | UUID | FK → habits.id, NOT NULL | Which habit |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| completed_date | DATE, NOT NULL | Date of completion |
| count_value | INTEGER | NULL | For target_count habits |
| note | TEXT | NULL | Journal entry |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation |
| | | UNIQUE(habit_id, completed_date) | One log per habit per day |

**3. `habit_groups`** — Routines/collections of habits
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Routine name |
| description | TEXT | NULL | Optional description |
| icon | VARCHAR(50) | DEFAULT 'list' | Display icon |
| color | VARCHAR(7) | DEFAULT '#8B5CF6' | Hex color |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**4. `habit_group_items`** — Many-to-many: habits ↔ groups
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| group_id | UUID | FK → habit_groups.id, NOT NULL | Which group |
| habit_id | UUID | FK → habits.id, NOT NULL | Which habit |
| sort_order | INTEGER | DEFAULT 0 | Display order |

**5. `badges`** — Available achievement badges
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Badge name |
| description | TEXT | NULL | What it represents |
| icon | VARCHAR(50) | DEFAULT 'award' | Display icon |
| requirement_type | VARCHAR(30) | CHECK (streak, total_completions) | How to earn |
| requirement_value | INTEGER | NOT NULL | Threshold value |

**6. `user_badges`** — Badges earned by users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | Who earned it |
| badge_id | UUID | FK → badges.id, NOT NULL | Which badge |
| earned_at | TIMESTAMPTZ | DEFAULT NOW() | When earned |
| | | UNIQUE(user_id, badge_id) | One per user per badge |

#### 3.4.2 Data Integrity Constraints

1. **Referential Integrity:** All foreign keys use `ON DELETE CASCADE`
2. **Uniqueness:** One log per habit per day (`UNIQUE(habit_id, completed_date)`)
3. **Type Constraints:** `habit_type` restricted to `positive`, `negative`, `target_count`
4. **Frequency Constraints:** `frequency` restricted to `daily`, `weekly`, `custom`
5. **RLS Policies:** Users can only access their own data across all tables

#### 3.4.3 Data Volume Estimates

| Entity | Per User | Total (100 users) |
|--------|----------|-------------------|
| Habits | 5–20 | 500–2,000 |
| Habit Logs | 0–365 per habit/year | 50,000–730,000/year |
| Groups | 0–10 | 0–1,000 |
| Badges | 6 (fixed) | 6 |
| User Badges | 0–6 | 0–600 |

---

## 4. System Models

### 4.1 Use Case Model

#### 4.1.1 Use Case Diagram (Textual Description)

**Actors:**
1. **User** — Primary actor who interacts with the system
2. **Supabase Auth** — External system actor for authentication
3. **Google OAuth** — External system actor for social login

**Use Cases:**

```
┌─────────────────────────────────────────────────────────────┐
│                        HabitForge                           │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Register        │  │  Login           │                │
│  │  (Email/Google)  │  │  (Email/Google)  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Create Habit    │  │  Edit Habit      │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Delete Habit    │  │  View Dashboard  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Check-in Habit  │  │  Undo Check-in   │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  View Analytics  │  │  View Badges     │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Create Routine  │  │  Delete Routine  │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Toggle Dark Mode│  │  Logout          │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Use Case Specifications

**UC-1: Register**
| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | User is not logged in |
| **Trigger** | User clicks "Sign Up" |
| **Main Flow** | 1. User navigates to /signup 2. User enters name, email, password 3. System validates inputs 4. System creates account via Supabase Auth 5. System redirects to /dashboard |
| **Alternative Flow 3a** | User clicks "Continue with Google" → OAuth flow → Account created → Redirect to /dashboard |
| **Exception Flow 4a** | Email already registered → Display error message |
| **Postcondition** | User account created, session established |

**UC-2: Login**
| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | User has an existing account |
| **Trigger** | User clicks "Login" |
| **Main Flow** | 1. User navigates to /login 2. User enters email and password 3. System validates credentials via Supabase Auth 4. System creates session 5. System redirects to /dashboard |
| **Alternative Flow 3a** | User clicks "Continue with Google" → OAuth flow → Session created → Redirect |
| **Exception Flow 4a** | Invalid credentials → Display "Invalid login credentials" |
| **Postcondition** | Session established, user authenticated |

**UC-3: Create Habit**
| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | User is logged in |
| **Trigger** | User clicks "New Habit" |
| **Main Flow** | 1. User navigates to /habits/new 2. User fills habit details (name, type, target, etc.) 3. User clicks "Create Habit" 4. System validates inputs 5. System inserts record into `habits` table 6. System redirects to /dashboard |
| **Exception Flow 5a** | Validation fails → Display field errors |
| **Postcondition** | New habit appears on dashboard |

**UC-4: Check-in Habit**
| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | User is logged in, habit exists |
| **Trigger** | User clicks "Mark Done" or increments counter |
| **Main Flow** | 1. User clicks check-in button on habit card 2. System inserts/updates record in `habit_logs` 3. System updates UI to show completed state 4. System recalculates streak |
| **Alternative Flow** | For target_count: User clicks +/- to adjust count |
| **Postcondition** | Habit marked complete for today, streak updated |

**UC-5: View Analytics**
| Field | Value |
|-------|-------|
| **Actor** | User |
| **Precondition** | User is logged in |
| **Trigger** | User clicks "Analytics" in navbar |
| **Main Flow** | 1. System fetches habits and logs from Supabase 2. System calculates streaks, rates, strength 3. System renders charts and per-habit cards |
| **Alternative Flow 1a** | No habits exist → Display empty state with "Create Habit" CTA |
| **Postcondition** | Analytics page displayed with all charts |

### 4.2 Data Flow Model

#### 4.2.1 Context Diagram (Level 0)

```
                    ┌──────────────┐
                    │              │
                    │    User      │
                    │              │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
     ┌────────────┐ ┌───────────┐ ┌──────────┐
     │   Habit    │ │  Google   │ │ Supabase │
     │  Forge     │ │  OAuth    │ │  Auth    │
     │  System    │ │           │ │          │
     └──────┬─────┘ └───────────┘ └──────────┘
            │
            ▼
     ┌────────────┐
     │  Supabase  │
     │ PostgreSQL │
     └────────────┘
```

**External Entities:**
- User
- Google OAuth
- Supabase Auth

**Data Flows:**
- User → System: Login credentials, habit data, check-in actions
- System → User: Dashboard, analytics, badges, UI responses
- System → Supabase: Database queries (CRUD)
- Supabase → System: Query results, auth tokens
- Google OAuth ↔ System: OAuth authentication flow

#### 4.2.2 Level 1 DFD

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  D1     │    │  D2      │    │  D3      │    │  D4      │   │
│  │  User   │    │  Habits  │    │  Habit   │    │  Badges  │   │
│  │  Auth   │    │  Store   │    │  Logs    │    │  Store   │   │
│  │  Data   │    │          │    │  Store   │    │          │   │
│  └────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘   │
│       │              │              │              │           │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐      │
│  │                                                      │      │
│  │              HabitForge Application                   │      │
│  │                                                      │      │
│  │  P1 ──────── P2 ──────── P3 ──────── P4              │      │
│  │  Auth      Habit      Check-in   Analytics           │      │
│  │  Service   Service    Service    Engine              │      │
│  │                                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Processes:**
- **P1: Auth Service** — Handles registration, login, session management
- **P2: Habit Service** — CRUD operations for habits and groups
- **P3: Check-in Service** — Daily logging, streak calculation
- **P4: Analytics Engine** — Chart data generation, heatmap, strength scores

**Data Stores:**
- **D1: User Auth Data** — Managed by Supabase Auth (not directly accessible)
- **D2: Habits Store** — `habits`, `habit_groups`, `habit_group_items` tables
- **D3: Habit Logs Store** — `habit_logs` table
- **D4: Badges Store** — `badges`, `user_badges` tables

### 4.3 Entity Relationship Model

#### 4.3.1 ER Diagram (Textual)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│  auth.users  │       │     habits       │       │ habit_logs   │
│──────────────│       │──────────────────│       │──────────────│
│ id (PK)      │──┐    │ id (PK)          │──┐    │ id (PK)      │
│ email        │  │    │ user_id (FK)     │  │    │ habit_id(FK) │
│ created_at   │  │    │ name             │  │    │ user_id (FK) │
└──────────────┘  │    │ description      │  │    │completed_date│
                  │    │ habit_type       │  │    │ count_value  │
                  │    │ target_value     │  │    │ note         │
                  │    │ target_unit      │  │    │ created_at   │
                  │    │ frequency        │  │    └──────────────┘
                  │    │ days_of_week     │  │
                  │    │ category         │  │
                  │    │ color            │  │
                  │    │ is_active        │  │
                  │    │ created_at       │  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌──────────────────┐  │
                  │    │ habit_groups     │  │
                  │    │──────────────────│  │
                  │    │ id (PK)          │  │
                  │    │ user_id (FK)     │  │
                  │    │ name             │  │
                  │    │ description      │  │
                  │    │ color            │  │
                  │    │ created_at       │  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌──────────────────┐  │
                  │    │habit_group_items │  │
                  │    │──────────────────│  │
                  │    │ id (PK)          │  │
                  │    │ group_id (FK)    │  │
                  │    │ habit_id (FK)    │  │
                  │    │ sort_order       │  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌──────────────────┐  │
                  │    │     badges       │  │
                  │    │──────────────────│  │
                  │    │ id (PK)          │  │
                  │    │ name             │  │
                  │    │ description      │  │
                  │    │ requirement_type │  │
                  │    │ requirement_value│  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌──────────────────┐  │
                  │    │  user_badges     │  │
                  │    │──────────────────│  │
                  │    │ id (PK)          │  │
                  │    │ user_id (FK)     │  │
                  │    │ badge_id (FK)    │  │
                  │    │ earned_at        │  │
                  │    └──────────────────┘  │
```

#### 4.3.2 Relationship Cardinality

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| User → Habits | 1:N | One user can have many habits |
| User → Groups | 1:N | One user can have many groups |
| Habits → Logs | 1:N | One habit can have many daily logs |
| Groups → Habits | M:N | Groups contain many habits; habits can be in many groups (via habit_group_items) |
| User → UserBadges | 1:N | One user can earn many badges |
| Badges → UserBadges | 1:N | One badge can be earned by many users |

---

## 5. Appendices

### 5.1 Appendix A — Wireframes

#### Wireframe 1: Dashboard (Mobile)
```
┌─────────────────────────┐
│ ☰  HabitForge    🌙    │
├─────────────────────────┤
│                         │
│  Good morning! 👋       │
│  5 habits for today     │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Drink Water       │ │
│ │ Health  🎯 Target: 8│ │
│ │                     │ │
│ │ Today's Progress    │ │
│ │ ████████░░ 5/8 gls  │ │
│ │                     │ │
│ │ [-]  5  [+]  ✏️     │ │
│ │ +1 +2 +5 glasses    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Morning Exercise  │ │
│ │ Fitness             │ │
│ │ ✓ Completed!        │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Read Books        │ │
│ │ Learning 🎯 30 min  │ │
│ │ ██████████ 30/30    │ │
│ │ Target reached! 🎉  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🚫 No Junk Food     │ │
│ │ Health  Break habit │ │
│ │ ✓ Resisted!         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Meditate          │ │
│ │ Mindfulness 🎯 1    │ │
│ │ ██████████ 1/1 sess │ │
│ │ Target reached! 🎉  │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [🏠] [📊] [🏆] [📋]    │
└─────────────────────────┘
```

#### Wireframe 2: Analytics (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│  HabitForge    Dashboard  Analytics  Badges  Routines    🌙    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ← Back to Dashboard                                            │
│  Analytics                                                      │
│  Deep insights into your habit patterns                         │
│                                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Today    │ │ Total    │ │ 7-Day    │ │ Avg      │           │
│ │ 5/5      │ │ Done: 5  │ │ Consist. │ │ Strength │           │
│ │ 🔥       │ │ ✅       │ │ 14% ⚡   │ │ 10       │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│ ┌────────────────────────────┐ ┌────────────────────────────┐  │
│ │ Weekly Completions         │ │ Category Distribution      │  │
│ │                            │ │                            │  │
│ │  █                         │ │      ╭───────╮             │  │
│ │  █  █                      │ │    ╱  Health  ╲            │  │
│ │  █  █  █                   │ │   │  Fitness  │            │  │
│ │  █  █  █  █                │ │    ╲ Learn  ╱             │  │
│ │  █  █  █  █  █             │ │      ╰───────╯             │  │
│ │ Mon Tue Wed Thu Fri Sat Sun│ │                            │  │
│ └────────────────────────────┘ └────────────────────────────┘  │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Activity Heatmap (6 Months)                              │   │
│ │  ░░▒▒▓▓██▓▓▒▒░░▒▒▓▓██▓▓▒▒░░▒▒▓▓██▓▓▒▒░░▒▒▓▓██▓▓▒▒░░  │   │
│ │  Less ░░ ▒▒ ▓▓ ██ More                                    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Habit Breakdown                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ ● Drink Water    Health    [Strong]  Streak:1 Rate:100% │   │
│ │   Strength: 100/100 ████████████████████████████████████ │   │
│ │   Most active on Saturdays                                │   │
│ └──────────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ ● Morning Exercise  Fitness  [Strong]  Streak:1 Rate:100│   │
│ │   ...                                                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Appendix B — Requirements Traceability Matrix

| Req ID | Description | Design Component | Test Case | Status |
|--------|-------------|-----------------|-----------|--------|
| FR-1.1 | User registration | Signup page, Supabase Auth | TC-AUTH-01 | Implemented |
| FR-1.2 | Input validation | Form validation, Supabase constraints | TC-AUTH-02 | Implemented |
| FR-1.3 | User login | Login page, Supabase Auth | TC-AUTH-03 | Implemented |
| FR-1.4 | Error messages | Error state UI | TC-AUTH-04 | Implemented |
| FR-1.5 | Google OAuth | Supabase OAuth config | TC-AUTH-05 | Implemented |
| FR-1.6 | Session management | Middleware, Supabase SSR | TC-AUTH-06 | Implemented |
| FR-1.7 | Protected routes | Middleware matcher | TC-AUTH-07 | Implemented |
| FR-1.8 | Logout | Auth context, Supabase signOut | TC-AUTH-08 | Implemented |
| FR-2.1 | Create habit | New Habit form, habits table | TC-HAB-01 | Implemented |
| FR-2.2 | View habits | Dashboard, HabitCard | TC-HAB-02 | Implemented |
| FR-2.3 | Edit habit | Edit Habit form | TC-HAB-03 | Implemented |
| FR-2.4 | Delete habit | Soft-delete (is_active) | TC-HAB-04 | Implemented |
| FR-3.1 | Check-in | HabitCard toggle | TC-CHK-01 | Implemented |
| FR-3.2 | Undo check-in | Delete log | TC-CHK-02 | Implemented |
| FR-3.3 | Target count | Counter controls | TC-CHK-03 | Implemented |
| FR-3.5 | Journal note | Note textarea | TC-CHK-04 | Implemented |
| FR-4.1 | Current streak | streaks.ts utility | TC-STR-01 | Implemented |
| FR-4.2 | Longest streak | streaks.ts utility | TC-STR-02 | Implemented |
| FR-5.1 | Weekly chart | Recharts BarChart | TC-ANA-01 | Implemented |
| FR-5.4 | Heatmap | HeatmapCalendar component | TC-ANA-02 | Implemented |
| FR-5.5 | Per-habit cards | HabitAnalyticsCard | TC-ANA-03 | Implemented |
| FR-6.1 | Display badges | Badges page | TC-BDG-01 | Implemented |
| FR-7.1 | Create routine | Groups page form | TC-GRP-01 | Implemented |
| FR-7.3 | View routines | Groups page list | TC-GRP-02 | Implemented |
| FR-8.1 | Responsive design | Tailwind responsive classes | TC-UI-01 | Implemented |
| FR-8.2 | Dark/light mode | Navbar toggle, CSS variables | TC-UI-02 | Implemented |
| NFR-1.1 | Page load < 2s | SSR, Vercel Edge | TC-PERF-01 | Verified |
| NFR-2.3 | RLS policies | Supabase RLS | TC-SEC-01 | Implemented |
| NFR-5.2 | TypeScript | Full TS coverage | TC-MAINT-01 | Implemented |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-21 | Vyanko AI LLP | Initial SRS document |

---

*End of SRS Document*
