export interface Integration {
  name: string;
  uploadScreenshot(imageBuffer: Buffer, filename: string): Promise<string>;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
}

export interface NotionConfig {
  token: string;
  pageId: string;
}
