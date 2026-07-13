insert into public.utenti (id, email, nome, ruolo)
select u.id,
       lower(u.email) as email,
       coalesce(nullif(split_part(u.email, '@', 1), ''), 'utente') as nome,
       case when lower(u.email) = 'francesco.grinovero@gmail.com' then 'admin' else 'maestro' end as ruolo
from auth.users u
where not exists (
  select 1 from public.utenti existing where existing.id = u.id
);
