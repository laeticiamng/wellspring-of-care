-- Créer uniquement les tables manquantes essentielles sans erreurs

-- emotional_scan_results
CREATE TABLE IF NOT EXISTS emotional_scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_data JSONB NOT NULL DEFAULT '{}',
  emotions_detected JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE emotional_scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional scan results"
ON emotional_scan_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional scan results"
ON emotional_scan_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- story_sessions
CREATE TABLE IF NOT EXISTS story_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_data JSONB NOT NULL DEFAULT '{}',
  theme TEXT,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE story_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own story sessions"
ON story_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own story sessions"
ON story_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own story sessions"
ON story_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- nyvee_sessions
CREATE TABLE IF NOT EXISTS nyvee_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data JSONB NOT NULL DEFAULT '{}',
  assessment_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE nyvee_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nyvee sessions"
ON nyvee_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nyvee sessions"
ON nyvee_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nyvee sessions"
ON nyvee_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- implicit_tracking
CREATE TABLE IF NOT EXISTS implicit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE implicit_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own implicit tracking"
ON implicit_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own implicit tracking"
ON implicit_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);