-- Syntra - esquema, integridade, RLS e políticas do CRUD de ocorrências.
-- Execute este arquivo no SQL Editor de um projeto Supabase novo.

create extension if not exists pgcrypto;

create table if not exists public.occurrences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_type text not null check (subject_type in ('station', 'transport', 'infrastructure')),
  transport_type text,
  line text check (line is null or char_length(line) between 1 and 100),
  direction text check (direction is null or char_length(direction) between 1 and 100),
  station text check (station is null or char_length(station) between 1 and 160),
  address text check (address is null or char_length(address) between 1 and 240),
  category text not null check (category in ('delay', 'crowding', 'interruption', 'accessibility', 'sidewalk', 'lighting', 'obstacle', 'station')),
  description text check (description is null or char_length(description) <= 500),
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  source_type text not null default 'user' check (source_type in ('user', 'official', 'demo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint occurrence_location_consistency check (
    (latitude is null and longitude is null) or
    (latitude is not null and longitude is not null)
  ),
  constraint occurrence_subject_fields check (
    (subject_type = 'infrastructure' and address is not null) or
    (subject_type = 'station' and station is not null) or
    (subject_type = 'transport' and line is not null)
  )
);

-- Reaplica a restrição também quando este arquivo é executado sobre uma versão anterior.
do $$
begin
  if exists (
    select 1
    from public.occurrences
    where transport_type is not null
      and transport_type not in ('metro', 'train', 'monorail')
  ) then
    raise exception 'Existem relatos com tipo de transporte fora do novo escopo. Revise-os antes de reaplicar a restrição.';
  end if;
end;
$$;

alter table public.occurrences drop constraint if exists occurrences_transport_type_check;
alter table public.occurrences
  add constraint occurrences_transport_type_check
  check (transport_type is null or transport_type in ('metro', 'train', 'monorail'));

create index if not exists occurrences_created_at_idx on public.occurrences (created_at desc);
create index if not exists occurrences_user_id_idx on public.occurrences (user_id);
create index if not exists occurrences_category_idx on public.occurrences (category);

create or replace function public.set_occurrence_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists occurrences_set_updated_at on public.occurrences;
create trigger occurrences_set_updated_at
before update on public.occurrences
for each row execute function public.set_occurrence_updated_at();

alter table public.occurrences enable row level security;

drop policy if exists "Public occurrences are readable" on public.occurrences;
create policy "Public occurrences are readable"
on public.occurrences
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users create own occurrences" on public.occurrences;
create policy "Authenticated users create own occurrences"
on public.occurrences
for insert
to authenticated
with check (
  user_id = (select auth.uid()) and
  source_type = 'user'
);

drop policy if exists "Authors update own occurrences" on public.occurrences;
create policy "Authors update own occurrences"
on public.occurrences
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid()) and
  source_type = 'user'
);

drop policy if exists "Authors delete own occurrences" on public.occurrences;
create policy "Authors delete own occurrences"
on public.occurrences
for delete
to authenticated
using (user_id = (select auth.uid()));

revoke all on table public.occurrences from anon, authenticated;
grant select on table public.occurrences to anon, authenticated;
grant insert (user_id, subject_type, transport_type, line, direction, station, address, category, description, latitude, longitude, source_type)
  on table public.occurrences to authenticated;
grant update (subject_type, transport_type, line, direction, station, address, category, description, latitude, longitude)
  on table public.occurrences to authenticated;
grant delete on table public.occurrences to authenticated;

comment on table public.occurrences is 'Relatos públicos de mobilidade da Syntra; autoria e mutações protegidas por RLS.';
