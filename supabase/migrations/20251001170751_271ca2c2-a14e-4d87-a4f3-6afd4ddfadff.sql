-- Create organizations table if not exists
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create org_memberships table if not exists
CREATE TABLE IF NOT EXISTS public.org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'manager', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, org_id)
);

-- Create team_assessments table if not exists
CREATE TABLE IF NOT EXISTS public.team_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  phrases JSONB NOT NULL DEFAULT '[]'::jsonb,
  hints JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_count INTEGER NOT NULL DEFAULT 0,
  can_show BOOLEAN NOT NULL DEFAULT false,
  color_mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(org_id, team_name, period_start)
);

-- Create manager_actions table if not exists
CREATE TABLE IF NOT EXISTS public.manager_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  manager_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.org_memberships;
DROP POLICY IF EXISTS "Managers can view team assessments" ON public.team_assessments;
DROP POLICY IF EXISTS "Service role can manage team assessments" ON public.team_assessments;
DROP POLICY IF EXISTS "Managers can view and manage their actions" ON public.manager_actions;

-- RLS Policies for organizations
CREATE POLICY "Members can view their organizations"
  ON public.organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = organizations.id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- RLS Policies for org_memberships
CREATE POLICY "Users can view their own memberships"
  ON public.org_memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage memberships"
  ON public.org_memberships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships om
      WHERE om.org_id = org_memberships.org_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
    )
  );

-- RLS Policies for team_assessments
CREATE POLICY "Managers can view team assessments"
  ON public.team_assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = team_assessments.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Service role can manage team assessments"
  ON public.team_assessments
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for manager_actions
CREATE POLICY "Managers can view and manage their actions"
  ON public.manager_actions
  FOR ALL
  USING (
    manager_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE org_memberships.org_id = manager_actions.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON public.org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON public.org_memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_team_assessments_org_period ON public.team_assessments(org_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_manager_actions_org_team ON public.manager_actions(org_id, team_name);