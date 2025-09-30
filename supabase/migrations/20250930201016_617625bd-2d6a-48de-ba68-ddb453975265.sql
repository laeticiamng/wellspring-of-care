-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Meditation tables
CREATE TABLE IF NOT EXISTS public.meditation_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  audio_url TEXT,
  category TEXT NOT NULL,
  instructor TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.meditation_content ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.user_meditation_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_id UUID NOT NULL REFERENCES public.meditation_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meditation_id)
);

ALTER TABLE public.user_meditation_progress ENABLE ROW LEVEL SECURITY;

-- Therapy tables
CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  rating NUMERIC(2,1) DEFAULT 5.0,
  price_per_session NUMERIC(10,2) NOT NULL,
  languages TEXT[] DEFAULT ARRAY['Français'],
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Community tables (create tables first, policies after)
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  member_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, group_id)
);

ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.community_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'fr',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Now create all RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view meditation content" ON public.meditation_content;
CREATE POLICY "Anyone can view meditation content"
  ON public.meditation_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own meditation progress" ON public.user_meditation_progress;
CREATE POLICY "Users can manage their own meditation progress"
  ON public.user_meditation_progress FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view therapists" ON public.therapists;
CREATE POLICY "Anyone can view therapists"
  ON public.therapists FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own therapy sessions" ON public.therapy_sessions;
CREATE POLICY "Users can manage their own therapy sessions"
  ON public.therapy_sessions FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public groups" ON public.community_groups;
CREATE POLICY "Anyone can view public groups"
  ON public.community_groups FOR SELECT
  USING (NOT is_private OR auth.uid() IN (
    SELECT user_id FROM public.group_memberships 
    WHERE group_id = community_groups.id
  ));

DROP POLICY IF EXISTS "Users can view their own memberships" ON public.group_memberships;
CREATE POLICY "Users can view their own memberships"
  ON public.group_memberships FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can join groups" ON public.group_memberships;
CREATE POLICY "Users can join groups"
  ON public.group_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view posts in their groups" ON public.community_posts;
CREATE POLICY "Users can view posts in their groups"
  ON public.community_posts FOR SELECT
  USING (
    group_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM public.group_memberships 
      WHERE group_id = community_posts.group_id 
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create posts" ON public.community_posts;
CREATE POLICY "Users can create posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can view comments on accessible posts" ON public.community_comments;
CREATE POLICY "Users can view comments on accessible posts"
  ON public.community_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts 
      WHERE id = community_comments.post_id
    )
  );

DROP POLICY IF EXISTS "Users can create comments" ON public.community_comments;
CREATE POLICY "Users can create comments"
  ON public.community_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.community_comments;
CREATE POLICY "Users can update their own comments"
  ON public.community_comments FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.community_comments;
CREATE POLICY "Users can delete their own comments"
  ON public.community_comments FOR DELETE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their organization memberships" ON public.organization_members;
CREATE POLICY "Users can view their organization memberships"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  ));

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Insert sample data only if tables are empty
INSERT INTO public.meditation_content (title, description, duration, category, instructor, difficulty_level) 
SELECT * FROM (VALUES
  ('Méditation Guidée du Matin', 'Commencez votre journée avec calme et sérénité', 600, 'Guidée', 'Sophie Martin', 'beginner'),
  ('Respiration Profonde', 'Techniques de respiration pour réduire le stress', 300, 'Respiration', 'Jean Dubois', 'beginner'),
  ('Pleine Conscience', 'Développez votre attention au moment présent', 900, 'Mindfulness', 'Marie Laurent', 'intermediate'),
  ('Méditation du Soir', 'Préparez-vous pour un sommeil réparateur', 720, 'Sommeil', 'Sophie Martin', 'beginner'),
  ('Scan Corporel', 'Détendez chaque partie de votre corps', 1200, 'Relaxation', 'Jean Dubois', 'intermediate')
) AS v(title, description, duration, category, instructor, difficulty_level)
WHERE NOT EXISTS (SELECT 1 FROM public.meditation_content LIMIT 1);

INSERT INTO public.therapists (full_name, specialization, bio, rating, price_per_session)
SELECT * FROM (VALUES
  ('Dr. Marie Laurent', 'Psychologue Clinicienne', 'Spécialisée en thérapie cognitivo-comportementale avec 15 ans d''expérience', 4.9, 80.00),
  ('Dr. Jean Dubois', 'Psychiatre', 'Expert en troubles anxieux et dépression', 4.8, 120.00),
  ('Sophie Martin', 'Thérapeute', 'Approche holistique et thérapie par l''art', 4.7, 65.00)
) AS v(full_name, specialization, bio, rating, price_per_session)
WHERE NOT EXISTS (SELECT 1 FROM public.therapists LIMIT 1);

INSERT INTO public.community_groups (name, description, icon, member_count)
SELECT * FROM (VALUES
  ('Gestion du Stress', 'Partagez vos techniques et expériences', '😌', 1234),
  ('Anxiété', 'Soutien mutuel pour ceux qui vivent avec l''anxiété', '💙', 892),
  ('Méditation', 'Communauté de pratiquants de la méditation', '🧘', 2156)
) AS v(name, description, icon, member_count)
WHERE NOT EXISTS (SELECT 1 FROM public.community_groups LIMIT 1);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();