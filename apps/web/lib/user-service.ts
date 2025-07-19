// User management service - connects Clerk to our database
import { currentUser } from '@clerk/nextjs';
import { getSupabaseClient } from '@docshot/database';
import type { User } from '@docshot/database';

export class UserService {
  private supabase: ReturnType<typeof getSupabaseClient> | null = null;

  private getClient() {
    if (!this.supabase) {
      console.log('Creating Supabase client with:', {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      this.supabase = getSupabaseClient();
    }
    return this.supabase;
  }

  // Get the current user from Clerk and sync with our database
  async getCurrentUser(): Promise<User | null> {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Sync user with our database
    return this.syncUserWithDatabase(clerkUser);
  }

  // Sync Clerk user with our database
  async syncUserWithDatabase(clerkUser: any): Promise<User> {
    try {
      // Upsert user in our database
      const user = await this.getClient().upsertUser({
        id: clerkUser.id,
        emailAddresses: clerkUser.emailAddresses,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      });

      return user;
    } catch (error) {
      console.error('Failed to sync user with database:', error);

      // In local development we may not have the Supabase function, tables or Clerk keys ready.
      // Return a minimal stub user so the UI can render instead of hanging.
      if (process.env.NODE_ENV !== 'production') {
        return {
          id: clerkUser.id,
          clerk_user_id: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || 'dev@example.com',
          first_name: clerkUser.firstName ?? undefined,
          last_name: clerkUser.lastName ?? undefined,
          avatar_url: clerkUser.imageUrl ?? undefined,
          subscription_tier: 'free',
          subscription_status: 'active',
          monthly_screenshot_count: 0,
          monthly_screenshot_limit: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as unknown as User;
      }

      throw new Error('Failed to sync user data');
    }
  }

  // Get user by Clerk ID
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      return await this.getClient().getUserByClerkId(clerkId);
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  // Check if user can perform actions based on their subscription
  async checkUserPermissions(clerkId: string) {
    try {
      const limits = await this.getClient().checkUserLimits(clerkId);
      return limits;
    } catch (error) {
      console.error('Failed to check user permissions:', error);
      return {
        canCreateProject: false,
        canTakeScreenshot: false,
        usage: {
          screenshots: 0,
          limit: 0,
          projects: 0,
        },
      };
    }
  }

  // Update user subscription (called from Stripe webhooks)
  async updateUserSubscription(
    clerkId: string,
    subscription: {
      tier: 'free' | 'pro' | 'team';
      status: 'active' | 'canceled' | 'past_due';
      stripeCustomerId?: string;
    }
  ): Promise<void> {
    try {
      await this.getClient().withUserContext(clerkId, async (client) => {
        await client
          .from('users')
          .update({
            subscription_tier: subscription.tier,
            subscription_status: subscription.status,
            stripe_customer_id: subscription.stripeCustomerId,
            monthly_screenshot_limit: this.getScreenshotLimit(subscription.tier),
          })
          .eq('clerk_user_id', clerkId);
      });
    } catch (error) {
      console.error('Failed to update user subscription:', error);
      throw error;
    }
  }

  // Get screenshot limit based on subscription tier
  private getScreenshotLimit(tier: string): number {
    switch (tier) {
      case 'free':
        return 10;
      case 'pro':
      case 'team':
        return -1; // Unlimited
      default:
        return 10;
    }
  }

  // Track screenshot usage
  async trackScreenshotUsage(clerkId: string): Promise<void> {
    try {
      await this.getClient().incrementScreenshotCount(clerkId);
    } catch (error) {
      console.error('Failed to track screenshot usage:', error);
      throw error;
    }
  }

  // Get user's projects with permissions check
  async getUserProjects(clerkId: string) {
    try {
      // Use the new RPC function that properly enforces user isolation and gets counts
      const { data, error } = await this.getClient().getClient().rpc('get_user_projects_with_counts', {
        p_clerk_user_id: clerkId
      });

      if (error) throw error;
      
      // Transform to match expected format with screenshots array
      const projectsWithCounts = (data || []).map((project: any) => ({
        ...project,
        screenshots: [{ count: project.screenshot_count || 0 }]
      }));

      return projectsWithCounts;
    } catch (error) {
      console.error('Failed to get user projects:', error);
      return [];
    }
  }

  // Create a new project for user
  async createProject(
    clerkId: string,
    projectData: {
      name: string;
      description?: string;
      url: string;
      schedule?: string;
      github_repo_owner?: string;
      github_repo_name?: string;
      github_branch?: string;
      github_path?: string;
      github_auto_commit?: boolean;
    }
  ) {
    try {
      // Check if user can create projects
      const permissions = await this.checkUserPermissions(clerkId);
      if (!permissions.canCreateProject && process.env.NODE_ENV === 'production') {
        throw new Error('User has reached project limit for their subscription');
      }

      // Ensure a user row exists
      let user = await this.getUserByClerkId(clerkId);
      if (!user) {
        if (process.env.NODE_ENV !== 'production') {
          // create a minimal user row for local testing
          user = await this.getClient().upsertUser({
            id: clerkId,
            emailAddresses: [{ emailAddress: 'dev@example.com' }],
            firstName: 'Dev',
            lastName: 'User',
            imageUrl: undefined,
          });
        } else {
          throw new Error('User not found');
        }
      }

      return await this.getClient().withUserContext(clerkId, async (client) => {
        const { data, error } = await client
          .from('projects')
          .insert({
            user_id: user.id,
            name: projectData.name,
            description: projectData.description,
            url: projectData.url,
            schedule: projectData.schedule,
            github_repo_owner: projectData.github_repo_owner,
            github_repo_name: projectData.github_repo_name,
            github_branch: projectData.github_branch || 'main',
            github_path: projectData.github_path || 'screenshots/',
            github_auto_commit: projectData.github_auto_commit || false,
            is_active: true,
            total_screenshots: 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }
}

// Singleton instance
export const userService = new UserService();
