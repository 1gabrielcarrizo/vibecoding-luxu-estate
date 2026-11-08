-- ==============================================================
-- Migration: Create user_roles table, RLS policies, and trigger
-- Luxe Estate - Admin Dashboard & Role-Based Access Control (RBAC)
-- ==============================================================

-- 1. Create enum for user roles if not exists (or text check constraint)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_user_role') THEN
    CREATE TYPE public.app_user_role AS ENUM ('admin', 'agent', 'user');
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for quick lookups by role and email
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Helper function to check if current requesting user is an administrator
-- SECURITY DEFINER prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 5. RLS Policies for public.user_roles

-- Policy: Users can view their own role
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

-- Policy: Admins can view all user roles
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Policy: Admins can update roles
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Allow users to insert their own initial record as 'user', or admins to insert any role
DROP POLICY IF EXISTS "Users can insert default role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
CREATE POLICY "Users can insert default role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() OR ((SELECT auth.uid()) = id AND role = 'user')
);

-- Policy: Admins can delete user role records
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- 6. Trigger to automatically create a user_roles entry when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    -- Default role is 'user'
    'user',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Backfill existing authenticated users who may already exist in auth.users without a role
INSERT INTO public.user_roles (id, email, role, created_at, updated_at)
SELECT
  id,
  email,
  'user',
  created_at,
  timezone('utc'::text, now())
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email;

-- 8. To grant yourself admin role, execute this query with your email:
-- UPDATE public.user_roles SET role = 'admin' WHERE email = 'tu_correo@ejemplo.com';
