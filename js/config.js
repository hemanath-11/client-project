/* ==========================================================================
   Pet Haven - Global Config
   ========================================================================== */

const CONFIG = {
  SITE_NAME: 'Pet Haven',
  CURRENCY_SYMBOL: '₹',
  WHATSAPP_NUMBER: '918807773526',
  DEFAULT_PAGE_SIZE: 12,

  SUPABASE_URL: 'https://nqoyfsrqvrsfjnrjiwng.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_8yOHKBt8C3oJLzblCAPUaQ_UAQvL8YJ',
  ENABLE_LIVE_DB: true,

  ADMIN_AUTH_KEY: 'pet_haven_admin_session'
};

window.SUPABASE_URL = CONFIG.SUPABASE_URL;
window.SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;
