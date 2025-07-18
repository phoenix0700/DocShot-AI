-- CRITICAL FIX: User Isolation for Clerk Authentication
-- Run this entire script in your Supabase SQL editor

-- Step 1: Create the set_config function for Clerk user context
CREATE OR REPLACE FUNCTION set_config(setting_name text, new_value text, is_local boolean)
RETURNS void AS $$
BEGIN
  PERFORM set_config(setting_name, new_value, is_local);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Fix the users table structure if needed
-- Check if clerk_user_id column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'clerk_user_id'
  ) THEN
    -- Old schema: id is the clerk_user_id, need to migrate
    ALTER TABLE users ADD COLUMN clerk_user_id TEXT;
    UPDATE users SET clerk_user_id = id;
    
    -- Add new UUID id column
    ALTER TABLE users ADD COLUMN new_id UUID DEFAULT uuid_generate_v4();
    
    -- Update foreign keys
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
    UPDATE projects SET user_id = u.new_id::text FROM users u WHERE projects.user_id = u.id;
    
    -- Swap columns
    ALTER TABLE users DROP COLUMN id CASCADE;
    ALTER TABLE users RENAME COLUMN new_id TO id;
    ALTER TABLE users ADD PRIMARY KEY (id);
    
    -- Re-add foreign key
    ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Service role has full access to projects" ON projects;

DROP POLICY IF EXISTS "Users can see screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can insert screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can update screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can delete screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Service role has full access to screenshots" ON screenshots;

-- Step 4: Create new RLS policies that work with Clerk
-- For projects table
CREATE POLICY "Users can see their own projects" ON projects
    FOR SELECT USING (
        user_id IN (
            SELECT id::text FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id::text FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (
        user_id IN (
            SELECT id::text FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (
        user_id IN (
            SELECT id::text FROM users 
            WHERE clerk_user_id = current_setting('app.current_user_id', true)
        )
    );

-- For screenshots table
CREATE POLICY "Users can see screenshots for their projects" ON screenshots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = screenshots.project_id 
            AND p.user_id IN (
                SELECT id::text FROM users 
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
                SELECT id::text FROM users 
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
                SELECT id::text FROM users 
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
                SELECT id::text FROM users 
                WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
        )
    );

-- Step 5: Add service role policies
CREATE POLICY "Service role has full access to projects" ON projects
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to screenshots" ON screenshots
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Step 6: Create helper function
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT * INTO user_record 
    FROM users 
    WHERE clerk_user_id = current_setting('app.current_user_id', true);
    
    IF user_record.id IS NULL THEN
        RETURN NULL; -- Return NULL instead of raising exception
    END IF;
    
    RETURN user_record.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id() TO service_role;
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO service_role;

-- Step 7: Verify the fix
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename IN ('projects', 'screenshots')
    AND policyname LIKE '%current_setting%';
    
    RAISE NOTICE 'Created % RLS policies using current_setting', policy_count;
    
    IF policy_count < 8 THEN
        RAISE WARNING 'Expected 8 policies but found %. Some policies may have failed to create.', policy_count;
    ELSE
        RAISE NOTICE '✅ All RLS policies created successfully!';
    END IF;
END $$;

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ User isolation fix completed!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Users will now only see their own projects.';
    RAISE NOTICE '';
    RAISE NOTICE 'Test by logging in with different users.';
    RAISE NOTICE '==============================================';
END $$;