export interface ScreenshotJobData {
  projectId: string;
  screenshotId: string;
  url: string;
  selector?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface DiffJobData {
  screenshotId: string;
  currentImageUrl: string;
  previousImageUrl: string;
}

export interface NotificationJobData {
  type: 'screenshot_captured' | 'diff_detected' | 'screenshot_failed';
  projectId: string;
  screenshotId: string;
  message: string;
}

export interface YamlConfig {
  name: string;
  url: string;
  selector?: string;
  viewport?: {
    width: number;
    height: number;
  };
  schedule?: string;
}

export interface ProjectConfig {
  version: string;
  project: {
    name: string;
    description?: string;
  };
  screenshots: YamlConfig[];
  integrations?: {
    github?: {
      repo: string;
      path: string;
    };
    notion?: {
      pageId: string;
    };
  };
}