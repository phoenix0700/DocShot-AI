# DocShot AI - Architecture Decisions

## System Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js Web   │────▶│   Supabase DB    │◀────│  Worker Nodes   │
│   (Vercel)      │     │   (PostgreSQL)   │     │  (Fly.io)       │
└────────┬────────┘     └──────────────────┘     └────────┬────────┘
         │                                                  │
         │              ┌──────────────────┐                │
         └─────────────▶│     Redis        │◀───────────────┘
                        │   (BullMQ)       │
                        └──────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   S3 Storage    │
                        │  (Screenshots)  │
                        └─────────────────┘
```

## Core Design Patterns

### 1. Queue-Based Processing
- **Pattern**: Producer-Consumer with BullMQ
- **Why**: Decouple screenshot capture from web requests
- **Implementation**:
  ```typescript
  // Producer (API)
  await screenshotQueue.add('capture', {
    projectId,
    screenshotName,
    config
  });

  // Consumer (Worker)
  screenshotQueue.process('capture', async (job) => {
    await captureScreenshot(job.data);
  });
  ```

### 2. Repository Pattern
- **Pattern**: Abstract data access behind interfaces
- **Why**: Swap implementations, easier testing
- **Example**:
  ```typescript
  interface ScreenshotRepository {
    findById(id: string): Promise<Screenshot>;
    updateStatus(id: string, status: Status): Promise<void>;
  }
  ```

### 3. Strategy Pattern for Integrations
- **Pattern**: Pluggable integration handlers
- **Why**: Easy to add new CMS integrations
- **Structure**:
  ```typescript
  interface IntegrationStrategy {
    push(screenshot: Screenshot): Promise<void>;
    validate(config: unknown): boolean;
  }
  
  class GitHubIntegration implements IntegrationStrategy {}
  class NotionIntegration implements IntegrationStrategy {}
  ```

## Module Responsibilities

### `apps/web/`
- **Purpose**: User-facing dashboard
- **Responsibilities**:
  - Authentication (Clerk)
  - Project management UI
  - Screenshot review/approval
  - Configuration editing
  - Usage analytics display

### `apps/worker/`
- **Purpose**: Background job processing
- **Responsibilities**:
  - Screenshot capture orchestration
  - Visual diff computation
  - Integration pushing
  - Webhook dispatching
  - Scheduled captures

### `packages/database/`
- **Purpose**: Data layer
- **Responsibilities**:
  - Schema definitions
  - Migration scripts
  - Type-safe queries (via Supabase client)
  - Row-level security policies

### `packages/shared/`
- **Purpose**: Cross-app utilities
- **Responsibilities**:
  - TypeScript types/interfaces
  - Validation schemas (Zod)
  - Common utilities
  - Error classes

### `packages/integrations/`
- **Purpose**: Third-party integrations
- **Responsibilities**:
  - CMS-specific API clients
  - Authentication flows
  - Error handling/retries
  - Rate limiting

## Data Flow

### Screenshot Capture Flow
```
1. User triggers capture (API or schedule)
    │
2. API validates request & enqueues job
    │
3. Worker picks up job from queue
    │
4. Puppeteer captures screenshot
    │
5. Upload to S3, get signed URL
    │
6. Compare with previous version
    │
7. Update database with results
    │
8. Send notifications if changed
```

### Integration Push Flow
```
1. User approves screenshot update
    │
2. Load integration config
    │
3. Select appropriate strategy
    │
4. Transform screenshot for target
    │
5. Push to external service
    │
6. Update sync status
    │
7. Dispatch webhook
```

## Performance Optimizations

### Puppeteer Pool Management
```typescript
class PuppeteerPool {
  private browsers: Browser[] = [];
  private maxBrowsers = 5;
  
  async acquire(): Promise<Browser> {
    // Reuse existing or spawn new
  }
  
  async release(browser: Browser): void {
    // Return to pool or close if over limit
  }
}
```

### Image Storage Strategy
- Store original PNGs in S3 with intelligent naming: `{projectId}/{screenshotName}/{timestamp}.png`
- Generate WebP versions for web display
- Use CloudFront CDN for serving
- Implement lifecycle rules: move to cold storage after 90 days

### Caching Strategy
- Redis for hot data (current screenshot URLs, diff results)
- Edge caching for static assets
- Database query results cached for 5 minutes
- Invalidate on updates

## Scalability Considerations

### Horizontal Scaling
- **Web tier**: Vercel handles automatically
- **Workers**: Fly.io autoscaling based on queue depth
- **Database**: Supabase connection pooling
- **Redis**: Redis Cluster for high availability

### Resource Limits
```typescript
const LIMITS = {
  MAX_CONCURRENT_BROWSERS: 5,
  MAX_SCREENSHOT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_CAPTURE_TIME: 30000, // 30s
  MAX_QUEUE_SIZE: 10000,
  MAX_RETRIES: 3
};
```

### Monitoring & Observability
- **APM**: Sentry for error tracking
- **Metrics**: Prometheus + Grafana
- **Logs**: Structured logging with Pino
- **Alerts**: PagerDuty for critical issues

## Deployment Architecture

### Environments
```
Production:
- Web: Vercel (auto-deploy from main)
- Workers: Fly.io (blue-green deployment)
- Database: Supabase (managed)

Staging:
- Identical setup with `-staging` suffix
- Separate Supabase project

Development:
- Local Docker Compose
- Local Supabase
- MinIO for S3 compatibility
```

### CI/CD Pipeline
```yaml
# Simplified GitHub Actions flow
on: [push]
jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Check TypeScript
    - Lint code
  
  deploy:
    if: branch == main
    - Deploy to Vercel
    - Build Worker image
    - Deploy to Fly.io
    - Run migrations
```

## Future Architecture Considerations

### Phase 2 Features
1. **Multi-region support**: Deploy workers closer to customer sites
2. **Browser fingerprinting**: Detect JS-rendered changes
3. **AI-powered cropping**: Use vision models to auto-detect UI components
4. **Batch operations**: Capture multiple screenshots in single browser session

### Technical Debt to Address
1. [ ] Implement proper event sourcing for audit trail
2. [ ] Add circuit breakers for external integrations  
3. [ ] Implement blue-green deployments for workers
4. [ ] Add request signing for webhook security