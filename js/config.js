/* ==========================================================================
   Pet Haven - Global Config
   ========================================================================== */

const CONFIG = {
  SITE_NAME: 'Pet Haven',
  CURRENCY_SYMBOL: '₹',
  WHATSAPP_NUMBER: '918807773526',
  DEFAULT_PAGE_SIZE: 12,

  // Live Supabase Configuration (Base Project URL without /rest/v1/)
  SUPABASE_URL: 'https://phosuvsayhlroahnoxhh.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_EXvEkgjaTXQkGE-8YqvPiQ_Gz36Gu4S',

  ADMIN_AUTH_KEY: 'pet_haven_admin_session'
};

window.SUPABASE_URL = CONFIG.SUPABASE_URL;
window.SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;
