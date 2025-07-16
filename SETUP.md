# DocShot AI - Development Setup

## Prerequisites

- Node.js 20+ and pnpm 9+
- Docker and Docker Compose
- Supabase CLI
- Git

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd DocShot\ AI
   pnpm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Start local services:**
   ```bash
   docker-compose up -d
   ```

4. **Setup Supabase (for local development):**
   ```bash
   npx supabase start
   npx supabase db reset
   ```

5. **Start development servers:**
   ```bash
   pnpm dev
   ```

## Environment Variables Setup

### Required for Development

1. **Clerk Auth** (get from [clerk.com](https://clerk.com)):
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

2. **Supabase** (get from [supabase.com](https://supabase.com)):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

3. **Redis** (automatically set up via Docker):
   - `REDIS_URL=redis://localhost:6379`

4. **S3/MinIO** (automatically set up via Docker):
   - `S3_BUCKET=docshot-screenshots`
   - `S3_ACCESS_KEY=minioadmin`
   - `S3_SECRET_KEY=minioadmin123`
   - `S3_ENDPOINT=http://localhost:9000`

## Project Structure

```
DocShot AI/
├── apps/
│   ├── web/           # Next.js web application
│   └── worker/        # BullMQ worker for background jobs
├── packages/
│   ├── database/      # Supabase client and schemas
│   ├── shared/        # Shared utilities and types
│   └── integrations/  # Third-party integrations
├── supabase/          # Database migrations and config
└── .github/           # CI/CD workflows
```

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

## Development Workflow

1. **Database Changes:**
   ```bash
   # Create migration
   npx supabase migration new migration_name
   
   # Apply migrations
   npx supabase db reset
   ```

2. **Adding Dependencies:**
   ```bash
   # Root dependencies
   pnpm add -w <package>
   
   # Workspace dependencies  
   pnpm add <package> --filter=web
   ```

3. **Running Tests:**
   ```bash
   # All tests
   pnpm test
   
   # Specific workspace
   pnpm test --filter=web
   ```

## Production Deployment

The project is configured for deployment on:

- **Web App**: Vercel
- **Worker**: Railway  
- **Database**: Supabase
- **File Storage**: AWS S3 or compatible service

See `.github/workflows/deploy.yml` for the complete deployment pipeline.

## Troubleshooting

### Common Issues

1. **Docker services not starting:**
   ```bash
   docker-compose down
   docker-compose up -d --force-recreate
   ```

2. **Supabase connection issues:**
   ```bash
   npx supabase status
   npx supabase db reset
   ```

3. **Node modules issues:**
   ```bash
   pnpm clean
   pnpm install
   ```

### Getting Help

- Check the [TODO.md](./TODO.md) for current development priorities
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Create an issue for bugs or feature requests