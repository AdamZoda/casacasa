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
    .order('id', { ascending: false });
    
  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log(`Found ${data.length} rows in site_settings`);
    data.forEach((row, i) => {
      console.log(`\n--- Row ${i} (ID: ${row.id}) ---`);
      console.log('hero_title:', JSON.stringify(row.hero_title));
      console.log('hero_subtitle:', JSON.stringify(row.hero_subtitle));
    });
  }
}

run();
