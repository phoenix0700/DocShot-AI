const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function testManualScreenshot() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get a pending screenshot
    const { data: pendingScreenshot, error } = await supabase
      .from('screenshots')
      .select('*')
      .eq('status', 'pending')
      .limit(1)
      .single();
    
    if (error || !pendingScreenshot) {
      console.log('No pending screenshots found');
      return;
    }
    
    console.log('Found pending screenshot:', pendingScreenshot.id);
    console.log('URL:', pendingScreenshot.url);
    
    // Try to manually trigger the API endpoint
    console.log('\nTesting API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/screenshots/run-single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here' // This might not work without proper auth
      },
      body: JSON.stringify({ screenshotId: pendingScreenshot.id })
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

testManualScreenshot().catch(console.error);