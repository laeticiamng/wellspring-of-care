-- Supprimer la table existante si elle existe
DROP TABLE IF EXISTS public.journal_entries CASCADE;

-- Recréer la table avec la bonne structure
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  audio_url TEXT,
  affect_positive INTEGER,
  affect_negative INTEGER,
  color_palette JSONB DEFAULT '{"primary": "hsl(200, 70%, 50%)", "secondary": "hsl(220, 60%, 60%)"}'::jsonb,
  badge_text TEXT,
  is_precious BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performances
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_precious ON public.journal_entries(is_precious) WHERE is_precious = true;

-- RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries"
  ON public.journal_entries
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);