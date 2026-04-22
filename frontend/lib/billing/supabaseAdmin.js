const { createClient } = require("@supabase/supabase-js");

let _client;

/**
 * Service-role client. Server / Vercel only. Never import from frontend.
 */
function getSupabaseAdmin() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL (or REACT_APP_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY (server only)");
  }
  _client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _client;
}

/**
 * @param {string} jwt
 * @returns {Promise<import("@supabase/supabase-js").User | null>}
 */
async function getUserFromJwt(jwt) {
  if (!jwt) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data.user) return null;
  return data.user;
}

module.exports = { getSupabaseAdmin, getUserFromJwt };
