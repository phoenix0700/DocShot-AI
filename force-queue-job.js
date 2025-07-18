const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function forceQueueJob() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get a pending screenshot
    const { data: pendingScreenshots, error } = await supabase
      .from('screenshots')
      .select('*')
      .eq('status', 'pending')
      .limit(1);
    
    if (error || !pendingScreenshots || pendingScreenshots.length === 0) {
      console.log('No pending screenshots found');
      return;
    }
    
    const screenshot = pendingScreenshots[0];
    console.log('Found pending screenshot:', screenshot.id);
    console.log('URL:', screenshot.url);
    console.log('Status:', screenshot.status);
    
    // Try to call the bulk run API which we know was working
    console.log('\nTrying bulk run API...');
    
    const response = await fetch('http://localhost:3000/api/screenshots/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId: screenshot.project_id })
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error:', errorText);
    } else {
      const result = await response.json();
      console.log('API Result:', result);
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

forceQueueJob().catch(console.error);