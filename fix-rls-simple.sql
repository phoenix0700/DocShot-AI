-- Simple RLS Fix for Clerk Authentication
-- This version works with your current schema

-- 1. Create set_config function
CREATE OR REPLACE FUNCTION set_config(setting_name text, new_value text, is_local boolean)
RETURNS void AS $$
BEGIN
  PERFORM set_config(setting_name, new_value, is_local);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- 3. Create new policies for projects
-- Since user_id in projects table contains the clerk_user_id directly
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

-- 4. Fix screenshots policies
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

-- 5. Service role policies
CREATE POLICY "Service role projects" ON projects
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role screenshots" ON screenshots
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Grant permissions
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO service_role;

-- Done!
SELECT 'RLS policies updated successfully!' as status;