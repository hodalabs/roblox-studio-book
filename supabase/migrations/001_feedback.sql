-- Roblox Studio Book — feedback table
-- Stores Jay's notes on each challenge, keyed by slug.

create table if not exists roblox_book_feedback (
  id uuid primary key default gen_random_uuid(),
  challenge_slug text not null unique,
  reviewer text not null default 'jay',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roblox_book_feedback_slug_idx on roblox_book_feedback (challenge_slug);

alter table roblox_book_feedback enable row level security;

-- Public read/write. Access is gated client-side by the password prompt.
-- Tighten later if needed.
drop policy if exists "public_read" on roblox_book_feedback;
create policy "public_read" on roblox_book_feedback
  for select using (true);

drop policy if exists "public_upsert" on roblox_book_feedback;
create policy "public_upsert" on roblox_book_feedback
  for insert with check (true);

drop policy if exists "public_update" on roblox_book_feedback;
create policy "public_update" on roblox_book_feedback
  for update using (true) with check (true);
