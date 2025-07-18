-- Fix RLS policies for projects table to use Clerk user IDs instead of Supabase auth.uid()
-- This is critical for multi-tenant isolation when using Clerk authentication

-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Create new policies using current_setting for Clerk user context
-- The user_id column now references the users.id (UUID) not clerk_user_id
CREATE POLICY "Users can see their own projects" ON projects
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (
        user_id IN (
            SELECT id FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

-- Also update screenshots policies to be consistent
DROP POLICY IF EXISTS "Users can see screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can insert screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can update screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can delete screenshots for their projects" ON screenshots;

CREATE POLICY "Users can see screenshots for their projects" ON screenshots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id IN (
                SELECT id FROM users 
                WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
        )
    );

CREATE POLICY "Users can insert screenshots for their projects" ON screenshots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id IN (
                SELECT id FROM users 
                WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
        )
    );

CREATE POLICY "Users can update screenshots for their projects" ON screenshots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id IN (
                SELECT id FROM users 
                WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
        )
    );

CREATE POLICY "Users can delete screenshots for their projects" ON screenshots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id IN (
                SELECT id FROM users 
                WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
        )
    );

-- Add service role policies for admin access
CREATE POLICY "Service role has full access to projects" ON projects
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to screenshots" ON screenshots
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create helper function to get current user's database ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Get the clerk_user_id from the session config
    SELECT * INTO user_record 
    FROM users 
    WHERE clerk_user_id = current_setting('app.current_user_id', true);
    
    IF user_record.id IS NULL THEN
        RAISE EXCEPTION 'User not found for clerk_user_id: %', current_setting('app.current_user_id', true);
    END IF;
    
    RETURN user_record.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id() TO service_role;