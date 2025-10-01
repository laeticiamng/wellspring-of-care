-- Migration Story Synth Lab - Théâtre des Histoires

-- Catalogue des actes disponibles
CREATE TABLE IF NOT EXISTS public.story_acts_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  act_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  theme TEXT NOT NULL, -- 'apaisement', 'courage', 'douceur_soir', 'clarté'
  description TEXT,
  duration_minutes INTEGER DEFAULT 5,
  scenes JSONB NOT NULL, -- Array des scènes avec choix
  music_palette JSONB DEFAULT '[]', -- Textures musicales possibles
  visual_palette JSONB DEFAULT '{}', -- Couleurs, particules
  difficulty_level TEXT DEFAULT 'gentle', -- 'gentle', 'medium', 'deep'
  unlock_conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sessions d'histoires utilisateur
CREATE TABLE IF NOT EXISTS public.story_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  act_code TEXT NOT NULL,
  session_id UUID, -- Lien vers assess session
  choices JSONB DEFAULT '[]', -- Choix faits pendant l'histoire
  scenes_completed INTEGER DEFAULT 0,
  poms_pre JSONB, -- État pré (jamais affiché)
  poms_post JSONB, -- État post (jamais affiché)
  badge_received TEXT, -- Badge verbal
  fragments_unlocked JSONB DEFAULT '[]',
  duration_seconds INTEGER,
  ending_reached TEXT, -- Quelle fin atteinte
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fragments collectionnés (cartes souvenir)
CREATE TABLE IF NOT EXISTS public.story_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fragment_code TEXT NOT NULL,
  act_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
  visual_asset TEXT, -- URL ou code visuel
  ambient_unlock TEXT, -- Ambiance musicale débloquée
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  times_viewed INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, fragment_code)
);

-- Catalogue des fragments disponibles
CREATE TABLE IF NOT EXISTS public.story_fragments_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fragment_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  act_code TEXT NOT NULL,
  rarity TEXT NOT NULL,
  visual_data JSONB NOT NULL,
  ambient_data JSONB,
  unlock_hints JSONB DEFAULT '[]', -- Indices pour débloquer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ambiances rares débloquables
CREATE TABLE IF NOT EXISTS public.story_ambients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ambient_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  music_texture JSONB NOT NULL, -- Paramètres audio
  visual_effect JSONB, -- Effets visuels spéciaux
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, ambient_code)
);

-- RLS Policies
ALTER TABLE public.story_acts_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_fragments_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_ambients ENABLE ROW LEVEL SECURITY;

-- Acts catalog: public read
DROP POLICY IF EXISTS "Anyone can view story acts" ON public.story_acts_catalog;
CREATE POLICY "Anyone can view story acts"
ON public.story_acts_catalog FOR SELECT
USING (true);

-- Sessions policies
DROP POLICY IF EXISTS "Users manage own story sessions" ON public.story_sessions;
CREATE POLICY "Users manage own story sessions"
ON public.story_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fragments policies
DROP POLICY IF EXISTS "Users manage own fragments" ON public.story_fragments;
CREATE POLICY "Users manage own fragments"
ON public.story_fragments FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fragments catalog: public read
DROP POLICY IF EXISTS "Anyone can view fragments catalog" ON public.story_fragments_catalog;
CREATE POLICY "Anyone can view fragments catalog"
ON public.story_fragments_catalog FOR SELECT
USING (true);

