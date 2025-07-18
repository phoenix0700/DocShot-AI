const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function fixSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }
  
  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Adding config column to projects table...');
    
    // Use the built-in SQL execution through PostgREST
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add missing config column to projects table
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
        
        -- Add missing columns to screenshots table
        ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS viewport JSONB;
        ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS timestamp TEXT;
        ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_data JSONB;
        ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_image_url TEXT;
      `
    });
    
    if (error) {
      console.error('RPC error:', error);
      
      // Try alternative approach: create a custom function
      console.log('Creating custom function to execute SQL...');
      
      const { data: createFuncData, error: createFuncError } = await supabase.rpc('create_exec_function');
      
      if (createFuncError) {
        console.log('Custom function approach failed, trying direct table operations...');
        
        // Try to test if we can at least query the table
        const { data: testData, error: testError } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
        
        if (testError) {
          console.error('Cannot access projects table:', testError);
        } else {
          console.log('Projects table accessible, but schema updates need manual intervention');
        }
        
        console.log('\n🔧 Manual Action Required:');
        console.log('Please run this SQL in your Supabase dashboard SQL editor:');
        console.log(`
-- Add missing config column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Add missing columns to screenshots table  
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS viewport JSONB;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS timestamp TEXT;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_data JSONB;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_image_url TEXT;

-- Create index for config searches
CREATE INDEX IF NOT EXISTS idx_projects_config ON projects USING gin(config);
        `);
        
        return;
      }
    }
    
    console.log('✅ Schema updated successfully!');
    
    // Test the schema
    console.log('Testing updated schema...');
    const { data: projects, error: testError } = await supabase
      .from('projects')
      .select('id, name, config')
      .limit(1);
    
    if (testError) {
      console.error('Schema test failed:', testError);
    } else {
      console.log('✅ Schema test passed!');
    }
    
  } catch (err) {
    console.error('Error:', err);
    
    console.log('\n🔧 Manual Action Required:');
    console.log('Please run this SQL in your Supabase dashboard SQL editor:');
    console.log(`
-- Add missing config column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Add missing columns to screenshots table
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS viewport JSONB;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS timestamp TEXT;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_data JSONB;
ALTER TABLE screenshots ADD COLUMN IF NOT EXISTS diff_image_url TEXT;

-- Create index for config searches
CREATE INDEX IF NOT EXISTS idx_projects_config ON projects USING gin(config);
    `);
  }
}

fixSchema().catch(console.error);