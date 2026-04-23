const Stripe = require("stripe");
const { getSiteUrl } = require("../lib/billing/env");
const { getPriceIdForPlanAndBilling } = require("../lib/billing/priceMap");
const { getUserFromJwt } = require("../lib/billing/supabaseAdmin");

/**
 * POST /api/create-checkout-session
 * Body: { plan: "family"|"premium", billing: "monthly"|"yearly" }
 * Auth: optional. If Authorization: Bearer is present and valid, the session is tied to that user.
 * If omitted, a guest session is created (user pays first; they link the subscription after sign-in via /api/claim-checkout-session when emails match).
 */
module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("STRIPE_SECRET_KEY is not set (Vercel: add for Production, Preview, or All Environments as needed)");
    return res.status(500).json({ error: "Billing is not configured" });
  }

  const stripe = new Stripe(secret);

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const plan = body && body.plan;
  const billing = body && body.billing;
  if (!["family", "premium"].includes(plan) || !["monthly", "yearly"].includes(billing)) {
    return res.status(400).json({ error: "Invalid plan or billing" });
  }

  let user = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const jwt = authHeader.slice(7);
    user = await getUserFromJwt(jwt);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  }

  const priceId = getPriceIdForPlanAndBilling(plan, billing);
  if (!priceId) {
    console.error("Missing Stripe price ID env for", plan, billing);
    return res.status(500).json({ error: "Price not configured" });
  }

  const siteUrl = getSiteUrl();
  const successUrl = `${siteUrl}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/pricing?checkout=cancel`;

  try {
    const baseSession = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    if (user) {
      const session = await stripe.checkout.sessions.create({
        ...baseSession,
        client_reference_id: user.id,
        customer_email: user.email || undefined,
        metadata: {
          userId: user.id,
          plan,
          billing,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            plan,
            billing,
          },
        },
      });
      if (!session.url) {
        return res.status(500).json({ error: "No checkout URL" });
      }
      return res.status(200).json({ url: session.url });
    }

    const session = await stripe.checkout.sessions.create({
      ...baseSession,
      metadata: {
        plan,
        billing,
        guest: "true",
      },
      subscription_data: {
        metadata: {
          plan,
          billing,
          guest: "true",
        },
      },
    });

    if (!session.url) {
      return res.status(500).json({ error: "No checkout URL" });
    }
    return res.status(200).json({ url: session.url, guest: true });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: "Could not start checkout" });
  }
};
