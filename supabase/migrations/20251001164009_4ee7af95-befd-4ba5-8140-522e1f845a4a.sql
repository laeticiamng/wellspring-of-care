-- Migration Ciel des Auras (Leaderboard poétique)

-- Table principale des auras utilisateur
CREATE TABLE IF NOT EXISTS public.user_auras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  color_hue INTEGER NOT NULL DEFAULT 200, -- 0-360 (violet bas, cyan moyen, or haut)
  luminosity INTEGER NOT NULL DEFAULT 50, -- 0-100
  size_scale NUMERIC NOT NULL DEFAULT 1.0, -- 0.5-2.0
  animation_speed NUMERIC NOT NULL DEFAULT 1.0,
  who5_internal_level INTEGER, -- 0-4 (jamais affiché)
  last_who5_at TIMESTAMP WITH TIME ZONE,
  streak_weeks INTEGER NOT NULL DEFAULT 0,
  interactions_count INTEGER NOT NULL DEFAULT 0,
  is_rare BOOLEAN DEFAULT false,
  rare_type TEXT, -- 'cosmic', 'prismatic', 'aurora', 'starlight'
  unlocked_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Historique des auras pour la galerie
CREATE TABLE IF NOT EXISTS public.aura_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  color_hue INTEGER NOT NULL,
  luminosity INTEGER NOT NULL,
  size_scale NUMERIC NOT NULL,
  who5_badge TEXT, -- "Semaine posée ✨", "Énergie douce 🌙", etc.
  snapshot_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Catalogue des auras rares
CREATE TABLE IF NOT EXISTS public.rare_auras_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aura_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  color_palette JSONB NOT NULL, -- array de couleurs
  unlock_conditions JSONB NOT NULL,
  rarity_level TEXT NOT NULL, -- 'rare', 'epic', 'legendary'
  animation_preset TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Connexions entre auras (interactions)
CREATE TABLE IF NOT EXISTS public.aura_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_strength INTEGER NOT NULL DEFAULT 1, -- nombre d'interactions
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  interaction_types JSONB DEFAULT '[]', -- ['cocon', 'reply', 'empathy']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id_a, user_id_b)
);

-- RLS Policies
ALTER TABLE public.user_auras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rare_auras_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_connections ENABLE ROW LEVEL SECURITY;

-- User auras policies
DROP POLICY IF EXISTS "Users can view their own aura" ON public.user_auras;
CREATE POLICY "Users can view their own aura"
ON public.user_auras FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own aura" ON public.user_auras;
CREATE POLICY "Users can update their own aura"
ON public.user_auras FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view community auras anonymized" ON public.user_auras;
CREATE POLICY "Users can view community auras anonymized"
ON public.user_auras FOR SELECT
USING (true); -- Vue anonymisée côté client

-- Aura history policies
DROP POLICY IF EXISTS "Users can manage their aura history" ON public.aura_history;
CREATE POLICY "Users can manage their aura history"
ON public.aura_history FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Rare auras catalog: public read
DROP POLICY IF EXISTS "Anyone can view rare auras catalog" ON public.rare_auras_catalog;
CREATE POLICY "Anyone can view rare auras catalog"
ON public.rare_auras_catalog FOR SELECT
USING (true);

-- Aura connections policies
DROP POLICY IF EXISTS "Users can view their connections" ON public.aura_connections;
CREATE POLICY "Users can view their connections"
ON public.aura_connections FOR SELECT
USING (auth.uid() = user_id_a OR auth.uid() = user_id_b);

DROP POLICY IF EXISTS "Users can manage their connections" ON public.aura_connections;
CREATE POLICY "Users can manage their connections"
ON public.aura_connections FOR ALL
USING (auth.uid() = user_id_a OR auth.uid() = user_id_b);

-- Seed rare auras catalog
INSERT INTO public.rare_auras_catalog (aura_type, name, description, color_palette, unlock_conditions, rarity_level, animation_preset, icon)
VALUES
  ('cosmic', 'Aura Cosmique', 'Une constellation vivante', 
   '["#1a1a2e", "#16213e", "#0f3460", "#533483"]'::jsonb,
   '{"streak_weeks": 4, "interactions": 20}'::jsonb,
   'epic', 'swirl', '🌌'),
  
  ('prismatic', 'Aura Prismatique', 'Arc-en-ciel émotionnel',
   '["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"]'::jsonb,
   '{"streak_weeks": 8, "who5_high_weeks": 3}'::jsonb,
   'legendary', 'rainbow', '🌈'),
  
  ('aurora', 'Aura Aurore', 'Danse boréale intérieure',
   '["#00d2ff", "#3a7bd5", "#00f260", "#0575e6"]'::jsonb,
   '{"streak_weeks": 6, "cocons_joined": 5}'::jsonb,
   'epic', 'wave', '✨'),
  
  ('starlight', 'Aura Stellaire', 'Lumière des étoiles',
   '["#fff59d", "#ffeb3b", "#ffd54f", "#ffca28"]'::jsonb,
   '{"who5_high_weeks": 5}'::jsonb,
   'rare', 'pulse', '⭐')
ON CONFLICT (aura_type) DO NOTHING;

