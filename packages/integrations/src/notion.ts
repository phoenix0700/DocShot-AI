import { Client } from '@notionhq/client';
import type { Integration, NotionConfig } from './types';

export class NotionIntegration implements Integration {
  name = 'notion';
  private notion: Client;
  private config: NotionConfig;

  constructor(config: NotionConfig) {
    this.config = config;
    this.notion = new Client({
      auth: config.token,
    });
  }

  async uploadScreenshot(imageBuffer: Buffer, filename: string): Promise<string> {
    // Note: Notion doesn't support direct file uploads via API
    // This would require uploading to a file service first, then linking
    // For now, this is a placeholder implementation
    
    try {
      const response = await this.notion.blocks.children.append({
        block_id: this.config.pageId,
        children: [
          {
            type: 'image',
            image: {
              type: 'external',
              external: {
                url: 'https://via.placeholder.com/800x600.png?text=Placeholder',
              },
            },
          },
        ],
      });

      return `notion://block/${response.results[0]?.id || ''}`;
    } catch (error) {
      throw new Error(`Failed to upload to Notion: ${error}`);
    }
  }
}