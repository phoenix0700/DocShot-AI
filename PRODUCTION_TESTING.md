# 🧪 DocShot AI Production Testing Guide

This guide provides comprehensive testing procedures for validating your DocShot AI production deployment.

## 🎯 Testing Overview

### Test Types
1. **Automated E2E Testing** - Full system validation
2. **Manual User Journey** - Real user experience testing  
3. **Performance Testing** - Load and response time validation
4. **Security Testing** - Authentication and data protection
5. **Integration Testing** - External service connectivity

---

## 🤖 Automated End-to-End Testing

### Run Full E2E Test Suite
```bash
# Test against your production deployment
tsx scripts/test-e2e-production.ts --production-url=https://your-app.vercel.app --worker-url=https://your-worker.railway.app

# Expected output:
# ✅ Health Check - Web App: Completed successfully (150ms)
# ✅ Health Check - Worker: Completed successfully (89ms)
# ✅ Database Connection: Completed successfully (234ms)
# ✅ Redis Queue Connection: Completed successfully (156ms)
# ✅ S3 Storage Access: Completed successfully (445ms)
# ✅ Create Test User: Completed successfully (312ms)
# ✅ Create Test Project: Completed successfully (189ms)
# ✅ Add Screenshot Configuration: Completed successfully (123ms)
# ✅ Queue Screenshot Job: Completed successfully (267ms)
# ✅ Process Screenshot Job: Completed successfully (15234ms)
# ✅ Verify Image Storage: Completed successfully (445ms)
# ✅ Test Visual Diff: Completed successfully (234ms)
# ✅ Test Notifications: Completed successfully (156ms)
# ✅ Cleanup Test Data: Completed successfully (89ms)
```

### What the E2E Test Validates
- ✅ Web application responsiveness
- ✅ Worker health and job processing
- ✅ Database CRUD operations
- ✅ Redis queue functionality
- ✅ S3 storage read/write operations
- ✅ Complete user workflow (signup → project → screenshot → storage)
- ✅ Authentication and authorization
- ✅ Multi-tenant data isolation

---

## 👤 Manual User Journey Testing

### 1. User Registration & Authentication

**Test Steps:**
1. Visit your production URL: `https://your-app.vercel.app`
2. Click "Sign Up" or "Get Started"
3. Complete Clerk authentication flow
4. Verify redirect to dashboard

**Expected Results:**
- ✅ Registration form loads correctly
- ✅ Email verification works (if enabled)
- ✅ User is redirected to dashboard after signup
- ✅ User data is created in Supabase users table

**Validation Queries:**
```sql
-- Check user was created
SELECT * FROM users WHERE email = 'your-test-email@example.com';

-- Verify subscription limits
SELECT subscription_tier, monthly_screenshot_limit 
FROM users WHERE email = 'your-test-email@example.com';
```

### 2. Project Creation

**Test Steps:**
1. From dashboard, click "Create Project"
2. Fill in project details:
   - Name: "Production Test Project"
   - Description: "Testing production deployment"
   - URL: "https://example.com"
   - GitHub settings (optional)
3. Click "Create Project"
4. Verify redirect to project detail page

**Expected Results:**
- ✅ Project creation form validates inputs
- ✅ Project is saved to database
- ✅ User is redirected to project detail page
- ✅ Project appears in user's project list

### 3. Screenshot Configuration

**Test Steps:**
1. In project detail page, click "Add Screenshot"
2. Configure screenshot:
   - Name: "Homepage Test"
   - URL: "https://example.com"
   - Viewport: Desktop (1920x1080)
   - Full page: Yes
3. Save screenshot configuration
4. Verify screenshot appears in project

**Expected Results:**
- ✅ Screenshot configuration form works
- ✅ Viewport presets are selectable
- ✅ Screenshot is saved to database
- ✅ Screenshot appears in project screenshot list

### 4. Screenshot Execution

**Test Steps:**
1. Click "Run Now" on the screenshot
2. Wait for processing (may take 30-60 seconds)
3. Refresh page to see results
4. Verify screenshot image loads

**Expected Results:**
- ✅ Job is queued successfully
- ✅ Worker processes the job
- ✅ Screenshot image is captured
- ✅ Image is stored in S3/R2
- ✅ Database is updated with image URL
- ✅ Screenshot status changes to "completed"

### 5. YAML Configuration Export