-- Function to update aura based on WHO-5
CREATE OR REPLACE FUNCTION public.update_aura_from_who5(
  p_user_id UUID,
  p_who5_score INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_color_hue INTEGER;
  v_luminosity INTEGER;
  v_who5_level INTEGER;
BEGIN
  -- Calculer le niveau WHO-5 (0-4)
  v_who5_level := CASE
    WHEN p_who5_score >= 20 THEN 4
    WHEN p_who5_score >= 16 THEN 3
    WHEN p_who5_score >= 12 THEN 2
    WHEN p_who5_score >= 8 THEN 1
    ELSE 0
  END;
  
  -- Mapper WHO-5 level à couleur (0-360 hue)
  v_color_hue := CASE v_who5_level
    WHEN 4 THEN 45  -- Or/jaune (haut)
    WHEN 3 THEN 180 -- Cyan (bon)
    WHEN 2 THEN 200 -- Bleu clair (moyen)
    WHEN 1 THEN 240 -- Bleu (bas)
    ELSE 280        -- Violet (très bas)
  END;
  
  -- Luminosité basée sur WHO-5
  v_luminosity := 30 + (v_who5_level * 15);
  
  -- Upsert user aura
  INSERT INTO public.user_auras (
    user_id,
    color_hue,
    luminosity,
    who5_internal_level,
    last_who5_at
  ) VALUES (
    p_user_id,
    v_color_hue,
    v_luminosity,
    v_who5_level,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    color_hue = v_color_hue,
    luminosity = v_luminosity,
    who5_internal_level = v_who5_level,
    last_who5_at = now(),
    updated_at = now();
    
  -- Check for rare aura unlocks
  PERFORM public.check_rare_aura_unlocks(p_user_id);
END;
$$;

-- Function to check rare aura unlocks
CREATE OR REPLACE FUNCTION public.check_rare_aura_unlocks(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aura RECORD;
  v_catalog RECORD;
  v_conditions JSONB;
  v_meets_conditions BOOLEAN;
BEGIN
  SELECT * INTO v_aura FROM public.user_auras WHERE user_id = p_user_id;
  
  IF v_aura IS NULL THEN RETURN; END IF;
  
  -- Check each rare aura
  FOR v_catalog IN SELECT * FROM public.rare_auras_catalog WHERE NOT EXISTS (
    SELECT 1 FROM public.user_auras 
    WHERE user_id = p_user_id AND rare_type = v_catalog.aura_type
  ) LOOP
    v_conditions := v_catalog.unlock_conditions;
    v_meets_conditions := true;
    
    -- Check streak_weeks
    IF v_conditions ? 'streak_weeks' THEN
      IF v_aura.streak_weeks < (v_conditions->>'streak_weeks')::INTEGER THEN
        v_meets_conditions := false;
      END IF;
    END IF;
    
    -- Check interactions
    IF v_conditions ? 'interactions' AND v_meets_conditions THEN
      IF v_aura.interactions_count < (v_conditions->>'interactions')::INTEGER THEN
        v_meets_conditions := false;
      END IF;
    END IF;
    
    -- If all conditions met, unlock rare aura
    IF v_meets_conditions THEN
      UPDATE public.user_auras
      SET 
        is_rare = true,
        rare_type = v_catalog.aura_type,
        unlocked_at = now()
      WHERE user_id = p_user_id;
    END IF;
  END LOOP;
END;
$$;

-- Function to increment aura interaction
CREATE OR REPLACE FUNCTION public.increment_aura_interaction(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_auras
  SET 
    interactions_count = interactions_count + 1,
    luminosity = LEAST(100, luminosity + 2),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Check for unlocks
  PERFORM public.check_rare_aura_unlocks(p_user_id);
END;
$$;

-- Trigger to create aura history on week change
CREATE OR REPLACE FUNCTION public.snapshot_aura_weekly()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aura RECORD;
  v_week_start DATE;
  v_week_end DATE;
  v_badge TEXT;
BEGIN
  v_week_start := date_trunc('week', now())::DATE;
  v_week_end := v_week_start + INTERVAL '7 days';
  
  FOR v_aura IN SELECT * FROM public.user_auras LOOP
    -- Generate badge based on WHO-5 level
    v_badge := CASE v_aura.who5_internal_level
      WHEN 4 THEN 'Vitalité rayonnante 🌞'
      WHEN 3 THEN 'Énergie douce 🌙'
      WHEN 2 THEN 'Semaine posée ✨'
      WHEN 1 THEN 'Présence calme 🕊️'
      ELSE 'Respire doucement 🌿'
    END;
    
    -- Insert into history if not exists for this week
    INSERT INTO public.aura_history (
      user_id,
      week_start,
      week_end,
      color_hue,
      luminosity,
      size_scale,
      who5_badge,
      snapshot_data
    )
    SELECT
      v_aura.user_id,
      v_week_start,
      v_week_end,
      v_aura.color_hue,
      v_aura.luminosity,
      v_aura.size_scale,
      v_badge,
      jsonb_build_object(
        'streak', v_aura.streak_weeks,
        'interactions', v_aura.interactions_count,
        'is_rare', v_aura.is_rare
      )
    WHERE NOT EXISTS (
      SELECT 1 FROM public.aura_history
      WHERE user_id = v_aura.user_id
        AND week_start = v_week_start
    );
  END LOOP;
END;
$$;