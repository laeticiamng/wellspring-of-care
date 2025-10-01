-- Phase 3: Performance Optimization - Database Indexes (tables existantes uniquement)

-- Add composite indexes for frequently queried combinations
CREATE INDEX IF NOT EXISTS idx_user_activities_user_type_created 
ON public.user_activities(user_id, activity_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_emotional_scans_user_created 
ON public.emotional_scans(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_insights_user_priority 
ON public.user_insights(user_id, priority, is_read);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_active 
ON public.ai_recommendations(user_id, is_active, priority_level);

-- Add partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_user_insights_unread 
ON public.user_insights(user_id, created_at DESC) 
WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_active 
ON public.ai_recommendations(user_id, expires_at) 
WHERE is_active = true;

-- Optimize query performance with covering indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_covering 
ON public.user_activities(user_id, created_at DESC) 
INCLUDE (activity_type, duration_seconds);

-- Add GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_user_activities_data_gin 
ON public.user_activities USING GIN(activity_data);

CREATE INDEX IF NOT EXISTS idx_user_insights_action_items_gin 
ON public.user_insights USING GIN(action_items);

-- Enable query plan caching and optimize autovacuum
ALTER TABLE public.user_activities SET (autovacuum_enabled = true, autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE public.emotional_scans SET (autovacuum_enabled = true, autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE public.user_insights SET (autovacuum_enabled = true, autovacuum_vacuum_scale_factor = 0.05);

-- Create materialized view for dashboard stats (faster queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.dashboard_stats_cache AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE activity_type = 'journal_entry') as journal_count,
  COUNT(*) FILTER (WHERE activity_type = 'meditation_session') as meditation_count,
  COUNT(*) FILTER (WHERE activity_type = 'chat_message') as chat_count,
  MAX(created_at) as last_activity_at,
  date_trunc('day', created_at) as activity_date
FROM public.user_activities
WHERE created_at > now() - interval '30 days'
GROUP BY user_id, date_trunc('day', created_at);

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_user_date 
ON public.dashboard_stats_cache(user_id, activity_date DESC);

-- Function to refresh stats cache
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_stats_cache;
END;
$$;