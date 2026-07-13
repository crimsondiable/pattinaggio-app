create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create or replace function app_private.is_super_maestro()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'francesco.grinovero@gmail.com';
$$;

create or replace function app_private.can_access_allievo(p_allievo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.allievi a
      where a.id = p_allievo_id
        and (
          a.maestro_id = (select auth.uid())
          or exists (
            select 1
            from public.allievi_condivisi ac
            where ac.allievo_id = a.id
              and ac.maestro_id = (select auth.uid())
          )
        )
    );
$$;

create or replace function app_private.can_manage_allievo(p_allievo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.allievi a
      where a.id = p_allievo_id
        and a.maestro_id = (select auth.uid())
    );
$$;

create or replace function app_private.can_access_lezione(p_lezione_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.lezioni l
      where l.id = p_lezione_id
        and (
          l.maestro_id = (select auth.uid())
          or exists (
            select 1
            from public.lezioni_allievi la
            where la.lezione_id = l.id
              and app_private.can_access_allievo(la.allievo_id)
          )
        )
    );
$$;

create or replace function app_private.can_manage_lezione(p_lezione_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.lezioni l
      where l.id = p_lezione_id
        and (
          l.maestro_id = (select auth.uid())
          or (
            l.maestro_id is null
            and exists (
              select 1
              from public.lezioni_allievi la
              where la.lezione_id = l.id
                and app_private.can_manage_allievo(la.allievo_id)
            )
          )
        )
    );
$$;

create or replace function app_private.can_access_location(p_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.locations loc
      where loc.id = p_location_id
        and (
          loc.maestro_id = (select auth.uid())
          or (loc.maestro_id is null and loc.allievo_id is null)
          or (loc.allievo_id is not null and app_private.can_access_allievo(loc.allievo_id))
        )
    );
$$;

