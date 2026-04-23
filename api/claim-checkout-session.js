const Stripe = require("stripe");
const { getUserFromJwt, normalizeEmail } = require("../lib/billing/supabaseAdmin");
const {
  rowFromSubscription,
  upsertUserBilling,
} = require("../lib/billing/subscriptionSync");

/**
 * POST /api/claim-checkout-session
 * Body: { sessionId: "cs_..." }
 * Auth: Authorization: Bearer <supabase access token>
 * Links a completed guest Checkout Session to the signed-in user when the payer email and Supabase user email match.
 * Also patches subscription metadata with userId for later webhooks.
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
    return res.status(500).json({ error: "Billing is not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Sign in required" });
  }
  const user = await getUserFromJwt(authHeader.slice(7));
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
  if (!user.email) {
    return res.status(400).json({ error: "Account has no email; cannot link checkout" });
  }
  const userEmailNorm = normalizeEmail(user.email);
  if (!userEmailNorm) {
    return res.status(400).json({ error: "Account has no email; cannot link checkout" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  const sessionId = body && body.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid sessionId" });
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });
    if (session.mode !== "subscription" || !session.subscription) {
      return res.status(400).json({ error: "Not a subscription checkout" });
    }
    if (session.status !== "complete") {
      return res.status(400).json({ error: "Checkout not complete" });
    }

    const metaUid = (session.metadata && session.metadata.userId) || session.client_reference_id;
    if (metaUid && metaUid === user.id) {
      // Already tied to this user; ensure DB row exists
      const sub = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string" ? session.subscription : session.subscription.id
      );
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer && sub.customer.id;
      if (!customerId) return res.status(500).json({ error: "No customer" });
      const row = rowFromSubscription(sub, customerId, user.id);
      await upsertUserBilling(user.id, row);
      return res.status(200).json({ ok: true, alreadyLinked: true });
    }

    if (metaUid && metaUid !== user.id) {
      return res.status(403).json({ error: "This purchase belongs to a different account" });
    }

    let payerEmail = (session.customer_details && session.customer_details.email) || session.customer_email;
    if (!payerEmail && session.customer) {
      const c = typeof session.customer === "object" && !session.customer.deleted
        ? session.customer
        : await stripe.customers.retrieve(
            typeof session.customer === "string" ? session.customer : session.customer.id
          );
      if (c && c.email) payerEmail = c.email;
    }
    const payerNorm = normalizeEmail(payerEmail);
    if (!payerNorm) {
      return res.status(400).json({ error: "Could not read payer email on checkout session" });
    }
    if (payerNorm !== userEmailNorm) {
      return res.status(403).json({ error: "Sign in with the same email you used at checkout" });
    }

    const sub = await stripe.subscriptions.retrieve(
      typeof session.subscription === "string" ? session.subscription : session.subscription.id
    );
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer && sub.customer.id;
    if (!customerId) return res.status(500).json({ error: "No customer" });

    const plan = (sub.metadata && (sub.metadata.plan === "family" || sub.metadata.plan === "premium"))
      ? sub.metadata.plan
      : session.metadata && (session.metadata.plan === "family" || session.metadata.plan === "premium")
        ? session.metadata.plan
        : "free";
    const bill =
      (sub.metadata && (sub.metadata.billing === "monthly" || sub.metadata.billing === "yearly"))
        ? sub.metadata.billing
        : session.metadata && (session.metadata.billing === "monthly" || session.metadata.billing === "yearly")
          ? session.metadata.billing
          : "monthly";

    const newMeta = {
      ...sub.metadata,
      userId: user.id,
      plan: plan || "family",
      billing: bill || "monthly",
    };
    delete newMeta.guest;
    await stripe.subscriptions.update(sub.id, { metadata: newMeta });

    const row = rowFromSubscription(
      { ...sub, metadata: { ...sub.metadata, userId: user.id, plan, billing: bill } },
      customerId,
      user.id
    );
    await upsertUserBilling(user.id, row);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("claim-checkout-session error:", err);
    if (err && err.code === "resource_missing") {
      return res.status(404).json({ error: "Checkout session not found" });
    }
    return res.status(500).json({ error: "Could not link checkout" });
  }
};
