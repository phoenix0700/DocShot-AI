import { z } from 'zod';

export const ViewportSchema = z.object({
  width: z.number().min(320).max(3840),
  height: z.number().min(240).max(2160),
});

export const WaitConditionSchema = z.object({
  type: z.enum(['selector', 'timeout', 'networkIdle', 'custom']),
  value: z.union([z.string(), z.number()]),
  timeout: z.number().min(1000).max(30000).optional(),
});

export const AuthenticationSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const CookieSchema = z.object({
  name: z.string(),
  value: z.string(),
  domain: z.string().optional(),
  path: z.string().optional(),
});

export const ScreenshotConfigSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  selector: z.string().optional(),
  viewport: ViewportSchema.optional(),
  fullPage: z.boolean().optional().default(true),
  hideElements: z.array(z.string()).optional(),
  waitFor: z.union([WaitConditionSchema, z.array(WaitConditionSchema)]).optional(),
  authentication: AuthenticationSchema.optional(),
  cookies: z.array(CookieSchema).optional(),
  customCSS: z.string().optional(),
  userAgent: z.string().optional(),
  schedule: z
    .string()
    .regex(
      /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([12]?\d|3[01])) (\*|([0]?\d|1[0-2])) (\*|([0-6]))$/
    )
    .optional(),
  enabled: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional(),
  diffThreshold: z.number().min(0).max(100).optional().default(0.1),
});

export const IntegrationConfigSchema = z.object({
  github: z
    .object({
      repo: z.string().regex(/^[\w\-\.]+\/[\w\-\.]+$/), // owner/repo format
      path: z.string().optional(),
      branch: z.string().optional().default('main'),
      autoCommit: z.boolean().optional().default(false),
      commitMessage: z.string().optional(),
    })
    .optional(),
  notion: z
    .object({
      pageId: z.string(),
      updateMode: z.enum(['replace', 'append']).optional().default('replace'),
    })
    .optional(),
  slack: z
    .object({
      webhook: z.string().url(),
      channel: z.string().optional(),
      mentions: z.array(z.string()).optional(),
    })
    .optional(),
  email: z
    .object({
      recipients: z.array(z.string().email()),
      subject: z.string().optional(),
      template: z.string().optional(),
    })
    .optional(),
});

export const ProjectConfigSchema = z.object({
  version: z
    .string()
    .regex(/^\d+\.\d+(\.\d+)?$/, 'Version must be in semver format (e.g., "1.0" or "1.0.0")'),
  project: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    baseUrl: z.string().url().optional(),
    defaultViewport: ViewportSchema.optional(),
    retryAttempts: z.number().min(0).max(5).optional().default(3),
    retryDelay: z.number().min(1000).max(60000).optional().default(5000),
  }),
  screenshots: z
    .array(ScreenshotConfigSchema)
    .min(1, 'At least one screenshot configuration is required'),
  integrations: IntegrationConfigSchema.optional(),
  settings: z
    .object({
      concurrency: z.number().min(1).max(10).optional().default(3),
      timeout: z.number().min(5000).max(60000).optional().default(30000),
      userAgent: z.string().optional(),
      defaultDiffThreshold: z.number().min(0).max(100).optional().default(0.1),
    })
    .optional(),
});

export const ScreenshotJobDataSchema = z.object({
  projectId: z.string().uuid(),
  screenshotId: z.string().uuid(),
  url: z.string().url(),
  selector: z.string().optional(),
  viewport: ViewportSchema.optional(),
});

export const DiffJobDataSchema = z.object({
  screenshotId: z.string().uuid(),
  currentImageUrl: z.string().url(),
  previousImageUrl: z.string().url(),
});

export const NotificationJobDataSchema = z.object({
  type: z.enum([
    'screenshot_captured',
    'diff_detected',
    'screenshot_failed',
    'project_summary',
    'bulk_changes',
  ]),
  projectId: z.string().uuid(),
  screenshotId: z.string().uuid(),
  message: z.string(),
  diffImageUrl: z.string().optional(),
  diffData: z
    .object({
      pixelDiff: z.number(),
      percentageDiff: z.number(),
      totalPixels: z.number(),
    })
    .optional(),
  summary: z
    .object({
      totalScreenshots: z.number(),
      changesDetected: z.number(),
      pendingApproval: z.number(),
      failed: z.number(),
    })
    .optional(),
  changes: z
    .array(
      z.object({
        screenshotName: z.string(),
        percentageDiff: z.number(),
        url: z.string().optional(),
      })
    )
    .optional(),
  period: z.string().optional(),
});