**Test Steps:**
1. Go to "YAML Config" tab in project
2. Review generated configuration
3. Click "Copy" or "Download"
4. Verify YAML format is correct

**Expected Results:**
- ✅ YAML configuration is generated
- ✅ All project settings are included
- ✅ Screenshot configurations are listed
- ✅ GitHub integration settings are included (if configured)

---

## ⚡ Performance Testing

### Response Time Benchmarks

**Acceptable Response Times:**
- Homepage load: < 2 seconds
- Dashboard load: < 3 seconds
- Project creation: < 5 seconds
- Screenshot job queue: < 2 seconds
- Screenshot processing: < 60 seconds (depends on page complexity)

**Test Commands:**
```bash
# Test web app response times
curl -w "Total time: %{time_total}s\n" -o /dev/null -s https://your-app.vercel.app

# Test API endpoints
curl -w "API response: %{time_total}s\n" -o /dev/null -s https://your-app.vercel.app/api/health

# Test worker health
curl -w "Worker response: %{time_total}s\n" -o /dev/null -s https://your-worker.railway.app/health
```

### Load Testing (Optional)

**Basic Load Test:**
```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpd                   # macOS

# Test 100 requests with 10 concurrent users
ab -n 100 -c 10 https://your-app.vercel.app/

# Test API endpoint
ab -n 50 -c 5 https://your-app.vercel.app/api/health
```

---

## 🔒 Security Testing

### Authentication Testing

**Test Steps:**
1. Try to access dashboard without authentication
2. Verify redirect to login page
3. Test with invalid credentials
4. Test password reset flow (if applicable)

**Expected Results:**
- ✅ Unauthenticated users are redirected to login
- ✅ Invalid credentials are rejected
- ✅ Password reset works properly
- ✅ Session management works correctly

### Data Isolation Testing

**Test Steps:**
1. Create two test users
2. Create projects for each user
3. Verify User A cannot see User B's projects
4. Test API endpoints with different user contexts

**Database Validation:**
```sql
-- Test RLS policies are working
-- This should return only the user's own projects
SELECT * FROM projects WHERE user_id = 'user_a_id';

-- This should fail or return empty for different user
SET app.current_user_id = 'user_b_id';
SELECT * FROM projects WHERE user_id = 'user_a_id';
```

### API Security Testing

**Test Steps:**
1. Try to access API endpoints without authentication
2. Test with invalid API keys (if applicable)
3. Verify rate limiting is working
4. Test CORS policies

**Expected Results:**
- ✅ Protected endpoints require authentication
- ✅ Rate limiting prevents abuse
- ✅ CORS allows only expected origins
- ✅ Sensitive data is not exposed in responses

---

## 🔗 Integration Testing

### External Services

**Supabase Database:**
```bash
# Test connection
psql "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres" -c "SELECT current_database(), current_user;"

# Test RLS policies
# (Should be done through application, not direct DB access in production)
```

**Upstash Redis:**
```bash
# Test Redis connection
redis-cli -u "rediss://default:[password]@[region]-[id].upstash.io:6380" ping

# Test queue operations
redis-cli -u "rediss://..." lpush test-queue "test-message"
redis-cli -u "rediss://..." rpop test-queue
```

**Cloudflare R2 Storage:**
```bash
# Test S3 operations
aws s3 ls s3://your-bucket --endpoint-url https://[account-id].r2.cloudflarestorage.com

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://your-bucket/ --endpoint-url https://[account-id].r2.cloudflarestorage.com
aws s3 rm s3://your-bucket/test.txt --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

### GitHub Integration (if configured)

**Test Steps:**
1. Configure GitHub integration in project settings
2. Run a screenshot that should commit to GitHub
3. Verify commit appears in target repository
4. Check commit message and file contents

**Expected Results:**
- ✅ GitHub authentication works
- ✅ Files are committed to correct repository/branch
- ✅ Commit messages are descriptive
- ✅ File paths are correct

---

## 📊 Monitoring & Alerts Testing

### Health Endpoints

**Web Application:**
```bash
# Should return 200 OK
curl -i https://your-app.vercel.app/api/health

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: application/json
# {"status":"healthy","timestamp":"2024-01-15T10:30:00.000Z"}
```

**Worker:**
```bash
# Should return health status
curl -i https://your-worker.railway.app/health

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: application/json
# {
#   "status": "healthy",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "checks": {
#     "redis": "connected",
#     "database": "connected"
#   }
# }
```

### Error Handling

**Test Error Conditions:**
1. Submit invalid project data
2. Try to queue job with invalid screenshot ID
3. Test with network timeouts
4. Simulate database connection issues

**Expected Results:**
- ✅ Errors are handled gracefully
- ✅ User-friendly error messages are shown
- ✅ System remains stable during errors
- ✅ Errors are logged for debugging

---

## 🚨 Troubleshooting Common Issues

### Screenshot Jobs Failing

**Check:**
1. Worker logs: `railway logs` or platform logs
2. Redis queue status: Check for failed jobs
3. Puppeteer dependencies: Ensure Chrome is available
4. Network connectivity: Worker can reach target URLs

**Debug Commands:**
```bash
# Check worker logs
railway logs --tail

