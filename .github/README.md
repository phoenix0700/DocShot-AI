# DocShot AI - CI/CD Documentation

## Overview

This directory contains GitHub Actions workflows for continuous integration and deployment of DocShot AI.

## Workflows

### 1. CI (`ci.yml`)
**Trigger**: Push to `main`/`develop`, Pull Requests

**Jobs**:
- **Lint**: Code linting with ESLint
- **Type Check**: TypeScript type checking
- **Test**: Unit tests with Jest
- **Build**: Build all packages and apps
- **Security**: Security audit and vulnerability scanning
- **Integration Tests**: End-to-end functionality tests

**Services**:
- Redis (for queue testing)
- PostgreSQL (for database testing)

### 2. Pull Request (`pr.yml`)
**Trigger**: Pull Request events

**Jobs**:
- **PR Checks**: Linting, type checking, testing, building
- **Size Check**: Bundle size analysis and limits
- **Preview Deploy**: Deploy to Vercel preview environment
- **Code Quality**: Security audit, license checking, complexity analysis

**Features**:
- Automated preview deployments
- Bundle size monitoring
- Breaking change detection
- Code quality metrics

### 3. Deploy (`deploy.yml`)
**Trigger**: Push to `main` branch

**Jobs**:
- **Deploy Web**: Deploy Next.js app to Vercel
- **Deploy Worker**: Deploy worker to Railway
- **Migrate Database**: Apply Supabase migrations
- **Notify Deployment**: Send deployment status notifications

**Deployment Targets**:
- **Web App**: Vercel
- **Worker**: Railway
- **Database**: Supabase

### 4. Release (`release.yml`)
**Trigger**: Git tags (`v*`) or manual workflow dispatch

**Jobs**:
- **Create Release**: Generate GitHub releases with changelog
- **Docker Build**: Build and push Docker images
- **Notify Release**: Send release notifications

**Artifacts**:
- GitHub releases with changelogs
- Docker images (`docshot/web`, `docshot/worker`)
- Deployment packages

## Required Secrets

### General
- `TURBO_TOKEN`: Turborepo remote cache token
- `TURBO_TEAM`: Turborepo team name

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service key (for worker)
- `SUPABASE_PROJECT_REF`: Supabase project reference
- `SUPABASE_ACCESS_TOKEN`: Supabase API token

### Clerk (Authentication)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key

### Vercel (Web App Deployment)
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Railway (Worker Deployment)
- `RAILWAY_TOKEN`: Railway deployment token

### Docker (Release)
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password

### Application
- `NEXT_PUBLIC_APP_URL`: Public app URL
- `REDIS_URL`: Redis connection string
- `S3_BUCKET`: S3 bucket name
- `S3_ACCESS_KEY`: S3 access key
- `S3_SECRET_KEY`: S3 secret key
- `GITHUB_TOKEN`: GitHub token for integrations
- `SMTP_HOST`: Email server host
- `SMTP_USER`: Email server username
- `SMTP_PASS`: Email server password

## Workflow Features

### Continuous Integration
- ✅ **Automated testing** on every push and PR
- ✅ **Multi-job parallelization** for faster feedback
- ✅ **Caching** for dependencies and build artifacts
- ✅ **Security scanning** with dependency audits
- ✅ **Code quality checks** with linting and formatting

### Continuous Deployment
- ✅ **Automatic deployments** on main branch
- ✅ **Preview deployments** for pull requests
- ✅ **Database migrations** as part of deployment
- ✅ **Multi-environment** support (staging/production)
- ✅ **Rollback capabilities** through GitHub releases

### Release Management
- ✅ **Automated releases** with semantic versioning
- ✅ **Changelog generation** from commit messages
- ✅ **Docker image publishing** to Docker Hub
- ✅ **Asset packaging** for manual deployments
- ✅ **Release notifications** for team awareness

### Quality Assurance
- ✅ **Bundle size monitoring** with limits
- ✅ **Breaking change detection** for APIs
- ✅ **License compliance** checking
- ✅ **Code complexity analysis**
- ✅ **Security vulnerability scanning**

## Usage

### Running Locally
```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Manual Deployment
```bash
# Deploy to production (requires secrets)
gh workflow run deploy.yml

# Create a release
gh release create v1.0.0 --generate-notes
```

### Development Workflow
1. **Create feature branch** from `develop`
2. **Make changes** and commit
3. **Open pull request** to `develop`
4. **CI runs automatically** - checks must pass
5. **Preview deployment** created automatically
6. **Code review** and approval
7. **Merge to develop** triggers staging deployment
8. **Merge to main** triggers production deployment

### Release Workflow
1. **Create release tag** (`v1.0.0`)
2. **Release workflow** runs automatically
3. **GitHub release** created with changelog
4. **Docker images** built and pushed
5. **Deployment packages** uploaded as assets

## Monitoring

### Build Status
- Check workflow status in GitHub Actions tab
- Monitor build times and success rates
- Review failed builds and error logs

### Deployment Status
- Vercel deployments visible in dashboard
- Railway deployments tracked in platform
- Database migrations logged in Supabase

### Performance Metrics
- Bundle size trends over time
- Build time optimization opportunities
- Test coverage and quality metrics

## Troubleshooting

### Common Issues
1. **Build failures**: Check dependency versions and lock file
2. **Deployment failures**: Verify secrets and environment variables
3. **Test failures**: Review test output and fix broken tests
4. **Security failures**: Update vulnerable dependencies

### Debug Steps
1. Check workflow logs in GitHub Actions
2. Verify required secrets are configured
3. Test changes locally before pushing
4. Review deployment platform logs

## Contributing

### Adding New Workflows
1. Create new workflow file in `.github/workflows/`
2. Follow existing patterns for consistency
3. Add required secrets documentation
4. Test thoroughly before merging

### Updating Dependencies
1. Update `package.json` files
2. Run `pnpm install` to update lock file
3. Test all workflows with new dependencies
4. Update CI/CD if breaking changes

### Security Considerations
- Never commit secrets to repository
- Use GitHub secrets for sensitive data
- Regularly audit and rotate secrets
- Monitor for security vulnerabilities

## Support

For issues with CI/CD workflows:
1. Check GitHub Actions logs
2. Review this documentation
3. Contact the development team
4. Create issue in repository