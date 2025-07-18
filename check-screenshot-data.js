const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkScreenshotData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Checking screenshot data...');
    
    // Get the latest screenshot
    const { data: screenshots, error } = await supabase
      .from('screenshots')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching screenshots:', error);
      return;
    }
    
    console.log('Latest screenshots:');
    screenshots.forEach((screenshot, index) => {
      console.log(`\n${index + 1}. Screenshot ID: ${screenshot.id}`);
      console.log(`   Name: ${screenshot.name}`);
      console.log(`   URL: ${screenshot.url}`);
      console.log(`   Status: ${screenshot.status}`);
      console.log(`   Image URL: ${screenshot.image_url}`);
      console.log(`   Last Image URL: ${screenshot.last_image_url}`);
      console.log(`   Created: ${screenshot.created_at}`);
      console.log(`   Updated: ${screenshot.updated_at}`);
    });
    
    // The issue might be that we're storing in `image_url` but UI expects `last_image_url`
    // Let's check if we need to copy image_url to last_image_url
    
    console.log('\nChecking if we need to update last_image_url...');
    
    const screenshotsNeedingUpdate = screenshots.filter(s => 
      s.image_url && s.status === 'completed' && !s.last_image_url
    );
    
    if (screenshotsNeedingUpdate.length > 0) {
      console.log(`Found ${screenshotsNeedingUpdate.length} screenshots that need last_image_url update`);
      
      for (const screenshot of screenshotsNeedingUpdate) {
        console.log(`Updating last_image_url for ${screenshot.id}...`);
        
        const { error: updateError } = await supabase
          .from('screenshots')
          .update({ last_image_url: screenshot.image_url })
          .eq('id', screenshot.id);
        
        if (updateError) {
          console.error(`Error updating ${screenshot.id}:`, updateError);
        } else {
          console.log(`✅ Updated ${screenshot.id}`);
        }
      }
    } else {
      console.log('No screenshots need last_image_url update');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkScreenshotData().catch(console.error);