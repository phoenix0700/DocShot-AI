# YAML Configuration Reference

This document describes all available configuration options for DocShot AI YAML files.

## Basic Structure

```yaml
version: "1.0"                    # Required: Configuration version
project:                          # Required: Project settings
  name: "string"                  # Required: Project name
  description: "string"           # Optional: Project description
  baseUrl: "https://example.com"  # Optional: Base URL for relative paths
  defaultViewport:                # Optional: Default viewport settings
    width: 1920                   # Default: 1920
    height: 1080                  # Default: 1080
  retryAttempts: 3               # Optional: Retry failed captures (0-5)
  retryDelay: 5000               # Optional: Delay between retries (ms)

screenshots: []                   # Required: Array of screenshot configs
integrations: {}                  # Optional: Integration settings
settings: {}                      # Optional: Global settings
```

## Screenshot Configuration

Each screenshot in the `screenshots` array can have these properties:

```yaml
screenshots:
  - name: "Screenshot Name"       # Required: Unique name
    url: "https://example.com"    # Required: URL to capture
    selector: ".css-selector"     # Optional: Specific element to capture
    viewport:                     # Optional: Override default viewport
      width: 1280
      height: 720
    fullPage: true                # Optional: Capture full page (default: true)
    hideElements:                 # Optional: CSS selectors to hide
      - ".cookie-banner"
      - "#ads"
    waitFor:                      # Optional: Wait conditions
      type: "selector"            # Type: selector, timeout, networkIdle, custom
      value: ".content-loaded"    # Value depends on type
      timeout: 5000               # Optional: Max wait time (ms)
    authentication:               # Optional: Basic auth
      username: "user"
      password: "pass"
    cookies:                      # Optional: Set cookies before capture
      - name: "session"
        value: "abc123"
        domain: ".example.com"
        path: "/"
    customCSS: |                  # Optional: Inject custom CSS
      .header { display: none; }
    userAgent: "Custom UA"        # Optional: Override user agent
    schedule: "0 9 * * *"         # Optional: Cron schedule
    enabled: true                 # Optional: Enable/disable (default: true)
    tags: ["production", "docs"]  # Optional: Tags for organization
    diffThreshold: 0.1            # Optional: Diff sensitivity (0-100)
```

### Wait Conditions

Different types of wait conditions:

```yaml
# Wait for selector
waitFor:
  type: "selector"
  value: ".loaded-indicator"
  timeout: 10000

# Wait for fixed time
waitFor:
  type: "timeout"
  value: 3000

# Wait for network idle
waitFor:
  type: "networkIdle"
  value: 500  # Max network idle time (ms)

# Custom JavaScript
waitFor:
  type: "custom"
  value: "window.dataLoaded === true"
```

### Multiple Wait Conditions

You can specify multiple conditions (all must be met):

```yaml
waitFor:
  - type: "selector"
    value: ".content"
  - type: "networkIdle"
    value: 500
```

## Integrations

### GitHub Integration

```yaml
integrations:
  github:
    repo: "owner/repository"      # Required: GitHub repository
    path: "docs/screenshots"      # Optional: Path in repo (default: "screenshots")
    branch: "main"                # Optional: Target branch (default: "main")
    autoCommit: true              # Optional: Auto-commit changes (default: false)
    commitMessage: "Update screenshots" # Optional: Custom commit message
```

### Notion Integration

```yaml
integrations:
  notion:
    pageId: "abc123..."           # Required: Notion page ID
    updateMode: "replace"         # Optional: "replace" or "append"
```

### Slack Integration

```yaml
integrations:
  slack:
    webhook: "https://hooks.slack.com/..." # Required: Webhook URL
    channel: "#screenshots"       # Optional: Override channel
    mentions:                     # Optional: Users to mention
      - "@team"
      - "@john"
```

### Email Integration

```yaml
integrations:
  email:
    recipients:                   # Required: Email addresses
      - "team@example.com"
      - "docs@example.com"
    subject: "Screenshot Update"  # Optional: Email subject template
    template: "custom"            # Optional: Email template name
```

