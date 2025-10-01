-- Migration Village Bienveillant (adaptation avec tables existantes)

-- Maison-avatar de l'utilisateur (progression lumineuse)
CREATE TABLE IF NOT EXISTS public.community_house_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  light_intensity INTEGER NOT NULL DEFAULT 0,
  acts_of_care INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Ajouter colonnes manquantes à community_posts si elles n'existent pas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='community_posts' AND column_name='mood_halo') THEN
    ALTER TABLE public.community_posts ADD COLUMN mood_halo TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='community_posts' AND column_name='reply_count') THEN
    ALTER TABLE public.community_posts ADD COLUMN reply_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='community_posts' AND column_name='has_empathy_response') THEN
    ALTER TABLE public.community_posts ADD COLUMN has_empathy_response BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Ajouter colonne à community_comments si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='community_comments' AND column_name='is_empathy_template') THEN
    ALTER TABLE public.community_comments ADD COLUMN is_empathy_template BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Templates de réponses empathiques
CREATE TABLE IF NOT EXISTS public.empathy_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_fr TEXT NOT NULL,
  text_en TEXT NOT NULL,
  emoji TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rooms cocon (sessions synchrones)
CREATE TABLE IF NOT EXISTS public.community_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 4 CHECK (capacity BETWEEN 2 AND 4),
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  ritual_stage TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Participants aux rooms
CREATE TABLE IF NOT EXISTS public.community_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.community_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  badges_earned TEXT[],
  UNIQUE(room_id, user_id)
);

-- Badges communautaires
CREATE TABLE IF NOT EXISTS public.community_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies pour les nouvelles tables
ALTER TABLE public.community_house_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empathy_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_badges ENABLE ROW LEVEL SECURITY;

-- House state policies
DROP POLICY IF EXISTS "Users can manage their own house state" ON public.community_house_state;
CREATE POLICY "Users can manage their own house state"
ON public.community_house_state
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Empathy templates: public read
DROP POLICY IF EXISTS "Anyone can view empathy templates" ON public.empathy_templates;
CREATE POLICY "Anyone can view empathy templates"
ON public.empathy_templates
FOR SELECT
USING (true);

-- Rooms policies
DROP POLICY IF EXISTS "Anyone can view open rooms" ON public.community_rooms;
CREATE POLICY "Anyone can view open rooms"
ON public.community_rooms
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create rooms" ON public.community_rooms;
CREATE POLICY "Users can create rooms"
ON public.community_rooms
FOR INSERT
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their rooms" ON public.community_rooms;
CREATE POLICY "Users can update their rooms"
ON public.community_rooms
FOR UPDATE
USING (auth.uid() = created_by);

-- Room members policies
DROP POLICY IF EXISTS "Anyone can view room members" ON public.community_room_members;
CREATE POLICY "Anyone can view room members"
ON public.community_room_members
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can join rooms" ON public.community_room_members;
CREATE POLICY "Users can join rooms"
ON public.community_room_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Badges policies
DROP POLICY IF EXISTS "Anyone can view badges" ON public.community_badges;
CREATE POLICY "Anyone can view badges"
ON public.community_badges
FOR SELECT
USING (true);

-- Seed empathy templates
INSERT INTO public.empathy_templates (text_fr, text_en, emoji, category) 
VALUES
('Je te lis 🤍', 'I hear you 🤍', '🤍', 'presence'),
('Je suis là', 'I''m here', '🌿', 'presence'),
('Je comprends', 'I understand', '💙', 'understanding'),
('Respirons 10 sec ?', 'Breathe 10s together?', '🌬️', 'comfort'),
('Ça semble lourd', 'That sounds heavy', '🫂', 'understanding'),
('Je t''envoie douceur', 'Sending you softness', '✨', 'comfort')
ON CONFLICT DO NOTHING;

-- Function to increment house light
CREATE OR REPLACE FUNCTION public.increment_house_light(
  p_user_id UUID,
  p_acts INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.community_house_state (user_id, light_intensity, acts_of_care, last_activity_at)
  VALUES (p_user_id, p_acts, p_acts, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    light_intensity = community_house_state.light_intensity + p_acts,
    acts_of_care = community_house_state.acts_of_care + p_acts,
    last_activity_at = now();
END;
$$;

-- Trigger to increment house light on comment
CREATE OR REPLACE FUNCTION public.handle_community_comment_light()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment light for commenter (+2 for empathy)
  PERFORM public.increment_house_light(NEW.author_id, 2);
  
  -- Update post reply count if community_posts has the column
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='community_posts' AND column_name='reply_count') THEN
    UPDATE public.community_posts
    SET reply_count = reply_count + 1,
        has_empathy_response = true
    WHERE id = NEW.post_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_community_comment_light ON public.community_comments;
CREATE TRIGGER on_community_comment_light
AFTER INSERT ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_community_comment_light();

-- Trigger to increment house light on post
CREATE OR REPLACE FUNCTION public.handle_community_post_light()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment light for poster (+1)
  PERFORM public.increment_house_light(NEW.author_id, 1);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_community_post_light ON public.community_posts;
CREATE TRIGGER on_community_post_light
AFTER INSERT ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_community_post_light();