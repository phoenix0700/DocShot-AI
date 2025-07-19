export default function GitHubIntegrationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        GitHub Integration
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Automatically push approved screenshots to your GitHub repository. Keep your documentation always in sync with your product.
      </p>

      {/* Prerequisites */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>A GitHub account with repository access</li>
          <li>A GitHub Personal Access Token (PAT)</li>
          <li>Write permissions to your target repository</li>
          <li>Basic understanding of Git branches</li>
        </ul>
      </section>

      {/* Step 1: Create GitHub Token */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 1: Create a GitHub Personal Access Token
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-blue-900 font-semibold mb-2">🔐 Security Note</p>
          <p className="text-blue-800">
            Create a fine-grained personal access token with minimal permissions for better security.
          </p>
        </div>

        <ol className="space-y-4">
          <li>
            <p className="text-gray-700">
              <strong>1.</strong> Go to GitHub Settings → Developer settings → Personal access tokens → 
              <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                Fine-grained tokens
              </a>
            </p>
          </li>
          
          <li>
            <p className="text-gray-700">
              <strong>2.</strong> Click "Generate new token"
            </p>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>3.</strong> Configure your token:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-2">
              <ul className="space-y-2 text-sm">
                <li><strong>Token name:</strong> DocShot AI Screenshots</li>
                <li><strong>Expiration:</strong> 90 days (or your preference)</li>
                <li><strong>Repository access:</strong> Select specific repositories</li>
                <li><strong>Repositories:</strong> Choose your documentation repository</li>
              </ul>
            </div>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>4.</strong> Set repository permissions:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-2">
              <pre className="text-sm">
{`Contents: Read and Write
Metadata: Read (automatically selected)
Pull requests: Write (if using PR workflow)`}
              </pre>
            </div>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>5.</strong> Click "Generate token" and copy the token immediately
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
              <p className="text-yellow-800 text-sm">
                ⚠️ Save this token securely - you won't be able to see it again!
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Step 2: Add Token to DocShot */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 2: Add Token to DocShot AI
        </h2>
        
        <ol className="space-y-4">
          <li>
            <p className="text-gray-700">
              <strong>1.</strong> Go to your project settings in DocShot AI
            </p>
          </li>
          
          <li>
            <p className="text-gray-700">
              <strong>2.</strong> Navigate to "Environment Variables"
            </p>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>3.</strong> Add a new variable:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-2">
              <p className="font-mono text-sm">
                <strong>Name:</strong> GITHUB_TOKEN<br/>
                <strong>Value:</strong> ghp_your_token_here
              </p>
            </div>
          </li>

          <li>
            <p className="text-gray-700">
              <strong>4.</strong> Click "Save" to store the token securely
            </p>
          </li>
        </ol>
      </section>

      {/* Step 3: Configure YAML */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Step 3: Configure GitHub in YAML
        </h2>
        
        <p className="text-gray-700 mb-4">
          Add the GitHub integration to your project's YAML configuration:
        </p>

        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm">
{`integrations:
  github:
    # Required: Repository in format owner/repo
    repo: "acme-corp/documentation"
    
    # Required: Directory path for screenshots
    path: "static/screenshots"
    
    # Optional: Target branch (default: main)
    branch: "main"
    
    # Optional: Commit message template
    commitMessage: "docs: Update screenshots [skip ci]"
    
    # Optional: Create PR instead of direct commit
    pullRequest: false
    
    # Optional: PR settings (if pullRequest: true)
    pr:
      title: "Update screenshots"
      body: "Automated screenshot updates from DocShot AI"
      baseBranch: "main"
      labels: ["documentation", "automated"]`}
              </pre>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuration Options Explained</h3>
          
          <div className="space-y-3">
            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-gray-900">repo</p>
              <p className="text-gray-600 text-sm">The GitHub repository where screenshots will be pushed. Use the format "owner/repo".</p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-gray-900">path</p>
              <p className="text-gray-600 text-sm">Directory path within the repository. Will be created if it doesn't exist.</p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-gray-900">branch</p>
              <p className="text-gray-600 text-sm">Target branch for commits. Defaults to the repository's default branch.</p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-gray-900">commitMessage</p>
              <p className="text-gray-600 text-sm">Customize the commit message. Add [skip ci] to prevent CI triggers.</p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-gray-900">pullRequest</p>
              <p className="text-gray-600 text-sm">When true, creates a PR instead of committing directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Usage Examples</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Setup</h3>
            <p className="text-gray-700 mb-3">Simple configuration for direct commits:</p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  github:
    repo: "mycompany/docs"
    path: "images/screenshots"`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">With Pull Requests</h3>
            <p className="text-gray-700 mb-3">Create PRs for review before merging:</p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  github:
    repo: "mycompany/docs"
    path: "assets/screenshots"
    pullRequest: true
    pr:
      title: "🖼️ Update screenshots"
      body: |
        ## Screenshot Updates
        
        This PR contains automated screenshot updates from DocShot AI.
        
        Please review the changes before merging.
      baseBranch: "develop"
      labels: ["screenshots", "auto-generated"]`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organized by Feature</h3>
            <p className="text-gray-700 mb-3">Structure screenshots in subdirectories:</p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`integrations:
  github:
    repo: "mycompany/docs"
    path: "static/img/features/{{ project.name | slugify }}"
    commitMessage: "docs({{ project.name }}): Update screenshots"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* File Naming */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Naming Convention</h2>
        
        <p className="text-gray-700 mb-4">
          Screenshots are automatically named based on your configuration:
        </p>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Default Pattern</h3>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 text-sm">
            {`{screenshot-name}-{timestamp}.png`}
          </code>
          
          <div className="mt-4 space-y-2">
            <p className="text-gray-700 text-sm">Examples:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              <li>homepage-hero-2024-01-15-093042.png</li>
              <li>docs-getting-started-2024-01-15-093045.png</li>
              <li>dashboard-overview-2024-01-15-093048.png</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow Integration */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Workflow Integration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Direct Commit Workflow</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Screenshots are captured</li>
              <li>2. Visual changes detected</li>
              <li>3. You approve changes</li>
              <li>4. Files pushed to GitHub automatically</li>
              <li>5. Your site rebuilds with new images</li>
            </ol>
            <p className="text-gray-600 text-sm mt-3">
              Best for: Small teams, documentation sites
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pull Request Workflow</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Screenshots are captured</li>
              <li>2. Visual changes detected</li>
              <li>3. You approve changes</li>
              <li>4. PR created with new screenshots</li>
              <li>5. Team reviews and merges PR</li>
            </ol>
            <p className="text-gray-600 text-sm mt-3">
              Best for: Larger teams, production sites
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">Common Issues</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-red-900">Authentication Failed</p>
                <p className="text-red-800 text-sm">Ensure your GitHub token has the correct permissions and hasn't expired.</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-900">Repository Not Found</p>
                <p className="text-red-800 text-sm">Check the repo format is "owner/repo" and you have access to it.</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-900">Permission Denied</p>
                <p className="text-red-800 text-sm">Your token needs "Contents: Write" permission for the repository.</p>
              </div>
              
              <div>
                <p className="font-semibold text-red-900">Branch Doesn't Exist</p>
                <p className="text-red-800 text-sm">Ensure the specified branch exists in your repository.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">Testing Your Setup</h3>
            <ol className="space-y-2 text-green-800 text-sm">
              <li>1. Create a test screenshot configuration</li>
              <li>2. Run a manual capture</li>
              <li>3. Approve the screenshot</li>
              <li>4. Check your GitHub repository for the new file</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">✅ Recommended</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Use fine-grained tokens with minimal permissions</li>
              <li>• Add [skip ci] to commit messages to avoid build loops</li>
              <li>• Organize screenshots in logical directories</li>
              <li>• Use pull requests for production repositories</li>
              <li>• Set token expiration reminders</li>
              <li>• Test with a single screenshot first</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">❌ Avoid</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Using classic tokens (less secure)</li>
              <li>• Giving tokens admin or write access to code</li>
              <li>• Committing directly to production branches</li>
              <li>• Using the same token for multiple services</li>
              <li>• Storing tokens in your repository</li>
              <li>• Ignoring token expiration warnings</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Advanced Features
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Branch-based Captures</h3>
            <p className="text-gray-600 text-sm">
              Configure different screenshot sets for different branches (e.g., staging vs production).
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Custom File Naming</h3>
            <p className="text-gray-600 text-sm">
              Use template variables to customize how screenshots are named and organized.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Automated PR Reviews</h3>
            <p className="text-gray-600 text-sm">
              Set up GitHub Actions to automatically review and merge screenshot PRs.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a href="/docs/guides/advanced-github" className="text-blue-600 hover:text-blue-700 text-sm">
            Learn more about advanced GitHub features →
          </a>
        </div>
      </section>
    </div>
  );
}