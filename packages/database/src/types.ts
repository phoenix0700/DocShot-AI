// DocShot AI Database Types
// Comprehensive multi-tenant schema types

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  
  // Subscription
  subscription_tier: 'free' | 'pro' | 'team';
  subscription_status: 'active' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  
  // Usage tracking
  monthly_screenshot_count: number;
  monthly_screenshot_limit: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  
  // Project details
  name: string;
  description?: string;
  url: string;
  
  // Configuration
  schedule?: string; // Cron expression
  is_active: boolean;
  
  // GitHub integration
  github_repo_owner?: string;
  github_repo_name?: string;
  github_branch: string;
  github_path: string;
  github_auto_commit: boolean;
  
  // Statistics
  total_screenshots: number;
  last_run_at?: string;
  last_run_status?: 'success' | 'failed' | 'running';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Screenshot {
  id: string;
  project_id: string;
  
  // Configuration
  name: string;
  url: string;
  selector?: string;
  viewport_width: number;
  viewport_height: number;
  full_page: boolean;
  wait_for_selector?: string;
  wait_for_timeout?: number;
  
  // Authentication (encrypted)
  auth_username?: string;
  auth_password?: string;
  cookies?: Record<string, any>;
  headers?: Record<string, any>;
  
  // Current state
  status: 'pending' | 'processing' | 'completed' | 'failed';
  last_captured_at?: string;
  last_image_url?: string;
  last_image_size?: number;
  
  // Error tracking
  last_error?: string;
  retry_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ScreenshotHistory {
  id: string;
  screenshot_id: string;
  
  // Image data
  image_url: string;
  image_size?: number;
  image_hash?: string;
  
  // Diff data
  diff_image_url?: string;
  diff_percentage?: number;
  diff_pixel_count?: number;
  has_significant_change: boolean;
  
  // Approval workflow
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by_user_id?: string;
  approved_at?: string;
  
  // Metadata
  capture_metadata?: Record<string, any>;
  
  // Timestamps
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  
  // Details
  type: 'screenshot_captured' | 'change_detected' | 'job_failed' | 'approval_needed';
  title: string;
  message: string;
  
  // Related entities
  project_id?: string;
  screenshot_id?: string;
  screenshot_history_id?: string;
  
  // Status
  is_read: boolean;
  email_sent: boolean;
  email_sent_at?: string;
  
  // Timestamps
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  
  // Key details
  name: string;
  key_hash: string;
  key_prefix: string;
  
  // Permissions
  scopes: string[];
  
  // Usage tracking
  last_used_at?: string;
  usage_count: number;
  
  // Status
  is_active: boolean;
  expires_at?: string;
  
  // Timestamps
  created_at: string;
}

// =====================================================
// Legacy Database Interface (Supabase Auto-generated)
// =====================================================
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<User>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Project>;
      };
      screenshots: {
        Row: Screenshot;
        Insert: Omit<Screenshot, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Screenshot>;
      };
      screenshot_history: {
        Row: ScreenshotHistory;
        Insert: Omit<ScreenshotHistory, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ScreenshotHistory>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Notification>;
      };
      api_keys: {
        Row: ApiKey;
        Insert: Omit<ApiKey, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ApiKey>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// =====================================================
// Database Helper Types
// =====================================================

export interface DatabaseConfig {
  url: string;
  serviceKey: string;
}

export interface UserWithProjects extends User {
  projects: Project[];
}

export interface ProjectWithScreenshots extends Project {
  screenshots: Screenshot[];
}

export interface ScreenshotWithHistory extends Screenshot {
  history: ScreenshotHistory[];
}

// =====================================================
// API Request/Response Types
// =====================================================

export interface CreateProjectRequest {
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

export interface CreateScreenshotRequest {
  project_id: string;
  name: string;
  url: string;
  selector?: string;
  viewport_width?: number;
  viewport_height?: number;
  full_page?: boolean;
  wait_for_selector?: string;
  wait_for_timeout?: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: string;
}

export interface UpdateScreenshotRequest extends Partial<CreateScreenshotRequest> {
  id: string;
}

// =====================================================
// Queue Job Types (for BullMQ)
// =====================================================

export interface ScreenshotJobData {
  projectId: string;
  screenshotId: string;
  url: string;
  selector?: string;
  viewport?: {
    width: number;
    height: number;
  };
  userId?: string; // For RLS context
}

export interface DiffJobData {
  screenshotId: string;
  previousImageUrl: string;
  newImageUrl: string;
  userId?: string;
}

export interface NotificationJobData {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  projectId?: string;
  screenshotId?: string;
  screenshotHistoryId?: string;
}

// =====================================================
// Subscription & Billing Types
// =====================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // In cents
  interval: 'month' | 'year';
  features: {
    screenshot_limit: number; // -1 for unlimited
    project_limit: number;
    github_integration: boolean;
    priority_support: boolean;
    custom_scheduling: boolean;
    team_collaboration: boolean;
  };
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: {
      screenshot_limit: 10,
      project_limit: 1,
      github_integration: false,
      priority_support: false,
      custom_scheduling: false,
      team_collaboration: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2900, // $29.00
    interval: 'month',
    features: {
      screenshot_limit: -1, // Unlimited
      project_limit: -1,
      github_integration: true,
      priority_support: false,
      custom_scheduling: true,
      team_collaboration: false,
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    price: 9900, // $99.00
    interval: 'month',
    features: {
      screenshot_limit: -1,
      project_limit: -1,
      github_integration: true,
      priority_support: true,
      custom_scheduling: true,
      team_collaboration: true,
    },
  },
};

// =====================================================
// Utility Types
// =====================================================

export type DatabaseTable = 
  | 'users'
  | 'projects' 
  | 'screenshots'
  | 'screenshot_history'
  | 'notifications'
  | 'api_keys';

export type DatabaseRecord = 
  | User
  | Project
  | Screenshot
  | ScreenshotHistory
  | Notification
  | ApiKey;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}