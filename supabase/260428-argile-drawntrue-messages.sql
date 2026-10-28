-- Le Four Argile "Make": the conversation with Drawn True (sketch in, questions, renders out).
-- The page writes inbound messages and reads its own; Drawn True on Devin's Mac pulls and posts through two functions
-- guarded by a secret (only its SHA-256 hash is stored; the secret lives in Drawn True's .env as DT_ARGILE_SECRET).
create table public.argile_dt_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  kind text not null default 'message' check (kind in ('message','event')),
  text text not null default '',
  step text,
  image text,                                   -- data:image/jpeg;base64,... (resized; one picture per message)
  handled boolean not null default false,       -- inbound: picked up by Drawn True
  created_at timestamptz not null default now()
);
create index argile_dt_messages_user on public.argile_dt_messages(user_id, id);
create index argile_dt_messages_inbox on public.argile_dt_messages(id) where direction = 'in' and not handled;
alter table public.argile_dt_messages enable row level security;
create policy "read own conversation" on public.argile_dt_messages for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "send own messages" on public.argile_dt_messages for insert to authenticated
  with check ((select auth.uid()) = user_id and direction = 'in' and not handled);

create table public.argile_dt_worker (secret_sha256 text primary key);
alter table public.argile_dt_worker enable row level security;  -- no policies: unreadable through the API
insert into public.argile_dt_worker values ('d2976375422d0e6f1da6084acebca698cf2b0abd9088ac786a9acaf9174b1981');

create or replace function public.argile_dt_pull(p_secret text)
returns table (id bigint, user_id uuid, email text, name text, text text, image text)
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.argile_dt_worker w where w.secret_sha256 = encode(extensions.digest(p_secret, 'sha256'), 'hex')) then
    raise exception 'not allowed';
  end if;
  return query
  with picked as (
    update public.argile_dt_messages m set handled = true
    where m.id in (select m2.id from public.argile_dt_messages m2 where m2.direction = 'in' and not m2.handled order by m2.id limit 20 for update skip locked)
    returning m.id, m.user_id, m.text, m.image)
  select p.id, p.user_id, u.email::text, coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1))::text, p.text, p.image
  from picked p join auth.users u on u.id = p.user_id order by p.id;
end $$;

create or replace function public.argile_dt_post(p_secret text, p_user uuid, p_kind text, p_text text, p_step text, p_image text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint;
begin
  if not exists (select 1 from public.argile_dt_worker w where w.secret_sha256 = encode(extensions.digest(p_secret, 'sha256'), 'hex')) then
    raise exception 'not allowed';
  end if;
  insert into public.argile_dt_messages (user_id, direction, kind, text, step, image, handled)
  values (p_user, 'out', coalesce(p_kind, 'message'), coalesce(p_text, ''), p_step, p_image, true) returning id into new_id;
  return new_id;
end $$;
revoke all on function public.argile_dt_pull(text) from public, authenticated;
revoke all on function public.argile_dt_post(text, uuid, text, text, text, text) from public, authenticated;
grant execute on function public.argile_dt_pull(text) to anon;
grant execute on function public.argile_dt_post(text, uuid, text, text, text, text) to anon;
