-- Migration to Multi-tenant Schema
-- Run this on your Supabase database to upgrade to multi-tenant structure

-- =====================================================
-- BACKUP EXISTING DATA (OPTIONAL)
-- =====================================================
-- CREATE TABLE projects_backup AS SELECT * FROM projects;
-- CREATE TABLE screenshots_backup AS SELECT * FROM screenshots;

-- =====================================================
-- STEP 1: Create Users Table
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
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
  monthly_screenshot_limit INTEGER DEFAULT 10,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS users_isolation_policy ON users;

-- Create RLS policy
CREATE POLICY users_isolation_policy ON users
  FOR ALL
  USING (clerk_user_id = current_setting('app.current_user_id', true));

-- =====================================================
-- STEP 2: Update Projects Table
-- =====================================================

-- Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS schedule TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS github_repo_owner TEXT,
ADD COLUMN IF NOT EXISTS github_repo_name TEXT,
ADD COLUMN IF NOT EXISTS github_branch TEXT DEFAULT 'main',
ADD COLUMN IF NOT EXISTS github_path TEXT DEFAULT 'screenshots/',
ADD COLUMN IF NOT EXISTS github_auto_commit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_screenshots INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_run_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_run_status TEXT CHECK (last_run_status IN ('success', 'failed', 'running')),
ADD COLUMN IF NOT EXISTS url TEXT;

-- Update the user_id to reference users table (if not already)
-- Note: This assumes existing projects have valid user_ids
-- You may need to create sample users first

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_schedule ON projects(schedule) WHERE schedule IS NOT NULL;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS projects_isolation_policy ON projects;

-- Create RLS policy
CREATE POLICY projects_isolation_policy ON projects
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- STEP 3: Update Screenshots Table
-- =====================================================

-- Add new columns to screenshots table
ALTER TABLE screenshots
ADD COLUMN IF NOT EXISTS viewport_width INTEGER DEFAULT 1920,
ADD COLUMN IF NOT EXISTS viewport_height INTEGER DEFAULT 1080,
ADD COLUMN IF NOT EXISTS full_page BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS wait_for_selector TEXT,
ADD COLUMN IF NOT EXISTS wait_for_timeout INTEGER,
ADD COLUMN IF NOT EXISTS auth_username TEXT,
ADD COLUMN IF NOT EXISTS auth_password TEXT,
ADD COLUMN IF NOT EXISTS cookies JSONB,
ADD COLUMN IF NOT EXISTS headers JSONB,
ADD COLUMN IF NOT EXISTS last_captured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_image_url TEXT,
ADD COLUMN IF NOT EXISTS last_image_size INTEGER,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- Update status enum if needed
-- You may need to add new status values to existing enum
-- ALTER TYPE screenshot_status ADD VALUE IF NOT EXISTS 'processing';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_screenshots_project_id ON screenshots(project_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_status ON screenshots(status);
CREATE INDEX IF NOT EXISTS idx_screenshots_last_captured ON screenshots(last_captured_at);

-- Enable RLS
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS screenshots_isolation_policy ON screenshots;

-- Create RLS policy
CREATE POLICY screenshots_isolation_policy ON screenshots
  FOR ALL
  USING (project_id IN (
    SELECT p.id FROM projects p 
    JOIN users u ON p.user_id = u.id 
    WHERE u.clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- STEP 4: Create New Tables
-- =====================================================

-- Screenshot History Table
CREATE TABLE IF NOT EXISTS screenshot_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
  
  -- Image data
  image_url TEXT NOT NULL,
  image_size INTEGER,
  image_hash TEXT,
  
  -- Diff data
  diff_image_url TEXT,
  diff_percentage DECIMAL(5,2),
  diff_pixel_count INTEGER,
  has_significant_change BOOLEAN DEFAULT false,
  
  -- Approval workflow
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  capture_metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_screenshot_history_screenshot_id ON screenshot_history(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_approval_status ON screenshot_history(approval_status);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_created_at ON screenshot_history(created_at);

-- Enable RLS
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY screenshot_history_isolation_policy ON screenshot_history
  FOR ALL
  USING (screenshot_id IN (
    SELECT s.id FROM screenshots s
    JOIN projects p ON s.project_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE u.clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- Notifications Table
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

-- Create RLS policy
CREATE POLICY notifications_isolation_policy ON notifications
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Key details
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  
  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read'],
  
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

-- Create RLS policy
CREATE POLICY api_keys_isolation_policy ON api_keys
  FOR ALL
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = current_setting('app.current_user_id', true)
  ));

-- =====================================================
-- STEP 5: Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
    CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_screenshots_updated_at') THEN
    CREATE TRIGGER update_screenshots_updated_at BEFORE UPDATE ON screenshots
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to reset monthly screenshot counts
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

-- Function to set config (for RLS)
CREATE OR REPLACE FUNCTION set_config(setting_name TEXT, new_value TEXT, is_local BOOLEAN DEFAULT false)
RETURNS TEXT AS $$
BEGIN
  PERFORM set_config(setting_name, new_value, is_local);
  RETURN new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 6: Create Sample User (OPTIONAL - for testing)
-- =====================================================

-- Insert a sample user for testing
-- Replace with your actual Clerk user ID
/*
INSERT INTO users (
  clerk_user_id, 
  email, 
  first_name, 
  last_name
) VALUES (
  'user_test123456789', 
  'test@example.com', 
  'Test', 
  'User'
) ON CONFLICT (clerk_user_id) DO NOTHING;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'projects', 'screenshots', 'screenshot_history', 'notifications', 'api_keys');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Show table structures
\d+ users;
\d+ projects;
\d+ screenshots;
\d+ screenshot_history;
\d+ notifications;
\d+ api_keys;

-- =====================================================
-- NOTES
-- =====================================================

-- 1. Make sure to test RLS by setting user context:
--    SELECT set_config('app.current_user_id', 'your_clerk_user_id', true);

-- 2. All existing data should be preserved, but you may need to:
--    - Create users for existing projects
--    - Update foreign key relationships
--    - Migrate screenshot data to new structure

-- 3. Remember to update your application code to use the new:
--    - Multi-tenant Supabase client
--    - Updated type definitions
--    - RLS context setting

COMMIT;