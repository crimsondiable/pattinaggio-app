create table if not exists public.skating_tricks_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.skating_tricks_sync enable row level security;

drop policy if exists "Users can read own skating tricks sync" on public.skating_tricks_sync;
drop policy if exists "Users can insert own skating tricks sync" on public.skating_tricks_sync;
drop policy if exists "Users can update own skating tricks sync" on public.skating_tricks_sync;

create policy "Users can read own skating tricks sync"
on public.skating_tricks_sync
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own skating tricks sync"
on public.skating_tricks_sync
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own skating tricks sync"
on public.skating_tricks_sync
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.skating_tricks_sync from anon;
grant select, insert, update on table public.skating_tricks_sync to authenticated;;
