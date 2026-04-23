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

/**
 * @param {string} raw
 * @returns {string | null}
 */
function normalizeEmail(raw) {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim().toLowerCase();
  return t || null;
}

/**
 * Admin user lookup by email (service role). Used for Stripe guest checkout → app account linking.
 * Paginates auth.users (bounded). Prefer linking via JWT/claim for brand-new signups.
 * @param {string} email
 * @returns {Promise<string | null>} Supabase auth user id
 */
async function getAuthUidByEmail(email) {
  const want = normalizeEmail(email);
  if (!want) return null;
  const supabase = getSupabaseAdmin();
  const perPage = 200;
  const maxPages = 100;
  for (let page = 1; page <= maxPages; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data && data.users;
    if (!users || users.length === 0) return null;
    for (const u of users) {
      if (normalizeEmail(u.email) === want) return u.id;
    }
    if (users.length < perPage) return null;
  }
  return null;
}

module.exports = { getSupabaseAdmin, getUserFromJwt, getAuthUidByEmail, normalizeEmail };
