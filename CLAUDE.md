# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start all apps in development mode (web on :3000, worker with health check on :3001)
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint across the monorepo
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without changing files
- `pnpm clean` - Clean build artifacts and caches
- `docker-compose up -d` - Start local services (Redis, MinIO)

### Testing & Validation
- `pnpm test` - Run all tests (currently no framework configured - use Vitest for unit tests and Playwright for E2E tests when implementing)
- `pnpm test:services` - Test production services connectivity
- `pnpm test:e2e` - Run end-to-end tests in production environment
- `pnpm validate:production` - Validate production setup and configuration

### Deployment
- `pnpm deploy:production` - Deploy to production (web to Vercel, worker to Railway)
- `pnpm setup:production` - Display production setup instructions

### Database
- `supabase db push` - Apply migrations to production
- `supabase db push --local` - Apply migrations to local database
- Migrations are in `supabase/migrations/`

### GitHub Integration
- GitHub MCP server is configured for automated repository operations
- Use `gh` CLI for GitHub operations when MCP is not available
- Auto-commit and push changes when requested by user
- Create PRs with proper titles and descriptions

## Architecture

### Monorepo Structure
This is a Turborepo monorepo with workspaces:

**Apps:**
- `apps/web` - Next.js 14 frontend with App Router, Clerk auth, Tailwind CSS
- `apps/worker` - Node.js background job processor using BullMQ (health check on :3001)

**Packages:**
- `packages/shared` - Core business logic, schemas (Zod), queue management, storage abstraction
- `packages/database` - Supabase client wrapper with multi-tenant support and TypeScript types

### Key Technologies
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Clerk
- **Backend**: Node.js, BullMQ, Puppeteer, Redis
- **Database**: Supabase (PostgreSQL with RLS for multi-tenancy)
- **Storage**: S3-compatible (MinIO locally, AWS S3/Cloudflare R2 in production)

### Multi-Tenant Database Architecture
- **Row Level Security (RLS)** enforces data isolation between users
- **Clerk integration** for authentication with user sync via webhooks
- **Key tables**: users, projects, screenshots, screenshot_history, notifications, api_keys
- **User context setting**: `set_config('app.current_user_id', 'clerk_user_123', true)` must be called on each database connection
- **Subscription tiers**: free (10 screenshots/month), pro, team with usage tracking

### Data Flow
1. User configures screenshots via YAML in web app
2. Configuration saved to Supabase with RLS enforcing user isolation
3. Web app queues jobs to Redis via BullMQ
4. Worker processes jobs (screenshot capture, diff detection, notifications)
5. Results stored in S3, metadata in Supabase
6. Integrations push to GitHub, send emails, etc.

### Job Processing
Three main job types with configurable concurrency:
- `screenshot` - Captures screenshots using Puppeteer
- `diff` - Compares images for visual changes using pixelmatch
- `notification` - Sends email/Slack notifications

Jobs include retry logic and proper error handling.

## Important Implementation Patterns

### Database Access
Always use the Supabase client from `@docshot/database` with user context:
```typescript
import { createSupabaseClient } from '@docshot/database';
const supabase = createSupabaseClient();
await supabase.setUserContext(clerkUserId);
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

## Environment Variables

### Required for Development
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Redis (Local: Docker, Production: Upstash)
REDIS_URL=redis://localhost:6380

# S3 Storage (Local: MinIO, Production: AWS S3/Cloudflare R2)
S3_BUCKET=docshot-screenshots
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1

# Worker Configuration
WORKER_HEALTH_PORT=3002
SCREENSHOT_CONCURRENCY=3
DIFF_CONCURRENCY=5
NOTIFICATION_CONCURRENCY=10
```

### Production Additional Variables
- `STRIPE_*` - Billing integration
- `SMTP_*` - Email notifications
- `GITHUB_*` - GitHub integration
- `NEXT_PUBLIC_APP_URL` - Application URL

## Key API Routes

### Screenshot Management
- `POST /api/screenshots/run` - Trigger screenshot capture
- `POST /api/screenshots/approve` - Approve screenshot changes

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user sync webhook

### Testing
- `GET /api/test-screenshot` - Test screenshot functionality

## GitHub Automation

### Repository Information
- **Owner**: phoenix0700
- **Repository**: DocShot-AI
- **Main Branch**: main
- **GitHub URL**: https://github.com/phoenix0700/DocShot-AI

### When to Use GitHub Operations
1. **Committing Changes**: When user asks to "push to GitHub" or "commit changes"
2. **Creating Pull Requests**: When implementing features that need review
3. **Issue Management**: When bugs are discovered or features are requested
4. **Release Management**: When deploying new versions

### GitHub Integration Commands
- `gh pr create --title "Title" --body "Description"` - Create pull request
- `gh issue create --title "Title" --body "Description"` - Create issue
- `gh release create v1.0.0 --title "Release" --notes "Notes"` - Create release
- `git push origin main` - Push changes to main branch

## Production Deployment

### Recommended Stack
- **Frontend**: Vercel (Next.js deployment)
- **Worker**: Railway (Node.js deployment with health checks)
- **Database**: Supabase (PostgreSQL with RLS)
- **Cache/Queue**: Upstash Redis (managed Redis)
- **Storage**: Cloudflare R2 (S3-compatible storage)

### Deployment Process
1. Run `pnpm validate:production` to check configuration
2. Deploy web app to Vercel with environment variables
3. Deploy worker to Railway with health check endpoint
4. Configure webhooks and integrations
5. Run `pnpm test:e2e` to verify end-to-end functionality

## Security Considerations

### Data Isolation
- Row Level Security (RLS) enforces user data isolation
- All queries automatically filtered by user context
- No accidental data leaks between tenants

### API Security
- All screenshot URLs must be validated
- Use signed URLs for storage access
- Implement rate limiting for API endpoints
- Store sensitive data encrypted

### Performance
- Limit concurrent Puppeteer instances to prevent memory issues
- Implement proper resource cleanup in job processors
- Use caching strategies for frequently accessed data
- Respect third-party API rate limits (GitHub: 5000/hr, Notion: 3/sec)

## Project Status

The DocShot AI SaaS platform is feature-complete with:
- ✅ Multi-tenant database architecture with RLS
- ✅ Clerk authentication system with webhook sync
- ✅ Project management UI with YAML configuration
- ✅ Screenshot capture engine with Puppeteer
- ✅ Visual diff detection with approval workflows
- ✅ Production deployment configurations
- ✅ Landing page with 3-tier pricing
- ✅ Enhanced dashboard with onboarding
- ✅ Screenshot history system with visual diff viewer

The system is ready for production deployment and user acquisition.