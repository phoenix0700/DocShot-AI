const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkConstraint() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test updating a screenshot status to 'captured'
    console.log('Testing status update to captured...');
    
    // First, let's see what screenshots exist
    const { data: screenshots, error: selectError } = await supabase
      .from('screenshots')
      .select('id, status')
      .limit(1);
    
    if (selectError) {
      console.error('Error selecting screenshots:', selectError);
      return;
    }
    
    if (screenshots && screenshots.length > 0) {
      const screenshot = screenshots[0];
      console.log('Found screenshot:', screenshot);
      
      // Try to update the status
      const { data: updateData, error: updateError } = await supabase
        .from('screenshots')
        .update({ status: 'captured' })
        .eq('id', screenshot.id);
      
      if (updateError) {
        console.error('❌ Status update failed:', updateError);
        
        // Let's try to see what the current constraint allows
        console.log('Checking database constraints...');
        
        // Try different status values to see what's allowed
        const testStatuses = ['pending', 'captured', 'failed', 'processing', 'completed'];
        
        for (const status of testStatuses) {
          const { error: testError } = await supabase
            .from('screenshots')
            .update({ status })
            .eq('id', screenshot.id);
          
          if (testError) {
            console.log(`❌ Status '${status}' not allowed:`, testError.message);
          } else {
            console.log(`✅ Status '${status}' is allowed`);
          }
        }
      } else {
        console.log('✅ Status update to captured succeeded!');
      }
    } else {
      console.log('No screenshots found to test');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkConstraint().catch(console.error);