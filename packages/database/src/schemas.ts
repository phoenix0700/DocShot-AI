import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ScreenshotSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  url: z.string().url(),
  selector: z.string().nullable(),
  image_url: z.string().url().nullable(),
  status: z.enum(['pending', 'captured', 'failed']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Screenshot = z.infer<typeof ScreenshotSchema>;