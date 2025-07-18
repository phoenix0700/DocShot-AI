const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }
  
  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Read the migration file
  const migrationPath = path.join(__dirname, 'supabase/migrations/005_add_missing_columns.sql');
  const migration = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('Applying migration: 005_add_missing_columns.sql');
  
  try {
    // Try to add the config column first
    console.log('Adding config column to projects table...');
    const { error: configError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE projects ADD COLUMN IF NOT EXISTS config JSONB DEFAULT \'{}\';' 
    });
    
    if (configError) {
      console.log('Config column might already exist or exec_sql not available');
      console.log('Error:', configError);
    } else {
      console.log('✅ Config column added successfully!');
    }
    
    // Test if the columns exist by querying the table
    console.log('Testing database structure...');
    const { data: projects, error: testError } = await supabase
      .from('projects')
      .select('id, name, config')
      .limit(1);
    
    if (testError) {
      console.error('Error testing projects table:', testError);
      
      // If config column still doesn't exist, let's create it manually
      console.log('Attempting to create missing schema...');
      console.log('You may need to run the migration directly in your Supabase dashboard SQL editor.');
      console.log('Migration content:');
      console.log(migration);
      
      process.exit(1);
    } else {
      console.log('✅ Database structure verified!');
    }
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

applyMigration().catch(console.error);