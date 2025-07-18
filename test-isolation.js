const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load env vars
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

async function testIsolation() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('Testing user isolation...\n');
  
  // Get all users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, clerk_user_id');
    
  console.log('Users in database:');
  users.forEach(u => {
    console.log(`- ${u.email} (Clerk ID: ${u.clerk_user_id || u.id})`);
  });
  
  // Get all projects without RLS (admin view)
  const { data: allProjects } = await supabase
    .from('projects')
    .select('id, name, user_id');
    
  console.log(`\nTotal projects: ${allProjects.length}`);
  
  // Group by user
  const projectsByUser = {};
  allProjects.forEach(p => {
    if (!projectsByUser[p.user_id]) {
      projectsByUser[p.user_id] = [];
    }
    projectsByUser[p.user_id].push(p.name);
  });
  
  console.log('\nProjects per user:');
  Object.entries(projectsByUser).forEach(([userId, projects]) => {
    const user = users.find(u => u.id === userId);
    console.log(`- ${user?.email || 'Unknown'}: ${projects.join(', ')}`);
  });
  
  // Test with specific user context
  if (users.length > 0) {
    const testUser = users[0];
    const clerkId = testUser.clerk_user_id || testUser.id;
    
    console.log(`\nTesting RLS with user: ${testUser.email}`);
    
    // Create a new client instance for testing
    const userClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Set user context
    try {
      await userClient.rpc('set_config', {
        setting_name: 'app.current_user_id',
        new_value: clerkId,
        is_local: true
      });
      
      // Query with user context
      const { data: userProjects, error } = await userClient
        .from('projects')
        .select('id, name');
        
      if (error) {
        console.log('RLS Error:', error.message);
      } else {
        console.log(`Projects visible to ${testUser.email}: ${userProjects?.length || 0}`);
        userProjects?.forEach(p => console.log(`  - ${p.name}`));
      }
    } catch (e) {
      console.log('Error setting user context:', e.message);
    }
  }
}

testIsolation().catch(console.error);