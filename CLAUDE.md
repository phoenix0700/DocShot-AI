# Project: DocShot AI

## Overview
DocShot AI is a SaaS tool that automatically captures and updates product screenshots in documentation, help centers, and release notes. It detects when UI changes occur and notifies teams to update stale screenshots with zero manual effort.

## Tech Stack
- Language: TypeScript (Node.js 20)
- Framework: Next.js 14 (App Router)
- Database: Supabase (PostgreSQL + Auth)
- Queue: BullMQ with Redis
- Key Libraries:
  - Puppeteer (headless browser automation)
  - Pixelmatch (visual diff detection)
  - Clerk (authentication)
  - Zod (schema validation)
  - Tailwind CSS (styling)

## Project Structure
```
docshot-ai/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Client utilities
│   └── worker/           # Background job processor
│       ├── jobs/         # Job definitions
│       └── lib/          # Worker utilities
├── packages/
│   ├── database/         # Supabase schema & migrations
│   ├── shared/           # Shared types & utilities
│   └── integrations/     # CMS integrations (GitHub, Notion, etc)
├── docker/               # Docker configs for local dev
└── .github/              # GitHub Actions
```

## Core Functionality
1. **Screenshot Capture**: Automated webpage screenshots using Puppeteer with configurable selectors
2. **Visual Diff Detection**: Compare screenshots to detect changes using pixel-based diffing
3. **Multi-CMS Integration**: Push updated screenshots to GitHub, Confluence, Notion via APIs
4. **Change Notifications**: Slack/email alerts when screenshots become stale
5. **YAML Configuration**: Simple manifest files for defining screenshot targets

## Development Guidelines

### Code Style
- Use 2 spaces for indentation
- Prefer const over let, never use var
- Use early returns to reduce nesting
- Max line length: 100 characters
- File naming: kebab-case for files, PascalCase for components
- Always use TypeScript strict mode

### Architecture Patterns
- Domain-driven design with clear separation of concerns
- Repository pattern for data access
- Queue-based architecture for screenshot jobs
- RESTful API design with tRPC for type safety
- Server components by default in Next.js

### Testing Strategy
- Unit tests for core business logic (visual diff, YAML parsing)
- Integration tests for CMS integrations
- E2E tests for critical user flows (onboarding, screenshot approval)
- Test file naming: `*.test.ts` or `*.spec.ts`
- Minimum 80% code coverage for core modules

## Current Status
- ✅ Completed: Project setup, basic architecture planning
- 🚧 In Progress: MVP implementation
- 📋 TODO: 
  - Core screenshot capture engine
  - Visual diff algorithm
  - Basic web UI
  - GitHub integration
  - Authentication setup

## Common Tasks
- To run locally: `pnpm dev` (starts both web and worker)
- To run tests: `pnpm test`
- To add a new integration: Add to `packages/integrations/`
- To modify DB schema: Edit `packages/database/schema.sql` then run migrations
- To add a new job type: Create in `apps/worker/jobs/`

## Important Notes
- **Security**: All screenshot URLs must be validated; use signed URLs for storage
- **Performance**: Limit concurrent Puppeteer instances to prevent memory issues
- **Privacy**: Implement PII detection/masking for sensitive screenshots
- **Rate Limiting**: Respect third-party API limits (GitHub: 5000/hr, Notion: 3/sec)
- **Storage**: Use S3-compatible storage with lifecycle policies for old screenshots
- **Pricing**: Keep infrastructure costs below $0.001 per screenshot to maintain margins

## Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL= https://wncjpuvhoulrgiwngdxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduY2pwdXZob3Vscmdpd25nZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTI5ODQsImV4cCI6MjA2ODIyODk4NH0.HLRuaHkH6k3MkFTpUFx6597AJ3q3iR8929LdDQJ1bpg
SUPABASE_SERVICE_KEY=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Redis (for BullMQ)
REDIS_URL=

# S3 Storage
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Integrations
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
NOTION_API_KEY=
```





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

### GitHub Integration
- GitHub MCP server is configured for automated repository operations
- Use `gh` CLI for GitHub operations when MCP is not available
- Auto-commit and push changes when requested by user
- Create PRs with proper titles and descriptions
- See `docs/GITHUB_INTEGRATION.md` for complete setup instructions

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

## GitHub Automation Workflows

### When Claude Code should automatically use GitHub:
1. **Committing Changes**: When user asks to "push to GitHub" or "commit changes"
2. **Creating Pull Requests**: When implementing features that need review
3. **Issue Management**: When bugs are discovered or features are requested
4. **Release Management**: When deploying new versions
5. **Documentation Updates**: When project documentation changes

### Automated GitHub Operations:
- **Auto-commit**: Stage all changes, create descriptive commit messages, push to origin
- **PR Creation**: Create feature branches, implement changes, create PR with proper description
- **Issue Tracking**: Create issues for bugs, link PRs to issues, update issue status
- **Release Notes**: Generate changelogs, create GitHub releases with proper tags

### GitHub Integration Commands:
- `gh pr create --title "Title" --body "Description"` - Create pull request
- `gh issue create --title "Title" --body "Description"` - Create issue
- `gh release create v1.0.0 --title "Release" --notes "Notes"` - Create release
- `git push origin main` - Push changes to main branch

### Repository Information:
- **Owner**: phoenix0700
- **Repository**: DocShot-AI
- **Main Branch**: main
- **GitHub URL**: https://github.com/phoenix0700/DocShot-AI

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