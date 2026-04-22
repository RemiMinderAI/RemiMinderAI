const { getSupabaseAdmin } = require("./supabaseAdmin");

/**
 * @param {string} stripeStatus
 * @returns {string}
 */
function mapStripeStatusToDb(stripeStatus) {
  if (["active", "trialing"].includes(stripeStatus)) return "active";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid") return "past_due";
  if (
    [
      "canceled",
      "incomplete_expired",
      "paused",
    ].includes(stripeStatus)
  ) {
    return "canceled";
  }
  if (stripeStatus === "incomplete") return "canceled";
  return "canceled";
}

/**
 * @param {import('stripe').Stripe.Subscription} sub
 * @param {string} [fallbackUserId]
 */
function getUserIdFromSubscription(sub, fallbackUserId) {
  if (sub.metadata && sub.metadata.userId) return sub.metadata.userId;
  return fallbackUserId || null;
}

/**
 * @param {import('stripe').Stripe.Subscription} sub
 * @param {string} customerId
 * @param {string} userId
 */
function rowFromSubscription(sub, customerId, userId) {
  const planType =
    sub.metadata && (sub.metadata.plan === "family" || sub.metadata.plan === "premium")
      ? sub.metadata.plan
      : "free";
  const billing =
    sub.metadata && (sub.metadata.billing === "monthly" || sub.metadata.billing === "yearly")
      ? sub.metadata.billing
      : null;

  return {
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    plan_type: planType,
    billing,
    subscription_status: mapStripeStatusToDb(sub.status),
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
  };
}

/**
 * @param {string} userId
 * @param {object} row
 */
async function upsertUserBilling(userId, row) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: selErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_uid", userId)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing) {
    const { error } = await supabase.from("users").update(row).eq("auth_uid", userId);
    if (error) throw error;
    return;
  }

  const insertRow = { auth_uid: userId, ...row };
  const { error: insErr } = await supabase.from("users").insert(insertRow);
  if (insErr) throw insErr;
}

/**
 * Free plan after cancellation or deletion.
 * @param {string} userId
 * @param {string} [customerId]
 */
async function setUserToFree(userId) {
  const supabase = getSupabaseAdmin();
  const row = {
    plan_type: "free",
    billing: null,
    subscription_status: "canceled",
    current_period_end: null,
    stripe_subscription_id: null,
  };
  const { error } = await supabase.from("users").update(row).eq("auth_uid", userId);
  if (error) throw error;
}

/**
 * @param {string} customerId
 * @returns {Promise<string | null>} auth uid
 */
async function getAuthUidByStripeCustomerId(customerId) {
  if (!customerId) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("auth_uid")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (error) throw error;
  return data && data.auth_uid ? data.auth_uid : null;
}

/**
 * Insert event id. Returns true if this worker should process, false if duplicate.
 */
async function tryClaimStripeEvent(eventId) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("stripe_events_processed").insert({ id: eventId });
  if (error) {
    if (error.code === "23505" || /duplicate key/i.test(String(error.message || ""))) {
      return false;
    }
    throw error;
  }
  return true;
}

/**
 * @param {string} eventId
 */
async function releaseStripeEvent(eventId) {
  const supabase = getSupabaseAdmin();
  await supabase.from("stripe_events_processed").delete().eq("id", eventId);
}

module.exports = {
  mapStripeStatusToDb,
  getUserIdFromSubscription,
  rowFromSubscription,
  upsertUserBilling,
  setUserToFree,
  getAuthUidByStripeCustomerId,
  tryClaimStripeEvent,
  releaseStripeEvent,
};
