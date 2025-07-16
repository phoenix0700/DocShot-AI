# 🏗️ DocShot AI Production Infrastructure Setup

This guide covers setting up production-ready Redis, database, and storage services for DocShot AI.

## 🎯 Quick Setup Options

### Option 1: All-in-One Setup (Recommended)
Use our recommended providers for the best experience:

1. **Database**: Supabase (PostgreSQL + Auth + Storage)
2. **Redis**: Upstash (Serverless Redis)
3. **Storage**: Cloudflare R2 (S3-compatible)
4. **Monitoring**: Upstash (Redis monitoring)

### Option 2: Custom Setup
Choose your own providers based on your needs.

---

## 📊 Service Providers Comparison

| Service | Provider | Free Tier | Pricing | Best For |
|---------|----------|-----------|---------|----------|
| **Database** | Supabase | 500MB, 2 projects | $25/month | Full-stack features |
| | PlanetScale | 5GB, 1 branch | $39/month | High performance |
| | Neon | 3GB, 10 projects | $20/month | PostgreSQL focus |
| **Redis** | Upstash | 10K commands/day | $0.20/100K | Serverless model |
| | Redis Cloud | 30MB | $5/month | Enterprise features |
| | Railway Redis | None | $5/month | Simple setup |
| **Storage** | Cloudflare R2 | 10GB/month | $0.015/GB | No egress fees |
| | AWS S3 | 5GB/month | $0.023/GB | Industry standard |
| | MinIO Cloud | None | $0.01/GB | S3-compatible |

---

## 🚀 Step-by-Step Setup

### 1. Database Setup (Supabase)

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name: `docshot-ai-prod`
4. Select region closest to your users
5. Generate strong database password

#### Apply Schema
```bash
# Clone your repository
git clone https://github.com/phoenix0700/DocShot-AI.git
cd DocShot-AI

# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

#### Get Connection Details
```bash
# Your connection strings will be:
DATABASE_URL: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
SUPABASE_URL: https://[ref].supabase.co
SUPABASE_ANON_KEY: [anon_key]
SUPABASE_SERVICE_KEY: [service_role_key]
```

### 2. Redis Setup (Upstash)

#### Create Database
1. Go to [upstash.com](https://upstash.com)
2. Sign up/Login
3. Click "Create Database"
4. Choose region (same as your app)
5. Select "Regional" for better performance

#### Get Connection String
```bash
# Format: redis://:[password]@[endpoint]:6379
REDIS_URL: redis://default:[password]@[region]-[id].upstash.io:6379

# For TLS (recommended):
REDIS_URL: rediss://default:[password]@[region]-[id].upstash.io:6380
```

### 3. Storage Setup (Cloudflare R2)

#### Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 Object Storage
3. Click "Create bucket"
4. Name: `docshot-screenshots-prod`
5. Choose location close to your users

#### Create API Token
1. Go to "Manage R2 API tokens"
2. Click "Create API token"
3. Set permissions: Object Read, Object Write, Bucket Read
4. Note down Access Key ID and Secret Access Key

#### Configure Bucket
```bash
# Environment variables for R2:
S3_BUCKET=docshot-screenshots-prod
S3_ACCESS_KEY=[access_key_id]
S3_SECRET_KEY=[secret_access_key]
S3_ENDPOINT=https://[account_id].r2.cloudflarestorage.com
S3_REGION=auto
```

### 4. Email Setup (Gmail SMTP)

#### Create App Password
1. Enable 2FA on your Gmail account
2. Go to Google Account settings
3. Security → App passwords
4. Generate password for "Mail"

#### Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=[app_password]
SMTP_FROM="DocShot AI <notifications@yourdomain.com>"
```

---

## 🔧 Environment Configuration

### Complete Production .env

