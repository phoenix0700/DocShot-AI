# DocShot AI - Detailed Project Specification

## User Stories

### Core User Journey
- As a **technical writer**, I want to automatically detect when product screenshots are outdated so that I don't ship stale documentation
- As a **developer**, I want to integrate screenshot updates into my CI/CD pipeline so that docs stay in sync with releases
- As a **team lead**, I want to see which screenshots need updating across all our docs so that I can prioritize documentation work
- As a **solo founder**, I want a simple YAML config so that I don't need to write code to automate screenshots

## Screenshot Configuration Schema

```yaml
# docshot.yaml
version: 1
project: my-saas-app

defaults:
  viewport:
    width: 1280
    height: 800
  waitFor: networkidle2
  fullPage: false

screenshots:
  - name: dashboard-overview
    url: https://app.example.com/dashboard
    selector: "#main-content"  # Optional: capture specific element
    steps:  # Optional: interaction steps before capture
      - type: click
        selector: "#accept-cookies"
      - type: wait
        duration: 2000
    
  - name: user-settings
    url: https://app.example.com/settings
    fullPage: true
    mask:  # Privacy: mask sensitive areas
      - ".email-field"
      - "#credit-card-info"
    
  - name: feature-modal
    url: https://app.example.com/features
    steps:
      - type: click
        selector: "#open-modal-btn"
      - type: waitForSelector
        selector: ".modal-content"

integrations:
  github:
    owner: mycompany
    repo: docs
    branch: main
    path: static/screenshots/
  
  notion:
    workspace_id: xxx
    database_id: yyy
```

## API Endpoints

### Public API (REST)
```
POST /api/v1/projects
  Body: { name: string, yaml_config: string }
  Returns: { id: string, api_key: string }

GET /api/v1/projects/:id/screenshots
  Returns: Screenshot[]

POST /api/v1/projects/:id/screenshots/capture
  Body: { screenshot_names?: string[] }  // Capture specific or all
  Returns: { job_id: string }

GET /api/v1/jobs/:id
  Returns: { status: 'pending' | 'processing' | 'completed' | 'failed' }

POST /api/v1/screenshots/:id/approve
  Body: { push_to_integrations: boolean }
  Returns: { success: boolean }

GET /api/v1/screenshots/:id/diff
  Returns: { old_url: string, new_url: string, diff_percentage: number }
```

### Webhook Events
```
screenshot.captured - When a new screenshot is taken
screenshot.changed - When visual diff detects changes
screenshot.approved - When user approves an update
screenshot.pushed - When update is pushed to integrations
```

## Data Models

### Database Schema
```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL, -- Clerk user ID
  api_key TEXT UNIQUE NOT NULL,
  yaml_config TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Screenshots
CREATE TABLE screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL, -- Parsed from YAML
  current_image_url TEXT,
  current_captured_at TIMESTAMP,
  pending_image_url TEXT,
  pending_captured_at TIMESTAMP,
  diff_percentage FLOAT,
  status TEXT CHECK (status IN ('current', 'stale', 'pending_approval')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, name)
);

-- Screenshot History
CREATE TABLE screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screenshot_id UUID REFERENCES screenshots(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  captured_at TIMESTAMP NOT NULL,
  diff_percentage FLOAT,
  approved_by TEXT,
  approved_at TIMESTAMP
);

-- Integration Configs
CREATE TABLE integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('github', 'notion', 'confluence')),
  config JSONB NOT NULL, -- Encrypted sensitive data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  payload JSONB,
  result JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Business Logic Rules

### Screenshot Capture
1. **Rate Limiting**: Max 100 screenshots per project per hour
2. **Timeout**: Each screenshot attempt times out after 30 seconds
3. **Retries**: Failed captures retry 3 times with exponential backoff
4. **Concurrency**: Max 5 concurrent Puppeteer instances per worker

### Visual Diff
1. **Threshold**: Default 5% pixel difference to mark as "stale"
2. **Ignore Regions**: Support for ignoring dynamic areas (timestamps, random IDs)
3. **Smart Crop**: Auto-detect and crop to content area if selector not provided

### Integration Rules
1. **GitHub**: 
   - Requires GitHub App installation
   - Creates PR with screenshot updates
   - Can auto-merge if diff < 5%

2. **Notion**:
   - Updates inline images in pages
   - Maintains version history

3. **Confluence**:
   - Updates attachments
   - Adds comment with diff preview

### Pricing Tiers
```
FREE:
- 25 screenshots/month
- 1 project
- Email notifications only
- 7-day history

INDIE ($19/mo):
- 300 screenshots/month
- 3 projects
- Slack integration
- 30-day history
- Webhooks

PRO ($49/mo):
- 2000 screenshots/month
- Unlimited projects
- All integrations
- 90-day history
- API access
- Priority support

ENTERPRISE ($299+/mo):
- Unlimited screenshots
- SSO/SAML
- On-premise runner option
- Custom integrations
- SLA guarantee
```

## Security Considerations

### Authentication & Authorization
- Clerk for user authentication
- API keys for programmatic access
- Row-level security in Supabase

### Data Security
- All screenshot URLs are signed with 24-hour expiry
- Integration credentials encrypted at rest
- No storage of actual webpage content, only images
- PII masking options in configuration

### Infrastructure Security
- Puppeteer runs in sandboxed containers
- Network isolation between customer jobs
- No execution of customer-provided code
- Rate limiting on all endpoints