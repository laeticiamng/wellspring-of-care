-- Fix security warning: set search_path for trigger function
DROP FUNCTION IF EXISTS update_module_progress_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_module_progress_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER module_progress_updated_at
  BEFORE UPDATE ON public.module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_updated_at();