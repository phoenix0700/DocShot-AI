# Getting Started with DocShot AI

Welcome to DocShot AI! This guide will help you get up and running in minutes.

## Overview

DocShot AI automates screenshot capture and management for your documentation. It:
- Captures screenshots on a schedule or on-demand
- Detects visual changes automatically
- Updates your documentation across multiple platforms
- Notifies you when changes need review

## Quick Start (5 minutes)

### 1. Sign Up

1. Go to [docshot.ai](https://docshot.ai)
2. Click "Get Started" 
3. Sign up with your email or GitHub account
4. Verify your email address

### 2. Create Your First Project

1. Click "New Project" in your dashboard
2. Enter a project name (e.g., "My App Documentation")
3. Add an optional description
4. Click "Create Project"

### 3. Configure Screenshots

1. In your project, click "Configure"
2. Paste this starter configuration:

```yaml
version: "1.0"
project:
  name: "My App Documentation"
  
screenshots:
  - name: "Homepage"
    url: "https://myapp.com"
    schedule: "0 9 * * *"  # Daily at 9 AM
    
  - name: "Dashboard"  
    url: "https://myapp.com/dashboard"
    selector: ".main-content"
```

3. Click "Save Configuration"

### 4. Run Your First Capture

1. Go back to your project dashboard
2. Click "Run Screenshots"
3. Wait for the captures to complete
4. View your screenshots!

## Understanding the Workflow

### 1. Configuration
Define what to capture using YAML:
- URLs to screenshot
- CSS selectors for specific elements
- Schedules for automatic capture
- Authentication if needed

### 2. Capture
DocShot AI uses headless Chrome to:
- Navigate to your URLs
- Wait for content to load
- Take pixel-perfect screenshots
- Store them securely

### 3. Diff Detection
When screenshots update:
- Compares with previous version
- Highlights visual changes
- Calculates change percentage
- Flags significant differences

### 4. Review & Approve
For detected changes:
- Review side-by-side diffs
- Approve legitimate updates
- Reject unwanted changes
- Add notes for context

### 5. Integration
Approved screenshots can:
- Push to GitHub automatically
- Update Notion pages
- Trigger webhooks
- Send notifications

## Common Use Cases

### Documentation Screenshots
```yaml
screenshots:
  - name: "Getting Started Guide"
    url: "https://docs.myapp.com/getting-started"
    selector: ".doc-content"
    schedule: "0 0 * * 0"  # Weekly on Sunday
```

### Feature Demos
```yaml
screenshots:
  - name: "New Feature Demo"
    url: "https://app.myapp.com/features/new"
    viewport:
      width: 1280
      height: 720
    waitFor:
      type: "selector"
      value: ".feature-loaded"
```

### Mobile Views
```yaml
screenshots:
  - name: "Mobile Dashboard"
    url: "https://app.myapp.com"
    viewport:
      width: 375
      height: 667
    userAgent: "Mozilla/5.0 (iPhone...)"
```

### Authenticated Pages
```yaml
screenshots:
  - name: "User Settings"
    url: "https://app.myapp.com/settings"
    cookies:
      - name: "session_token"
        value: "${SESSION_TOKEN}"
        domain: ".myapp.com"
```

## Setting Up Integrations

### GitHub Integration

1. In your project settings, click "Integrations"
2. Select "GitHub"
3. Authorize DocShot AI
4. Configure in your YAML:

```yaml
integrations:
  github:
    repo: "myorg/docs"
    path: "images/screenshots"
    autoCommit: true
```

### Email Notifications

1. Add email recipients in your YAML:

```yaml
integrations:
  email:
    recipients:
      - "team@mycompany.com"
```

2. You'll receive notifications for:
   - Successful captures
   - Detected changes
   - Failed screenshots

## Best Practices

### 1. Start Simple
Begin with a few key screenshots and expand gradually.

### 2. Use Meaningful Names
```yaml
# Good
- name: "Checkout Process - Payment Step"

# Bad  
- name: "Screenshot 1"
```

### 3. Hide Dynamic Content
```yaml
hideElements:
  - ".timestamp"
  - ".user-specific-data"
  - "#live-chat-widget"
```

### 4. Set Appropriate Schedules
- Daily: For frequently updated pages
- Weekly: For stable documentation
- Monthly: For rarely changing content

### 5. Group Related Screenshots
Use tags to organize:
```yaml
tags: ["onboarding", "mobile", "v2"]
```

## Troubleshooting

### Screenshot Fails to Capture

**Check URL accessibility:**
- Is the URL publicly accessible?
- Does it require authentication?
- Are there geo-restrictions?

**Increase timeouts:**
```yaml
waitFor:
  type: "timeout"
  value: 10000  # 10 seconds
```

### Too Many False Positive Changes

**Hide dynamic elements:**
```yaml
hideElements:
  - ".date-display"
  - ".random-banner"
```

**Increase diff threshold:**
```yaml
diffThreshold: 1.0  # Less sensitive
```

### Authentication Issues

**For basic auth:**
```yaml
authentication:
  username: "demo"
  password: "demo123"
```

**For cookie-based:**
```yaml
cookies:
  - name: "auth_token"
    value: "your-token"
    domain: ".example.com"
```

## Next Steps

1. **Explore Advanced Features**
   - Custom CSS injection
   - Multiple wait conditions
   - Viewport testing

2. **Set Up Team Collaboration**
   - Invite team members
   - Configure approval workflows
   - Set up notifications

3. **Automate Your Workflow**
   - Configure schedules
   - Set up CI/CD triggers
   - Create webhook integrations

## Need Help?

- 📖 Read the [YAML Reference](YAML_REFERENCE.md)
- 🚀 Check [Deployment Guide](DEPLOYMENT.md)
- 💬 Join our [Discord Community](https://discord.gg/docshot)
- 📧 Email support@docshot.ai

Happy screenshotting! 📸