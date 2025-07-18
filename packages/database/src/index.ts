// Multi-tenant database exports
export {
  createSupabaseClient,
  getSupabaseClient,
  MultiTenantSupabaseClient,
} from './supabase-client';

// Type exports - use types from the generated types file
export * from './types';

// Legacy exports for backwards compatibility  
export * from './client';
// Export schemas but not the conflicting types
export { ProjectSchema, ScreenshotSchema } from './schemas';
