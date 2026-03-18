# RoboLearn

A local-first adaptive learning platform. 2-year structured path from beginner to robotics engineer and founder, covering software, EE, ME, ML, RL, controls, simulation, and product thinking.

## Setup

Prerequisites: Node.js 20+

```bash
npm install
npm run setup    # creates SQLite database + seeds curriculum
npm run dev      # http://localhost:3000
```

That's it. No database server, no cloud services, no accounts.

## What It Does

**Adaptive daily learning** across 9 robotics engineering domains. The engine tracks mastery per skill (0-5), detects struggles, schedules spaced repetition reviews, and generates a personalized daily plan that balances new material, weak-area repair, project work, and reflection.

### Core Systems

| System | What it does |
|--------|-------------|
| Mastery Engine | Bayesian confidence tracking per skill with difficulty-weighted scoring, velocity tracking, and time decay |
| Spaced Repetition | SM-2 with leech detection and reset counting. Items that repeatedly fail get flagged |
| Struggle Detector | Flags skills with consecutive failures, low confidence, or stalled progress. Feeds remediation into daily plans |
| Daily Planner | Allocates time across overdue reviews, new lessons, struggle repairs, project milestones, and reflection |
| Prerequisite Graph | DAG of skill dependencies with topological ordering and remediation path traversal |

### Pages

| Page | Purpose |
|------|---------|
| `/dashboard` | Today's mission: streak, stats, next lesson, domain progress, struggle alerts |
| `/curriculum` | Full curriculum map — 9 domains, 29 tracks, 20 modules, drill-down navigation |
| `/learn/[id]` | Lesson player — markdown with math (KaTeX), syntax highlighting, interactive exercises |
| `/skills` | All 45 skills grouped by domain with mastery levels and dependency counts |
| `/projects` | 6 projects with milestone checklists and progress bars |
| `/review` | Spaced repetition session — flashcard UI with 0-5 grading |
| `/journal` | Structured daily reflections — mood, wins, struggles, key insights |
| `/analytics` | Charts: weekly study time, lessons/reviews per week, domain mastery bars |
| `/founder` | 104 weekly prompts connecting technical learning to startup thinking |
| `/settings` | Display name, daily goal, database info |

## Tech Stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **SQLite** via Prisma 5 — single-file database, zero config
- **Tailwind CSS** + shadcn/ui — dark mode, engineering dashboard aesthetic
- **Recharts** — weekly activity and progress charts
- **Zod** — input validation on all API routes
- **react-markdown** + KaTeX + rehype-highlight — lesson content rendering

## Architecture

```
prisma/
  schema.prisma              # 23 models, junction tables, proper indexes
  seed/                      # Real robotics curriculum (not placeholder data)
    index.ts                 # Orchestrator
    domains.ts               # 9 domains
    tracks.ts                # 29 tracks
    modules.ts               # 20 modules
    units.ts                 # 26 units
    lessons.ts               # 11 lessons with full markdown content
    exercises.ts             # 14 exercises with answers + explanations
    skills.ts                # 45 skills + 30 dependency edges + mastery records
    projects.ts              # 6 projects with milestones + skill junctions
    founder-prompts.ts       # 104 weekly prompts

src/
  engine/                    # Pure functions, no side effects, unit-testable
    mastery.ts               # Level calc, Bayesian confidence, velocity, remediation/acceleration signals
    spaced-repetition.ts     # SM-2 with leech detection
    daily-planner.ts         # Budget allocation across item types
    struggle-detector.ts     # Multi-signal struggle identification
    prerequisite.ts          # DAG operations: unlock check, remediation paths, topological sort
    scoring.ts               # Daily score, momentum, retention health

  services/                  # Database layer — reads/writes, calls engine functions
    curriculum.ts            # Domain/track/module/unit/lesson/project queries
    mastery.ts               # Attempt recording, mastery updates, struggle detection
    review.ts                # SM-2 grading, due items, review stats
    planner.ts               # Daily plan generation integrating all engines
    analytics.ts             # Streak tracking, aggregated metrics, weekly activity
    journal.ts               # Reflections, founder prompts, user settings
    ai-service.ts            # Interface + stub for future AI integration

  lib/
    db.ts                    # Prisma singleton
    utils.ts                 # cn(), date helpers, mastery labels
    validations.ts           # Zod schemas for all API inputs

  app/
    api/                     # 6 validated API routes
    dashboard/               # Mission control
    curriculum/              # Curriculum browser with dynamic domain pages
    learn/[lessonId]/        # Lesson player with exercise runner
    (+ skills, projects, review, journal, analytics, founder, settings)
    loading.tsx              # Skeleton loading state
    error.tsx                # Error boundary with recovery
    not-found.tsx            # 404 page
```

## Database Schema

23 models with proper relationships, indexes, and cascade deletes:

- **Curriculum**: Domain → Track → Module → Unit → Lesson → Exercise
- **Skills**: Skill ← SkillDependency (DAG), LessonSkill (junction), ProjectSkill (junction)
- **Progress**: MasteryRecord (per-skill), Attempt (per-exercise), Submission (per-lesson)
- **Review**: ReviewItem (SM-2 state + reset counter)
- **Planning**: DailyPlan → DailyPlanItem (with reason field explaining why each item was assigned)
- **Tracking**: StudySession (with domain relation), Streak
- **Reflection**: ReflectionEntry (with FounderPrompt relation), FounderPrompt

## Scripts

```bash
npm run dev          # Development server at localhost:3000
npm run build        # Production build
npm run setup        # Push schema + seed database
npm run db:push      # Push schema changes without seeding
npm run db:seed      # Seed data only
npm run db:studio    # Prisma Studio — visual database browser
```

## Backup

Everything lives in `prisma/learn.db`. Copy this file to back up your entire learning history.

## AI Integration

`src/services/ai-service.ts` defines an `AIService` interface with methods for concept explanation, hint generation, freeform answer assessment, next-step suggestion, and reflection analysis. The current implementation is a no-op stub. Swap in Ollama, Claude API, or OpenAI by implementing the interface — no other code changes needed.

## Curriculum

**Year 1**: Python, Linux, Git, C++, linear algebra, calculus, circuits, sensors, motors, microcontrollers, ROS2, simulation, first control systems, integrated projects.

**Year 2**: Kinematics, dynamics, motion planning, computer vision, PyTorch, reinforcement learning, sim-to-real, SLAM, system integration, founder thinking, capstone MVP.

9 domains. 29 tracks. 104 weeks of founder prompts. Content is seeded with real robotics engineering material — not lorem ipsum.
