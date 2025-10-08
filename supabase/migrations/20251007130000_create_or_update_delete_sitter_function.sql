create or replace function public.delete_sitter(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Delete from public.users, which will cascade to the sitters table
  delete from public.users where id = user_id;

  -- Delete the user from auth.users
  delete from auth.users where id = user_id;
end;
$$;