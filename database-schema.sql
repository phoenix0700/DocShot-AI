-- DocShot AI Multi-Tenant Database Schema
-- This schema supports multiple users with isolated data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Store user profile information from Clerk
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Clerk's user ID
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  
  -- Subscription info
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due')),
  stripe_customer_id TEXT,
  
  -- Usage tracking
  monthly_screenshot_count INTEGER DEFAULT 0,
  monthly_screenshot_limit INTEGER DEFAULT 10, -- Free tier limit
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create index on clerk_user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_isolation_policy ON users
  FOR ALL
  USING (clerk_user_id = current_setting('app.current_user_id', true));

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
-- Store screenshot projects for each user
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Project details
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL, -- Base URL for the project
  
  -- Configuration
  schedule TEXT, -- Cron expression for scheduled captures
  is_active BOOLEAN DEFAULT true,
  
  -- GitHub integration
  github_repo_owner TEXT,
  github_repo_name TEXT,
  github_branch TEXT DEFAULT 'main',
  github_path TEXT DEFAULT 'screenshots/',
  github_auto_commit BOOLEAN DEFAULT false,
  
  -- Statistics
  total_screenshots INTEGER DEFAULT 0,
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_run_status TEXT CHECK (last_run_status IN ('success', 'failed', 'running')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_schedule ON projects(schedule) WHERE schedule IS NOT NULL;

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only access their own projects
CREATE POLICY projects_isolation_policy ON projects
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- SCREENSHOTS TABLE
-- =====================================================
-- Store individual screenshot configurations and results
CREATE TABLE IF NOT EXISTS screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Screenshot configuration
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  selector TEXT, -- CSS selector for element screenshots
  viewport_width INTEGER DEFAULT 1920,
  viewport_height INTEGER DEFAULT 1080,
  full_page BOOLEAN DEFAULT true,
  wait_for_selector TEXT,
  wait_for_timeout INTEGER,
  
  -- Authentication (encrypted)
  auth_username TEXT,
  auth_password TEXT,
  cookies JSONB,
  headers JSONB,
  
  -- Current state
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  last_captured_at TIMESTAMP WITH TIME ZONE,
  last_image_url TEXT, -- S3/Storage URL
  last_image_size INTEGER, -- Bytes
  
  -- Error tracking
  last_error TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_screenshots_project_id ON screenshots(project_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_status ON screenshots(status);
CREATE INDEX IF NOT EXISTS idx_screenshots_last_captured ON screenshots(last_captured_at);

-- Enable RLS on screenshots table
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

-- Users can only access screenshots from their own projects
CREATE POLICY screenshots_isolation_policy ON screenshots
  FOR ALL
  USING (project_id IN (
    SELECT p.id FROM projects p 
    JOIN users u ON p.user_id = u.id 
    WHERE u.clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- SCREENSHOT_HISTORY TABLE
-- =====================================================
-- Store historical versions of screenshots for comparison
CREATE TABLE IF NOT EXISTS screenshot_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
  
  -- Image data
  image_url TEXT NOT NULL,
  image_size INTEGER,
  image_hash TEXT, -- For deduplication
  
  -- Diff data (compared to previous version)
  diff_image_url TEXT,
  diff_percentage DECIMAL(5,2), -- Percentage of pixels changed
  diff_pixel_count INTEGER,
  has_significant_change BOOLEAN DEFAULT false,
  
  -- Approval workflow
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  capture_metadata JSONB, -- Browser info, timing, etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_screenshot_history_screenshot_id ON screenshot_history(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_approval_status ON screenshot_history(approval_status);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_created_at ON screenshot_history(created_at);

-- Enable RLS
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;

-- Users can only access history from their own screenshots
CREATE POLICY screenshot_history_isolation_policy ON screenshot_history
  FOR ALL
  USING (screenshot_id IN (
    SELECT s.id FROM screenshots s
    JOIN projects p ON s.project_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE u.clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
-- Store notification history and preferences
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN ('screenshot_captured', 'change_detected', 'job_failed', 'approval_needed')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entities
  project_id UUID REFERENCES projects(id),
  screenshot_id UUID REFERENCES screenshots(id),
  screenshot_history_id UUID REFERENCES screenshot_history(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY notifications_isolation_policy ON notifications
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- API_KEYS TABLE
-- =====================================================
-- Store API keys for programmatic access
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Key details
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE, -- Hashed API key
  key_prefix TEXT NOT NULL, -- First 8 chars for display
  
  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read'], -- ['read', 'write', 'admin']
  
  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only see their own API keys
CREATE POLICY api_keys_isolation_policy ON api_keys
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screenshots_updated_at BEFORE UPDATE ON screenshots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset monthly screenshot count
CREATE OR REPLACE FUNCTION reset_monthly_screenshot_counts()
RETURNS void AS $$
BEGIN
  UPDATE users SET monthly_screenshot_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user's screenshot count
CREATE OR REPLACE FUNCTION increment_screenshot_count(user_clerk_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET monthly_screenshot_count = monthly_screenshot_count + 1
  WHERE clerk_user_id = user_clerk_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (for development)
-- =====================================================

-- Note: This will be populated by the application when users sign up
-- The Clerk integration will automatically create user records

-- =====================================================
-- SECURITY NOTES
-- =====================================================

-- RLS (Row Level Security) ensures that:
-- 1. Users can only see their own data
-- 2. All queries automatically filter by user
-- 3. No accidental data leaks between tenants

-- To use RLS in the application, set the user context:
-- SELECT set_config('app.current_user_id', 'clerk_user_123', true);

-- This must be set on every database connection before making queries