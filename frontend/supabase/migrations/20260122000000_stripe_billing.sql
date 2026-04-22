-- Stripe subscription fields on public.users (source of truth from webhooks only).
-- Run in Supabase SQL editor or via supabase db push if you use the CLI.

alter table public.users
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_type text not null default 'free',
  add column if not exists billing text,
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz;

comment on column public.users.stripe_customer_id is 'Stripe customer id (cus_...)';
comment on column public.users.stripe_subscription_id is 'Active Stripe subscription id if any';
comment on column public.users.plan_type is 'free | family | premium (entitlements; trust webhooks, not the client)';
comment on column public.users.billing is 'monthly | yearly when on a paid plan';
comment on column public.users.subscription_status is 'active | canceled | past_due (from Stripe, via webhooks)';
comment on column public.users.current_period_end is 'Current subscription period end (UTC)';

-- Idempotency for Stripe webhooks
create table if not exists public.stripe_events_processed (
  id text primary key,
  processed_at timestamptz not null default now()
);

create index if not exists idx_users_stripe_customer_id on public.users (stripe_customer_id)
  where stripe_customer_id is not null;
