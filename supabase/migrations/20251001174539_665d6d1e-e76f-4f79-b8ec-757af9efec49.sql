-- Create assessment_sessions table for generic assessment tracking
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrument TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'fr-FR',
  context JSONB DEFAULT '{}'::jsonb,
  answers JSONB DEFAULT NULL,
  duration_seconds INTEGER DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own assessment sessions"
ON public.assessment_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment sessions"
ON public.assessment_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment sessions"
ON public.assessment_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all assessment sessions"
ON public.assessment_sessions
FOR ALL
TO service_role
USING (true);

-- Create index for faster queries
CREATE INDEX idx_assessment_sessions_user_id ON public.assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_instrument ON public.assessment_sessions(instrument);
CREATE INDEX idx_assessment_sessions_completed_at ON public.assessment_sessions(completed_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_assessment_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_assessment_sessions_updated_at
BEFORE UPDATE ON public.assessment_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_assessment_sessions_updated_at();