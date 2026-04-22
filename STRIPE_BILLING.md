# Stripe subscriptions (RemiMinderAI)

Subscription state is **only** written by the `/api/stripe-webhook` handler after Stripe signature verification. The React app must **not** treat checkout success as proof of an active plan until webhooks have updated `public.users`.

## Environment variables (Vercel + local)

Set these in the Vercel project (**Settings → Environment Variables**) and in `.env.local` for local work.

### Stripe

| Name | Description |
|------|-------------|
| `STRIPE_SECRET_KEY` | Secret key (`sk_test_...` or `sk_live_...`). Server only. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `stripe-webhook` endpoint (`whsec_...`). |
| `STRIPE_FAMILY_MONTHLY_PRICE_ID` | Price id for Family monthly |
| `STRIPE_FAMILY_YEARLY_PRICE_ID` | Price id for Family yearly |
| `STRIPE_PREMIUM_MONTHLY_PRICE_ID` | Price id for Premium monthly |
| `STRIPE_PREMIUM_YEARLY_PRICE_ID` | Price id for Premium yearly |

Create four recurring prices in the Stripe Dashboard and paste the `price_...` ids. The placeholder names in the task (e.g. `price_family_monthly`) are **variable names**; the values are always real ids from your Stripe account.

### Public site URL (redirects)

| Name | Description |
|------|-------------|
| `SITE_URL` | Recommended: `https://remiminderai.com` (no trailing slash). Used for Checkout `success_url` / `cancel_url`. |

Falls back to `FRONTEND_URL` / `REACT_APP_FRONTEND_URL`, then `https://$VERCEL_URL` in preview, then `http://localhost:3000`.

### Supabase (server)

| Name | Description |
|------|-------------|
| `SUPABASE_URL` | Same as `REACT_APP_SUPABASE_URL` (either may be set). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Service role** (secret). Webhooks and checkout session use this. Never put it in the client. |

## Database

Run the SQL in `supabase/migrations/20260122000000_stripe_billing.sql` in the Supabase SQL editor (or your migration pipeline). It adds billing columns to `public.users` and a `stripe_events_processed` table for idempotent webhooks.

## API routes (Vercel serverless)

- `POST /api/create-checkout-session` — requires `Authorization: Bearer <Supabase access token>`. JSON body: `{ "plan": "family"|"premium", "billing": "monthly"|"yearly" }`. Responds with `{ "url": "<Stripe Checkout url>" }`.
- `POST /api/stripe-webhook` — **only** called by Stripe. Raw body; signature from `STRIPE_WEBHOOK_SECRET`.

## Stripe Dashboard configuration

1. **Customers & Products:** create products/prices for Family and Premium (monthly and yearly) and map env vars to those price ids.
2. **Webhooks:** add endpoint `https://remiminderai.com/api/stripe-webhook` (or your Vercel URL + `/api/stripe-webhook`).
3. **Events to send (minimum):** `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. **Redirect URLs (Supabase):** allow `https://remiminderai.com/sign-in` and `https://remiminderai.com/sign-in?...` (and preview URLs) for OAuth return paths used by sign-in with `?redirect=/pricing`.

## Local end-to-end testing

1. Install deps: `npm install`
2. Set env vars in `.env.local` (see above). For CRA, prefix public vars with `REACT_APP_` as already used.
3. Run **Vercel dev** (recommended) so `/api` routes exist on one origin:

   ```bash
   npx vercel dev
   ```

   If you only run `npm start`, `/api/*` is not available unless you set `REACT_APP_BILLING_API_BASE` to a separate API origin.
4. Forward webhooks to local:

   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe-webhook
   ```

   Use the `whsec_...` from the CLI output in `STRIPE_WEBHOOK_SECRET` for local only (or a dedicated test endpoint secret).
5. In Stripe Dashboard → Developers → add the same `stripe listen` URL if needed, or use the CLI.
6. Use test card: **4242 4242 4242 4242**, any future expiry, any CVC.
7. Sign in, open `/pricing`, choose a plan, complete Checkout. Confirm:
   - `checkout.session.completed` and/or `invoice.paid` run;
   - `public.users` row for the Supabase `auth.users` id (`auth_uid`) shows `plan_type`, `subscription_status`, etc.

## Row Level Security (Supabase)

Webhooks use the **service role** and bypass RLS. For the app to read `plan_type` / `subscription_status` in the client (e.g. to show the current plan), add a policy on `public.users` so a signed-in user can `SELECT` the row where `auth_uid = auth.uid()`. If you only enforce entitlements in server-side APIs, you can keep the table private and use those APIs instead.

## Security checklist

- [ ] `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` only in server env (Vercel, not `REACT_APP_*`).
- [ ] `STRIPE_WEBHOOK_SECRET` matches the signing secret of the URL Stripe calls.
- [ ] No Stripe price id strings in the React bundle (only server reads env and maps `plan` + `billing`).

## Git

```bash
git add .
git commit -m "Add Stripe subscription system (Family + Premium with monthly/yearly + webhooks)"
git push origin main
```

Pushing to `main` should trigger a Vercel production deployment if the GitHub integration is connected.
