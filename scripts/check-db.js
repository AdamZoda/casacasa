
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

async function setup() {
  console.log('Checking global_services table...');
  
  // Try to fetch to see if table exists
  const { error } = await supabase.from('global_services').select('*').limit(1);
  
  if (error && error.code === '42P01') {
    console.log('Table global_services does not exist. Please create it in Supabase Dashboard with columns: id (text), title (text), description (text), image (text), link (text).');
  } else {
    console.log('Table global_services is ready or already exists.');
  }
}

setup();
