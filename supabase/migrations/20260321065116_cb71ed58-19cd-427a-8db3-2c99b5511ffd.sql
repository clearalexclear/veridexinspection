
-- Create a function to list users with roles (admin only, security definer)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id as user_id,
    au.email::text,
    p.full_name,
    COALESCE(ur.role::text, 'client') as role,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY au.created_at DESC
$$;
