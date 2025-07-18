const { createClient } = require('@supabase/supabase-js');

async function checkUserIsolation() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Checking user isolation in database...\n');

  try {
    // Check users table structure
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else {
      console.log('Sample users:', users);
      console.log('Users table columns:', users.length > 0 ? Object.keys(users[0]) : 'No users found');
    }

    // Check projects without RLS (using service key)
    const { data: allProjects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id, created_at')
      .limit(10);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    } else {
      console.log('\nAll projects (without RLS):', allProjects);
      
      // Group projects by user_id
      const projectsByUser = {};
      allProjects.forEach(project => {
        if (!projectsByUser[project.user_id]) {
          projectsByUser[project.user_id] = [];
        }
        projectsByUser[project.user_id].push(project.name);
      });
      
      console.log('\nProjects grouped by user_id:');
      Object.entries(projectsByUser).forEach(([userId, projects]) => {
        console.log(`User ${userId}: ${projects.join(', ')}`);
      });
    }

    // Test RLS by setting user context
    if (users && users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting RLS with user context: ${testUser.clerk_user_id || testUser.id}`);
      
      // Set user context
      await supabase.rpc('set_config', {
        setting_name: 'app.current_user_id',
        new_value: testUser.clerk_user_id || testUser.id,
        is_local: true,
      });
      
      // Now query with RLS
      const { data: userProjects, error: rlsError } = await supabase
        .from('projects')
        .select('id, name, user_id');
      
      if (rlsError) {
        console.error('Error with RLS query:', rlsError);
      } else {
        console.log(`Projects visible to user ${testUser.clerk_user_id || testUser.id}:`, userProjects);
      }
    }

  } catch (error) {
    console.error('Error checking user isolation:', error);
  }
}

checkUserIsolation();