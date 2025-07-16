# DocShot AI

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phoenix0700/DocShot-AI&project-name=docshot-ai&repository-name=DocShot-AI)

Automated screenshot capture and documentation updates for modern teams. Keep your documentation visually up-to-date with zero manual effort.

## Features

- 📸 **Automated Screenshot Capture** - Schedule captures or trigger them via API
- 🔍 **Visual Diff Detection** - Automatically detect and review visual changes
- 🔄 **Smart Integrations** - Push to GitHub, Notion, and more
- 📧 **Intelligent Notifications** - Get alerted only when it matters
- 🎯 **YAML Configuration** - Simple, version-controlled config
- ✅ **Approval Workflows** - Review changes before they go live

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local development)
- Supabase account
- Clerk account

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/docshot-ai.git
   cd docshot-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start local services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd supabase
   supabase db push --local
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

The application will be available at:
- Web app: http://localhost:3000
- Worker health check: http://localhost:3001/health

## Project Structure

```
docshot-ai/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── worker/       # Background job processor
├── packages/
│   ├── database/     # Shared database client and types
│   ├── shared/       # Common utilities and schemas
│   └── integrations/ # External service integrations
├── supabase/
│   └── migrations/   # Database migrations
└── docs/            # Documentation
```

## Configuration

DocShot AI uses YAML files to configure screenshot capture:

```yaml
version: "1.0"
project:
  name: "My Documentation"
  
screenshots:
  - name: "Dashboard"
    url: "https://app.example.com/dashboard"
    selector: ".main-content"  # Optional: capture specific element
    schedule: "0 9 * * *"      # Optional: cron schedule
    
integrations:
  github:
    repo: "myorg/docs"
    path: "images/screenshots"
    autoCommit: true
    
  email:
    recipients:
      - "team@example.com"
```

## Core Concepts

### Screenshots
Define what pages or elements to capture, including:
- Full page captures
- Specific CSS selectors
- Custom viewports
- Authentication handling
- Dynamic wait conditions

### Visual Diffs
Automatically detect changes between captures:
- Pixel-by-pixel comparison
- Configurable sensitivity thresholds
- Side-by-side diff viewer
- Approval workflows

### Integrations
Push screenshots to your existing tools:
- **GitHub**: Commit directly to repositories
- **Notion**: Update database pages
- **Email**: Get notified of changes
- **Webhooks**: Custom integrations

## API Usage

### Queue a Screenshot

```typescript
import { createQueueManager } from '@docshot/shared';

const queueManager = createQueueManager();

await queueManager.addScreenshotJob({
  projectId: 'uuid',
  screenshotId: 'uuid',
  url: 'https://example.com',
  selector: '.content',
});
```

### Check Job Status

```typescript
const job = await queueManager.getJob('screenshot', jobId);
console.log(job.progress, job.returnvalue);
```

## Development Commands

```bash
# Start all services
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

#### Option 1: One-Click Deploy (Recommended)
1. **Frontend**: Click the "Deploy to Vercel" button above
2. **Worker**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/docshot-worker)

#### Option 2: Manual Deploy
1. **Deploy database to Supabase**
   ```bash
   supabase db push --project-ref your-project-ref
   ```

2. **Deploy web app to Vercel**
   ```bash
   cd apps/web && vercel --prod
   ```

3. **Deploy worker to Railway**
   ```bash
   cd apps/worker && railway up
   ```

## Environment Variables

### Development
See `.env.example` for all required environment variables

### Production
See `.env.production.template` for production configuration:

- `SUPABASE_*` - Database credentials
- `CLERK_*` - Authentication keys  
- `REDIS_URL` - Queue storage (Upstash)
- `S3_*` - Screenshot storage (Cloudflare R2)
- `SMTP_*` - Email notifications

**Production Setup:**
```bash
# Test your production services
pnpm test:services

# Deploy everything
pnpm deploy:production
```

See `PRODUCTION_SETUP.md` for detailed instructions.

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Architecture

DocShot AI follows a microservices architecture:

- **Web App**: Next.js 14 with App Router for the UI
- **Worker**: Node.js service processing background jobs
- **Database**: PostgreSQL via Supabase with RLS
- **Queue**: Redis + BullMQ for job processing
- **Storage**: S3-compatible object storage

## Troubleshooting

### Common Issues

**Screenshots failing to capture**
- Check Puppeteer dependencies: `npx puppeteer diagnose`
- Verify URL accessibility
- Check authentication configuration

**Jobs not processing**
- Ensure Redis is running: `docker-compose ps`
- Check worker logs: `docker-compose logs worker`
- Verify queue connections

**Storage upload errors**
- Verify S3 credentials
- Check bucket permissions
- Test with MinIO locally first

## Security

- All database access uses Row Level Security (RLS)
- API keys are stored securely in environment variables
- User data is isolated by organization
- Regular security updates via Dependabot

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.docshot.ai](https://docs.docshot.ai)
- Issues: [GitHub Issues](https://github.com/yourusername/docshot-ai/issues)
- Email: support@docshot.ai

---

Built with ❤️ by the DocShot AI team