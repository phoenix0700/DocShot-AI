'use client';

import { useState } from 'react';
import { Project, Screenshot } from '@docshot/database';
import { Button } from '../ui/Button';

interface YamlConfigViewerProps {
  project: Project & {
    screenshots?: Screenshot[];
  };
}

export function YamlConfigViewer({ project }: YamlConfigViewerProps) {
  const [copied, setCopied] = useState(false);

  const generateYamlConfig = () => {
    const config = {
      version: '1.0',
      project: {
        name: project.name,
        description: project.description || undefined,
        url: project.url,
      },
      screenshots:
        project.screenshots?.map((screenshot) => ({
          name: screenshot.name,
          url: screenshot.url,
          ...(screenshot.selector && { selector: screenshot.selector }),
          viewport: {
            width: screenshot.viewport_width,
            height: screenshot.viewport_height,
          },
          fullPage: screenshot.full_page,
          ...(screenshot.wait_for_selector && { waitForSelector: screenshot.wait_for_selector }),
          ...(screenshot.wait_for_timeout && { waitForTimeout: screenshot.wait_for_timeout }),
        })) || [],
      ...(project.schedule && {
        schedule: project.schedule,
      }),
      ...(project.github_repo_name && {
        integrations: {
          github: {
            repository: `${project.github_repo_owner}/${project.github_repo_name}`,
            branch: project.github_branch,
            path: project.github_path,
            autoCommit: project.github_auto_commit,
          },
        },
      }),
    };

    // Convert to YAML-like format (simple implementation)
    const yamlString = objectToYaml(config);
    return yamlString;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateYamlConfig());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadConfig = () => {
    const yamlContent = generateYamlConfig();
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-config.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">YAML Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">
            Export your project configuration as a YAML file for version control or backup
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className={copied ? 'text-green-600' : ''}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </Button>
          <Button onClick={downloadConfig} className="bg-blue-600 hover:bg-blue-700">
            Download
          </Button>
        </div>
      </div>

      {/* YAML Content */}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 whitespace-pre-wrap">
          <code>{generateYamlConfig()}</code>
        </pre>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">🚀 How to use this configuration</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>1. Save the configuration:</strong> Download or copy the YAML above and save it
            as
            <code className="bg-blue-100 px-1 rounded mx-1">.docshot.yml</code> in your project
            root.
          </p>
          <p>
            <strong>2. Install DocShot CLI:</strong>
            <code className="bg-blue-100 px-1 rounded mx-1">npm install -g @docshot/cli</code>
          </p>
          <p>
            <strong>3. Run screenshots:</strong>
            <code className="bg-blue-100 px-1 rounded mx-1">docshot run</code>
          </p>
          <p>
            <strong>4. Automate with CI/CD:</strong> Add the run command to your GitHub Actions,
            Jenkins, or other CI/CD pipeline.
          </p>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration Summary</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-medium text-gray-500">Project Name</dt>
            <dd className="text-sm text-gray-900 mt-1">{project.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Base URL</dt>
            <dd className="text-sm text-gray-900 mt-1">{project.url}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Screenshots</dt>
            <dd className="text-sm text-gray-900 mt-1">
              {project.screenshots?.length || 0} configured
            </dd>
          </div>
          {project.schedule && (
            <div>
              <dt className="text-xs font-medium text-gray-500">Schedule</dt>
              <dd className="text-sm text-gray-900 mt-1">
                <code className="bg-gray-100 px-1 rounded text-xs">{project.schedule}</code>
              </dd>
            </div>
          )}
          {project.github_repo_name && (
            <>
              <div>
                <dt className="text-xs font-medium text-gray-500">GitHub Repository</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {project.github_repo_owner}/{project.github_repo_name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Auto-commit</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {project.github_auto_commit ? 'Enabled' : 'Disabled'}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>

      {/* Example CI/CD Integration */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">GitHub Actions Example</h4>
        <p className="text-sm text-gray-600 mb-3">
          Add this to{' '}
          <code className="bg-gray-200 px-1 rounded">.github/workflows/screenshots.yml</code> to
          automate screenshot updates:
        </p>
        <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded overflow-x-auto">
          {`name: Update Screenshots

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:      # Manual trigger

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install DocShot CLI
        run: npm install -g @docshot/cli
        
      - name: Run Screenshots
        run: docshot run --config .docshot.yml
        env:
          DOCSHOT_API_KEY: \${{ secrets.DOCSHOT_API_KEY }}
          
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git diff --staged --quiet || git commit -m "Update screenshots [automated]"
          git push`}
        </pre>
      </div>
    </div>
  );
}

// Simple YAML converter (basic implementation)
function objectToYaml(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;

    yaml += `${spaces}${key}:`;

    if (value === null) {
      yaml += ' null\n';
    } else if (typeof value === 'string') {
      yaml += ` "${value}"\n`;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      yaml += ` ${value}\n`;
    } else if (Array.isArray(value)) {
      yaml += '\n';
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spaces}  -\n`;
          yaml += objectToYaml(item, indent + 2).replace(/^ {2}/, '    ');
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      yaml += '\n';
      yaml += objectToYaml(value, indent + 1);
    }
  }

  return yaml;
}