-- Ambients policies
DROP POLICY IF EXISTS "Users manage own ambients" ON public.story_ambients;
CREATE POLICY "Users manage own ambients"
ON public.story_ambients FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Seed story acts catalog
INSERT INTO public.story_acts_catalog (act_code, title, theme, description, duration_minutes, scenes, music_palette, visual_palette)
VALUES
  ('lisiere', 'À la Lisière', 'apaisement',
   'Un chemin doux entre forêt et lumière',
   5,
   '[
     {"id": 1, "title": "L''orée", "choices": [
       {"id": "A", "text": "Écouter la rivière", "mood": "calm", "music": "water"},
       {"id": "B", "text": "Suivre la luciole", "mood": "curious", "music": "light"},
       {"id": "C", "text": "Tenir la pierre chaude", "mood": "grounded", "music": "earth"}
     ]},
     {"id": 2, "title": "Le passage", "choices": [
       {"id": "A", "text": "Observer le ciel", "mood": "open", "music": "sky"},
       {"id": "B", "text": "Respirer avec l''arbre", "mood": "centered", "music": "breath"}
     ]},
     {"id": 3, "title": "Le cœur", "choices": [
       {"id": "A", "text": "Constellation", "mood": "wonder", "music": "stars"},
       {"id": "B", "text": "Foyer", "mood": "warmth", "music": "fire"},
       {"id": "C", "text": "Clairière", "mood": "peace", "music": "forest"}
     ]}
   ]'::jsonb,
   '["ambient_forest", "water_flow", "light_chimes", "earth_pulse"]'::jsonb,
   '{"primary": "#2d5016", "secondary": "#8b9474", "particles": "fireflies"}'::jsonb
  ),
  
  ('crepuscule', 'Crépuscule Doré', 'douceur_soir',
   'Quand le jour se retire en douceur',
   4,
   '[
     {"id": 1, "title": "Le dernier rayon", "choices": [
       {"id": "A", "text": "Marcher vers l''horizon", "mood": "reflective", "music": "sunset"},
       {"id": "B", "text": "S''asseoir sur la colline", "mood": "peaceful", "music": "stillness"}
     ]},
     {"id": 2, "title": "Entre chien et loup", "choices": [
       {"id": "A", "text": "Allumer une lanterne", "mood": "gentle", "music": "glow"},
       {"id": "B", "text": "Écouter le silence", "mood": "present", "music": "quiet"}
     ]},
     {"id": 3, "title": "La nuit douce", "choices": [
       {"id": "A", "text": "Première étoile", "mood": "hope", "music": "starlight"},
       {"id": "B", "text": "Lune montante", "mood": "calm", "music": "moonrise"}
     ]}
   ]'::jsonb,
   '["sunset_ambient", "twilight_hum", "night_whisper"]'::jsonb,
   '{"primary": "#f4a261", "secondary": "#e76f51", "particles": "stardust"}'::jsonb
  ),
  
  ('courage', 'Le Souffle du Courage', 'courage',
   'Trouver la force dans le mouvement',
   6,
   '[
     {"id": 1, "title": "L''appel", "choices": [
       {"id": "A", "text": "Répondre au vent", "mood": "brave", "music": "wind"},
       {"id": "B", "text": "Avancer d''un pas", "mood": "determined", "music": "march"}
     ]},
     {"id": 2, "title": "L''obstacle", "choices": [
       {"id": "A", "text": "Contourner", "mood": "wise", "music": "flow"},
       {"id": "B", "text": "Franchir", "mood": "bold", "music": "rise"}
     ]},
     {"id": 3, "title": "Le sommet", "choices": [
       {"id": "A", "text": "Crier sa victoire", "mood": "triumphant", "music": "victory"},
       {"id": "B", "text": "Respirer le calme", "mood": "achieved", "music": "peace"}
     ]}
   ]'::jsonb,
   '["wind_surge", "drum_pulse", "triumph_echo"]'::jsonb,
   '{"primary": "#e63946", "secondary": "#f77f00", "particles": "embers"}'::jsonb
  )
ON CONFLICT (act_code) DO NOTHING;

