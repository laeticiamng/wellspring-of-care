-- Create music_therapy_sessions table
CREATE TABLE IF NOT EXISTS public.music_therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  music_url TEXT,
  music_metadata JSONB DEFAULT '{}'::jsonb,
  mood_state_pre JSONB DEFAULT '{}'::jsonb,
  mood_state_post JSONB DEFAULT '{}'::jsonb,
  duration_seconds INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  badge_verbal TEXT,
  fragment_unlocked BOOLEAN DEFAULT false,
  fragment_rarity TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create music_fragments table
CREATE TABLE IF NOT EXISTS public.music_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.music_therapy_sessions(id) ON DELETE SET NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_fragments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for music_therapy_sessions
CREATE POLICY "Users can manage their own music sessions"
ON public.music_therapy_sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for music_fragments
CREATE POLICY "Users can view their own music fragments"
ON public.music_fragments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert music fragments"
ON public.music_fragments
FOR INSERT
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_music_sessions_user ON public.music_therapy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_music_fragments_user ON public.music_fragments(user_id);
CREATE INDEX IF NOT EXISTS idx_music_fragments_rarity ON public.music_fragments(rarity);