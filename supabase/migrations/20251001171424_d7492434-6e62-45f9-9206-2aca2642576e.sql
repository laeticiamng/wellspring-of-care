-- Screen Silk tables for visual rest tracking and texture collection

-- Table for Screen Silk sessions (CVS-Q implicit tracking)
CREATE TABLE IF NOT EXISTS public.screen_silk_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  badge TEXT,
  hints JSONB DEFAULT '{}'::jsonb,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for unlocked silk textures
CREATE TABLE IF NOT EXISTS public.screen_silk_textures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  texture_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  asset_url TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, texture_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_screen_silk_sessions_user_id ON public.screen_silk_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_screen_silk_sessions_created_at ON public.screen_silk_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_screen_silk_textures_user_id ON public.screen_silk_textures(user_id);

-- Enable RLS
ALTER TABLE public.screen_silk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_silk_textures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for screen_silk_sessions
DROP POLICY IF EXISTS "Users can manage their own screen silk sessions" ON public.screen_silk_sessions;
CREATE POLICY "Users can manage their own screen silk sessions"
  ON public.screen_silk_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all screen silk sessions" ON public.screen_silk_sessions;
CREATE POLICY "Service role can manage all screen silk sessions"
  ON public.screen_silk_sessions
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for screen_silk_textures
DROP POLICY IF EXISTS "Users can manage their own textures" ON public.screen_silk_textures;
CREATE POLICY "Users can manage their own textures"
  ON public.screen_silk_textures
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all textures" ON public.screen_silk_textures;
CREATE POLICY "Service role can manage all textures"
  ON public.screen_silk_textures
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');