```bash
# =====================================================
# PRODUCTION ENVIRONMENT VARIABLES
# =====================================================

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_KEY=[service_role_key]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[key]
CLERK_SECRET_KEY=sk_live_[key]
CLERK_WEBHOOK_SECRET=whsec_[secret]

# Upstash Redis
REDIS_URL=rediss://default:[password]@[region]-[id].upstash.io:6380

# Cloudflare R2 Storage
S3_BUCKET=docshot-screenshots-prod
S3_ACCESS_KEY=[access_key]
S3_SECRET_KEY=[secret_key]
S3_ENDPOINT=https://[account_id].r2.cloudflarestorage.com
S3_REGION=auto

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@yourdomain.com
SMTP_PASS=[app_password]
SMTP_FROM="DocShot AI <notifications@yourdomain.com>"

# Worker Configuration
SCREENSHOT_CONCURRENCY=3
DIFF_CONCURRENCY=5
NOTIFICATION_CONCURRENCY=10

# Security
ENCRYPTION_KEY=[generate_32_char_key]
JWT_SECRET=[generate_strong_secret]
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Store all secrets in platform environment variables
- Never commit secrets to Git
- Use different keys for staging/production
- Rotate keys regularly

### 2. Database Security
- Enable Row Level Security (RLS) policies
- Use service role key only for backend
- Enable database backups
- Monitor connection logs

### 3. Redis Security
- Use TLS connections (rediss://)
- Enable authentication
- Restrict IP access if possible
- Monitor usage patterns

### 4. Storage Security
- Use signed URLs for uploads
- Set proper CORS policies
- Enable versioning for backups
- Monitor access logs

---

## 📊 Monitoring & Alerts

### Database Monitoring (Supabase)
```sql
-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
```

### Redis Monitoring (Upstash)
- Memory usage trends
- Command execution rates
- Connection counts
- Error rates

### Recommended Alerts
- Database connections > 80%
- Redis memory usage > 75%
- Storage usage > 90%
- Error rates > 5%
- Response times > 2s

---

## 🧪 Testing Production Setup

### 1. Database Connection Test
```bash
# Test from your local machine
psql "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# Run a simple query
SELECT current_database(), current_user, now();
```

### 2. Redis Connection Test
```bash
# Test Redis connection
redis-cli -u "rediss://default:[password]@[region]-[id].upstash.io:6380"

# Test basic operations
PING
SET test-key "test-value"
GET test-key
DEL test-key
```

### 3. Storage Upload Test
```bash
# Using AWS CLI with R2
aws configure set aws_access_key_id [access_key]
aws configure set aws_secret_access_key [secret_key]

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://docshot-screenshots-prod/ --endpoint-url https://[account_id].r2.cloudflarestorage.com
```

### 4. Full Integration Test
```typescript
// apps/web/test-production.ts
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

async function testProduction() {
  // Test Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  
  const { data, error } = await supabase.from('users').select('id').limit(1);
  console.log('Database:', error ? 'Failed' : 'Connected');

  // Test Redis
  const redis = new Redis(process.env.REDIS_URL!);
  await redis.ping();
  console.log('Redis: Connected');
  await redis.quit();

  console.log('Production setup test completed!');
}

testProduction().catch(console.error);
```

---

## 💰 Cost Estimation

### Startup Scale (< 1000 users)
- **Supabase**: $25/month (Pro plan)
- **Upstash**: $10/month (Pay as you go)
- **Cloudflare R2**: $5/month (Storage + requests)
- **Total**: ~$40/month

### Growth Scale (1000-10000 users)
- **Supabase**: $25-100/month
- **Upstash**: $20-50/month
- **Cloudflare R2**: $20-100/month
- **Total**: ~$65-250/month

### Enterprise Scale (10000+ users)
- **Supabase**: $100-500/month
- **Upstash**: $100-300/month
- **Cloudflare R2**: $100-500/month
- **Total**: ~$300-1300/month

---

## 🔄 Deployment Checklist

### Pre-deployment
- [ ] Create all service accounts
- [ ] Configure environment variables
- [ ] Test all connections locally
- [ ] Run database migrations
- [ ] Set up monitoring/alerts

### Deployment
- [ ] Deploy web app to Vercel
- [ ] Deploy worker to Railway
- [ ] Configure domain/SSL
- [ ] Test health endpoints
- [ ] Run end-to-end tests

### Post-deployment
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Verify backup procedures
- [ ] Document runbook procedures
- [ ] Set up ongoing monitoring

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Timeouts**
```bash
# Check connection limits
SELECT * FROM pg_stat_activity;

# Increase connection pooling
# In Supabase: Database → Settings → Connection pooling
```

**Redis Memory Issues**
```bash
# Check memory usage
INFO memory

# Clear cache if needed
FLUSHDB
```

**Storage Upload Failures**
```bash
# Check CORS settings
# In Cloudflare R2: Bucket settings → CORS policy

# Verify credentials
aws sts get-caller-identity --endpoint-url https://[account_id].r2.cloudflarestorage.com
```

---

## 📞 Support Contacts

- **Supabase**: [support@supabase.com](mailto:support@supabase.com)
- **Upstash**: [support@upstash.com](mailto:support@upstash.com)  
- **Cloudflare**: [Enterprise support](https://support.cloudflare.com)

Your production infrastructure is now ready to scale! 🚀