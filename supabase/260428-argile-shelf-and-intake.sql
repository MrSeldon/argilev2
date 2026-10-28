-- Le Four Argile: each person's glaze shelf and the photos/receipts read into it.
-- Target: Slipstream Supabase project (tpltyfchkpsmtdzzvxeh), where Winnie already has a password login.
-- Row-level security: everyone only ever sees their own rows and files.
create table public.argile_shelf (
  user_id uuid primary key references auth.users(id) on delete cascade,
  materials jsonb not null default '[]'::jsonb,   -- [{id, name, amount?, unit?, note?, source?: "photo"|"receipt"|"manual", added_at}]
  updated_at timestamptz not null default now()
);
create table public.argile_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('receipt','photo')),
  photo_path text,                                -- storage path in argile-uploads, <user_id>/<file>
  extracted jsonb not null default '[]'::jsonb,   -- what the photo was read as, before she confirmed
  confirmed jsonb,                                -- what she kept
  created_at timestamptz not null default now()
);
create index argile_intake_user on public.argile_intake(user_id, created_at desc);
alter table public.argile_shelf enable row level security;
alter table public.argile_intake enable row level security;
create policy "own shelf" on public.argile_shelf for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own intake" on public.argile_intake for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Private bucket for shelf photos and receipts, one folder per person.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('argile-uploads', 'argile-uploads', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do nothing;
create policy "argile own uploads read" on storage.objects for select to authenticated
  using (bucket_id = 'argile-uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "argile own uploads write" on storage.objects for insert to authenticated
  with check (bucket_id = 'argile-uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "argile own uploads delete" on storage.objects for delete to authenticated
  using (bucket_id = 'argile-uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);
