# 🚧 DocShot AI Worker Deployment Guide

This guide covers deploying the DocShot AI worker to various cloud platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/docshot-worker)

**Steps:**
1. Click the "Deploy on Railway" button
2. Connect your GitHub account
3. Set environment variables (see below)
4. Deploy!

### Option 2: Render

1. Create new Web Service from GitHub repo
2. Set build command: `pnpm install && pnpm build --filter=worker`
3. Set start command: `cd apps/worker && pnpm start`
4. Set environment variables
5. Deploy

### Option 3: Docker

```bash
# Build and run locally
docker build -f apps/worker/Dockerfile -t docshot-worker .
docker run -p 3001:3001 --env-file .env docshot-worker

# Deploy to any Docker platform
```

## 🔧 Required Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Redis Queue
REDIS_URL=redis://your-redis-instance:6379

# Storage (S3-compatible)
S3_BUCKET=docshot-screenshots
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_ENDPOINT=https://your-storage-endpoint.com
S3_REGION=auto

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# GitHub Integration (optional)
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key

# Worker Configuration
NODE_ENV=production
PORT=3001
SCREENSHOT_CONCURRENCY=2
DIFF_CONCURRENCY=3
NOTIFICATION_CONCURRENCY=5
```

## 🔍 Health Check

The worker exposes a health check endpoint at `/health`:

```bash
curl https://your-worker-url.com/health
```

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checks": {
    "redis": "connected",
    "database": "connected"
  }
}
```

## 📊 Monitoring

### Key Metrics to Monitor:

1. **Health Check Status**: Endpoint should return 200
2. **Memory Usage**: Keep below 512MB
3. **Job Processing**: Monitor queue lengths
4. **Error Rates**: Check logs for failed jobs

### Recommended Alerts:

- Health check fails for 5+ minutes
- Memory usage > 80%
- Job queue depth > 100
- Error rate > 10%

## 🐛 Troubleshooting

### Common Issues:

**1. Puppeteer Crashes**
```bash
# Solution: Increase memory limit
railway variables set RAILWAY_MAX_MEMORY_GB=1

# Or add Puppeteer flags
PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox
```

**2. Redis Connection Fails**
```bash
# Check Redis URL format
REDIS_URL=redis://default:password@host:port

# For TLS connections
REDIS_URL=rediss://default:password@host:port
```

**3. Build Failures**
```bash
# Ensure monorepo build works
pnpm install
pnpm build --filter=worker
```

**4. High Memory Usage**
```bash
# Reduce concurrency
SCREENSHOT_CONCURRENCY=1
DIFF_CONCURRENCY=2
```

## 🔧 Platform-Specific Configuration

### Railway

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd apps/worker && pnpm start"
healthcheckPath = "/health"
```

### Render

```yaml
# render.yaml
services:
  - type: web
    name: docshot-worker
    env: node
    buildCommand: pnpm install && pnpm build --filter=worker
    startCommand: cd apps/worker && pnpm start
    healthCheckPath: /health
```

### Docker

```dockerfile
# Use the provided Dockerfile
FROM node:20-alpine
# ... (see apps/worker/Dockerfile)
```

## 🔄 Deployment Workflow

1. **Test Locally**: Ensure worker runs with `pnpm dev` from worker directory
2. **Check Dependencies**: Verify all packages build successfully
3. **Set Variables**: Configure all required environment variables
4. **Deploy**: Use your chosen platform
5. **Verify**: Check health endpoint and logs
6. **Monitor**: Set up alerts and monitoring

## 📈 Scaling Considerations

### Single Instance (Startup)
- Memory: 512MB
- CPU: 0.5 cores
- Concurrency: 2-3 jobs

### Production (High Traffic)
- Memory: 1-2GB
- CPU: 1-2 cores
- Concurrency: 5-10 jobs
- Multiple instances behind load balancer

### Enterprise (Heavy Load)
- Memory: 2-4GB
- CPU: 2-4 cores
- Concurrency: 10-20 jobs
- Auto-scaling based on queue depth

## 🔐 Security Notes

- Use service role keys for Supabase (not public keys)
- Store secrets in platform environment variables
- Enable HTTPS for all external communications
- Regularly update dependencies for security patches
- Monitor logs for suspicious activity

---

## Next Steps

After deploying the worker:

1. ✅ Test the health endpoint
2. ✅ Verify Redis and database connections
3. ✅ Queue a test screenshot job
4. ✅ Monitor job processing in real-time
5. ✅ Set up alerts and monitoring

The worker is now ready to process screenshot jobs from your web application!