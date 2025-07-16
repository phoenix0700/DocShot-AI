import { Octokit } from '@octokit/rest';
import type { Integration, GitHubConfig } from './types';

export class GitHubIntegration implements Integration {
  name = 'github';
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  async uploadScreenshot(imageBuffer: Buffer, filename: string): Promise<string> {
    const content = imageBuffer.toString('base64');
    const path = `${this.config.path}/${filename}`;

    try {
      // Check if file exists
      let sha: string | undefined;
      try {
        const existing = await this.octokit.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path,
        });

        if ('sha' in existing.data) {
          sha = existing.data.sha;
        }
      } catch (error) {
        // File doesn't exist, that's ok
      }

      const result = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message: `Update screenshot: ${filename}`,
        content,
        sha,
      });

      return result.data.content?.download_url || '';
    } catch (error) {
      throw new Error(`Failed to upload to GitHub: ${error}`);
    }
  }
}
