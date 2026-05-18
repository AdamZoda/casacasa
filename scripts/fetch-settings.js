import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log('Site settings columns in DB:', Object.keys(data[0]));
    console.log('\nFull row data:', JSON.stringify(data[0], null, 2));
  }
}

run();
