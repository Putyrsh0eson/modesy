-- Run this once in Supabase Dashboard -> SQL Editor.
-- Passwords stay securely managed in auth.users. Profile fields are editable here.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  slug text not null unique,
  role text not null default 'member',
  avatar text default '/sites/modesy/avatar-admin.jpg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Import the users that already exist in Authentication -> Users.
insert into public.profiles (id, username, slug, role)
select
  id,
  coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  lower(regexp_replace(coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8),
  case
    when raw_user_meta_data->>'role' in ('admin', 'moderator', 'vendor', 'customer') then raw_user_meta_data->>'role'
    else 'member'
  end
from auth.users
on conflict (id) do nothing;

-- Automatically add future registrations to the editable profiles table.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, slug, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(new.id::text, 8),
    case when new.raw_user_meta_data->>'role' = 'vendor' then 'vendor' else 'member' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
