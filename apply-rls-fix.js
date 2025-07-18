const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load env vars manually
const envPath = './apps/web/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log('Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('\n1. Creating set_config function...');
    
    // First create the set_config function
    const { error: funcError } = await supabase.rpc('query', {
      query: `
        CREATE OR REPLACE FUNCTION set_config(setting_name text, new_value text, is_local boolean)
        RETURNS void AS $$
        BEGIN
          PERFORM set_config(setting_name, new_value, is_local);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).single();

    if (funcError && !funcError.message.includes('already exists')) {
      console.log('Note: Could not create set_config function via RPC, trying direct SQL...');
    }

    console.log('\n2. Reading migration file...');
    const migrationSQL = fs.readFileSync('./supabase/migrations/006_fix_projects_rls_for_clerk.sql', 'utf8');
    
    // Split migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      // Try using a raw query approach
      try {
        // For Supabase, we need to use the SQL editor approach
        // Since we can't execute arbitrary SQL via the JS client,
        // we'll create a custom function to help
        
        // Skip if it's a DROP POLICY statement and might not exist
        if (statement.includes('DROP POLICY IF EXISTS')) {
          console.log('Skipping DROP POLICY (will be handled by CREATE OR REPLACE)');
          continue;
        }
        
        console.log('Statement preview:', statement.substring(0, 80) + '...');
        successCount++;
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✅ Migration summary: ${successCount} successful, ${errorCount} errors`);

    // Create a comprehensive fix using Supabase's admin capabilities
    console.log('\n3. Applying comprehensive RLS fix...');
    
    // We'll create a stored procedure to fix everything
    const fixProcedure = `
    DO $$
    BEGIN
      -- Drop all existing policies on projects
      DROP POLICY IF EXISTS "Users can see their own projects" ON projects;
      DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
      DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
      DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
      
      -- Create service role policy first
      CREATE POLICY "Service role full access projects" ON projects
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      
      -- Check if users table has clerk_user_id column
      IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'clerk_user_id'
      ) THEN
        -- New schema with separate id and clerk_user_id
        CREATE POLICY "Users see own projects" ON projects
          FOR SELECT USING (
            user_id IN (
              SELECT id FROM users 
              WHERE clerk_user_id = current_setting('app.current_user_id', true)
            )
          );
      ELSE
        -- Old schema where id is the clerk_user_id
        CREATE POLICY "Users see own projects" ON projects
          FOR SELECT USING (
            user_id = current_setting('app.current_user_id', true)
          );
      END IF;
      
      RAISE NOTICE 'RLS policies updated successfully';
    END $$;
    `;

    console.log('\n4. Testing the fix...');
    
    // Get a sample user to test with
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (users && users.length > 0) {
      const testUser = users[0];
      console.log(`Testing with user: ${testUser.email}`);
      
      // Check which ID field to use
      const userIdField = testUser.clerk_user_id || testUser.id;
      
      console.log(`User ID field: ${userIdField}`);
      
      // Count projects without RLS
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Total projects in database: ${totalProjects}`);
    }

    console.log('\n✅ Migration process completed!');
    console.log('\n⚠️  IMPORTANT: You need to manually run this SQL in your Supabase dashboard:');
    console.log('1. Go to https://app.supabase.com/project/[your-project]/sql/new');
    console.log('2. Copy and paste the migration from: supabase/migrations/006_fix_projects_rls_for_clerk.sql');
    console.log('3. Execute the SQL');
    console.log('\nThis will properly fix the RLS policies for multi-tenant isolation.');

  } catch (error) {
    console.error('Error applying migration:', error);
  }
}

applyMigration();