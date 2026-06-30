# HabitForge — A Full-Stack Habit Tracking Web Application

## Major Project Report

**Course:** Master of Computer Applications (MCA) — 4th Semester
**Subject Code:** 23ONMCR-753
**Credits:** 12
**Project Duration:** June 2026

---

## Table of Contents

1. [Chapter 1: Introduction](#chapter-1-introduction)
2. [Chapter 2: Literature Survey](#chapter-2-literature-survey)
3. [Chapter 3: System Analysis & Feasibility Study](#chapter-3-system-analysis--feasibility-study)
4. [Chapter 4: Software Requirements Specification](#chapter-4-software-requirements-specification)
5. [Chapter 5: System Design](#chapter-5-system-design)
6. [Chapter 6: Implementation](#chapter-6-implementation)
7. [Chapter 7: Testing](#chapter-7-testing)
8. [Chapter 8: Deployment](#chapter-8-deployment)
9. [Chapter 9: Conclusion & Future Scope](#chapter-9-conclusion--future-scope)
10. [References](#references)
11. [Appendices](#appendices)

---

## Chapter 1: Introduction

### 1.1 Project Overview

**HabitForge** is a full-stack web application designed to help users build positive habits, break negative ones, and track their daily progress through an intuitive, gamified interface. The application leverages modern web technologies including Next.js 14, Supabase (PostgreSQL), and Tailwind CSS to deliver a responsive, secure, and feature-rich user experience.

The project was developed as part of the MCA 4th Semester Major Project requirement (Subject Code: 23ONMCR-753, 12 Credits) at Chandigarh University's Centre for Distance & Online Education.

### 1.2 Problem Statement

Building and maintaining habits is a fundamental challenge in personal development. Research shows that it takes an average of 66 days to form a new habit (Lally et al., 2010). Yet most people struggle with:

1. **Lack of consistency tracking** — No easy way to see daily progress
2. **No visual motivation** — Missing streak counters and achievement systems
3. **Poor analytics** — Cannot identify patterns in habit completion
4. **One-size-fits-all approach** — Existing apps don't support diverse habit types (positive, negative, target-count, grouped routines)

HabitForge addresses these gaps by providing a comprehensive, type-aware habit tracking system with rich analytics and gamification.

### 1.3 Objectives

1. Develop a full-stack web application for habit tracking with support for multiple habit types
2. Implement secure user authentication with email/password and Google OAuth
3. Design an intuitive, mobile-first responsive interface
4. Build an analytics dashboard with charts, heatmaps, and habit strength metrics
5. Incorporate gamification through a badge/achievement system
6. Apply complete SDLC methodology from requirements through deployment
7. Document the project comprehensively for academic evaluation

### 1.4 Scope

**Included:**
- User authentication (email/password + Google OAuth)
- CRUD operations for 4 habit types (positive, negative, target_count, groups)
- Daily check-in system with optional journal notes
- Streak tracking (current, longest, total completions)
- Analytics dashboard with charts and heatmaps
- Gamification with 6 milestone badges
- Responsive design with dark/light mode
- Deployment on Vercel

**Excluded:**
- Native mobile applications (iOS/Android)
- Social features (friend groups, shared challenges)
- Push notifications
- Multi-language support

### 1.5 SDLC Methodology

This project follows the **Agile Iterative Model** with 8 sprints:

| Sprint | Focus | Duration |
|--------|-------|----------|
| Sprint 1 | Project setup, Supabase config, database schema | 2 days |
| Sprint 2 | Authentication system | 2 days |
| Sprint 3 | Habit CRUD operations | 3 days |
| Sprint 4 | Daily check-in, notes, streak tracking | 3 days |
| Sprint 5 | Analytics dashboard with charts | 3 days |
| Sprint 6 | Gamification (badges, achievements) | 2 days |
| Sprint 7 | UI polish, responsive design, dark mode | 3 days |
| Sprint 8 | Testing, bug fixes, deployment | 2 days |

### 1.6 Report Organization

This report is organized to follow the complete SDLC:
- **Chapters 1-3:** Introduction, literature survey, feasibility study
- **Chapter 4:** Software Requirements Specification (summary)
- **Chapter 5:** System Design (UML, ERD, DFD)
- **Chapter 6:** Implementation details with code snippets
- **Chapter 7:** Testing strategy and results
- **Chapter 8:** Deployment process
- **Chapter 9:** Conclusion and future scope

---

## Chapter 2: Literature Survey

### 2.1 Existing Habit Tracking Solutions

#### 2.1.1 Habitica (https://habitica.com)
- **Approach:** Gamifies habits as an RPG (role-playing game)
- **Strengths:** Strong gamification, social features, task management
- **Weaknesses:** Complex UI, steep learning curve, no target-count habits, no analytics charts
- **HabitForge Difference:** Simpler UI, native target-count support, built-in analytics with heatmaps

#### 2.1.2 Streaks (https://streaksapp.com)
- **Approach:** Minimalist habit tracker for iOS/macOS
- **Strengths:** Beautiful design, Apple ecosystem integration
- **Weaknesses:** Apple-only (no web/Android), no groups/routines, no analytics beyond streaks
- **HabitForge Difference:** Cross-platform web app, groups/routines, comprehensive analytics

#### 2.1.3 Loop Habit Tracker (https://github.com/iSoron/uhabits)
- **Approach:** Open-source Android habit tracker
- **Strengths:** Free, open-source, score-based tracking
- **Weaknesses:** Android-only, dated UI, no cloud sync, no groups
- **HabitForge Difference:** Web-based, cloud-synced, modern UI, groups support

#### 2.1.4 Done (https://doneapp.com)
- **Approach:** Simple habit tracking with statistics
- **Strengths:** Clean interface, multiple habit types
- **Weaknesses:** Limited analytics, no gamification, no groups
- **HabitForge Difference:** Rich analytics, badge system, routine grouping

### 2.2 Research Foundations

#### 2.2.1 Habit Formation Research
- **Lally et al. (2010):** "How are habits formed: Modelling habit formation in the real world" — European Journal of Social Psychology. Found that habit formation takes 18-254 days (median 66 days), supporting the need for long-term tracking.
- **Gardner et al. (2012):** "Making health habitual: the psychology of habit-formation and general practice" — British Journal of General Practice. Emphasized the importance of consistency cues and tracking.
- **Clear (2018):** "Atomic Habits" — Popularized the 1% improvement concept and habit stacking (grouping habits into routines).

#### 2.2.2 Gamification Research
- **Deterding et al. (2011):** "From game design elements to gamefulness: defining gamification" — Established framework for applying game elements to non-game contexts.
- **Hamari et al. (2014):** "Does gamification work? A literature review" — Found that gamification positively affects engagement when properly implemented.

### 2.3 Technology Survey

#### 2.3.1 Frontend Frameworks
| Framework | SSR | TypeScript | Learning Curve | Ecosystem |
|-----------|-----|------------|----------------|-----------|
| Next.js 14 | ✅ Built-in | ✅ Native | Medium | Excellent |
| Create React App | ❌ | ✅ Add-on | Low | Good |
| Vue 3 | ❌ (Nuxt needed) | ✅ Add-on | Low | Good |
| SvelteKit | ✅ Built-in | ✅ Add-on | Medium | Growing |

**Choice: Next.js 14** — Best SSR support, App Router, Vercel integration, TypeScript native.

#### 2.3.2 Backend/BaaS Options
| Option | Type | Auth | Database | Cost |
|--------|------|------|----------|------|
| Supabase | BaaS | Built-in | PostgreSQL | Free tier |
| Firebase | BaaS | Built-in | Firestore | Free tier |
| Custom Node.js | Self-hosted | Manual | Any | Server cost |
| Appwrite | BaaS | Built-in | MariaDB | Free tier |

**Choice: Supabase** — PostgreSQL (SQL-based, better for relational data), Row Level Security, excellent Next.js integration.

#### 2.3.3 Styling Approaches
| Approach | Type | Learning Curve | Bundle Size |
|----------|------|----------------|-------------|
| Tailwind CSS 4 | Utility-first | Medium | Tiny (JIT) |
| CSS Modules | Component-scoped | Low | Small |
| Styled Components | CSS-in-JS | Medium | Runtime cost |
| Bootstrap | Component library | Low | Large |

**Choice: Tailwind CSS 4** — Utility-first, no runtime cost, excellent responsive utilities, dark mode support.

---

## Chapter 3: System Analysis & Feasibility Study

### 3.1 Requirement Analysis

Based on the problem statement and literature survey, the following requirements were identified:

**Functional Requirements:**
1. User must be able to register and log in securely
2. User must be able to create, edit, and delete habits
3. System must support multiple habit types (positive, negative, target_count)
4. User must be able to check in habits daily
5. System must track and display streaks
6. System must provide analytics with charts
7. System must award badges for milestones
8. User must be able to group habits into routines

**Non-Functional Requirements:**
1. Application must be responsive (mobile-first)
2. Application must support dark/light mode
3. All data must be secured with RLS
4. Page load time must be under 2 seconds
5. Application must be accessible via public URL

### 3.2 Feasibility Analysis

#### 3.2.1 Technical Feasibility
| Aspect | Assessment | Details |
|--------|------------|---------|
| Technology maturity | ✅ Feasible | Next.js, Supabase, Tailwind are production-ready |
| Developer skills | ✅ Feasible | Modern web stack with good documentation |
| Infrastructure | ✅ Feasible | Vercel + Supabase free tiers sufficient |
| Integration | ✅ Feasible | Supabase SDK integrates seamlessly with Next.js |
| Browser support | ✅ Feasible | All target browsers support required features |

#### 3.2.2 Economic Feasibility
| Cost Item | Amount | Notes |
|-----------|--------|-------|
| Domain | ₹0 | Vercel provides *.vercel.app subdomain |
| Hosting (Vercel) | ₹0 | Free tier: 100GB bandwidth/month |
| Database (Supabase) | ₹0 | Free tier: 500MB, 2GB bandwidth |
| Auth (Supabase) | ₹0 | Free tier: 50,000 monthly active users |
| Development tools | ₹0 | VS Code, Git, npm — all free |
| **Total** | **₹0** | Entirely free for project scope |

#### 3.2.3 Operational Feasibility
| Aspect | Assessment | Details |
|--------|------------|---------|
| User adoption | ✅ Feasible | Simple, intuitive UI requires no training |
| Maintenance | ✅ Feasible | Serverless architecture requires minimal maintenance |
| Scalability | ✅ Feasible | Vercel auto-scales, Supabase handles connection pooling |
| Data backup | ✅ Feasible | Supabase provides automated daily backups |

#### 3.2.4 Schedule Feasibility
| Phase | Estimated | Actual |
|-------|-----------|--------|
| Requirements & Analysis | 2 days | 2 days |
| Design (UML, ERD, DFD) | 3 days | 3 days |
| Implementation | 10 days | 10 days |
| Testing | 3 days | 3 days |
| Documentation | 3 days | 3 days |
| **Total** | **21 days** | **21 days** |

### 3.3 Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase service outage | Low | High | Supabase SLA 99.9%; data export possible |
| Vercel deployment failure | Low | Medium | Git-based rollback, local dev server |
| Scope creep | Medium | Medium | Strict sprint boundaries, prioritized backlog |
| Browser compatibility issues | Low | Medium | Progressive enhancement, cross-browser testing |
| RLS policy misconfiguration | Medium | High | Thorough testing of all access patterns |

### 3.4 Hardware & Software Requirements

#### Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 | Intel Core i5+ |
| RAM | 4 GB | 8 GB |
| Storage | 50 GB | 100 GB |
| Display | 1366x768 | 1920x1080 |
| Internet | 1 Mbps | 10 Mbps |

#### Software Requirements
| Category | Technology | Version |
|----------|-----------|---------|
| Frontend Framework | Next.js | 14.x |
| UI Library | React | 18.x |
| Styling | Tailwind CSS | 4.x |
| Backend/BaaS | Supabase | Latest |
| Database | PostgreSQL | 15 (via Supabase) |
| Authentication | Supabase Auth | Latest |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 1.x |
| Language | TypeScript | 5.x |
| Testing | Jest + Playwright | 30.x / 1.x |
| Deployment | Vercel | Latest |
| Version Control | Git + GitHub | Latest |
| IDE | VS Code | Latest |

---

## Chapter 4: Software Requirements Specification

### 4.1 SRS Overview

The complete SRS document follows IEEE 830-1998 format and is included as a separate document (`docs/SRS.md`). This chapter provides a summary of key requirements.

### 4.2 Functional Requirements Summary

#### Authentication (FR-1)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | User registration with email/password | High |
| FR-1.2 | Input validation (email format, password length) | High |
| FR-1.3 | User login with email/password | High |
| FR-1.4 | Error messages for invalid credentials | High |
| FR-1.5 | Google OAuth login | Medium |
| FR-1.6 | Session management with token refresh | High |
| FR-1.7 | Protected route middleware | High |
| FR-1.8 | User logout | High |

#### Habit Management (FR-2)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Create habit with all attributes | High |
| FR-2.2 | View all active habits on dashboard | High |
| FR-2.3 | Edit habit details | High |
| FR-2.4 | Soft-delete habit | High |
| FR-2.5 | 8 habit categories | Medium |
| FR-2.6 | Habit type badges on cards | Medium |

#### Daily Check-in (FR-3)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Mark positive/negative habit complete | High |
| FR-3.2 | Undo today's check-in | High |
| FR-3.3 | Increment/decrement target_count | High |
| FR-3.4 | Custom count value input | Medium |
| FR-3.5 | Optional journal note | Medium |
| FR-3.6 | Prevent duplicate check-ins (upsert) | High |

#### Streak Tracking (FR-4)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Current streak calculation | High |
| FR-4.2 | Longest streak tracking | Medium |
| FR-4.3 | Total completions count | High |
| FR-4.4 | Completion rate percentage | Medium |
| FR-4.5 | Habit strength score (0-100) | Medium |

#### Analytics (FR-5)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Weekly completion bar chart | High |
| FR-5.2 | Monthly trend area chart | Medium |
| FR-5.3 | Category distribution pie chart | Medium |
| FR-5.4 | Calendar heatmap (6 months) | High |
| FR-5.5 | Per-habit analytics cards | High |
| FR-5.6 | Overall statistics dashboard | High |

#### Gamification (FR-6)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Display all badges with status | High |
| FR-6.2-6.7 | Award 6 milestone badges | Medium |

#### Routines (FR-7)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Create named routine | High |
| FR-7.2 | Add habits to routine | High |
| FR-7.3 | View routines with habits | High |
| FR-7.4 | Delete routine | Medium |

### 4.3 Non-Functional Requirements Summary

| Category | Key Requirements |
|----------|-----------------|
| **Performance** | FCP < 2s, TTI < 3s, API < 500ms, Lighthouse > 80 |
| **Security** | HTTPS/TLS, bcrypt passwords, RLS, JWT, XSS/CSRF prevention |
| **Usability** | Mobile-first, 44px touch targets, WCAG 2.1 AA |
| **Reliability** | 99.9% uptime, 99.999999999% data durability |
| **Maintainability** | TypeScript, >80% test coverage, documented code |
| **Scalability** | Serverless auto-scaling, connection pooling |

### 4.4 Database Requirements Summary

The system uses 6 PostgreSQL tables:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `habits` | Store user habits | id, user_id, name, habit_type, target_value, frequency |
| `habit_logs` | Daily completion records | id, habit_id, user_id, completed_date, count_value, note |
| `habit_groups` | Routine definitions | id, user_id, name, color |
| `habit_group_items` | Many-to-many mapping | id, group_id, habit_id, sort_order |
| `badges` | Badge definitions | id, name, requirement_type, requirement_value |
| `user_badges` | Earned badges | id, user_id, badge_id, earned_at |

All tables have Row Level Security (RLS) policies ensuring users can only access their own data.

---

## Chapter 5: System Design

### 5.1 Architecture Design

#### 5.1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Browser (Chrome, Firefox, Safari, Edge)                 │   │
│  │  - React 18 Components (Client & Server)                 │   │
│  │  - Tailwind CSS 4 Styling                                │   │
│  │  - Recharts Visualization                                │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ HTTPS                               │
├───────────────────────────┼─────────────────────────────────────┤
│                    Application Layer                              │
│  ┌────────────────────────┴─────────────────────────────────┐   │
│  │  Next.js 14 (App Router) on Vercel                       │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Server     │ │ Client     │ │ API        │           │   │
│  │  │ Components │ │ Components │ │ Routes     │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Middleware │ │ Supabase   │ │ Streak     │           │   │
│  │  │ (Auth)     │ │ Client SDK │ │ Calculator │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ Supabase SDK                        │
├───────────────────────────┼─────────────────────────────────────┤
│                      Data Layer                                   │
│  ┌────────────────────────┴─────────────────────────────────┐   │
│  │  Supabase Platform                                        │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ PostgreSQL │ │ Auth       │ │ PostgREST  │           │   │
│  │  │ Database   │ │ Service    │ │ API        │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.1.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HabitForge Component Tree                    │
│                                                                  │
│  Root Layout (layout.tsx)                                       │
│  ├── Navbar (Navbar.tsx)                                        │
│  │   ├── Logo                                                   │
│  │   ├── Nav Links (Dashboard, Analytics, Badges, Routines)     │
│  │   ├── Dark Mode Toggle                                       │
│  │   └── Logout Button                                          │
│  │                                                              │
│  ├── Landing Page (page.tsx)                                    │
│  │   ├── Hero Section                                           │
│  │   ├── Features Grid                                          │
│  │   └── CTA Section                                            │
│  │                                                              │
│  ├── Auth Layout ((auth)/layout.tsx)                            │
│  │   ├── Login Page                                             │
│  │   ├── Signup Page                                            │
│  │   └── Auth Callback (route.ts)                               │
│  │                                                              │
│  └── Dashboard Layout ((dashboard)/layout.tsx)                  │
│      ├── Dashboard Page                                         │
│      │   └── HabitCard[] (HabitCard.tsx)                        │
│      ├── New Habit Page                                         │
│      ├── Edit Habit Page                                        │
│      ├── Analytics Page                                         │
│      │   ├── StatsCard[]                                        │
│      │   ├── BarChart (Recharts)                                │
│      │   ├── PieChart (Recharts)                                │
│      │   ├── AreaChart (Recharts)                               │
│      │   ├── HeatmapCalendar                                    │
│      │   └── HabitAnalyticsCard[]                               │
│      ├── Badges Page                                            │
│      │   └── BadgeCard[]                                        │
│      └── Groups Page                                            │
│          ├── GroupForm                                          │
│          └── GroupCard[]                                        │
│                                                                  │
│  Shared Utilities:                                               │
│  ├── lib/supabase/client.ts (Browser client)                    │
│  ├── lib/supabase/server.ts (Server client)                     │
│  ├── lib/supabase/middleware.ts (Session management)            │
│  └── lib/streaks.ts (Streak calculation engine)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 UML Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     HabitForge Use Cases                         │
│                                                                  │
│  User Actor:                                                     │
│  ├── Register (Email/Google)                                     │
│  ├── Login (Email/Google)                                        │
│  ├── Logout                                                      │
│  ├── Create Habit                                                │
│  ├── Edit Habit                                                  │
│  ├── Delete Habit                                                │
│  ├── View Dashboard                                              │
│  ├── Check-in Habit ──«include»── Calculate Streak              │
│  ├── Undo Check-in                                               │
│  ├── View Analytics                                              │
│  ├── View Badges                                                 │
│  ├── Create Routine                                              │
│  ├── Delete Routine                                              │
│  └── Toggle Dark Mode                                            │
│                                                                  │
│  External Actors:                                                │
│  ├── Google OAuth (authentication)                               │
│  └── Supabase Auth (session management)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 UML Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    HabitForge Class Diagram                      │
│                                                                  │
│  ┌──────────────┐    1  *  ┌──────────────┐    1  *            │
│  │    User      │─────────│    Habit     │─────────             │
│  │──────────────│         │──────────────│         │             │
│  │ id: UUID     │         │ id: UUID     │         │             │
│  │ email: string│         │ user_id: FK  │         │             │
│  │ full_name    │         │ name: string │         │             │
│  │ created_at   │         │ habit_type   │         │             │
│  │──────────────│         │ target_value │         │             │
│  │ register()   │         │ frequency    │         │             │
│  │ login()      │         │ category     │         │             │
│  │ logout()     │         │ color        │         │             │
│  └──────────────┘         │ is_active    │         │             │
│         │                 │ created_at   │         │             │
│         │ 1               │──────────────│         │             │
│         │                 │ create()     │         │             │
│         │ *               │ update()     │         │             │
│  ┌──────────────┐         │ delete()     │         │             │
│  │ HabitGroup   │         │ checkin()    │         │             │
│  │──────────────│         │ undoCheckin()│         │             │
│  │ id: UUID     │         └──────────────┘         │             │
│  │ user_id: FK  │                                  │             │
│  │ name: string │    1  *  ┌──────────────┐         │             │
│  │ description  │─────────│  HabitLog    │◄────────┘             │
│  │ color        │         │──────────────│                        │
│  │ created_at   │         │ id: UUID     │                        │
│  │──────────────│         │ habit_id: FK │                        │
│  │ create()     │         │ user_id: FK  │                        │
│  │ addHabit()   │         │completed_date│                        │
│  │ delete()     │         │ count_value  │                        │
│  └──────────────┘         │ note         │                        │
│                           │ created_at   │                        │
│  ┌──────────────┐         └──────────────┘                        │
│  │    Badge     │    1  *  ┌──────────────┐                      │
│  │──────────────│─────────│  UserBadge   │                      │
│  │ id: UUID     │         │──────────────│                      │
│  │ name: string │         │ id: UUID     │                      │
│  │ description  │         │ user_id: FK  │                      │
│  │ icon         │         │ badge_id: FK │                      │
│  │ req_type     │         │ earned_at    │                      │
│  │ req_value    │         └──────────────┘                      │
│  └──────────────┘                                                │
│                                                                  │
│  ┌──────────────────┐                                            │
│  │ StreakCalculator │                                            │
│  │──────────────────│                                            │
│  │ calculateStreak()│                                            │
│  │ generateHeatmap()│                                            │
│  └──────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Entity Relationship Diagram                   │
│                                                                  │
│  auth.users ──1:N── habits ──1:N── habit_logs                   │
│       │                                                          │
│       └──1:N── habit_groups ──1:N── habit_group_items           │
│                      (M:N with habits)                           │
│       │                                                          │
│       └──1:N── user_badges ──N:1── badges                       │
│                                                                  │
│  Key: PK = Primary Key, FK = Foreign Key                         │
│  1:N = One-to-Many, M:N = Many-to-Many                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Data Flow Diagrams

#### Context Diagram (Level 0)
```
  User ◄──────────────────────────────► HabitForge System
    │                                       │
    │  Login, Habit Data, Check-ins         │
    │  Dashboard, Analytics, Badges         │
    │                                       │
    │              ┌──────────────┐         │
    └─────────────►│ Google OAuth │◄────────┘
                   └──────────────┘
```

#### Level 1 DFD
```
  User → P1(Auth) → D1(Session)
  User → P2(Habit CRUD) → D2(Habits)
  User → P3(Check-in) → D3(Logs)
  User → P4(Analytics) → D2, D3, D4(Badges)
```

### 5.6 Database Design

#### 5.6.1 Table: habits
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Habit name |
| description | TEXT | NULL | Optional description |
| habit_type | VARCHAR(20) | CHECK (positive, negative, target_count) | Type |
| target_value | INTEGER | NULL | Numeric goal |
| target_unit | VARCHAR(30) | NULL | Unit label |
| frequency | VARCHAR(20) | CHECK (daily, weekly, custom) | Schedule |
| days_of_week | INTEGER[] | NULL | Specific days |
| category | VARCHAR(50) | DEFAULT 'general' | Category |
| icon | VARCHAR(50) | DEFAULT 'check-circle' | Icon name |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Hex color |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |
| is_active | BOOLEAN | DEFAULT true | Soft delete |

#### 5.6.2 Table: habit_logs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| habit_id | UUID | FK → habits.id, NOT NULL | Habit reference |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| completed_date | DATE | NOT NULL | Date of completion |
| count_value | INTEGER | NULL | For target_count |
| note | TEXT | NULL | Journal entry |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record time |
| | | UNIQUE(habit_id, completed_date) | One per day |

#### 5.6.3 Table: habit_groups
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Routine name |
| description | TEXT | NULL | Description |
| icon | VARCHAR(50) | DEFAULT 'list' | Icon |
| color | VARCHAR(7) | DEFAULT '#8B5CF6' | Color |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

#### 5.6.4 Table: habit_group_items
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| group_id | UUID | FK → habit_groups.id, NOT NULL | Group |
| habit_id | UUID | FK → habits.id, NOT NULL | Habit |
| sort_order | INTEGER | DEFAULT 0 | Display order |

#### 5.6.5 Table: badges
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Badge name |
| description | TEXT | NULL | Description |
| icon | VARCHAR(50) | DEFAULT 'award' | Icon |
| requirement_type | VARCHAR(30) | CHECK (streak, total_completions) | Type |
| requirement_value | INTEGER | NOT NULL | Threshold |

#### 5.6.6 Table: user_badges
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → auth.users.id, NOT NULL | User |
| badge_id | UUID | FK → badges.id, NOT NULL | Badge |
| earned_at | TIMESTAMPTZ | DEFAULT NOW() | Earned time |
| | | UNIQUE(user_id, badge_id) | One per user |

### 5.7 Security Design

#### Row Level Security (RLS) Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| habits | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |
| habit_groups | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |
| habit_group_items | Via group ownership | Via group ownership | — | Via group ownership |
| habit_logs | auth.uid() = user_id | auth.uid() = user_id | — | auth.uid() = user_id |
| badges | authenticated | — | — | — |
| user_badges | auth.uid() = user_id | auth.uid() = user_id | — | — |

---

*Report continues in subsequent sections...*
