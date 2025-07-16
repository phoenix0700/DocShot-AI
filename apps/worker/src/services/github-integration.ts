import { GitHubIntegration, GitHubConfig } from '@docshot/integrations';
import { supabase } from '@docshot/database';
import { logger } from '../lib/logger';

export class GitHubIntegrationService {
  private githubIntegration: GitHubIntegration | null = null;

  constructor(private config?: GitHubConfig) {
    if (config) {
      this.githubIntegration = new GitHubIntegration(config);
    }
  }

  /**
   * Upload a screenshot to GitHub
   */
  async uploadScreenshot(
    projectId: string,
    screenshotId: string,
    imageBuffer: Buffer,
    filename: string
  ): Promise<string | null> {
    if (!this.githubIntegration) {
      logger.warn('GitHub integration not configured for project', { projectId });
      return null;
    }

    try {
      logger.info('Uploading screenshot to GitHub', {
        projectId,
        screenshotId,
        filename,
      });

      const url = await this.githubIntegration.uploadScreenshot(imageBuffer, filename);

      // Update the screenshot record with GitHub URL
      const { error } = await supabase
        .from('screenshots')
        .update({
          github_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', screenshotId);

      if (error) {
        logger.error('Failed to update screenshot with GitHub URL', {
          error,
          screenshotId,
        });
      }

      logger.info('Screenshot uploaded to GitHub successfully', {
        projectId,
        screenshotId,
        url,
      });

      return url;
    } catch (error) {
      logger.error('Failed to upload screenshot to GitHub', {
        error: error instanceof Error ? error.message : String(error),
        projectId,
        screenshotId,
      });
      throw error;
    }
  }

  /**
   * Create a pull request with updated screenshots
   */
  async createPullRequest(
    projectId: string,
    screenshots: Array<{ name: string; url: string }>
  ): Promise<string | null> {
    // This is a placeholder for future PR creation functionality
    // For MVP, we'll just upload files directly to the default branch
    logger.info('Pull request creation not implemented in MVP', {
      projectId,
      screenshotCount: screenshots.length,
    });
    return null;
  }

  /**
   * Initialize GitHub integration from project configuration
   */
  static async fromProjectConfig(projectId: string): Promise<GitHubIntegrationService | null> {
    try {
      // Fetch project configuration from database
      const { data: project, error } = await supabase
        .from('projects')
        .select('config')
        .eq('id', projectId)
        .single();

      if (error || !project?.config) {
        logger.warn('No project configuration found', { projectId });
        return new GitHubIntegrationService();
      }

      const config = project.config as any;
      
      if (!config.integrations?.github) {
        logger.debug('No GitHub integration configured', { projectId });
        return new GitHubIntegrationService();
      }

      const githubConfig = config.integrations.github;
      const token = process.env.GITHUB_TOKEN || '';

      if (!token) {
        logger.error('GitHub token not found in environment variables');
        return new GitHubIntegrationService();
      }

      // Parse the repo format (owner/repo)
      const [owner, repo] = githubConfig.repo.split('/');

      return new GitHubIntegrationService({
        token,
        owner,
        repo,
        path: githubConfig.path || 'screenshots',
      });
    } catch (error) {
      logger.error('Failed to initialize GitHub integration', {
        error: error instanceof Error ? error.message : String(error),
        projectId,
      });
      return new GitHubIntegrationService();
    }
  }
}