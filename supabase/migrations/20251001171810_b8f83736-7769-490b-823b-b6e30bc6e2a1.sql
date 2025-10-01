-- User Settings table for preferences and consents

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Accessibility settings
  low_stim_mode BOOLEAN DEFAULT false,
  tts_enabled BOOLEAN DEFAULT false,
  high_contrast BOOLEAN DEFAULT false,
  haptics_enabled BOOLEAN DEFAULT true,
  
  -- Notifications preferences
  nyvee_reminders BOOLEAN DEFAULT true,
  screen_silk_reminders BOOLEAN DEFAULT true,
  journal_reminders BOOLEAN DEFAULT true,
  reminder_frequency TEXT DEFAULT 'normal', -- 'low', 'normal', 'high'
  
  -- Visual preferences
  theme_palette TEXT DEFAULT 'default', -- 'default', 'dark', 'pastel', 'monochrome'
  
  -- Privacy consents (opt-ins for clinical instruments)
  consent_who5 BOOLEAN DEFAULT true,
  consent_panas BOOLEAN DEFAULT true,
  consent_swemwbs BOOLEAN DEFAULT true,
  consent_cbi BOOLEAN DEFAULT true,
  consent_uwes BOOLEAN DEFAULT true,
  consent_cvsq BOOLEAN DEFAULT true,
  consent_anonymous_aggregation BOOLEAN DEFAULT true,
  
  -- Onboarding state
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
CREATE POLICY "Users can manage their own settings"
  ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all settings" ON public.user_settings;
CREATE POLICY "Service role can manage all settings"
  ON public.user_settings
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- Function to auto-create settings on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create settings on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_settings();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to update timestamp
DROP TRIGGER IF EXISTS update_user_settings_timestamp ON public.user_settings;
CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_settings_updated_at();