-- =====================================================================
-- Techadyant Labs — commerce schema (Supabase / Postgres)
-- Run in Supabase: SQL Editor > New query > paste > Run.
-- Phase 1 sets up the tables; Phase 2 (auth) and Phase 3 (Razorpay) use them.
-- =====================================================================

-- Reports catalogue (mirror of app/reports/data.ts; source of truth for price).
create table if not exists public.reports (
  slug          text primary key,
  title         text not null,
  access        text not null check (access in ('free','paid')),
  price_inr     integer,                       -- whole rupees; null for free
  pdf_object    text,                          -- path inside the private bucket
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Orders: one row per checkout attempt; updated by the Razorpay webhook.
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete set null,
  email              text,
  report_slug        text not null references public.reports(slug),
  amount_inr         integer not null,
  currency           text not null default 'INR',
  status             text not null default 'created'
                       check (status in ('created','paid','failed','refunded')),
  razorpay_order_id  text unique,
  razorpay_payment_id text,
  created_at         timestamptz not null default now(),
  paid_at            timestamptz
);

-- Entitlements: the authoritative "this user owns this report" record.
-- Written ONLY by the server after a signature-verified payment.
create table if not exists public.entitlements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  email        text,
  report_slug  text not null references public.reports(slug),
  order_id     uuid references public.orders(id) on delete set null,
  granted_at   timestamptz not null default now(),
  unique (user_id, report_slug)
);

create index if not exists entitlements_user_idx  on public.entitlements (user_id);
create index if not exists entitlements_email_idx on public.entitlements (email);
create index if not exists orders_user_idx        on public.orders (user_id);

-- Row Level Security. The service-role key (used by Pages Functions) bypasses
-- RLS, so the download/webhook functions work regardless. These policies just
-- ensure that if you ever query from the browser with the anon key, a user can
-- only see their own rows.
alter table public.entitlements enable row level security;
alter table public.orders       enable row level security;
alter table public.reports      enable row level security;

drop policy if exists "read own entitlements" on public.entitlements;
create policy "read own entitlements" on public.entitlements
  for select using (auth.uid() = user_id);

drop policy if exists "read own orders" on public.orders;
create policy "read own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "reports are public-read" on public.reports;
create policy "reports are public-read" on public.reports
  for select using (true);

-- Seed the current catalogue (idempotent).
insert into public.reports (slug, title, access, price_inr, pdf_object) values
  ('india-fab-ecosystem', 'Who Really Benefits from India''s Fab Ecosystem?', 'paid', 4900, 'india-fab-ecosystem.pdf')
on conflict (slug) do update
  set title = excluded.title, access = excluded.access,
      price_inr = excluded.price_inr, pdf_object = excluded.pdf_object;

-- =====================================================================
-- Subscribers (newsletter / The Dispatch)
-- Public-write via the /api/subscribe Pages Function only; never written from
-- the browser directly. RLS denies all browser access; the service-role key
-- bypasses RLS so the Pages Function works.
-- =====================================================================
create table if not exists public.subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  source          text,            -- 'homepage' | 'report-cta' | etc.
  user_agent      text,
  ip              text,            -- Cloudflare CF-Connecting-IP
  country         text,            -- Cloudflare CF-IPCountry (2-letter)
  confirmed       boolean not null default false,
  confirmed_at    timestamptz,
  unsubscribed    boolean not null default false,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists subscribers_email_idx on public.subscribers (email);
create index if not exists subscribers_created_idx on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

drop policy if exists "subscribers no anon access" on public.subscribers;
-- Intentionally empty — no policy means no rows are visible to anon/auth users.
-- The Pages Function uses the service-role key to insert/read.

-- =====================================================================
-- STORAGE (run once, or do it in the Supabase Storage UI):
--   1. Create a bucket named "reports" with "Public" turned OFF (private).
--   2. Upload your PDFs (e.g. india-fab-ecosystem.pdf) into it.
--   3. Do NOT add any public-read storage policy. The Pages Function reads
--      objects with the service-role key and streams them; the browser never
--      gets a storage URL. This keeps storage unreachable without going
--      through the entitlement check.
-- =====================================================================
