/**
 * Maps plan + interval to env-driven Stripe Price IDs. No IDs in the client.
 * Env names are fixed in product requirements.
 */
function getPriceIdForPlanAndBilling(plan, billing) {
  if (plan === "family" && billing === "monthly") {
    return process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID || null;
  }
  if (plan === "family" && billing === "yearly") {
    return process.env.STRIPE_FAMILY_YEARLY_PRICE_ID || null;
  }
  if (plan === "premium" && billing === "monthly") {
    return process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || null;
  }
  if (plan === "premium" && billing === "yearly") {
    return process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || null;
  }
  return null;
}

module.exports = { getPriceIdForPlanAndBilling };
