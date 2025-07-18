-- CRITICAL FIX: User Isolation for Clerk Authentication (v2)
-- This version handles the type mismatch between UUID and TEXT

-- Step 1: Create the set_config function for Clerk user context
CREATE OR REPLACE FUNCTION set_config(setting_name text, new_value text, is_local boolean)
RETURNS void AS $$
BEGIN
  PERFORM set_config(setting_name, new_value, is_local);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Check current schema structure
DO $$
DECLARE
    users_id_type TEXT;
    projects_user_id_type TEXT;
    has_clerk_user_id BOOLEAN;
BEGIN
    -- Get the data type of users.id
    SELECT data_type INTO users_id_type
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id';
    
    -- Get the data type of projects.user_id
    SELECT data_type INTO projects_user_id_type
    FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'user_id';
    
    -- Check if clerk_user_id exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'clerk_user_id'
    ) INTO has_clerk_user_id;
    
    RAISE NOTICE 'Current schema: users.id is %, projects.user_id is %, has clerk_user_id: %', 
                 users_id_type, projects_user_id_type, has_clerk_user_id;
END $$;

-- Step 3: Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Service role has full access to projects" ON projects;
DROP POLICY IF EXISTS "Service role full access projects" ON projects;
DROP POLICY IF EXISTS "Users see own projects" ON projects;

DROP POLICY IF EXISTS "Users can see screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can insert screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can update screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Users can delete screenshots for their projects" ON screenshots;
DROP POLICY IF EXISTS "Service role has full access to screenshots" ON screenshots;

-- Step 4: Create RLS policies based on current schema
DO $$
DECLARE
    has_clerk_user_id BOOLEAN;
BEGIN
    -- Check if we have clerk_user_id column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'clerk_user_id'
    ) INTO has_clerk_user_id;
    
    IF has_clerk_user_id THEN
        -- New schema with clerk_user_id column
        RAISE NOTICE 'Creating RLS policies for schema with clerk_user_id column';
        
        -- Projects policies
        EXECUTE 'CREATE POLICY "Users can see their own projects" ON projects
            FOR SELECT USING (
                user_id::uuid IN (
                    SELECT id FROM users 
                    WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can insert their own projects" ON projects
            FOR INSERT WITH CHECK (
                user_id::uuid IN (
                    SELECT id FROM users 
                    WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can update their own projects" ON projects
            FOR UPDATE USING (
                user_id::uuid IN (
                    SELECT id FROM users 
                    WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can delete their own projects" ON projects
            FOR DELETE USING (
                user_id::uuid IN (
                    SELECT id FROM users 
                    WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                )
            )';
    ELSE
        -- Old schema where users.id is the clerk_user_id
        RAISE NOTICE 'Creating RLS policies for schema without clerk_user_id column';
        
        -- Projects policies
        EXECUTE 'CREATE POLICY "Users can see their own projects" ON projects
            FOR SELECT USING (
                user_id = current_setting(''app.current_user_id'', true)
            )';
            
        EXECUTE 'CREATE POLICY "Users can insert their own projects" ON projects
            FOR INSERT WITH CHECK (
                user_id = current_setting(''app.current_user_id'', true)
            )';
            
        EXECUTE 'CREATE POLICY "Users can update their own projects" ON projects
            FOR UPDATE USING (
                user_id = current_setting(''app.current_user_id'', true)
            )';
            
        EXECUTE 'CREATE POLICY "Users can delete their own projects" ON projects
            FOR DELETE USING (
                user_id = current_setting(''app.current_user_id'', true)
            )';
    END IF;
END $$;

-- Step 5: Create screenshots policies
DO $$
DECLARE
    has_clerk_user_id BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'clerk_user_id'
    ) INTO has_clerk_user_id;
    
    IF has_clerk_user_id THEN
        -- New schema
        EXECUTE 'CREATE POLICY "Users can see screenshots for their projects" ON screenshots
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id::uuid IN (
                        SELECT id FROM users 
                        WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                    )
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can insert screenshots for their projects" ON screenshots
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id::uuid IN (
                        SELECT id FROM users 
                        WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                    )
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can update screenshots for their projects" ON screenshots
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id::uuid IN (
                        SELECT id FROM users 
                        WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                    )
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can delete screenshots for their projects" ON screenshots
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id::uuid IN (
                        SELECT id FROM users 
                        WHERE clerk_user_id = current_setting(''app.current_user_id'', true)
                    )
                )
            )';
    ELSE
        -- Old schema
        EXECUTE 'CREATE POLICY "Users can see screenshots for their projects" ON screenshots
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can insert screenshots for their projects" ON screenshots
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can update screenshots for their projects" ON screenshots
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id = current_setting(''app.current_user_id'', true)
                )
            )';
            
        EXECUTE 'CREATE POLICY "Users can delete screenshots for their projects" ON screenshots
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM projects p
                    WHERE p.id = screenshots.project_id 
                    AND p.user_id = current_setting(''app.current_user_id'', true)
                )
            )';
    END IF;
END $$;

-- Step 6: Add service role policies
CREATE POLICY "Service role has full access to projects" ON projects
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to screenshots" ON screenshots
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Step 7: Grant permissions
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION set_config(text, text, boolean) TO service_role;

-- Step 8: Verify the fix
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename IN ('projects', 'screenshots')
    AND policyname LIKE 'Users can%';
    
    RAISE NOTICE '';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ Created % RLS policies', policy_count;
    RAISE NOTICE '==============================================';
    
    IF policy_count < 8 THEN
        RAISE WARNING 'Expected 8 user policies but found %. Some policies may have failed to create.', policy_count;
    ELSE
        RAISE NOTICE '✅ All RLS policies created successfully!';
        RAISE NOTICE '';
        RAISE NOTICE 'Users will now only see their own projects.';
        RAISE NOTICE 'Test by logging in with different users.';
    END IF;
    
    RAISE NOTICE '==============================================';
END $$;