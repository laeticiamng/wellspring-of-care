-- ==========================================
-- ARCHITECTURE B2C vs B2B - Simplified
-- ==========================================

-- 1. Création du type enum pour les rôles
DO $$ BEGIN
  CREATE TYPE app_user_role AS ENUM ('user_b2c', 'user_b2b', 'manager_b2b', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Table organisations
CREATE TABLE IF NOT EXISTS public.orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'standard',
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

-- 3. Table équipes
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, name)
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Ajout colonnes à profiles (sans modifier role existant)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_role app_user_role DEFAULT 'user_b2c',
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.orgs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL;

-- ==========================================
-- RLS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Managers can view their org" ON public.orgs;
CREATE POLICY "Managers can view their org"
ON public.orgs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_memberships.user_id = auth.uid()
    AND org_memberships.org_id = orgs.id
  )
);

DROP POLICY IF EXISTS "Managers can view teams in their org" ON public.teams;
CREATE POLICY "Managers can view teams in their org"
ON public.teams FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_memberships.user_id = auth.uid()
    AND org_memberships.org_id = teams.org_id
  )
);

DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_memberships;
CREATE POLICY "Users can view their own memberships"
ON public.org_memberships FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Managers can view team assessments" ON public.team_assessments;
CREATE POLICY "Managers can view team assessments"
ON public.team_assessments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_memberships.user_id = auth.uid()
    AND org_memberships.org_id = team_assessments.org_id
    AND org_memberships.role IN ('manager', 'admin')
  )
);

DROP POLICY IF EXISTS "Managers can manage actions" ON public.manager_actions;
CREATE POLICY "Managers can manage actions"
ON public.manager_actions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_memberships.user_id = auth.uid()
    AND org_memberships.org_id = manager_actions.org_id
    AND org_memberships.role IN ('manager', 'admin')
  )
);

-- ==========================================
-- FUNCTIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.get_user_app_role()
RETURNS app_user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(user_role, 'user_b2c'::app_user_role) 
  FROM public.profiles 
  WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_manager_of_org(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE user_id = auth.uid()
    AND org_id = p_org_id
    AND role IN ('manager', 'admin')
  )
$$;