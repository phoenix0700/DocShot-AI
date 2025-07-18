// Authenticated Supabase client that enforces RLS
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

interface AuthenticatedSupabaseClient {
  client: SupabaseClient<Database>;
  setUserContext: (clerkUserId: string) => Promise<void>;
}

/**
 * Creates a Supabase client that properly enforces RLS
 * This should be used for all client-facing operations
 */
export function createAuthenticatedSupabaseClient(): AuthenticatedSupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Use anon key instead of service key to ensure RLS is enforced
  const client = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return {
    client,
    async setUserContext(clerkUserId: string) {
      // For anon key, we need to use custom JWT with user context
      // This is a temporary solution until we implement proper Supabase Auth
      const { error } = await client.rpc('set_config', {
        setting_name: 'app.current_user_id',
        new_value: clerkUserId,
        is_local: false,
      });

      if (error) {
        console.error('Failed to set user context:', error);
        throw error;
      }
    },
  };
}

/**
 * Creates a server-side Supabase client with proper user context
 * This ensures RLS is enforced even on server-side operations
 */
export async function createServerSupabaseClient(clerkUserId: string) {
  const client = createAuthenticatedSupabaseClient();
  await client.setUserContext(clerkUserId);
  return client.client;
}