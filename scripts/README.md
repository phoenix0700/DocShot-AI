# 🛠️ DocShot AI Scripts

This directory contains utility scripts for managing DocShot AI deployment and testing.

## Scripts Overview

### 🧪 `test-production-services.ts`
Tests all production service connections (Database, Redis, S3, SMTP).

```bash
# Run production service tests
pnpm test:services

# Or directly
tsx scripts/test-production-services.ts
```

**What it tests:**
- ✅ Supabase database connection and authentication
- ✅ Redis connection and basic operations
- ✅ S3 storage upload/download/delete
- ✅ SMTP email server verification

### 🚀 `deploy-production.sh`
Automated production deployment script.

```bash
# Full production deployment
pnpm deploy:production

# Or directly
./scripts/deploy-production.sh
```

**What it does:**
1. Checks prerequisites (CLI tools)
2. Tests all production services
3. Deploys database migrations
4. Deploys web app to Vercel
5. Deploys worker to Railway
6. Runs post-deployment health checks
7. Generates deployment report

## Prerequisites

### Required CLI Tools
- `vercel` - For web app deployment
- `railway` - For worker deployment (optional)
- `supabase` - For database migrations (optional)
- `tsx` - For running TypeScript scripts

### Install Tools
```bash
# Vercel CLI
npm install -g vercel

# Railway CLI
npm install -g @railway/cli

# Supabase CLI
npm install -g supabase

# TSX (already in devDependencies)
npm install -g tsx
```

## Environment Setup

### Development
Copy `.env.example` to `.env.local` and fill in development credentials.

### Production
Copy `.env.production.template` to `.env.production` and fill in production credentials.

**Required Services:**
- [Supabase](https://supabase.com) - Database
- [Upstash](https://upstash.com) - Redis
- [Cloudflare R2](https://cloudflare.com/products/r2/) - Storage
- [Clerk](https://clerk.com) - Authentication

## Usage Examples

### Test Production Setup
```bash
# Before deploying, test all services
pnpm test:services

# Expected output:
# ✅ Supabase Database: Connected successfully (150ms)
# ✅ Redis (Upstash): Connected and tested operations (89ms)
# ✅ S3 Storage (R2): Upload, download, delete operations successful (234ms)
# ✅ SMTP Email: SMTP server connection verified (445ms)
```

### Deploy to Production
```bash
# Full automated deployment
pnpm deploy:production

# Manual steps (if automation fails):
cd apps/web && vercel --prod              # Deploy web app
cd apps/worker && railway up              # Deploy worker
supabase db push                          # Deploy database
```

### Monitor Deployment
```bash
# Check web app logs
vercel logs

# Check worker logs
railway logs

# Check database metrics
# (Use Supabase dashboard)

# Test health endpoints
curl https://your-app.vercel.app/api/health
curl https://your-worker.railway.app/health
```

## Troubleshooting

### Common Issues

**Service Test Failures:**
```bash
# Check environment variables
cat .env.production | grep -E "(SUPABASE|REDIS|S3|SMTP)"

# Test individual services
tsx scripts/test-production-services.ts
```

**Deployment Failures:**
```bash
# Check CLI authentication
vercel whoami
railway whoami
supabase projects list

# Verify project linking
cd apps/web && vercel link
cd apps/worker && railway link
```

**Missing Dependencies:**
```bash
# Reinstall with production testing deps
pnpm install

# Update CLI tools
npm update -g vercel @railway/cli supabase
```

## Output Files

Scripts may generate these files:

- `deployment-report-YYYYMMDD-HHMMSS.md` - Deployment summary
- `.env.local` - Temporary file (from .env.production for testing)

## Security Notes

- Never commit `.env.production` to version control
- Rotate API keys regularly
- Use least-privilege access for all services
- Monitor deployment logs for sensitive information leaks

---

For detailed setup instructions, see [PRODUCTION_SETUP.md](../PRODUCTION_SETUP.md)