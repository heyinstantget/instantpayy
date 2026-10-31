// Instant Pay Supabase Configuration
const SUPABASE_URL = 'https://unsqcyjkiqhantwozbbc.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_-cI6OnKdngJFj9dMZluZiA_VYRSCl33';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);