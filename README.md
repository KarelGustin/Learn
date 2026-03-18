# RoboLearn — Local-First Adaptive Robotics Learning Platform

A personal learning OS designed to take one highly motivated beginner from zero to robotics engineer and founder over 24 months through structured daily learning across software, electrical, mechanical, ML, RL, robotics systems, controls, simulation, and founder thinking.

## Quick Start

```bash
# Install dependencies
npm install

# Initialize database and seed curriculum
npm run setup

# Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access your dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | SQLite (via Prisma) |
| ORM | Prisma 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Content | Markdown + KaTeX (math) |
| Icons | Lucide React |
| State | Zustand |

## Features

### Core Learning System
- **9 learning domains**: Software, EE, ME, ML, RL, Robotics, Controls, Simulation, Founder
- **29 tracks** across all domains with structured progression
- **Lesson player** with markdown content, syntax highlighting, and math rendering
- **Interactive exercises**: multiple choice, true/false, short answer, code challenges
- **Projects** with milestone tracking

### Adaptive Engine
- **Mastery tracking** (0-5 levels) per skill with Bayesian confidence
- **Spaced repetition** (SM-2 algorithm) for knowledge retention
- **Struggle detection** — identifies weak skills and suggests remediation
- **Acceleration logic** — skips ahead when you master concepts quickly
- **Daily planner** — generates adaptive daily plans based on your progress

### Analytics & Reflection
- **Skill graph** — visual map of all skills with mastery levels and dependencies
- **Analytics dashboard** — time invested, accuracy, streaks, domain distribution
- **Reflection journal** — structured daily reflections with mood tracking
- **Founder prompts** — weekly business/product thinking prompts (104 weeks)

### Design
- Dark mode engineering dashboard aesthetic
- Clean, premium UI with strong information hierarchy
- Responsive layout with persistent sidebar navigation

## Project Structure

```
prisma/
  schema.prisma          # Database schema (21 tables)
  seed/                  # Seed data with real robotics curriculum
src/
  app/                   # Next.js App Router pages
    dashboard/           # Main mission control dashboard
    curriculum/          # Curriculum map and drill-down
    learn/[lessonId]/    # Lesson player
    skills/              # Skill dependency graph
    projects/            # Project hub
    review/              # Spaced repetition center
    journal/             # Reflection journal
    analytics/           # Progress analytics
    founder/             # Founder thinking prompts
    settings/            # User preferences
    api/                 # API routes for mutations
  components/            # Reusable UI components
  engine/                # Pure-function adaptive algorithms
    mastery.ts           # Mastery calculation
    spaced-repetition.ts # SM-2 algorithm
    daily-planner.ts     # Adaptive plan generation
    struggle-detector.ts # Weak skill detection
    prerequisite.ts      # Skill dependency graph traversal
    scoring.ts           # Performance scoring heuristics
  services/              # Database access layer
  lib/                   # Utilities, DB client
  types/                 # Shared TypeScript types
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run setup        # Initialize DB + seed data
npm run db:push      # Push schema to database
npm run db:seed      # Run seed script
npm run db:studio    # Open Prisma Studio (DB browser)
```

## Data & Backup

Your entire learning history is stored in `prisma/learn.db`. To back up, simply copy this file. The database is portable — move it to any machine with the same app installed.

## AI Integration (Future)

The app includes an `AIService` interface (`src/services/ai-service.ts`) with stub implementations. To add AI-powered features:

1. Implement the `AIService` interface with your preferred provider (Ollama, Claude, OpenAI)
2. Replace the `StubAIService` singleton
3. AI can power: hint generation, concept explanations, reflection analysis, learning path refinement

## Curriculum Coverage (2-Year Path)

**Year 1: Foundations**
- Python, Linux, Git, C++
- Math (linear algebra, calculus)
- Circuit fundamentals, sensors, motors
- Embedded systems, microcontrollers
- ROS2 basics, simulation
- First control systems and projects

**Year 2: Advanced Robotics**
- Kinematics, dynamics, motion planning
- Computer vision, ML, deep learning
- Reinforcement learning, sim-to-real
- Full-stack robotics integration
- Founder/product thinking
- Capstone robotics MVP
