-- Fix search_path for new functions

DROP FUNCTION IF EXISTS get_current_week_bounds();
CREATE OR REPLACE FUNCTION get_current_week_bounds()
RETURNS TABLE(week_start DATE, week_end DATE)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT
    date_trunc('week', CURRENT_DATE)::DATE AS week_start,
    (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::DATE AS week_end;
END;
$$;

DROP FUNCTION IF EXISTS calculate_who5_score(jsonb);
CREATE OR REPLACE FUNCTION calculate_who5_score(responses JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  total INTEGER := 0;
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(responses)
  LOOP
    total := total + (item->>'value')::INTEGER;
  END LOOP;
  RETURN total;
END;
$$;