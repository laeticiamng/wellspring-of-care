-- Fix security warning: Set search_path for trigger function
CREATE OR REPLACE FUNCTION update_emotional_scans_updated_at()
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