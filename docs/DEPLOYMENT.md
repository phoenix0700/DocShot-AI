# DocShot AI Deployment Guide

This guide covers deploying DocShot AI to production using Vercel (web app), Railway (worker), and Supabase (database).

## Prerequisites

1. **Accounts Required:**
   - [Vercel](https://vercel.com) account
   - [Railway](https://railway.app) account
   - [Supabase](https://supabase.com) account
   - [GitHub](https://github.com) account (for CI/CD)
   - Email service (SendGrid, Gmail, etc.)
   - S3-compatible storage (AWS S3, Cloudflare R2, etc.)

2. **CLI Tools:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Install Supabase CLI
   brew install supabase/tap/supabase
   ```

## Step 1: Database Setup (Supabase)

1. **Create a new Supabase project:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization
   - Set project name and database password
   - Select a region close to your users

2. **Run database migrations:**
   ```bash
   # Set your project URL
   export SUPABASE_PROJECT_REF=your-project-ref
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref $SUPABASE_PROJECT_REF
   
   # Push migrations
   supabase db push
   ```

3. **Configure Row Level Security (RLS):**
   - Migrations already include RLS policies
   - Verify in Supabase dashboard under Authentication > Policies

4. **Get your API keys:**
   - Go to Settings > API
   - Copy `URL`, `anon` key, and `service_role` key

## Step 2: Authentication Setup (Clerk)

1. **Create a Clerk application:**
   - Go to [dashboard.clerk.com](https://dashboard.clerk.com)
   - Create a new application
   - Configure sign-in methods (email, Google, GitHub)

2. **Configure production URLs:**
   - Add your production domain to allowed origins
   - Set up webhooks if needed

3. **Get your API keys:**
   - Copy `Publishable Key` and `Secret Key`

## Step 3: Storage Setup (S3)

### Option A: AWS S3
1. Create an S3 bucket with public read access
2. Create IAM user with S3 access
3. Generate access keys

### Option B: Cloudflare R2
1. Create R2 bucket
2. Enable public access
3. Create API token

### Option C: MinIO (Self-hosted)
1. Deploy MinIO to your infrastructure
2. Create bucket and access keys

## Step 4: Deploy Web App (Vercel)

1. **Connect GitHub repository:**
   ```bash
   vercel link
   ```

2. **Configure environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set up custom domain:**
   - Go to Vercel dashboard > Settings > Domains
   - Add your domain and configure DNS

## Step 5: Deploy Worker (Railway)

1. **Create Railway project:**
   ```bash
   railway login
   railway init
   ```

2. **Add Redis service:**
   ```bash
   railway add
   # Select Redis
   ```

3. **Configure environment variables:**
   ```bash
   railway variables set SUPABASE_URL=your-url
   railway variables set SUPABASE_SERVICE_KEY=your-key
   railway variables set S3_BUCKET=your-bucket
   railway variables set S3_ACCESS_KEY=your-key
   railway variables set S3_SECRET_KEY=your-secret
   railway variables set GITHUB_TOKEN=your-token
   railway variables set SMTP_HOST=smtp.sendgrid.net
   railway variables set SMTP_USER=apikey
   railway variables set SMTP_PASS=your-key
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

## Step 6: Configure CI/CD

1. **Add GitHub Secrets:**
   Go to your repository Settings > Secrets and add:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `RAILWAY_TOKEN`
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_ACCESS_TOKEN`
   - `TURBO_TOKEN` (optional, for build caching)

2. **Enable GitHub Actions:**
   - Workflows are already configured in `.github/workflows/`
   - Push to `main` branch to trigger deployment

## Step 7: Post-Deployment

1. **Verify services:**
   - [ ] Web app loads at your domain
   - [ ] Can sign in/sign up
   - [ ] Can create projects
   - [ ] Worker processes jobs (check logs)
   - [ ] Screenshots upload to S3
   - [ ] Email notifications work

2. **Set up monitoring:**
   ```bash
   # Add Sentry for error tracking
   vercel env add SENTRY_DSN
   railway variables set SENTRY_DSN=your-dsn
   ```

3. **Configure backups:**
   - Enable Supabase daily backups
   - Set up S3 lifecycle policies

## Environment Variables Reference

See `.env.production.example` for a complete list of required environment variables.

## Troubleshooting

### Web app not loading
- Check Vercel deployment logs
- Verify environment variables
- Check browser console for errors

### Worker not processing jobs
- Check Railway logs: `railway logs`
- Verify Redis connection
- Check Supabase connection

### Screenshots not uploading
- Verify S3 credentials
- Check bucket permissions
- Test with MinIO locally first

### Email not sending
- Verify SMTP credentials
- Check spam folder
- Use SendGrid for production

## Scaling Considerations

1. **Database:**
   - Enable connection pooling in Supabase
   - Add read replicas if needed

2. **Worker:**
   - Increase Railway replicas
   - Adjust BullMQ concurrency
   - Use Redis Cluster for high volume

3. **Storage:**
   - Enable CDN for screenshots
   - Use image optimization
   - Implement retention policies

## Security Checklist

- [ ] All secrets in environment variables
- [ ] RLS enabled on all tables
- [ ] API keys rotated regularly
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Webhooks use signatures
- [ ] Backup encryption enabled

## Cost Estimation

- **Vercel:** Free tier covers most use cases
- **Railway:** ~$20/month for worker + Redis
- **Supabase:** Free tier up to 500MB database
- **S3:** ~$0.023/GB stored + bandwidth
- **Email:** SendGrid free tier: 100 emails/day

Total: ~$20-50/month for small to medium usage