create or replace function app_private.can_manage_location(p_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app_private.is_super_maestro()
    or exists (
      select 1
      from public.locations loc
      where loc.id = p_location_id
        and loc.maestro_id = (select auth.uid())
    );
$$;

create or replace function app_private.prevent_allievo_owner_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.maestro_id is distinct from new.maestro_id and not app_private.is_super_maestro() then
    raise exception 'Solo il super maestro puo cambiare proprietario della scheda allievo';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_allievo_owner_change on public.allievi;
create trigger trg_prevent_allievo_owner_change
before update on public.allievi
for each row execute function app_private.prevent_allievo_owner_change();

grant execute on function app_private.is_super_maestro() to authenticated;
grant execute on function app_private.can_access_allievo(uuid) to authenticated;
grant execute on function app_private.can_manage_allievo(uuid) to authenticated;
grant execute on function app_private.can_access_lezione(uuid) to authenticated;
grant execute on function app_private.can_manage_lezione(uuid) to authenticated;
grant execute on function app_private.can_access_location(uuid) to authenticated;
grant execute on function app_private.can_manage_location(uuid) to authenticated;

-- allievi
alter table public.allievi enable row level security;
drop policy if exists leggi_propri_condivisi_o_super on public.allievi;
drop policy if exists inserisci_propri_o_super on public.allievi;
drop policy if exists modifica_propri_condivisi_o_super on public.allievi;
drop policy if exists cancella_propri_o_super on public.allievi;
create policy allievi_select_scope on public.allievi for select to authenticated using (app_private.can_access_allievo(id));
create policy allievi_insert_own_or_super on public.allievi for insert to authenticated with check (app_private.is_super_maestro() or maestro_id = (select auth.uid()));
create policy allievi_update_scope on public.allievi for update to authenticated using (app_private.can_access_allievo(id)) with check (app_private.can_access_allievo(id));
create policy allievi_delete_owner_or_super on public.allievi for delete to authenticated using (app_private.can_manage_allievo(id));

-- allievi_condivisi
alter table public.allievi_condivisi enable row level security;
drop policy if exists autenticato_tutto on public.allievi_condivisi;
create policy allievi_condivisi_select_scope on public.allievi_condivisi for select to authenticated using (app_private.is_super_maestro() or maestro_id = (select auth.uid()) or app_private.can_manage_allievo(allievo_id));
create policy allievi_condivisi_insert_owner_or_super on public.allievi_condivisi for insert to authenticated with check (app_private.can_manage_allievo(allievo_id) and (condiviso_da is null or condiviso_da = (select auth.uid()) or app_private.is_super_maestro()));
create policy allievi_condivisi_update_owner_or_super on public.allievi_condivisi for update to authenticated using (app_private.can_manage_allievo(allievo_id)) with check (app_private.can_manage_allievo(allievo_id));
create policy allievi_condivisi_delete_owner_recipient_or_super on public.allievi_condivisi for delete to authenticated using (app_private.can_manage_allievo(allievo_id) or maestro_id = (select auth.uid()) or app_private.is_super_maestro());

-- dati agganciati agli allievi
alter table public.progressi_allievo enable row level security;
drop policy if exists autenticato_tutto on public.progressi_allievo;
create policy progressi_select_scope on public.progressi_allievo for select to authenticated using (app_private.can_access_allievo(allievo_id));
create policy progressi_insert_scope on public.progressi_allievo for insert to authenticated with check (app_private.can_access_allievo(allievo_id));
create policy progressi_update_scope on public.progressi_allievo for update to authenticated using (app_private.can_access_allievo(allievo_id)) with check (app_private.can_access_allievo(allievo_id));
create policy progressi_delete_scope on public.progressi_allievo for delete to authenticated using (app_private.can_access_allievo(allievo_id));

alter table public.capacita_allievo enable row level security;
drop policy if exists autenticato_tutto on public.capacita_allievo;
create policy capacita_select_scope on public.capacita_allievo for select to authenticated using (app_private.can_access_allievo(allievo_id));
create policy capacita_insert_scope on public.capacita_allievo for insert to authenticated with check (app_private.can_access_allievo(allievo_id));
create policy capacita_update_scope on public.capacita_allievo for update to authenticated using (app_private.can_access_allievo(allievo_id)) with check (app_private.can_access_allievo(allievo_id));
create policy capacita_delete_scope on public.capacita_allievo for delete to authenticated using (app_private.can_access_allievo(allievo_id));

-- lezioni
alter table public.lezioni enable row level security;
drop policy if exists autenticato_tutto on public.lezioni;
create policy lezioni_select_scope on public.lezioni for select to authenticated using (app_private.can_access_lezione(id));
create policy lezioni_insert_own_or_super on public.lezioni for insert to authenticated with check (app_private.is_super_maestro() or maestro_id = (select auth.uid()));
create policy lezioni_update_scope on public.lezioni for update to authenticated using (app_private.can_manage_lezione(id)) with check (app_private.can_manage_lezione(id));
create policy lezioni_delete_scope on public.lezioni for delete to authenticated using (app_private.can_manage_lezione(id));

alter table public.lezioni_allievi enable row level security;
drop policy if exists autenticato_tutto on public.lezioni_allievi;
create policy lezioni_allievi_select_scope on public.lezioni_allievi for select to authenticated using (app_private.can_access_lezione(lezione_id) or app_private.can_access_allievo(allievo_id));
create policy lezioni_allievi_insert_scope on public.lezioni_allievi for insert to authenticated with check (app_private.can_manage_lezione(lezione_id) and app_private.can_access_allievo(allievo_id));
create policy lezioni_allievi_update_scope on public.lezioni_allievi for update to authenticated using (app_private.can_manage_lezione(lezione_id) or app_private.can_manage_allievo(allievo_id)) with check (app_private.can_access_lezione(lezione_id) and app_private.can_access_allievo(allievo_id));
create policy lezioni_allievi_delete_scope on public.lezioni_allievi for delete to authenticated using (app_private.can_manage_lezione(lezione_id) or app_private.can_manage_allievo(allievo_id));

alter table public.lezioni_skills enable row level security;
drop policy if exists autenticato_tutto on public.lezioni_skills;
create policy lezioni_skills_select_scope on public.lezioni_skills for select to authenticated using (app_private.can_access_lezione(lezione_id) or app_private.can_access_allievo(allievo_id));
create policy lezioni_skills_insert_scope on public.lezioni_skills for insert to authenticated with check (app_private.can_manage_lezione(lezione_id) and app_private.can_access_allievo(allievo_id));
create policy lezioni_skills_update_scope on public.lezioni_skills for update to authenticated using (app_private.can_manage_lezione(lezione_id) or app_private.can_access_allievo(allievo_id)) with check (app_private.can_access_lezione(lezione_id) and app_private.can_access_allievo(allievo_id));
create policy lezioni_skills_delete_scope on public.lezioni_skills for delete to authenticated using (app_private.can_manage_lezione(lezione_id) or app_private.can_manage_allievo(allievo_id));

-- locations
alter table public.locations enable row level security;
drop policy if exists autenticato_tutto on public.locations;
create policy locations_select_scope on public.locations for select to authenticated using (app_private.can_access_location(id));
create policy locations_insert_own_or_global on public.locations for insert to authenticated with check (app_private.is_super_maestro() or maestro_id = (select auth.uid()) or (maestro_id is null and allievo_id is null));
create policy locations_update_owner_or_super on public.locations for update to authenticated using (app_private.can_manage_location(id)) with check (app_private.can_manage_location(id));
create policy locations_delete_owner_or_super on public.locations for delete to authenticated using (app_private.can_manage_location(id));

-- storico locale su DB
alter table public.modifiche_storico enable row level security;
drop policy if exists autenticato_tutto on public.modifiche_storico;
create policy modifiche_select_own_or_super on public.modifiche_storico for select to authenticated using (app_private.is_super_maestro() or maestro_id = (select auth.uid()));
create policy modifiche_insert_own_or_super on public.modifiche_storico for insert to authenticated with check (app_private.is_super_maestro() or maestro_id = (select auth.uid()));
create policy modifiche_update_own_or_super on public.modifiche_storico for update to authenticated using (app_private.is_super_maestro() or maestro_id = (select auth.uid())) with check (app_private.is_super_maestro() or maestro_id = (select auth.uid()));
create policy modifiche_delete_own_or_super on public.modifiche_storico for delete to authenticated using (app_private.is_super_maestro() or maestro_id = (select auth.uid()));

-- catalogo: lettura per utenti autenticati, scrittura solo super
alter table public.skills enable row level security;
drop policy if exists autenticato_tutto on public.skills;
create policy skills_select_authenticated on public.skills for select to authenticated using (true);
create policy skills_insert_super on public.skills for insert to authenticated with check (app_private.is_super_maestro());
create policy skills_update_super on public.skills for update to authenticated using (app_private.is_super_maestro()) with check (app_private.is_super_maestro());
create policy skills_delete_super on public.skills for delete to authenticated using (app_private.is_super_maestro());

alter table public.prerequisiti_skill enable row level security;
drop policy if exists autenticato_tutto on public.prerequisiti_skill;
create policy prerequisiti_select_authenticated on public.prerequisiti_skill for select to authenticated using (true);
create policy prerequisiti_insert_super on public.prerequisiti_skill for insert to authenticated with check (app_private.is_super_maestro());
create policy prerequisiti_update_super on public.prerequisiti_skill for update to authenticated using (app_private.is_super_maestro()) with check (app_private.is_super_maestro());
create policy prerequisiti_delete_super on public.prerequisiti_skill for delete to authenticated using (app_private.is_super_maestro());

-- utenti: niente rubrica globale per utenti normali
alter table public.utenti enable row level security;
drop policy if exists autenticato_tutto on public.utenti;
create policy utenti_select_self_or_super on public.utenti for select to authenticated using (app_private.is_super_maestro() or id = (select auth.uid()));
create policy utenti_insert_super on public.utenti for insert to authenticated with check (app_private.is_super_maestro());
create policy utenti_update_super on public.utenti for update to authenticated using (app_private.is_super_maestro()) with check (app_private.is_super_maestro());
create policy utenti_delete_super on public.utenti for delete to authenticated using (app_private.is_super_maestro());