-- Seed fragments catalog
INSERT INTO public.story_fragments_catalog (fragment_code, title, description, act_code, rarity, visual_data)
VALUES
  ('lisiere_firefly', 'Luciole Étoilée', 'Une luciole qui danse dans la nuit', 'lisiere', 'common',
   '{"type": "illustration", "theme": "firefly", "colors": ["#ffd700", "#90ee90"]}'::jsonb),
  
  ('lisiere_stone', 'Pierre de Chaleur', 'Une pierre qui garde la chaleur du jour', 'lisiere', 'rare',
   '{"type": "illustration", "theme": "stone", "colors": ["#8b4513", "#ff8c00"]}'::jsonb),
  
  ('crepuscule_lantern', 'Lanterne d''Ambre', 'Une lumière douce pour la nuit', 'crepuscule', 'common',
   '{"type": "illustration", "theme": "lantern", "colors": ["#ffb347", "#ff6347"]}'::jsonb),
  
  ('crepuscule_star', 'Première Étoile', 'L''étoile qui ouvre la nuit', 'crepuscule', 'epic',
   '{"type": "illustration", "theme": "star", "colors": ["#e0f7fa", "#b2ebf2"]}'::jsonb),
  
  ('courage_summit', 'Vue du Sommet', 'L''horizon sans limites', 'courage', 'legendary',
   '{"type": "illustration", "theme": "summit", "colors": ["#00acc1", "#0097a7"]}'::jsonb)
ON CONFLICT (fragment_code) DO NOTHING;

-- Function to unlock fragment
CREATE OR REPLACE FUNCTION public.unlock_story_fragment(
  p_user_id UUID,
  p_fragment_code TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_fragment RECORD;
  v_catalog RECORD;
  v_result JSONB;
BEGIN
  -- Get catalog info
  SELECT * INTO v_catalog
  FROM public.story_fragments_catalog
  WHERE fragment_code = p_fragment_code;
  
  IF v_catalog IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Fragment not found');
  END IF;
  
  -- Check if already unlocked
  SELECT * INTO v_fragment
  FROM public.story_fragments
  WHERE user_id = p_user_id AND fragment_code = p_fragment_code;
  
  IF v_fragment IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_unlocked', true);
  END IF;
  
  -- Unlock fragment
  INSERT INTO public.story_fragments (
    user_id,
    fragment_code,
    act_code,
    title,
    description,
    rarity,
    visual_asset
  ) VALUES (
    p_user_id,
    p_fragment_code,
    v_catalog.act_code,
    v_catalog.title,
    v_catalog.description,
    v_catalog.rarity,
    v_catalog.visual_data::text
  )
  RETURNING * INTO v_fragment;
  
  -- Check for ambient unlock (rare fragments)
  IF v_catalog.ambient_data IS NOT NULL THEN
    INSERT INTO public.story_ambients (
      user_id,
      ambient_code,
      name,
      description,
      music_texture
    ) VALUES (
      p_user_id,
      p_fragment_code || '_ambient',
      v_catalog.title || ' (Ambiance)',
      'Ambiance musicale rare',
      v_catalog.ambient_data
    )
    ON CONFLICT (user_id, ambient_code) DO NOTHING;
  END IF;
  
  v_result := jsonb_build_object(
    'success', true,
    'fragment', row_to_json(v_fragment),
    'rarity', v_catalog.rarity,
    'ambient_unlocked', v_catalog.ambient_data IS NOT NULL
  );
  
  RETURN v_result;
END;
$$;

-- Function to complete story session
CREATE OR REPLACE FUNCTION public.complete_story_session(
  p_session_id UUID,
  p_badge TEXT,
  p_fragments_to_unlock TEXT[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_fragment_code TEXT;
  v_unlocked JSONB := '[]'::jsonb;
  v_result JSONB;
BEGIN
  -- Get session
  SELECT * INTO v_session
  FROM public.story_sessions
  WHERE id = p_session_id;
  
  IF v_session IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session not found');
  END IF;
  
  -- Update session
  UPDATE public.story_sessions
  SET 
    completed_at = now(),
    badge_received = p_badge,
    duration_seconds = EXTRACT(EPOCH FROM (now() - started_at))::INTEGER
  WHERE id = p_session_id;
  
  -- Unlock fragments
  FOREACH v_fragment_code IN ARRAY p_fragments_to_unlock
  LOOP
    v_result := public.unlock_story_fragment(v_session.user_id, v_fragment_code);
    IF (v_result->>'success')::boolean THEN
      v_unlocked := v_unlocked || jsonb_build_object(
        'code', v_fragment_code,
        'rarity', v_result->>'rarity'
      );
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'badge', p_badge,
    'fragments', v_unlocked
  );
END;
$$;