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
  const testPayload = {
    id: 1,
    site_name: "Casa Privilege",
    contact_email: "contact@casaprivilege.com",
    phone: "+212 699214728",
    address: "Marrakech, Maroc",
    social_links: {
      about: {
        story: "Casa Privilege...",
        title: "À Propos...",
        mission: "Créer...",
        imageUrl: "https://...",
        subtitle: "Une...",
        visibility: {
          showStory: true,
          showMission: true,
          showSocials: true,
          showYoutube: true,
          showFacebook: true,
          showLinkedin: true,
          showInstagram: true,
          showContactCard: true
        }
      },
      youtube: [],
      facebook: [],
      linkedin: [],
      instagram: [ "https://www.instagram.com/definitly.x/" ]
    },
    hero_background_url: "https://files.catbox.moe/lnp88e.mp4",
    hero_title: "CASA PRIVILÈGE ",
    hero_subtitle: "",
    hero_cta: "",
    whatsapp_number: "33749432208",
    logo_text: "CASA PRIVILEGE",
    footer_title: "",
    footer_cta: "",
    blocked_dates: [],
    bank_name: "",
    bank_beneficiary: "COMANE EXCELLENCE SARL",
    bank_rib: "",
    hidden_pages: [],
    phones: [ "+212 699214728", "+33 7 49 43 22 08" ],
    whatsapp_numbers: [ "33749432208" ],
    font_style: "original",
    block_weekends: false,
    contact_emails: [ { email: "partnerships@casaprivilege.com", label: "Partenariats" } ],
    currency: "EUR",
    payments_via_whatsapp_only: false,
    enable_private_access: true // Missing in DB!
  };

  const payload = { ...testPayload };
  let { data, error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'id' });
    
  if (error) {
    console.log('Initial attempt failed:', error.message);
    let attempts = 0;
    while (error && attempts < 5) {
      const match = error.message.match(/Could not find the '([^']+)' column/i) ||
                    error.message.match(/column "([^"]+)"/i);
      if (match) {
        const col = match[1];
        console.log(`Dynamic loop detected missing column: '${col}'. Omitting and retrying...`);
        delete payload[col];
        attempts++;
        const retry = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
        error = retry.error;
        data = retry.data;
      } else {
        break;
      }
    }
  }

  if (error) {
    console.error('Final attempt failed:', error);
  } else {
    console.log('Final attempt succeeded! Row successfully saved to Supabase.');
  }
}

run();
