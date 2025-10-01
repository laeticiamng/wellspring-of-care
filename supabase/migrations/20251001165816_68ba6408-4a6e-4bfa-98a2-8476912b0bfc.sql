-- Create weekly_summary table
CREATE TABLE IF NOT EXISTS public.weekly_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_iso TEXT NOT NULL,
  verbal_week TEXT[] DEFAULT '{}',
  helps TEXT[] DEFAULT '{}',
  season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter')),
  hints JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, week_iso)
);

-- Create weekly_garden table
CREATE TABLE IF NOT EXISTS public.weekly_garden (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_iso TEXT NOT NULL,
  plant_state JSONB DEFAULT '{}',
  sky_state JSONB DEFAULT '{}',
  rarity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, week_iso)
);

-- Enable RLS
ALTER TABLE public.weekly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_garden ENABLE ROW LEVEL SECURITY;

-- RLS policies for weekly_summary
CREATE POLICY "Users can view their own weekly summaries"
  ON public.weekly_summary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries"
  ON public.weekly_summary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly summaries"
  ON public.weekly_summary FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for weekly_garden
CREATE POLICY "Users can view their own gardens"
  ON public.weekly_garden FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gardens"
  ON public.weekly_garden FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gardens"
  ON public.weekly_garden FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_weekly_summary_user_week ON public.weekly_summary(user_id, week_iso DESC);
CREATE INDEX idx_weekly_garden_user_week ON public.weekly_garden(user_id, week_iso DESC);