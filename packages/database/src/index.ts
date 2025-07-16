// Multi-tenant database exports
export {
  createSupabaseClient,
  getSupabaseClient,
  MultiTenantSupabaseClient,
} from './supabase-client';

// Type exports
export * from './types';

// Legacy exports for backwards compatibility  
export * from './client';
export * from './schemas';
