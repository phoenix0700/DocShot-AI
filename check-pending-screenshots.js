const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkPendingScreenshots() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Checking pending screenshots...');
    
    // Get all pending screenshots
    const { data: pendingScreenshots, error } = await supabase
      .from('screenshots')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending screenshots:', error);
      return;
    }
    
    console.log(`Found ${pendingScreenshots.length} pending screenshots:`);
    
    pendingScreenshots.forEach((screenshot, index) => {
      console.log(`\n${index + 1}. Screenshot ID: ${screenshot.id}`);
      console.log(`   Name: ${screenshot.name}`);
      console.log(`   URL: ${screenshot.url}`);
      console.log(`   Status: ${screenshot.status}`);
      console.log(`   Created: ${screenshot.created_at}`);
      console.log(`   Updated: ${screenshot.updated_at}`);
      console.log(`   Time since created: ${Math.round((new Date() - new Date(screenshot.created_at)) / 1000)}s`);
    });
    
    // Also check if there are any processing screenshots
    const { data: processingScreenshots, error: processingError } = await supabase
      .from('screenshots')
      .select('*')
      .eq('status', 'processing')
      .order('created_at', { ascending: false });
    
    if (processingError) {
      console.error('Error fetching processing screenshots:', processingError);
    } else {
      console.log(`\nFound ${processingScreenshots.length} processing screenshots:`);
      
      processingScreenshots.forEach((screenshot, index) => {
        console.log(`\n${index + 1}. Screenshot ID: ${screenshot.id}`);
        console.log(`   Name: ${screenshot.name}`);
        console.log(`   URL: ${screenshot.url}`);
        console.log(`   Status: ${screenshot.status}`);
        console.log(`   Created: ${screenshot.created_at}`);
        console.log(`   Updated: ${screenshot.updated_at}`);
        console.log(`   Time since created: ${Math.round((new Date() - new Date(screenshot.created_at)) / 1000)}s`);
      });
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkPendingScreenshots().catch(console.error);