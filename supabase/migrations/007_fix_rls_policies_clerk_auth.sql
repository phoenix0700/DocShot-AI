-- Fix RLS policies for Clerk Authentication
-- This migration corrects the RLS policies to work with the actual schema
-- where projects.user_id contains the Clerk user ID directly

-- 1. Create or replace set_config function
CREATE OR REPLACE FUNCTION set_config(setting_name text, new_value text, is_local boolean)
RETURNS void AS $$
BEGIN
  PERFORM set_config(setting_name, new_value, is_local);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing incorrect policies
DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- 3. Create correct policies for projects table
-- These policies directly compare user_id with the Clerk user ID from context
CREATE POLICY "Users can see their own projects" ON projects
    FOR SELECT USING (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (
        user_id = current_setting('app.current_user_id', true)
    );

-- 4. Fix screenshots table policies
DROP POLICY IF EXISTS "Users can see screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can insert screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can update screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can delete screenshots for their projects" ON screenshots;

CREATE POLICY "Users can see screenshots for their projects" ON screenshots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert screenshots for their projects" ON screenshots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can update screenshots for their projects" ON screenshots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can delete screenshots for their projects" ON screenshots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

-- 5. Fix screenshot_history table policies  
DROP POLICY IF EXISTS "Users can see screenshot history for their projects" ON screenshot_history;
DROP POLICY IF EXISTS "Users can insert screenshot history for their projects" ON screenshot_history;

CREATE POLICY "Users can see screenshot history for their projects" ON screenshot_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_history.screenshot_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert screenshot history for their projects" ON screenshot_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_history.screenshot_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

-- 6. Fix notifications table policies
DROP POLICY IF EXISTS "Users can see their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can see their own notifications" ON notifications
    FOR SELECT USING (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (
        user_id = current_setting('app.current_user_id', true)
    );

-- 7. Fix api_keys table policies
DROP POLICY IF EXISTS "Users can see their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can insert their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON api_keys;

CREATE POLICY "Users can see their own API keys" ON api_keys
    FOR SELECT USING (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can insert their own API keys" ON api_keys
    FOR INSERT WITH CHECK (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can update their own API keys" ON api_keys
    FOR UPDATE USING (
        user_id = current_setting('app.current_user_id', true)
    );

CREATE POLICY "Users can delete their own API keys" ON api_keys
    FOR DELETE USING (
        user_id = current_setting('app.current_user_id', true)
    );

-- 8. Service role policies (for worker processes)
CREATE POLICY "Service role projects" ON projects
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role screenshots" ON screenshots
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role screenshot_history" ON screenshot_history
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role notifications" ON notifications
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role api_keys" ON api_keys
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO service_role;

-- Done!