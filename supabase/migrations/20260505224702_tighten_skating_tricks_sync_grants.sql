revoke all on table public.skating_tricks_sync from anon;
revoke all on table public.skating_tricks_sync from authenticated;
grant select, insert, update on table public.skating_tricks_sync to authenticated;;
