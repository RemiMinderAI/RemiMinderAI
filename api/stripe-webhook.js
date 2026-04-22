const getRawBody = require("raw-body");
const Stripe = require("stripe");
const { getSupabaseAdmin } = require("../lib/billing/supabaseAdmin");
const {
  rowFromSubscription,
  upsertUserBilling,
  setUserToFree,
  getAuthUidByStripeCustomerId,
  tryClaimStripeEvent,
  releaseStripeEvent,
} = require("../lib/billing/subscriptionSync");

/**
 * POST /api/stripe-webhook
 * Raw body required for signature verification.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!whSecret || !secret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY");
    return res.status(500).json({ error: "Not configured" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature" });
  }

  let buf;
  try {
    buf = await getRawBody(req, { limit: "2mb" });
  } catch (e) {
    console.error("Webhook raw body error:", e);
    return res.status(400).json({ error: "Invalid body" });
  }

  const stripe = new Stripe(secret);
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, whSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const claimed = await tryClaimStripeEvent(event.id);
  if (!claimed) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    await dispatchStripeEvent(stripe, event);
  } catch (err) {
    console.error("Webhook handler error:", err);
    try {
      await releaseStripeEvent(event.id);
    } catch (releaseErr) {
      console.error("Could not release event claim:", releaseErr);
    }
    return res.status(500).json({ error: "Handler failed" });
  }

  return res.status(200).json({ received: true });
};

/**
 * @param {import('stripe').Stripe} stripe
 * @param {import('stripe').Stripe.Event} event
 */
async function dispatchStripeEvent(stripe, event) {
  getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode !== "subscription" || !session.subscription) {
        return;
      }
      const sub = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string" ? session.subscription : session.subscription.id
      );
      const userId = session.metadata && session.metadata.userId ? session.metadata.userId : session.client_reference_id;
      if (!userId) {
        console.error("checkout.session.completed: missing userId");
        return;
      }
      const customerId = typeof session.customer === "string" ? session.customer : session.customer && session.customer.id;
      if (!customerId) return;
      const row = rowFromSubscription(sub, customerId, userId);
      await upsertUserBilling(userId, row);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      if (!invoice.subscription) return;
      const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer;
      let userId = getUserIdFromSub(sub) || (await getAuthUidByStripeCustomerId(customerId));
      if (!userId) {
        console.error("invoice.paid: could not resolve userId");
        return;
      }
      const row = rowFromSubscription(sub, customerId, userId);
      await upsertUserBilling(userId, row);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer;
      let userId = getUserIdFromSub(sub) || (await getAuthUidByStripeCustomerId(customerId));
      if (!userId) {
        console.error("customer.subscription.updated: could not resolve userId");
        return;
      }
      const row = rowFromSubscription(sub, customerId, userId);
      await upsertUserBilling(userId, row);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer;
      let userId = getUserIdFromSub(sub) || (await getAuthUidByStripeCustomerId(customerId));
      if (!userId) {
        console.error("customer.subscription.deleted: could not resolve userId");
        return;
      }
      await setUserToFree(userId);
      break;
    }
    default:
      break;
  }
}

/**
 * @param {import('stripe').Stripe.Subscription} sub
 * @returns {string | null}
 */
function getUserIdFromSub(sub) {
  if (sub.metadata && sub.metadata.userId) return sub.metadata.userId;
  return null;
}
