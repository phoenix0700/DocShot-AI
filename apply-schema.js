const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function applySchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (\!supabaseUrl || \!supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Read the schema file
  const schema = fs.readFileSync('database-schema.sql', 'utf8');
  
  console.log('Applying database schema...');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql: schema });
  
  if (error) {
    console.error('Error applying schema:', error);
    process.exit(1);
  }
  
  console.log('✅ Database schema applied successfully\!');
}

applySchema().catch(console.error);
EOF < /dev/null
