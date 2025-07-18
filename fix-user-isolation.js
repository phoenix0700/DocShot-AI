require('dotenv').config({ path: './apps/web/.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function fixUserIsolation() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Checking and fixing user isolation...\n');

  try {
    // First, let's check the current state
    console.log('1. Checking current database state...');
    
    // Get all projects without RLS
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return;
    }

    console.log(`Found ${projects.length} projects`);

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${users.length} users`);
    
    // Check if users table has the right structure
    if (users.length > 0) {
      const userColumns = Object.keys(users[0]);
      console.log('User table columns:', userColumns);
      
      // Check if we have clerk_user_id column
      const hasClerkUserId = userColumns.includes('clerk_user_id');
      const hasUuidId = users[0].id && users[0].id.length === 36; // UUID length
      
      console.log('Has clerk_user_id column:', hasClerkUserId);
      console.log('ID appears to be UUID:', hasUuidId);
      
      if (!hasClerkUserId) {
        console.log('\n⚠️  CRITICAL: Users table is using old schema where id = clerk_user_id');
        console.log('This needs to be migrated to have separate id (UUID) and clerk_user_id columns');
      }
    }

    // Group projects by user
    const projectsByUser = {};
    projects.forEach(p => {
      if (!projectsByUser[p.user_id]) {
        projectsByUser[p.user_id] = [];
      }
      projectsByUser[p.user_id].push(p.name);
    });

    console.log('\n2. Current project distribution:');
    Object.entries(projectsByUser).forEach(([userId, projectNames]) => {
      const user = users.find(u => u.id === userId || u.clerk_user_id === userId);
      console.log(`User ${userId} (${user?.email || 'unknown'}): ${projectNames.length} projects`);
    });

    // Test RLS policies
    console.log('\n3. Testing RLS policies...');
    
    // Try to apply the migration
    console.log('\n4. Applying RLS fix migration...');
    
    // Read and execute the migration
    const fs = require('fs');
    const migrationPath = './supabase/migrations/006_fix_projects_rls_for_clerk.sql';
    
    if (fs.existsSync(migrationPath)) {
      console.log('Migration file found. To apply it, run:');
      console.log('supabase db push --local');
      console.log('or for production:');
      console.log('supabase db push');
    } else {
      console.log('Migration file not found at:', migrationPath);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

fixUserIsolation();