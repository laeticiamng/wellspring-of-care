import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MoodState {
  tension: number;
  fatigue: number;
  energy: number;
}

interface MusicSession {
  sessionId: string;
  musicUrl: string;
  visualTheme: 'calming' | 'energizing' | 'expansive';
  duration: number;
}

interface SessionResult {
  badge: string;
  fragmentUnlocked: boolean;
  fragment?: {
    id: string;
    rarity: 'common' | 'rare' | 'legendary';
  };
  suggestedAction?: 'breathwork' | 'meditation' | null;
}

export function useMusicTherapy() {
  const [session, setSession] = useState<MusicSession | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSession = useCallback(async (moodState: MoodState) => {
    try {
      setLoading(true);
      setResult(null);

      const { data, error } = await supabase.functions.invoke('music-therapy-start', {
        body: { moodState },
      });

      if (error) throw error;

      setSession(data);
      return data;
    } catch (error) {
      console.error('Erreur démarrage session musicale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session musicale",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const submitSession = useCallback(async (
    sessionId: string,
    moodStatePost: MoodState,
    duration: number,
    interactions: number
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('music-therapy-submit', {
        body: {
          sessionId,
          moodStatePost,
          duration,
          interactions,
        },
      });

      if (error) throw error;

      setResult(data);

      // Toast si fragment légendaire débloqué
      if (data.fragmentUnlocked && data.fragment?.rarity === 'legendary') {
        toast({
          title: "✨ Fragment Légendaire !",
          description: "Tu as débloqué un fragment musical ultra-rare !",
          duration: 5000,
        });
      } else if (data.fragmentUnlocked) {
        toast({
          title: "🎶 Fragment débloqué",
          description: "Un nouveau son rejoint ta collection",
          duration: 3000,
        });
      }

      return data;
    } catch (error) {
      console.error('Erreur soumission session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la session",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setSession(null);
    setResult(null);
  }, []);

  return {
    session,
    result,
    loading,
    startSession,
    submitSession,
    reset,
  };
}
