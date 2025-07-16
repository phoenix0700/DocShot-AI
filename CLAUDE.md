# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start all apps in development mode (web on :3000, worker with health check on :3001)
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint across the monorepo
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `docker-compose up -d` - Start local services (Redis, MinIO)

### Testing
- No test framework is currently configured. When implementing tests, use Vitest for unit tests and Playwright for E2E tests.

### Database
- `supabase db push` - Apply migrations to production
- `supabase db push --local` - Apply migrations to local database
- Migrations are in `supabase/migrations/`

## Architecture

### Monorepo Structure
This is a Turborepo monorepo with three main workspaces:

**Apps:**
- `apps/web` - Next.js 14 frontend with App Router, Clerk auth, Tailwind CSS
- `apps/worker` - Node.js background job processor using BullMQ

**Packages:**
- `packages/shared` - Core business logic, schemas (Zod), queue management, storage abstraction
- `packages/database` - Supabase client and TypeScript types
- `packages/integrations` - External service integrations (GitHub, Notion)

### Key Technologies
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Clerk
- **Backend**: Node.js, BullMQ, Puppeteer, Redis
- **Database**: Supabase (PostgreSQL with RLS)
- **Storage**: S3-compatible (MinIO locally, AWS S3/Cloudflare R2 in production)

### Data Flow
1. User configures screenshots via YAML in web app
2. Configuration saved to Supabase with RLS
3. Web app queues jobs to Redis via BullMQ
4. Worker processes jobs (screenshot capture, diff detection, notifications)
5. Results stored in S3, metadata in Supabase
6. Integrations push to GitHub, send emails, etc.

### Authentication & Security
- Clerk handles user authentication
- Supabase RLS policies enforce data isolation by user
- All API keys in environment variables
- Worker authenticates to Supabase with service role key

### Job Processing
Three main job types:
- `screenshot` - Captures screenshots using Puppeteer
- `diff` - Compares images for visual changes
- `notification` - Sends email/Slack notifications

Jobs are processed with configurable concurrency and include retry logic.

## Important Patterns

### Database Access
Always use the Supabase client from `@docshot/database`:
```typescript
import { supabase } from '@docshot/database';
```

### Queue Management
Use the shared queue manager for consistency:
```typescript
import { createQueueManager } from '@docshot/shared';
const queueManager = createQueueManager();
```

### Type Safety
- All API data validated with Zod schemas in `packages/shared/src/schemas.ts`
- Database types generated in `packages/database/src/types.ts`
- Always parse external data through schemas

### Error Handling
- Log errors with context using the logger service
- Non-critical failures (e.g., GitHub upload) shouldn't fail the entire job
- Implement proper cleanup in job processors

### Component Structure
- Use client components (`'use client'`) only when necessary
- Prefer server components for data fetching
- Shared UI components in `apps/web/components/ui/`