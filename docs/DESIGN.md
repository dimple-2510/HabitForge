# Design Documents — HabitForge

## UML Diagrams, ERD, and DFD

**Document Version:** 1.0
**Date:** June 21, 2026
**Course:** MCA 4th Semester, Subject Code: 23ONMCR-753

---

## Table of Contents

1. [UML Use Case Diagram](#1-uml-use-case-diagram)
2. [UML Class Diagram](#2-uml-class-diagram)
3. [UML Sequence Diagrams](#3-uml-sequence-diagrams)
4. [UML Activity Diagrams](#4-uml-activity-diagrams)
5. [Entity Relationship Diagram (ERD)](#5-entity-relationship-diagram-erd)
6. [Data Flow Diagrams (DFD)](#6-data-flow-diagrams-dfd)

---

## 1. UML Use Case Diagram

### 1.1 Primary Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HabitForge System                             │
│                                                                         │
│  ┌─────────────────┐                                                    │
│  │   Register      │◄──────┐                                            │
│  │   (Email/Google)│       │                                            │
│  └─────────────────┘       │    ┌──────────────────┐                    │
│                            │    │  Google OAuth    │                    │
│  ┌─────────────────┐       │    │  (External)      │                    │
│  │   Login         │◄──────┤    └──────────────────┘                    │
│  │   (Email/Google)│       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Create Habit  │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Edit Habit    │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Delete Habit  │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   View Dashboard│       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Check-in      │       │                                            │
│  │   Habit         │       │                                            │
│  └────────┬────────┘       │                                            │
│           │ «include»       │                                            │
│           ▼                 │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Calculate     │       │                                            │
│  │   Streak        │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Undo Check-in │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   View Analytics│       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   View Badges   │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Create Routine│       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Delete Routine│       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Toggle Dark   │       │                                            │
│  │   Mode          │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
│  ┌─────────────────┐       │                                            │
│  │   Logout        │       │                                            │
│  └─────────────────┘       │                                            │
│                            │                                            │
└────────────────────────────┼────────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      User        │
                    │   (Actor)        │
                    └──────────────────┘
```

### 1.2 Use Case Descriptions

| Use Case | Actor | Description | Preconditions | Postconditions |
|----------|-------|-------------|---------------|----------------|
| Register | User | Create new account with email/password or Google | Not logged in | Account created, session established |
| Login | User | Authenticate with email/password or Google | Has account, not logged in | Session established |
| Create Habit | User | Add a new habit with type, target, schedule | Logged in | Habit appears on dashboard |
| Edit Habit | User | Modify habit details | Logged in, habit exists | Habit updated |
| Delete Habit | User | Soft-delete a habit | Logged in, habit exists | Habit hidden from dashboard |
| View Dashboard | User | See all habits with check-in status | Logged in | Dashboard displayed |
| Check-in Habit | User | Mark habit complete or update count | Logged in, habit exists | Log created/updated, streak recalculated |
| Undo Check-in | User | Remove today's check-in | Logged in, checked in today | Log removed, streak recalculated |
| View Analytics | User | See charts, heatmaps, per-habit stats | Logged in | Analytics displayed |
| View Badges | User | See all badges with earn status | Logged in | Badges displayed |
| Create Routine | User | Create a new habit group | Logged in | Routine created |
| Delete Routine | User | Remove a routine | Logged in, routine exists | Routine deleted |
| Toggle Dark Mode | User | Switch between light and dark themes | Any state | Theme changed, preference saved |
| Logout | User | End session | Logged in | Session terminated |

---

## 2. UML Class Diagram

### 2.1 Domain Model Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HabitForge Domain Model                       │
│                                                                         │
│  ┌────────────────────┐         ┌────────────────────┐                  │
│  │       User         │         │       Habit        │                  │
│  │────────────────────│         │────────────────────│                  │
│  │ id: UUID           │───┐     │ id: UUID           │                  │
│  │ email: string      │   │     │ user_id: UUID      │                  │
│  │ full_name: string  │   │     │ name: string       │                  │
│  │ created_at: Date   │   │     │ description: string│                  │
│  │────────────────────│   │     │ habit_type: enum   │                  │
│  │ register()         │   │     │ target_value: int  │                  │
│  │ login()            │   │     │ target_unit: string│                  │
│  │ logout()           │   │     │ frequency: enum    │                  │
│  └────────────────────┘   │     │ days_of_week: int[]│                  │
│                           │     │ category: string   │                  │
│                           │     │ color: string      │                  │
│                           │     │ is_active: boolean │                  │
│                           │     │ created_at: Date   │                  │
│                           │     │────────────────────│                  │
│                           │     │ create()           │                  │
│                           │     │ update()           │                  │
│                           │     │ delete()           │                  │
│                           │     │ checkin()          │                  │
│                           │     │ undoCheckin()      │                  │
│                           │     └─────────┬──────────┘                  │
│                           │               │ 1                           │
│                           │               │                             │
│                           │               │ *                           │
│                           │     ┌─────────┴──────────┐                  │
│                           │     │    HabitLog        │                  │
│                           │     │────────────────────│                  │
│                           │     │ id: UUID           │                  │
│                           │     │ habit_id: UUID     │                  │
│                           │     │ user_id: UUID      │                  │
│                           │     │ completed_date:Date│                  │
│                           │     │ count_value: int   │                  │
│                           │     │ note: string       │                  │
│                           │     │ created_at: Date   │                  │
│                           │     │────────────────────│                  │
│                           │     │ create()           │                  │
│                           │     │ delete()           │                  │
│                           │     └────────────────────┘                  │
│                           │                                             │
│                           │         ┌────────────────────┐              │
│                           │         │   HabitGroup      │              │
│                           │         │────────────────────│              │
│                           │         │ id: UUID           │              │
│                           │         │ user_id: UUID      │              │
│                           │         │ name: string       │              │
│                           │         │ description: string│              │
│                           │         │ color: string      │              │
│                           │         │ created_at: Date   │              │
│                           │         │────────────────────│              │
│                           │         │ create()           │              │
│                           │         │ addHabit()         │              │
│                           │         │ removeHabit()      │              │
│                           │         │ delete()           │              │
│                           │         └─────────┬──────────┘              │
│                           │                   │ 1                       │
│                           │                   │                         │
│                           │                   │ *                       │
│                           │         ┌─────────┴──────────┐              │
│                           │         │ HabitGroupItem     │              │
│                           │         │────────────────────│              │
│                           │         │ id: UUID           │              │
│                           │         │ group_id: UUID     │              │
│                           │         │ habit_id: UUID     │              │
│                           │         │ sort_order: int    │              │
│                           │         └────────────────────┘              │
│                           │                                             │
│                           │         ┌────────────────────┐              │
│                           │         │      Badge        │              │
│                           │         │────────────────────│              │
│                           │         │ id: UUID           │              │
│                           │         │ name: string       │              │
│                           │         │ description: string│              │
│                           │         │ icon: string       │              │
│                           │         │ requirement_type   │              │
│                           │         │ requirement_value  │              │
│                           │         │────────────────────│              │
│                           │         │ checkEligibility() │              │
│                           │         └─────────┬──────────┘              │
│                           │                   │ 1                       │
│                           │                   │                         │
│                           │                   │ *                       │
│                           │         ┌─────────┴──────────┐              │
│                           │         │   UserBadge       │              │
│                           │         │────────────────────│              │
│                           │         │ id: UUID           │              │
│                           │         │ user_id: UUID      │              │
│                           │         │ badge_id: UUID     │              │
│                           │         │ earned_at: Date    │              │
│                           │         └────────────────────┘              │
│                                                                         │
│  ┌────────────────────┐                                                 │
│  │  StreakCalculator  │                                                 │
│  │────────────────────│                                                 │
│  │ calculateStreak()  │                                                 │
│  │ generateHeatmap()  │                                                 │
│  │ calculateStrength()│                                                 │
│  │ calculateRate()    │                                                 │
│  └────────────────────┘                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Class Attributes and Methods Detail

**User Class:**
| Attribute | Type | Visibility | Description |
|-----------|------|------------|-------------|
| id | UUID | private | Unique identifier |
| email | string | private | User's email address |
| full_name | string | private | User's display name |
| created_at | Date | private | Account creation timestamp |

| Method | Return Type | Visibility | Description |
|--------|-------------|------------|-------------|
| register(email, password) | Promise\<User\> | public | Create new account |
| login(email, password) | Promise\<Session\> | public | Authenticate user |
| logout() | Promise\<void\> | public | End session |

**Habit Class:**
| Attribute | Type | Visibility | Description |
|-----------|------|------------|-------------|
| id | UUID | private | Unique identifier |
| user_id | UUID | private | Owner reference |
| name | string | private | Habit name |
| description | string | private | Optional description |
| habit_type | enum | private | positive \| negative \| target_count |
| target_value | int | private | Numeric goal (for target_count) |
| target_unit | string | private | Unit label (e.g., "glasses") |
| frequency | enum | private | daily \| weekly \| custom |
| days_of_week | int[] | private | [0,2,4] for Mon/Wed/Fri |
| category | string | private | Habit category |
| color | string | private | Hex color code |
| is_active | boolean | private | Soft delete flag |
| created_at | Date | private | Creation timestamp |

| Method | Return Type | Visibility | Description |
|--------|-------------|------------|-------------|
| create(data) | Promise\<Habit\> | public | Insert new habit |
| update(data) | Promise\<Habit\> | public | Modify habit |
| delete() | Promise\<void\> | public | Soft-delete habit |
| checkin(date, count?, note?) | Promise\<HabitLog\> | public | Log completion |
| undoCheckin(date) | Promise\<void\> | public | Remove today's log |

---

## 3. UML Sequence Diagrams

### 3.1 User Registration Sequence

```
User          Browser         Next.js         Supabase Auth    PostgreSQL
 │               │               │               │               │
 │──register────►│               │               │               │
 │               │──POST /signup─►│               │               │
 │               │               │──signUp()────►│               │
 │               │               │               │──INSERT──────►│
 │               │               │               │◄───OK────────│
 │               │               │◄─session──────│               │
 │               │               │               │               │
 │               │               │──create session──────────────►│
 │               │               │◄─JWT tokens──────────────────│
 │               │               │               │               │
 │               │◄─redirect /dashboard──────────│               │
 │◄──dashboard───│               │               │               │
 │               │               │               │               │
```

### 3.2 Habit Check-in Sequence

```
User          Browser         Next.js         Supabase         PostgreSQL
 │               │               │               │               │
 │──click Mark──►│               │               │               │
 │   Done        │               │               │               │
 │               │──toggleCheckin►               │               │
 │               │               │──upsert()────►│               │
 │               │               │               │──UPSERT──────►│
 │               │               │               │  (habit_logs) │
 │               │               │               │◄───OK────────│
 │               │               │◄─log record───│               │
 │               │               │               │               │
 │               │               │──recalculate streak           │
 │               │               │  (streaks.ts) │               │
 │               │               │               │               │
 │               │◄─update UI────│               │               │
 │◄──show done───│               │               │               │
 │               │               │               │               │
```

### 3.3 Analytics Data Load Sequence

```
User          Browser         Next.js         Supabase         PostgreSQL
 │               │               │               │               │
 │──click───────►│               │               │               │
 │   Analytics   │               │               │               │
 │               │──navigate────►│               │               │
 │               │  /analytics   │               │               │
 │               │               │               │               │
 │               │──useEffect───►│               │               │
 │               │               │──getUser()───►│               │
 │               │               │◄─user────────│               │
 │               │               │               │               │
 │               │               │──Promise.all([               │
 │               │               │  select habits,              │
 │               │               │  select logs                 │
 │               │               │ ])──────────►│               │
 │               │               │               │──SELECT──────►│
 │               │               │               │◄─rows────────│
 │               │               │               │               │
 │               │               │◄─{habits, logs}              │
 │               │               │               │               │
 │               │               │──useMemo: calculate          │
 │               │               │  streaks, charts,            │
 │               │               │  heatmap                     │
 │               │               │               │               │
 │               │◄─render charts│               │               │
 │◄──analytics───│               │               │               │
 │   page        │               │               │               │
```

### 3.4 Create Habit Sequence

```
User          Browser         Next.js         Supabase         PostgreSQL
 │               │               │               │               │
 │──click New───►│               │               │               │
 │   Habit       │               │               │               │
 │               │──navigate────►│               │               │
 │               │  /habits/new  │               │               │
 │               │               │               │               │
 │──fill form───►│               │               │               │
 │               │               │               │               │
 │──click────────►               │               │               │
 │   Create      │               │               │               │
 │               │──handleSubmit►│               │               │
 │               │               │──insert()────►│               │
 │               │               │               │──INSERT──────►│
 │               │               │               │  (habits)     │
 │               │               │               │◄─new row─────│
 │               │               │◄─habit record─│               │
 │               │               │               │               │
 │               │               │──router.push()│               │
 │               │               │  /dashboard   │               │
 │               │               │               │               │
 │               │◄─redirect─────│               │               │
 │◄──dashboard───│               │               │               │
 │   (new habit  │               │               │               │
 │    visible)   │               │               │               │
```

---

## 4. UML Activity Diagrams

### 4.1 User Authentication Activity Diagram

```
                    ┌─────────┐
                    │  Start  │
                    └────┬────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Landing Page │
                 └───────┬───────┘
                         │
                    ┌────┴────┐
                    │  Login  │
                    │  or     │
                    │  Signup?│
                    └────┬────┘
                    ┌────┴────┐
                    │         │
                    ▼         ▼
              ┌─────────┐ ┌─────────┐
              │  Login  │ │  Signup │
              │  Page   │ │  Page   │
              └────┬────┘ └────┬────┘
                   │           │
              ┌────┴────┐ ┌────┴────┐
              │ Email/  │ │ Email/  │
              │ Google? │ │ Google? │
              └────┬────┘ └────┬────┘
              ┌────┴────┐ ┌────┴────┐
              │         │ │         │
              ▼         ▼ ▼         ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │ Email  │ │ Google │ │ Email  │ │ Google │
         │ Login  │ │ OAuth  │ │ Signup │ │ OAuth  │
         └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
             │          │          │          │
             └──────┬───┘          └────┬─────┘
                    │                   │
                    ▼                   ▼
              ┌─────────────────────────────┐
              │   Supabase Auth validates   │
              └─────────────┬───────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
              ┌──────────┐  ┌──────────┐
              │ Success  │  │  Failed  │
              └────┬─────┘  └────┬─────┘
                   │             │
                   ▼             ▼
            ┌────────────┐ ┌──────────┐
            │ Dashboard  │ │  Error   │
            │            │ │  Message │
            └────────────┘ └──────────┘
```

### 4.2 Habit Check-in Activity Diagram

```
                    ┌─────────┐
                    │  Start  │
                    └────┬────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ View Dashboard│
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Select Habit  │
                 │   Card        │
                 └───────┬───────┘
                         │
                    ┌────┴────┐
                    │  Habit  │
                    │  Type?  │
                    └────┬────┘
               ┌────────┼────────┐
               │        │        │
               ▼        ▼        ▼
         ┌──────────┐ ┌──────┐ ┌──────────┐
         │ Positive │ │Target│ │ Negative │
         │ /Standard│ │Count │ │          │
         └────┬─────┘ └──┬───┘ └────┬─────┘
              │          │          │
              ▼          ▼          ▼
         ┌──────────┐ ┌──────┐ ┌──────────┐
         │  Click   │ │Click │ │  Click   │
         │ Mark Done│ │ +/-  │ │ Mark     │
         │  Button  │ │Button│ │ Resisted │
         └────┬─────┘ └──┬───┘ └────┬─────┘
              │          │          │
              └──────────┼──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Already checked    │
              │  in today?          │
              └──────────┬──────────┘
                    ┌────┴────┐
                    │         │
                    ▼         ▼
              ┌────────┐ ┌────────┐
              │  Yes   │ │  No    │
              │(Undo)  │ │(Create)│
              └───┬────┘ └───┬────┘
                  │          │
                  ▼          ▼
         ┌────────────┐ ┌────────────┐
         │   DELETE   │ │   INSERT   │
         │  habit_log │ │  habit_log │
         └─────┬──────┘ └─────┬──────┘
               │              │
               └──────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  Recalculate  │
              │    Streak     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  Update UI    │
              │  (show done)  │
              └───────────────┘
```

### 4.3 Analytics Generation Activity Diagram

```
                    ┌─────────┐
                    │  Start  │
                    └────┬────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Navigate to   │
                 │  /analytics   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Get current  │
                 │  user session │
                 └───────┬───────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Parallel fetch:    │
              │  - habits (SELECT)  │
              │  - logs (SELECT)    │
              └──────────┬──────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Any habits?  │
                 └───────┬───────┘
                    ┌────┴────┐
                    │         │
                    ▼         ▼
              ┌────────┐ ┌────────────┐
              │  Yes   │ │     No     │
              │        │ │            │
              └───┬────┘ └─────┬──────┘
                  │            │
                  ▼            ▼
         ┌──────────────┐ ┌──────────────┐
         │ For each     │ │ Show empty   │
         │ habit:       │ │ state with   │
         │ - calc streak│ │ "Create      │
         │ - calc rate  │ │  Habit" CTA  │
         │ - calc str.  │ └──────────────┘
         │ - gen heatmap│
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Aggregate:   │
         │ - weekly bar │
         │ - monthly    │
         │ - pie chart  │
         │ - heatmap    │
         │ - stats cards│
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Render page  │
         │ with all     │
         │ charts       │
         └──────────────┘
```

---

## 5. Entity Relationship Diagram (ERD)

### 5.1 Complete ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HabitForge ER Diagram                             │
│                                                                             │
│  ┌──────────────────┐         1      *    ┌──────────────────┐             │
│  │   auth.users     │─────────────────────│     habits       │             │
│  │──────────────────│                     │──────────────────│             │
│  │ *id: UUID (PK)   │                     │ *id: UUID (PK)   │             │
│  │  email: VARCHAR  │                     │  user_id: UUID(FK)│            │
│  │  password: HASH  │                     │  name: VARCHAR   │             │
│  │  created_at: TZ  │                     │  description: TEXT│             │
│  └──────────────────┘                     │  habit_type: ENUM│             │
│         │                                  │  target_value: INT│            │
│         │ 1                                │  target_unit: VAR│             │
│         │                                  │  frequency: ENUM │             │
│         │ *                                │  days_of_week: []│             │
│         │                                  │  category: VARCHAR│            │
│  ┌──────────────────┐                     │  color: VARCHAR  │             │
│  │  habit_groups    │                     │  is_active: BOOL │             │
│  │──────────────────│                     │  created_at: TZ  │             │
│  │ *id: UUID (PK)   │                     └────────┬─────────┘             │
│  │  user_id: UUID(FK)│                            │                        │
│  │  name: VARCHAR   │                            │ 1                      │
│  │  description: TEXT│                            │                        │
│  │  color: VARCHAR  │                            │ *                      │
│  │  created_at: TZ  │                     ┌──────┴───────────┐             │
│  └────────┬─────────┘                     │   habit_logs     │             │
│           │ 1                             │──────────────────│             │
│           │                               │ *id: UUID (PK)   │             │
│           │ *                             │  habit_id: UUID  │             │
│           │                               │  user_id: UUID   │             │
│  ┌────────┴──────────┐                    │  completed_date  │             │
│  │ habit_group_items │                    │  count_value: INT│             │
│  │───────────────────│                    │  note: TEXT      │             │
│  │ *id: UUID (PK)    │                    │  created_at: TZ  │             │
│  │  group_id: UUID   │                    │  UNIQUE(habit_id,│             │
│  │  habit_id: UUID   │                    │   completed_date)│             │
│  │  sort_order: INT  │                    └──────────────────┘             │
│  └───────────────────┘                                                     │
│                                                                             │
│         ┌──────────────────┐         1      *    ┌──────────────────┐      │
│         │     badges       │─────────────────────│   user_badges    │      │
│         │──────────────────│                     │──────────────────│      │
│         │ *id: UUID (PK)   │                     │ *id: UUID (PK)   │      │
│         │  name: VARCHAR   │                     │  user_id: UUID   │      │
│         │  description: TEXT│                     │  badge_id: UUID  │      │
│         │  icon: VARCHAR   │                     │  earned_at: TZ   │      │
│         │  requirement_type│                     │  UNIQUE(user_id, │      │
│         │  requirement_val │                     │   badge_id)      │      │
│         └──────────────────┘                     └──────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Relationship Details

| # | Parent Table | Child Table | Relationship | Cardinality | FK Column | Constraint |
|---|-------------|-------------|-------------|-------------|-----------|------------|
| 1 | auth.users | habits | User owns habits | 1:N | habits.user_id | ON DELETE CASCADE |
| 2 | habits | habit_logs | Habit has logs | 1:N | habit_logs.habit_id | ON DELETE CASCADE |
| 3 | auth.users | habit_groups | User owns groups | 1:N | habit_groups.user_id | ON DELETE CASCADE |
| 4 | habit_groups | habit_group_items | Group has items | 1:N | habit_group_items.group_id | ON DELETE CASCADE |
| 5 | habits | habit_group_items | Habit in groups | 1:N | habit_group_items.habit_id | ON DELETE CASCADE |
| 6 | badges | user_badges | Badge earned by users | 1:N | user_badges.badge_id | ON DELETE CASCADE |
| 7 | auth.users | user_badges | User earns badges | 1:N | user_badges.user_id | ON DELETE CASCADE |
| 8 | auth.users | habit_logs | User creates logs | 1:N | habit_logs.user_id | ON DELETE CASCADE |

### 5.3 Key Constraints Summary

| Constraint Type | Table | Details |
|----------------|-------|---------|
| PRIMARY KEY | All tables | `id` UUID with `uuid_generate_v4()` default |
| FOREIGN KEY | habits, logs, groups, items, user_badges | All with `ON DELETE CASCADE` |
| UNIQUE | habit_logs | `(habit_id, completed_date)` — one log per habit per day |
| UNIQUE | user_badges | `(user_id, badge_id)` — one earn per user per badge |
| CHECK | habits | `habit_type IN ('positive', 'negative', 'target_count')` |
| CHECK | habits | `frequency IN ('daily', 'weekly', 'custom')` |
| CHECK | badges | `requirement_type IN ('streak', 'total_completions')` |
| NOT NULL | habits | `user_id`, `name` |
| NOT NULL | habit_logs | `habit_id`, `user_id`, `completed_date` |
| DEFAULT | habits | `is_active = true`, `color = '#3B82F6'` |
| DEFAULT | all tables | `created_at = NOW()` |

---

## 6. Data Flow Diagrams (DFD)

### 6.1 Context Diagram (Level 0)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Context Diagram (Level 0)                           │
│                                                                             │
│                                                                             │
│    ┌──────────┐    Login Credentials    ┌──────────────────────────────┐    │
│    │          │────────────────────────►│                              │    │
│    │          │    Habit Data           │                              │    │
│    │          │────────────────────────►│                              │    │
│    │          │    Check-in Actions     │                              │    │
│    │  User    │────────────────────────►│      HabitForge System       │    │
│    │          │                         │                              │    │
│    │          │◄────────────────────────│                              │    │
│    │          │    Dashboard UI         │                              │    │
│    │          │◄────────────────────────│                              │    │
│    │          │    Analytics Charts     │                              │    │
│    │          │◄────────────────────────│                              │    │
│    │          │    Badge Status         │                              │    │
│    └──────────┘                         └──────────────┬───────────────┘    │
│                                                        │                    │
│                    ┌───────────────┐                   │                    │
│                    │  Google OAuth │◄──────────────────┤                    │
│                    │  (External)   │───────────────────┘                    │
│                    └───────────────┘    OAuth Token                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**External Entities:**
1. **User** — Primary actor who interacts with the system via web browser
2. **Google OAuth** — External authentication provider

**Data Flows (User ↔ System):**
- Login Credentials → System
- Habit Data (create/edit/delete) → System
- Check-in Actions → System
- Dashboard UI ← System
- Analytics Charts ← System
- Badge Status ← System

**Data Flows (System ↔ Google OAuth):**
- OAuth Request → Google OAuth
- OAuth Token ← Google OAuth

### 6.2 Level 1 DFD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Level 1 DFD                                      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │          │──login creds──►┌──────────────┐                               │
│  │          │               │  P1: Auth    │──session──►┌──────────────┐   │
│  │          │               │  Service     │            │  D1: User    │   │
│  │          │               └──────┬───────┘            │  Session     │   │
│  │          │                      │                     └──────────────┘   │
│  │          │                      │                                        │
│  │          │──habit data──►┌──────┴───────┐                               │
│  │          │               │  P2: Habit   │──CRUD──►┌──────────────┐     │
│  │          │               │  Service     │         │  D2: Habits  │     │
│  │          │               └──────┬───────┘         │  Store       │     │
│  │  User    │                      │                  └──────────────┘     │
│  │          │                      │                                        │
│  │          │──check-in────►┌──────┴───────┐                               │
│  │          │               │  P3: Checkin │──log───►┌──────────────┐     │
│  │          │               │  Service     │         │  D3: Habit   │     │
│  │          │               └──────┬───────┘         │  Logs Store  │     │
│  │          │                      │                  └──────────────┘     │
│  │          │                      │                                        │
│  │          │──analytics──►┌──────┴───────┐                               │
│  │          │   request    │  P4:Analytics│──read──►┌──────────────┐     │
│  │          │              │  Engine      │         │  D4: Badges  │     │
│  │          │              └──────┬───────┘         │  Store       │     │
│  │          │                     │                  └──────────────┘     │
│  │          │◄──charts & stats───┘                                        │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Processes:**
| ID | Process | Description | Input | Output |
|----|---------|-------------|-------|--------|
| P1 | Auth Service | Registration, login, session management | Login credentials, OAuth token | Session, user data |
| P2 | Habit Service | CRUD for habits and groups | Habit data (create/edit/delete) | Habit records |
| P3 | Check-in Service | Daily logging, streak calculation | Check-in actions | Log records |
| P4 | Analytics Engine | Chart generation, statistics | Analytics request | Charts, stats, heatmaps |

**Data Stores:**
| ID | Store | Tables | Description |
|----|-------|--------|-------------|
| D1 | User Session | auth.users (managed) | User authentication data |
| D2 | Habits Store | habits, habit_groups, habit_group_items | Habit definitions and groupings |
| D3 | Habit Logs Store | habit_logs | Daily completion records |
| D4 | Badges Store | badges, user_badges | Badge definitions and earned badges |

### 6.3 Level 2 DFD — P2: Habit Service (Decomposed)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Level 2 DFD — P2: Habit Service                          │
│                                                                             │
│  ┌──────────┐                                                               │
│  │          │──create habit──►┌──────────────────┐                          │
│  │          │                │ P2.1: Create     │──INSERT──►┌───────────┐ │
│  │          │                │ Habit            │           │ D2: Habits│ │
│  │          │                └──────────────────┘           │ Store     │ │
│  │          │                                               └───────────┘ │
│  │          │──edit habit───►┌──────────────────┐                          │
│  │          │                │ P2.2: Update     │──UPDATE──►┌───────────┐ │
│  │          │                │ Habit            │           │ D2: Habits│ │
│  │          │                └──────────────────┘           │ Store     │ │
│  │  User    │                                               └───────────┘ │
│  │          │──delete habit─►┌──────────────────┐                          │
│  │          │                │ P2.3: Soft-      │──UPDATE──►┌───────────┐ │
│  │          │                │ Delete Habit     │ (is_active│ D2: Habits│ │
│  │          │                │                  │  =false)  │ Store     │ │
│  │          │                └──────────────────┘           └───────────┘ │
│  │          │                                                               │
│  │          │──view habits──►┌──────────────────┐                          │
│  │          │                │ P2.4: List       │──SELECT──►┌───────────┐ │
│  │          │                │ Habits           │           │ D2: Habits│ │
│  │          │                └────────┬─────────┘           │ Store     │ │
│  │          │                         │                      └───────────┘ │
│  │          │◄──habit cards───────────┘                                    │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Level 2 DFD — P4: Analytics Engine (Decomposed)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  Level 2 DFD — P4: Analytics Engine                         │
│                                                                             │
│  ┌──────────┐                                                               │
│  │          │──analytics──►┌──────────────────┐                              │
│  │          │   request    │ P4.1: Fetch Data │──SELECT──►┌───────────┐    │
│  │          │              │                  │           │ D2: Habits│    │
│  │          │              │                  │──SELECT──►│ D3: Logs  │    │
│  │          │              └────────┬─────────┘           └───────────┘    │
│  │          │                       │                                       │
│  │          │                       ▼                                       │
│  │          │              ┌──────────────────┐                              │
│  │          │              │ P4.2: Calculate  │                              │
│  │          │              │ Streaks & Rates  │                              │
│  │          │              └────────┬─────────┘                              │
│  │  User    │                       │                                       │
│  │          │                       ▼                                       │
│  │          │              ┌──────────────────┐                              │
│  │          │              │ P4.3: Generate   │                              │
│  │          │              │ Chart Data       │                              │
│  │          │              │ (bar, pie, area) │                              │
│  │          │              └────────┬─────────┘                              │
│  │          │                       │                                       │
│  │          │                       ▼                                       │
│  │          │              ┌──────────────────┐                              │
│  │          │              │ P4.4: Generate   │                              │
│  │          │              │ Heatmap Data     │                              │
│  │          │              └────────┬─────────┘                              │
│  │          │                       │                                       │
│  │          │◄──analytics page──────┘                                       │
│  │          │   (charts + heatmap + stats)                                  │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-21 | Vyanko AI LLP | Initial design document with UML, ERD, DFD |

---

*End of Design Documents*
