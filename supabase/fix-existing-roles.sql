-- Run this once in Supabase SQL Editor to assign dashboard roles.
-- Roles must be lowercase: admin, moderator, vendor, or member.

update public.profiles p
set role = case lower(u.email)
  when 'admin@codingest.net' then 'admin'
  when 'moderator@codingest.net' then 'moderator'
  when 'trendshop@codingest.net' then 'vendor'
  else 'member'
end,
updated_at = now()
from auth.users u
where p.id = u.id;

-- Check the result.
select p.username, u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id
order by u.email;
