-- Phase 2: Hume AI Emotional Scan Tables
-- Table pour stocker les scans émotionnels
CREATE TABLE IF NOT EXISTS emotional_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('voice', 'face', 'text')),
  audio_url TEXT,
  video_url TEXT,
  text_content TEXT,
  emotions JSONB NOT NULL DEFAULT '{}',
  top_emotion TEXT,
  confidence FLOAT,
  duration_seconds INTEGER,
  hume_job_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE emotional_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own emotional scans"
  ON emotional_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotional scans"
  ON emotional_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotional scans"
  ON emotional_scans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotional scans"
  ON emotional_scans FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can manage all scans
CREATE POLICY "Service role can manage all emotional scans"
  ON emotional_scans FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- Index pour améliorer les performances
CREATE INDEX idx_emotional_scans_user_id ON emotional_scans(user_id);
CREATE INDEX idx_emotional_scans_created_at ON emotional_scans(created_at DESC);
CREATE INDEX idx_emotional_scans_top_emotion ON emotional_scans(top_emotion);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_emotional_scans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER emotional_scans_updated_at
  BEFORE UPDATE ON emotional_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_emotional_scans_updated_at();