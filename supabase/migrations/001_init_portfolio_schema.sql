-- ============================================================================
-- Tharuka Bandara Portfolio — Supabase PostgreSQL Schema & RLS Migration
-- File: supabase/migrations/001_init_portfolio_schema.sql
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ============================================================================

create extension if not exists "pgcrypto";

-- Helper function: checks if the current authenticated user is the portfolio admin
create or replace function public.is_portfolio_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = lower('tharukabandara821@gmail.com'),
    false
  );
$$;

-- 1. Site Settings Table (Single-row configuration for profile photo, CV, & contact info)
create table if not exists public.site_settings (
  id text primary key default 'default',
  name text not null,
  short_name text not null default 'THARUKA',
  role text not null,
  tagline text not null,
  location text not null,
  location_detail text not null,
  email text not null,
  phone text not null,
  github text not null,
  linkedin text not null,
  cv_path text not null,
  portrait_path text not null,
  availability text not null,
  description text not null,
  metrics jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Projects & Case Studies Table
create table if not exists public.projects (
  slug text primary key,
  title text not null,
  subtitle text not null,
  category text not null,
  context text not null,
  summary text not null,
  description text not null,
  problem text not null,
  role text not null,
  architecture jsonb not null default '{"overview":"","layers":[]}'::jsonb,
  features text[] not null default '{}',
  challenges text[] not null default '{}',
  outcomes text[] not null default '{}',
  stack text[] not null default '{}',
  status text not null default 'Completed',
  featured boolean not null default false,
  accent_color text not null default 'cyan',
  links jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 3. Professional Experience Table
create table if not exists public.experiences (
  id text primary key,
  company text not null,
  company_location text not null,
  role text not null,
  employment_type text not null default 'Internship',
  period text not null,
  start_date text not null,
  end_date text not null,
  current boolean not null default false,
  project_highlight text not null,
  summary text not null,
  responsibilities text[] not null default '{}',
  domains text[] not null default '{}',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 4. Contact Submissions Inbox Table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 120),
  subject text not null check (char_length(subject) between 3 and 120),
  message text not null check (char_length(message) between 15 and 3000),
  status text not null default 'unread' check (status in ('unread', 'read', 'replied', 'archived')),
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies — Least Privilege
-- ============================================================================

alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_submissions enable row level security;

-- Public read access for portfolio content
drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

drop policy if exists "Public can read experiences" on public.experiences;
create policy "Public can read experiences"
  on public.experiences for select
  using (true);

-- Admin-only write access for portfolio content
drop policy if exists "Admin full access site_settings" on public.site_settings;
create policy "Admin full access site_settings"
  on public.site_settings for all
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admin full access projects" on public.projects;
create policy "Admin full access projects"
  on public.projects for all
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admin full access experiences" on public.experiences;
create policy "Admin full access experiences"
  on public.experiences for all
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- Contact Submissions: Public can INSERT only; only Admin can SELECT, UPDATE, DELETE
drop policy if exists "Public can insert contact_submissions" on public.contact_submissions;
create policy "Public can insert contact_submissions"
  on public.contact_submissions for insert
  with check (true);

drop policy if exists "Admin can manage contact_submissions" on public.contact_submissions;
create policy "Admin can manage contact_submissions"
  on public.contact_submissions for all
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- ============================================================================
-- Supabase Storage Bucket for CV PDF & Portrait Image (portfolio-assets)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio-assets" on storage.objects;
create policy "Public can read portfolio-assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Admin can upload portfolio-assets" on storage.objects;
create policy "Admin can upload portfolio-assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "Admin can update portfolio-assets" on storage.objects;
create policy "Admin can update portfolio-assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "Admin can delete portfolio-assets" on storage.objects;
create policy "Admin can delete portfolio-assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