## Global Settings

```yaml
settings:
  concurrency: 3                  # Optional: Parallel captures (1-10)
  timeout: 30000                  # Optional: Global timeout (ms)
  userAgent: "DocShot AI/1.0"    # Optional: Global user agent
  defaultDiffThreshold: 0.1       # Optional: Global diff threshold
```

## Complete Example

```yaml
version: "1.0"
project:
  name: "ACME Documentation"
  description: "Automated screenshots for ACME Corp docs"
  baseUrl: "https://app.acme.com"
  defaultViewport:
    width: 1920
    height: 1080
  retryAttempts: 3
  retryDelay: 5000

screenshots:
  # Dashboard screenshot
  - name: "Dashboard Overview"
    url: "/dashboard"
    fullPage: true
    schedule: "0 9 * * 1-5"  # Weekdays at 9 AM
    tags: ["dashboard", "overview"]
    
  # Login page with custom viewport
  - name: "Login Page"
    url: "/login"
    viewport:
      width: 768
      height: 1024
    tags: ["auth", "mobile"]
    
  # Analytics with authentication
  - name: "Analytics Report"
    url: "/analytics"
    selector: ".report-container"
    authentication:
      username: "demo"
      password: "demo123"
    waitFor:
      type: "selector"
      value: ".chart-loaded"
      timeout: 10000
    hideElements:
      - ".beta-banner"
    tags: ["analytics", "reports"]
    
  # API docs with custom CSS
  - name: "API Reference"
    url: "https://docs.acme.com/api"
    selector: ".api-content"
    customCSS: |
      .sidebar { display: none; }
      .content { max-width: 100%; }
    diffThreshold: 0.5
    tags: ["api", "docs"]

integrations:
  github:
    repo: "acme/documentation"
    path: "images/screenshots"
    branch: "main"
    autoCommit: true
    commitMessage: "Update screenshots [skip ci]"
    
  email:
    recipients:
      - "docs-team@acme.com"
    subject: "[DocShot] Screenshot Update for {project.name}"
    
  slack:
    webhook: "https://hooks.slack.com/services/xxx/yyy/zzz"
    channel: "#docs-updates"
    mentions: ["@docs-team"]

settings:
  concurrency: 5
  timeout: 60000
  defaultDiffThreshold: 0.1
```

## Validation Rules

1. **Version**: Must be a valid semver format (e.g., "1.0", "1.0.0")
2. **URLs**: Must be valid HTTP(S) URLs
3. **Viewport**: Width 320-3840px, Height 240-2160px
4. **Timeouts**: 1000-60000ms
5. **Retry Attempts**: 0-5
6. **Concurrency**: 1-10
7. **Diff Threshold**: 0-100 (percentage)
8. **Cron Schedule**: Valid cron expression

## Environment Variable Substitution

You can use environment variables in your YAML:

```yaml
screenshots:
  - name: "Staging Dashboard"
    url: "${STAGING_URL}/dashboard"
    authentication:
      username: "${TEST_USER}"
      password: "${TEST_PASS}"
```

## Tips and Best Practices

1. **Use tags** to organize and filter screenshots
2. **Set appropriate timeouts** for slow-loading pages
3. **Use selectors** to capture specific components
4. **Hide dynamic elements** that change frequently
5. **Configure diff thresholds** based on content type
6. **Test locally** before deploying to production
7. **Use version control** for your YAML configs
8. **Start simple** and add complexity as needed

## Troubleshooting

### Common Issues

**Invalid YAML syntax**
- Use a YAML validator
- Check indentation (2 spaces)
- Quote special characters

**Screenshots timing out**
- Increase timeout values
- Check wait conditions
- Verify URL accessibility

**High false-positive diffs**
- Hide dynamic elements
- Increase diff threshold
- Use specific selectors

**Authentication failures**
- Verify credentials
- Check cookie settings
- Test authentication manually