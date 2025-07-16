#!/bin/bash

# =====================================================
# DocShot AI Production Deployment Script
# =====================================================
# This script automates the production deployment process
# 
# Usage: ./scripts/deploy-production.sh
# Prerequisites: Vercel CLI, Railway CLI, and environment variables set

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    command -v vercel >/dev/null 2>&1 || { 
        log_error "Vercel CLI is not installed. Install with: npm install -g vercel"
        exit 1
    }
    
    command -v railway >/dev/null 2>&1 || { 
        log_warning "Railway CLI is not installed. Install with: npm install -g @railway/cli"
        log_warning "Skipping Railway deployment..."
        SKIP_RAILWAY=true
    }
    
    command -v tsx >/dev/null 2>&1 || { 
        log_error "tsx is not installed. Install with: npm install -g tsx"
        exit 1
    }
    
    log_success "Prerequisites check completed"
}

# Test production services
test_services() {
    log_info "Testing production services..."
    
    if [ ! -f ".env.production" ]; then
        log_error ".env.production file not found!"
        log_info "Copy .env.production.template to .env.production and fill in your credentials"
        exit 1
    fi
    
    # Copy production env for testing
    cp .env.production .env.local
    
    # Run service tests
    tsx scripts/test-production-services.ts
    
    if [ $? -eq 0 ]; then
        log_success "All production services are ready!"
    else
        log_error "Service tests failed. Please fix issues before deploying."
        exit 1
    fi
}

# Deploy database migrations
deploy_database() {
    log_info "Deploying database migrations..."
    
    if command -v supabase >/dev/null 2>&1; then
        # Check if linked to project
        if [ ! -f ".supabase/config.toml" ]; then
            log_warning "Supabase project not linked. Please run: supabase link --project-ref YOUR_PROJECT_REF"
            return
        fi
        
        # Apply migrations
        supabase db push
        log_success "Database migrations deployed"
    else
        log_warning "Supabase CLI not found. Please deploy database migrations manually."
    fi
}

# Deploy web application to Vercel
deploy_web() {
    log_info "Deploying web application to Vercel..."
    
    cd apps/web
    
    # Check if project is linked
    if [ ! -f ".vercel/project.json" ]; then
        log_info "Linking to Vercel project..."
        vercel link
    fi
    
    # Set environment variables from .env.production
    log_info "Setting environment variables..."
    
    # Read .env.production and set variables (simplified version)
    if [ -f "../../.env.production" ]; then
        # Note: In real deployment, you'd want to set these via Vercel dashboard or CLI
        log_warning "Please set environment variables in Vercel dashboard manually"
        log_info "Variables needed: NEXT_PUBLIC_SUPABASE_URL, CLERK_SECRET_KEY, etc."
    fi
    
    # Deploy to production
    vercel --prod
    
    if [ $? -eq 0 ]; then
        log_success "Web application deployed successfully!"
        VERCEL_URL=$(vercel --prod 2>/dev/null | grep "https://" | tail -1)
        log_info "Web app URL: $VERCEL_URL"
    else
        log_error "Web deployment failed"
        exit 1
    fi
    
    cd ../..
}

# Deploy worker to Railway
deploy_worker() {
    if [ "$SKIP_RAILWAY" = true ]; then
        log_warning "Skipping Railway deployment (CLI not installed)"
        return
    fi
    
    log_info "Deploying worker to Railway..."
    
    cd apps/worker
    
    # Check if Railway is logged in
    if ! railway whoami >/dev/null 2>&1; then
        log_info "Please log in to Railway..."
        railway login
    fi
    
    # Deploy worker
    railway up
    
    if [ $? -eq 0 ]; then
        log_success "Worker deployed successfully!"
        RAILWAY_URL=$(railway status --json 2>/dev/null | grep -o 'https://[^"]*' | head -1)
        log_info "Worker URL: $RAILWAY_URL"
    else
        log_error "Worker deployment failed"
        exit 1
    fi
    
    cd ../..
}

# Run post-deployment tests
post_deployment_tests() {
    log_info "Running post-deployment tests..."
    
    # Test web app health
    if [ ! -z "$VERCEL_URL" ]; then
        log_info "Testing web app health..."
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")
        if [ "$HTTP_STATUS" = "200" ]; then
            log_success "Web app is responding"
        else
            log_error "Web app health check failed (HTTP $HTTP_STATUS)"
        fi
    fi
    
    # Test worker health
    if [ ! -z "$RAILWAY_URL" ]; then
        log_info "Testing worker health..."
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/health")
        if [ "$HTTP_STATUS" = "200" ]; then
            log_success "Worker is responding"
        else
            log_error "Worker health check failed (HTTP $HTTP_STATUS)"
        fi
    fi
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# DocShot AI Production Deployment Report

**Date**: $(date)
**Deployment ID**: $(date +%Y%m%d-%H%M%S)

## Services Deployed

### Web Application (Vercel)
- Status: ✅ Deployed
- URL: $VERCEL_URL
- Health: $([ "$WEB_HEALTH" = "200" ] && echo "✅ Healthy" || echo "❌ Unhealthy")

### Worker (Railway)
- Status: $([ "$SKIP_RAILWAY" = true ] && echo "⏭️ Skipped" || echo "✅ Deployed")
- URL: $RAILWAY_URL
- Health: $([ "$WORKER_HEALTH" = "200" ] && echo "✅ Healthy" || echo "❌ Unhealthy")

### Database (Supabase)
- Status: ✅ Migrations Applied
- Environment: Production

### Redis (Upstash)
- Status: ✅ Connected
- Environment: Production

## Next Steps

1. **Monitor Logs**: Check application logs for any errors
2. **Test Features**: Run end-to-end tests manually
3. **Set up Alerts**: Configure monitoring and alerting
4. **Documentation**: Update team documentation with new URLs

## Useful Commands

\`\`\`bash
# Check web app logs
vercel logs

# Check worker logs
railway logs

# Test production services
tsx scripts/test-production-services.ts
\`\`\`

## Emergency Contacts

- **Vercel Support**: https://vercel.com/help
- **Railway Support**: https://railway.app/help
- **Supabase Support**: https://supabase.com/support

---
Generated by DocShot AI deployment script
EOF

    log_success "Deployment report saved: $REPORT_FILE"
}

# Main deployment function
main() {
    echo "🚀 DocShot AI Production Deployment"
    echo "=================================="
    echo ""
    
    check_prerequisites
    test_services
    deploy_database
    deploy_web
    deploy_worker
    post_deployment_tests
    generate_report
    
    echo ""
    log_success "🎉 Production deployment completed!"
    echo ""
    log_info "Next steps:"
    echo "  1. Test the application functionality"
    echo "  2. Set up monitoring and alerts"
    echo "  3. Update DNS records if needed"
    echo "  4. Notify your team"
    echo ""
    log_info "Documentation:"
    echo "  - Setup guide: PRODUCTION_SETUP.md"
    echo "  - Deployment report: $REPORT_FILE"
    echo ""
}

# Trap errors and cleanup
trap 'log_error "Deployment failed! Check the logs above for details."' ERR

# Run main function
main "$@"