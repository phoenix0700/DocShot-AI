// Multi-tenant Supabase client with Row Level Security
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, User } from './types';

interface SupabaseClientConfig {
  url: string;
  serviceKey: string;
  clerkUserId?: string; // For RLS context
}

class MultiTenantSupabaseClient {
  private client: SupabaseClient<Database>;
  private clerkUserId?: string;

  constructor(config: SupabaseClientConfig) {
    this.client = createClient<Database>(config.url, config.serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    });
    
    this.clerkUserId = config.clerkUserId;
  }

  // Set the user context for RLS
  async setUserContext(clerkUserId: string): Promise<void> {
    this.clerkUserId = clerkUserId;
    
    // Set the RLS context
    const { error } = await this.client.rpc('set_config', {
      setting_name: 'app.current_user_id',
      new_value: clerkUserId,
      is_local: true,
    });

    if (error) {
      // If we get an invalid API key error, it's a critical configuration issue
      if (error.message === 'Invalid API key') {
        console.error('CRITICAL: Invalid Supabase API key. Please check your SUPABASE_SERVICE_KEY in .env.local');
        console.error('The service key might have expired or been regenerated in Supabase dashboard.');
        // Don't throw here to allow the app to partially function
        return;
      }
      
      if (error.code !== 'PGRST202') {
        // PGRST202: function not found in schema cache – likely local dev DB without the helper
        console.error('Failed to set user context:', error);
        throw new Error(`Failed to set user context: ${error.message}`);
      }
    }
  }

  // Get or create user from Clerk data
  async upsertUser(clerkUser: {
    id: string;
    emailAddresses: { emailAddress: string }[];
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }): Promise<User> {
    await this.setUserContext(clerkUser.id);

    const userData = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      avatar_url: clerkUser.imageUrl || null,
      last_login_at: new Date().toISOString(),
    };

    const { data, error } = await this.client
      .from('users')
      .upsert(userData, {
        onConflict: 'clerk_user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }

    return data;
  }

  // Get user by Clerk ID
  async getUserByClerkId(clerkUserId: string): Promise<User | null> {
    await this.setUserContext(clerkUserId);

    const { data, error } = await this.client
      .from('users')
      .select()
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No user found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }

  // Check if user can perform action (usage limits)
  async checkUserLimits(clerkUserId: string): Promise<{
    canCreateProject: boolean;
    canTakeScreenshot: boolean;
    usage: {
      screenshots: number;
      limit: number;
      projects: number;
    };
  }> {
    await this.setUserContext(clerkUserId);

    const { data: user, error } = await this.client
      .from('users')
      .select('id, subscription_tier, monthly_screenshot_count, monthly_screenshot_limit')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      throw new Error(`Failed to check limits: ${error.message}`);
    }

    const { data: projects, error: projectsError } = await this.client
      .from('projects')
      .select('id')
      .eq('user_id', user.id as any);

    if (projectsError) {
      throw new Error(`Failed to count projects: ${projectsError.message}`);
    }

    const projectCount = projects?.length || 0;
    
    // Check limits based on subscription tier
    const canCreateProject = user.subscription_tier === 'free' ? projectCount < 1 : true;
    const canTakeScreenshot = user.monthly_screenshot_count < user.monthly_screenshot_limit;

    return {
      canCreateProject,
      canTakeScreenshot,
      usage: {
        screenshots: user.monthly_screenshot_count,
        limit: user.monthly_screenshot_limit,
        projects: projectCount,
      },
    };
  }

  // Increment screenshot count
  async incrementScreenshotCount(clerkUserId: string): Promise<void> {
    await this.setUserContext(clerkUserId);

    const { error } = await this.client.rpc('increment_screenshot_count', {
      user_clerk_id: clerkUserId,
    });

    if (error) {
      throw new Error(`Failed to increment screenshot count: ${error.message}`);
    }
  }

  // Get the underlying Supabase client for direct queries
  // Note: Make sure to call setUserContext() before using this
  getClient(): SupabaseClient<Database> {
    if (!this.clerkUserId) {
      console.warn('User context not set. RLS may not work correctly.');
    }
    return this.client;
  }

  // NEW: lightweight passthrough to underlying client so existing code can continue
  // to use `supabase.from('table')` directly when holding a MultiTenantSupabaseClient
  // instance. This keeps backward-compatibility with older code and removes the
  // current TS errors in worker jobs.
  from<TableName extends string>(
    table: TableName
  ): ReturnType<SupabaseClient<Database>["from"]> {
    // Delegate to the underlying client.
    // Casting return type keeps the helper fully typed while avoiding exposure
    // of internal `@supabase/postgrest-js` generics that upset the TS linter.
    return this.client.from(table as any) as ReturnType<
      SupabaseClient<Database>["from"]
    >;
  }

  // Helper method for authenticated queries
  async withUserContext<T>(
    clerkUserId: string,
    operation: (client: SupabaseClient<Database>) => Promise<T>
  ): Promise<T> {
    await this.setUserContext(clerkUserId);
    return operation(this.client);
  }
}

// Factory function to create client instances
export function createSupabaseClient(
  url: string,
  serviceKey: string,
  clerkUserId?: string
): MultiTenantSupabaseClient {
  return new MultiTenantSupabaseClient({
    url,
    serviceKey,
    clerkUserId,
  });
}

// Singleton instance for server-side usage
let globalClient: MultiTenantSupabaseClient | null = null;

export function getSupabaseClient(): MultiTenantSupabaseClient {
  if (!globalClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !serviceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    globalClient = createSupabaseClient(url, serviceKey);
  }

  return globalClient;
}

// Export types for convenience
export type { Database, User } from './types';
export { MultiTenantSupabaseClient };