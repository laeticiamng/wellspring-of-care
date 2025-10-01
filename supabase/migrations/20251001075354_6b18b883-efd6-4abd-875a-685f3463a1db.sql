-- Table des cartes émotionnelles (mantras)
CREATE TABLE IF NOT EXISTS public.emotion_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  mantra TEXT NOT NULL,
  mantra_emoji TEXT NOT NULL,
  description TEXT,
  color_primary TEXT NOT NULL,
  color_secondary TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  who5_range_min INTEGER NOT NULL CHECK (who5_range_min >= 0 AND who5_range_min <= 25),
  who5_range_max INTEGER NOT NULL CHECK (who5_range_max >= 0 AND who5_range_max <= 25),
  animation_config JSONB DEFAULT '{}',
  sound_url TEXT,
  unlock_rewards JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_who5_range CHECK (who5_range_max >= who5_range_min)
);

-- Table des tirages hebdomadaires
CREATE TABLE IF NOT EXISTS public.weekly_card_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.emotion_cards(id),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  drawn_at TIMESTAMPTZ DEFAULT now(),
  who5_score INTEGER,
  assessment_session_id UUID,
  viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_weekly_draws_user ON public.weekly_card_draws(user_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_draws_card ON public.weekly_card_draws(card_id);

-- Table des assessments WHO-5
CREATE TABLE IF NOT EXISTS public.who5_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  responses JSONB DEFAULT '[]',
  total_score INTEGER,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_who5_user ON public.who5_assessments(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.emotion_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_card_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.who5_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour emotion_cards (lecture publique)
CREATE POLICY "Cards are viewable by everyone"
  ON public.emotion_cards FOR SELECT
  USING (true);

-- RLS Policies pour weekly_card_draws
CREATE POLICY "Users can view their own card draws"
  ON public.weekly_card_draws FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own card draws"
  ON public.weekly_card_draws FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own card draws"
  ON public.weekly_card_draws FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies pour who5_assessments
CREATE POLICY "Users can view their own assessments"
  ON public.who5_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
  ON public.who5_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
  ON public.who5_assessments FOR UPDATE
  USING (auth.uid() = user_id);

-- Fonction pour obtenir la semaine courante
CREATE OR REPLACE FUNCTION get_current_week_bounds()
RETURNS TABLE(week_start DATE, week_end DATE)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT
    date_trunc('week', CURRENT_DATE)::DATE AS week_start,
    (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::DATE AS week_end;
END;
$$;

-- Fonction pour calculer le score WHO-5
CREATE OR REPLACE FUNCTION calculate_who5_score(responses JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total INTEGER := 0;
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(responses)
  LOOP
    total := total + (item->>'value')::INTEGER;
  END LOOP;
  RETURN total;
END;
$$;

-- Insérer les cartes émotionnelles
INSERT INTO public.emotion_cards (code, mantra, mantra_emoji, description, color_primary, color_secondary, icon_name, rarity, who5_range_min, who5_range_max, unlock_rewards) VALUES
  ('posed', 'Posé', '✨', 'Tu es dans un état d''équilibre serein, prêt à accueillir le moment présent', 'hsl(240, 60%, 60%)', 'hsl(260, 50%, 70%)', 'Sparkles', 'common', 19, 25, '["sticker_zen"]'),
  ('cap', 'Cap', '🔥', 'Tu as l''énergie et la détermination pour conquérir tes objectifs', 'hsl(10, 80%, 55%)', 'hsl(30, 70%, 60%)', 'Flame', 'common', 18, 25, '["badge_fire"]'),
  ('douceur', 'Douceur', '🌊', 'L''instant t''invite à la bienveillance et au calme intérieur', 'hsl(200, 70%, 60%)', 'hsl(220, 60%, 70%)', 'Waves', 'common', 15, 20, '["sound_ocean"]'),
  ('elan', 'Élan', '🌱', 'C''est le moment de la croissance et des nouveaux départs', 'hsl(140, 60%, 50%)', 'hsl(160, 55%, 60%)', 'Sprout', 'common', 16, 22, '["plant_collection"]'),
  ('pause', 'Pause', '🌙', 'Ton énergie demande du repos, accorde-toi cette douceur', 'hsl(280, 50%, 60%)', 'hsl(260, 45%, 70%)', 'Moon', 'common', 10, 15, '["temple_night"]'),
  ('eclat', 'Éclat', '⭐', 'Tu rayonnes d''une énergie positive et inspirante', 'hsl(50, 100%, 60%)', 'hsl(45, 90%, 70%)', 'Star', 'rare', 21, 25, '["aura_gold", "sticker_star"]'),
  ('flow', 'Flow', '🌀', 'Tu es dans la fluidité parfaite, tout coule naturellement', 'hsl(180, 70%, 55%)', 'hsl(190, 65%, 65%)', 'Wind', 'rare', 20, 25, '["mantra_flow"]'),
  ('phoenix', 'Phoenix', '🔥', 'Tu renais de tes cendres avec une force renouvelée', 'hsl(20, 90%, 50%)', 'hsl(40, 80%, 60%)', 'Flame', 'epic', 18, 25, '["skin_phoenix", "aura_fire"]'),
  ('zenith', 'Zénith', '☀️', 'Tu atteins le sommet de ton bien-être et de ta vitalité', 'hsl(40, 100%, 55%)', 'hsl(50, 95%, 65%)', 'Sun', 'legendary', 23, 25, '["aura_legendary", "badge_zenith", "mantra_special"]'),
  ('refuge', 'Refuge', '🏡', 'Tu as besoin de te recentrer dans ton cocon sécurisant', 'hsl(30, 40%, 55%)', 'hsl(35, 35%, 65%)', 'Home', 'common', 8, 14, '["temple_cozy"]'),
  ('eveil', 'Éveil', '🌅', 'Une prise de conscience émerge, un nouveau jour se lève', 'hsl(15, 80%, 60%)', 'hsl(35, 75%, 70%)', 'Sunrise', 'rare', 17, 22, '["constellation_dawn"]'),
  ('cosmos', 'Cosmos', '✨', 'Tu es connecté à quelque chose de plus grand que toi', 'hsl(270, 70%, 50%)', 'hsl(290, 65%, 60%)', 'Stars', 'epic', 19, 25, '["constellation_rare", "halo_cosmic"]')
ON CONFLICT (code) DO NOTHING;

-- Fonction pour obtenir ou créer un tirage hebdomadaire
CREATE OR REPLACE FUNCTION get_or_create_weekly_draw(p_user_id UUID)
RETURNS TABLE(
  draw_id UUID,
  card_code TEXT,
  mantra TEXT,
  mantra_emoji TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  icon_name TEXT,
  rarity TEXT,
  is_new_draw BOOLEAN,
  unlock_rewards JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
  v_existing_draw public.weekly_card_draws;
  v_card public.emotion_cards;
BEGIN
  -- Obtenir les bornes de la semaine
  SELECT * INTO v_week_start, v_week_end FROM get_current_week_bounds();
  
  -- Chercher un tirage existant pour cette semaine
  SELECT * INTO v_existing_draw
  FROM public.weekly_card_draws
  WHERE user_id = p_user_id
    AND week_start = v_week_start
  LIMIT 1;
  
  -- Si tirage existe, le retourner
  IF v_existing_draw.id IS NOT NULL THEN
    SELECT * INTO v_card
    FROM public.emotion_cards
    WHERE id = v_existing_draw.card_id;
    
    RETURN QUERY SELECT
      v_existing_draw.id,
      v_card.code,
      v_card.mantra,
      v_card.mantra_emoji,
      v_card.color_primary,
      v_card.color_secondary,
      v_card.icon_name,
      v_card.rarity,
      false,
      v_card.unlock_rewards;
    RETURN;
  END IF;
  
  -- Sinon créer un nouveau tirage (carte aléatoire pour l'instant)
  SELECT * INTO v_card
  FROM public.emotion_cards
  ORDER BY random()
  LIMIT 1;
  
  INSERT INTO public.weekly_card_draws (
    user_id,
    card_id,
    week_start,
    week_end
  ) VALUES (
    p_user_id,
    v_card.id,
    v_week_start,
    v_week_end
  ) RETURNING id INTO v_existing_draw;
  
  RETURN QUERY SELECT
    v_existing_draw.id,
    v_card.code,
    v_card.mantra,
    v_card.mantra_emoji,
    v_card.color_primary,
    v_card.color_secondary,
    v_card.icon_name,
    v_card.rarity,
    true,
    v_card.unlock_rewards;
END;
$$;