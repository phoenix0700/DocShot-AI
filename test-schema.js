const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function testSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Testing projects table with config column...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, config')
      .limit(1);
    
    if (projectsError) {
      console.error('❌ Projects table test failed:', projectsError);
      return false;
    } else {
      console.log('✅ Projects table with config column works!');
    }
    
    console.log('Testing screenshots table with new columns...');
    const { data: screenshots, error: screenshotsError } = await supabase
      .from('screenshots')
      .select('id, image_url, viewport, timestamp, diff_data, diff_image_url')
      .limit(1);
    
    if (screenshotsError) {
      console.error('❌ Screenshots table test failed:', screenshotsError);
      return false;
    } else {
      console.log('✅ Screenshots table with new columns works!');
    }
    
    console.log('🎉 Database schema is ready!');
    return true;
    
  } catch (err) {
    console.error('Error:', err);
    return false;
  }
}

testSchema().catch(console.error);