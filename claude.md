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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
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