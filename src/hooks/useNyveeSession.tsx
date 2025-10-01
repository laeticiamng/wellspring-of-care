import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NyveeSession {
  sessionId: string;
  preScore: number;
}

interface NyveeBadge {
  badge: string;
  badgeColor: string;
  badgeEmoji: string;
  reductionPercent: number;
  nextAction: 'silence' | 'anchor' | 'flashglow';
  cocoonUnlocked: string | null;
  message: string;
}

export function useNyveeSession() {
  const { toast } = useToast();
  const [session, setSession] = useState<NyveeSession | null>(null);
  const [badge, setBadge] = useState<NyveeBadge | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nyvee-assess', {
        body: { action: 'start' },
      });

      if (error) throw error;

      setSession({
        sessionId: data.sessionId,
        preScore: data.preScore,
      });

      return data;
    } catch (error) {
      console.error('Error starting Nyvee session:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitSession = async (breathDuration: number) => {
    if (!session) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nyvee-assess', {
        body: {
          action: 'submit',
          sessionId: session.sessionId,
          preScore: session.preScore,
          breathDuration,
        },
      });

      if (error) throw error;

      setBadge(data);

      // Toast pour cocon rare
      if (data.cocoonUnlocked) {
        toast({
          title: '✨ Cocon rare débloqué !',
          description: `Texture "${data.cocoonUnlocked}" ajoutée à ta collection`,
          duration: 5000,
        });
      }

      return data;
    } catch (error) {
      console.error('Error submitting Nyvee session:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la session',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSession(null);
    setBadge(null);
  };

  return {
    session,
    badge,
    loading,
    startSession,
    submitSession,
    reset,
  };
}
