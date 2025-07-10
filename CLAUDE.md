# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

speed-riddle is a puzzle-solving speed competition website where users challenge puzzles, compete based on completion time, and can create their own puzzles. The project is currently in the specification phase with no code implementation yet.

## Technology Stack

### Frontend
- Next.js 14 (App Router) with TypeScript
- React 18 with Tailwind CSS + shadcn/ui
- Zustand for state management
- React Hook Form + Zod for form validation

### Backend
- Next.js API Routes
- NextAuth.js for authentication
- Cloudinary/AWS S3 for image storage
- PostgreSQL + Prisma ORM

### Infrastructure
- Vercel hosting
- Supabase/PlanetScale for database
- Redis (Upstash) for caching
- GitHub Actions for CI/CD

## Development Commands

Since the project hasn't been initialized yet, here are the commands to use once the Next.js project is set up:

```bash
# Project initialization (first time only)
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check

# Run tests
pnpm test
pnpm test:watch
pnpm test:e2e

# Database commands
pnpm prisma generate
pnpm prisma db push
pnpm prisma migrate dev
pnpm prisma studio
```

## Project Architecture

### Core Features

1. **Puzzle Challenge System** - Users solve puzzles with time tracking
   - Puzzle list view with thumbnails
   - Pre-start screen showing puzzle details
   - Solving screen with timer and progress tracking
   - Result screen with segment times
   - Ranking view for comparing scores

2. **Puzzle Creation System** - Users create and submit puzzles
   - Multiple image upload per puzzle
   - Multiple correct answers per question
   - Configurable answer input types

### Data Model Structure

Key entities and their relationships:
- **Puzzle**: Main puzzle container (title, description, thumbnail)
- **Question**: Individual questions within a puzzle (ordered)
- **Answer**: Correct and alternative answers for each question
- **Session**: User's attempt at solving a puzzle
- **SegmentTime**: Time spent on each question
- **Ranking**: Leaderboard entries for completed puzzles

### API Routes Structure

```
/api/puzzles                  - Puzzle CRUD operations
/api/puzzles/:id/questions    - Question management
/api/puzzles/:id/start        - Session initialization
/api/puzzles/:id/answer       - Answer submission
/api/puzzles/:id/complete     - Session completion
/api/puzzles/:id/ranking      - Ranking retrieval
```

### Performance Optimization Strategy

- Image optimization using Next.js Image component and WebP conversion
- Code splitting with dynamic imports
- Redis caching for API responses and rankings
- Database query optimization with proper indexing

## Development Workflow

1. Always check SPEC.md for detailed requirements before implementing features
2. Follow the established data model when creating database schemas
3. Implement API routes according to the specified endpoints
4. Use the designated technology stack for consistency
5. Prioritize the high-priority features (puzzle challenge and creation systems)

## Current Project Status

The project is in the specification phase. The next steps are:
1. Initialize the Next.js project with the specified configuration
2. Set up the development environment and tooling
3. Configure database schema based on the data model
4. Implement core features starting with the puzzle challenge system