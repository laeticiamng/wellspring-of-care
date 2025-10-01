-- Table pour le grimoire des pensées collectées
CREATE TABLE IF NOT EXISTS public.thought_grimoire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thought_text TEXT NOT NULL,
  thought_emoji TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
  category TEXT NOT NULL DEFAULT 'defusion' CHECK (category IN ('defusion', 'acceptance', 'presence', 'values')),
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  times_viewed INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false
);

-- Index pour performances
CREATE INDEX idx_grimoire_user_id ON public.thought_grimoire(user_id);
CREATE INDEX idx_grimoire_rarity ON public.thought_grimoire(rarity);
CREATE INDEX idx_grimoire_collected_at ON public.thought_grimoire(collected_at DESC);

-- Table pour les sessions du coach
CREATE TABLE IF NOT EXISTS public.coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aaq_score NUMERIC,
  flexibility_level TEXT CHECK (flexibility_level IN ('low', 'moderate', 'high')),
  thoughts_shown JSONB DEFAULT '[]'::jsonb,
  thoughts_collected INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_coach_sessions_user_id ON public.coach_sessions(user_id);
CREATE INDEX idx_coach_sessions_created_at ON public.coach_sessions(created_at DESC);

-- RLS Policies pour thought_grimoire
ALTER TABLE public.thought_grimoire ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own grimoire"
  ON public.thought_grimoire FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own grimoire"
  ON public.thought_grimoire FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grimoire"
  ON public.thought_grimoire FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own grimoire"
  ON public.thought_grimoire FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies pour coach_sessions
ALTER TABLE public.coach_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coach sessions"
  ON public.coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach sessions"
  ON public.coach_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach sessions"
  ON public.coach_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Insérer l'instrument AAQ-II dans clinical_instruments s'il n'existe pas
INSERT INTO public.clinical_instruments (code, name, domain, cadence, min_score, max_score, ttl_hours, questions, thresholds)
VALUES (
  'AAQ2',
  'Acceptance and Action Questionnaire II',
  'psychological_flexibility',
  'weekly',
  7,
  49,
  168,
  jsonb_build_array(
    jsonb_build_object('id', 'aaq2_1', 'text', 'Mes expériences et souvenirs douloureux m''empêchent de vivre une vie qui en vaut la peine', 'reverse', false),
    jsonb_build_object('id', 'aaq2_2', 'text', 'J''ai peur de mes sentiments', 'reverse', false),
    jsonb_build_object('id', 'aaq2_3', 'text', 'Je m''inquiète de ne pas pouvoir contrôler mes inquiétudes et mes sentiments', 'reverse', false),
    jsonb_build_object('id', 'aaq2_4', 'text', 'Mes souvenirs douloureux m''empêchent d''avoir une vie épanouissante', 'reverse', false),
    jsonb_build_object('id', 'aaq2_5', 'text', 'Les émotions causent des problèmes dans ma vie', 'reverse', false),
    jsonb_build_object('id', 'aaq2_6', 'text', 'Il me semble que la plupart des gens gèrent leur vie mieux que moi', 'reverse', false),
    jsonb_build_object('id', 'aaq2_7', 'text', 'Les inquiétudes m''empêchent de réussir', 'reverse', false)
  ),
  jsonb_build_object(
    '0', jsonb_build_array(7, 17),
    '1', jsonb_build_array(18, 24),
    '2', jsonb_build_array(25, 31),
    '3', jsonb_build_array(32, 38),
    '4', jsonb_build_array(39, 49)
  )
)
ON CONFLICT (code) DO NOTHING;