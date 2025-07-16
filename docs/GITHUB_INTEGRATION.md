# GitHub Integration Recipe for Claude Code

## Overview
This document outlines how to set up and use GitHub integration with Claude Code for the DocShot AI project.

## Prerequisites
- GitHub Personal Access Token with appropriate permissions
- Claude Code with MCP (Model Context Protocol) support
- GitHub repository access

## Setup Instructions

### 1. GitHub Personal Access Token
Create a GitHub Personal Access Token with these permissions:
- `repo` (Full control of private repositories)
- `workflow` (Update GitHub Action workflows)
- `write:packages` (Upload packages to GitHub Package Registry)
- `read:org` (Read org and team membership, read org projects)

### 2. MCP Configuration
The GitHub MCP server should be configured in `~/.config/claude-code/.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### 3. Environment Variables
Update your `.env` file with:
```bash
GITHUB_TOKEN=your_github_personal_access_token
```

## Available GitHub Operations

### Repository Management
- Create, read, update repositories
- Manage branches and tags
- Handle repository settings

### Issue and PR Management
- Create, update, close issues
- Create, review, merge pull requests
- Manage labels and milestones
- Handle project boards

### Code Operations
- Read file contents from any branch
- Create commits and push changes
- Manage repository files
- Handle merge conflicts

### Workflow Automation
- Trigger GitHub Actions
- Monitor workflow runs
- Manage deployment status

## Common Use Cases

### 1. Automated Issue Creation
When bugs are detected during development:
```typescript
// Claude Code can automatically create GitHub issues
await github.createIssue({
  title: "Bug: Screenshot capture failing",
  body: "Error details and reproduction steps",
  labels: ["bug", "high-priority"]
});
```

### 2. Pull Request Management
For code reviews and deployments:
```typescript
// Automatically create PRs for feature branches
await github.createPullRequest({
  title: "feat: Add new screenshot capture engine",
  body: "Implements Puppeteer-based screenshot capture",
  head: "feature/screenshot-engine",
  base: "main"
});
```

### 3. Release Management
For version releases and deployments:
```typescript
// Create releases with automated changelog
await github.createRelease({
  tag_name: "v1.0.0",
  name: "DocShot AI v1.0.0",
  body: generateChangelog(),
  draft: false
});
```

## Integration with DocShot AI

### Project Structure Integration
- **Web App**: Automatic deployment via Vercel on push to main
- **Worker**: Background job deployment via Railway
- **Database**: Schema migrations via Supabase CLI

### Workflow Triggers
1. **Code Push**: Triggers build and test workflows
2. **PR Creation**: Runs validation and preview deployments
3. **Release Tags**: Triggers production deployment
4. **Issue Labels**: Automatically assigns team members

### Security Considerations
- Store sensitive tokens in environment variables
- Use repository secrets for CI/CD
- Implement proper access controls
- Regular token rotation

## Troubleshooting

### MCP Server Issues
If GitHub MCP server doesn't work:
1. Verify token permissions
2. Check network connectivity
3. Restart Claude Code
4. Reinstall MCP server: `npm install -g @modelcontextprotocol/server-github`

### Authentication Problems
- Verify token is not expired
- Check repository access permissions
- Ensure token has required scopes

### API Rate Limits
- GitHub API allows 5000 requests/hour for authenticated users
- Implement request throttling for bulk operations
- Use GraphQL API for complex queries

## Best Practices

1. **Commit Messages**: Use conventional commit format
2. **Branch Strategy**: Use feature branches and PRs
3. **Code Reviews**: Require at least one review before merge
4. **CI/CD**: Automated testing and deployment
5. **Documentation**: Keep README and docs updated
6. **Security**: Regular dependency updates and security scans

## Example Workflows

### Feature Development
```bash
# Claude Code can automate this entire workflow:
1. Create feature branch
2. Implement changes
3. Run tests and linting
4. Create pull request
5. Request reviews
6. Merge after approval
7. Deploy to staging
8. Create release notes
```

### Bug Fix Process
```bash
# Automated bug fix workflow:
1. Create issue from bug report
2. Create hotfix branch
3. Implement fix
4. Run regression tests
5. Create emergency PR
6. Fast-track review
7. Deploy hotfix
8. Update documentation
```

## Monitoring and Analytics
- Track repository activity
- Monitor deployment success rates
- Analyze code review metrics
- Generate productivity reports

This integration enables Claude Code to fully manage the DocShot AI project lifecycle through GitHub APIs.