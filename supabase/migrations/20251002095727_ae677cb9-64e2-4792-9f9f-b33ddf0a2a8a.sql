-- Fix RLS policy for music_therapy_sessions to allow users to create their own sessions
DROP POLICY IF EXISTS "Users can insert their own music therapy sessions" ON public.music_therapy_sessions;

CREATE POLICY "Users can insert their own music therapy sessions"
ON public.music_therapy_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);