-- Phase 2: Suno AI Music Generation Tables
CREATE TABLE IF NOT EXISTS generated_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emotion_input TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('ambient', 'binaural', 'nature', 'classical')),
  duration INTEGER NOT NULL CHECK (duration IN (30, 60, 120, 180)),
  audio_url TEXT NOT NULL,
  suno_job_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS music_generation_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL,
  generated_count INTEGER DEFAULT 0,
  quota_limit INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE generated_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_generation_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generated_songs
CREATE POLICY "Users can view their own songs"
  ON generated_songs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own songs"
  ON generated_songs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all songs"
  ON generated_songs FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for music_generation_usage
CREATE POLICY "Users can view their own usage"
  ON music_generation_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON music_generation_usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all usage"
  ON music_generation_usage FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- Indexes
CREATE INDEX idx_generated_songs_user_id ON generated_songs(user_id);
CREATE INDEX idx_generated_songs_created_at ON generated_songs(created_at DESC);
CREATE INDEX idx_music_usage_user_month ON music_generation_usage(user_id, month_year);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_music_usage_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER music_usage_updated_at
  BEFORE UPDATE ON music_generation_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_music_usage_updated_at();