# Check Redis queue
redis-cli -u $REDIS_URL llen screenshot
redis-cli -u $REDIS_URL llen screenshot:failed

# Test Puppeteer manually
node -e "const puppeteer = require('puppeteer'); puppeteer.launch().then(browser => { console.log('Puppeteer OK'); browser.close(); });"
```

### Database Connection Issues

**Check:**
1. Supabase project status
2. Connection string format
3. RLS policies are not blocking operations
4. Service role key permissions

**Debug Queries:**
```sql
-- Check connection limits
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';
```

### Storage Upload Issues

**Check:**
1. S3/R2 bucket permissions
2. Access key credentials
3. CORS policies
4. Bucket region settings

**Debug Commands:**
```bash
# Test credentials
aws sts get-caller-identity --endpoint-url https://[account-id].r2.cloudflarestorage.com

# List bucket contents
aws s3 ls s3://your-bucket --endpoint-url https://[account-id].r2.cloudflarestorage.com

# Test upload
echo "test" | aws s3 cp - s3://your-bucket/test.txt --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

---

## ✅ Production Readiness Checklist

### Pre-Launch Checklist

**Infrastructure:**
- [ ] All services deployed and healthy
- [ ] Environment variables configured
- [ ] SSL certificates active
- [ ] DNS records pointing to production
- [ ] Backup procedures tested

**Security:**
- [ ] Authentication working correctly
- [ ] Data isolation verified (RLS policies)
- [ ] API endpoints secured
- [ ] Secrets not exposed in client code
- [ ] Rate limiting configured

**Performance:**
- [ ] Response times within acceptable limits
- [ ] Database queries optimized
- [ ] Image storage working efficiently
- [ ] Queue processing at expected speeds
- [ ] Error handling robust

**Monitoring:**
- [ ] Health checks configured
- [ ] Logging and monitoring active
- [ ] Alert thresholds set
- [ ] Dashboard access configured
- [ ] Error tracking enabled

**Testing:**
- [ ] All automated tests passing
- [ ] Manual user journeys completed
- [ ] Security testing passed
- [ ] Integration tests successful
- [ ] Performance benchmarks met

### Post-Launch Monitoring

**Daily Checks:**
- Application health status
- Error rates and logs
- Performance metrics
- User registration/activity

**Weekly Checks:**
- Database performance
- Storage usage trends
- Queue processing efficiency
- Security audit logs

**Monthly Checks:**
- Cost optimization opportunities
- Performance optimization
- Security vulnerability scans
- Backup restoration tests

---

## 📞 Support & Escalation

### Service Provider Support

**Vercel (Web App):**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/help

**Railway (Worker):**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Support: https://railway.app/help

**Supabase (Database):**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

**Upstash (Redis):**
- Dashboard: https://console.upstash.com
- Docs: https://upstash.com/docs
- Support: https://upstash.com/docs/support

**Cloudflare (R2 Storage):**
- Dashboard: https://dash.cloudflare.com
- Docs: https://developers.cloudflare.com/r2/
- Support: https://support.cloudflare.com

### Internal Escalation

**Critical Issues (System Down):**
1. Check service status pages
2. Review recent deployments
3. Check error logs and metrics
4. Implement rollback if necessary
5. Contact service provider support

**Performance Issues:**
1. Review performance metrics
2. Check database query performance
3. Analyze worker processing times
4. Optimize bottlenecks identified

**Security Incidents:**
1. Document the incident
2. Implement immediate containment
3. Review access logs
4. Update security measures
5. Notify affected users if necessary

---

Your production system is now thoroughly tested and ready for users! 🚀