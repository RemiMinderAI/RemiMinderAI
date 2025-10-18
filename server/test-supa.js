require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // backend
);

(async () => {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('users rows:', data?.length ?? 0);
  if (error) console.error('error:', error);
})();
