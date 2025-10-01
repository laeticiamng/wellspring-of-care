-- Phase 3: Analytics & Insights Tables
-- User behavior tracking
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'journal_entry', 'meditation_session', 'music_generation', 'emotional_scan',
    'chat_message', 'exercise_completed', 'badge_earned', 'login', 'logout'
  )),
  activity_data JSONB DEFAULT '{}',
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emotion patterns analysis
CREATE TABLE IF NOT EXISTS emotion_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  dominant_emotions JSONB NOT NULL, -- {joy: 0.3, calm: 0.4, ...}
  emotion_trends JSONB DEFAULT '{}', -- {improving: [...], declining: [...]}
  trigger_patterns JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- User insights and recommendations
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    'progress', 'pattern', 'recommendation', 'achievement', 'warning'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  action_items JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly/Monthly reports
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics JSONB NOT NULL, -- {total_sessions: 10, avg_mood: 7.5, ...}
  highlights JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, report_type, period_start)
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities"
  ON user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all activities"
  ON user_activities FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for emotion_patterns
CREATE POLICY "Users can view their own emotion patterns"
  ON emotion_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage emotion patterns"
  ON emotion_patterns FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for user_insights
CREATE POLICY "Users can manage their own insights"
  ON user_insights FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all insights"
  ON user_insights FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for user_reports
CREATE POLICY "Users can view their own reports"
  ON user_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage reports"
  ON user_reports FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- Indexes for performance
CREATE INDEX idx_user_activities_user_created ON user_activities(user_id, created_at DESC);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_emotion_patterns_user_week ON emotion_patterns(user_id, week_start DESC);
CREATE INDEX idx_user_insights_user_read ON user_insights(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_reports_user_period ON user_reports(user_id, period_start DESC);

-- Function to auto-track activities
CREATE OR REPLACE FUNCTION track_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_data JSONB DEFAULT '{}',
  p_duration_seconds INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO user_activities (user_id, activity_type, activity_data, duration_seconds)
  VALUES (p_user_id, p_activity_type, p_activity_data, p_duration_seconds)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;
