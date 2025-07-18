const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function fixUserSync() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Checking user sync issue...');
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else {
      console.log('Users in database:', users);
    }
    
    // Check projects table
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id');
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    } else {
      console.log('Projects in database:', projects);
    }
    
    // The Clerk user ID is: user_2zwufMCPXLMdkbtCiIZoPCrnt5H
    // Let's update the project to use the correct user ID
    const clerkUserId = 'user_2zwufMCPXLMdkbtCiIZoPCrnt5H';
    const projectId = '226b2a04-f8b0-4748-b677-dfd06ca49e9a';
    
    console.log('Updating project user_id to match Clerk ID...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('projects')
      .update({ user_id: clerkUserId })
      .eq('id', projectId);
    
    if (updateError) {
      console.error('Error updating project:', updateError);
    } else {
      console.log('✅ Project updated successfully!');
    }
    
    // Also ensure user exists in users table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', clerkUserId)
      .single();
    
    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create them
      console.log('Creating user record...');
      
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          id: clerkUserId,
          email: 'user@example.com', // You might want to get this from Clerk
          subscription_tier: 'free',
          subscription_status: 'active'
        });
      
      if (createUserError) {
        console.error('Error creating user:', createUserError);
      } else {
        console.log('✅ User created successfully!');
      }
    } else if (existingUser) {
      console.log('✅ User already exists');
    }
    
    console.log('User sync fix completed!');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

fixUserSync().catch(console.error);