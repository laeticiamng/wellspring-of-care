import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CoachSession {
  sessionId: string;
  instrument: {
    code: string;
    name: string;
    questions: Array<{
      id: string;
      text: string;
      reverse: boolean;
    }>;
  };
}

interface CoachResult {
  sessionId: string;
  aaqScore: number;
  flexibilityLevel: 'low' | 'moderate' | 'high';
  badge: string;
  thoughts: Array<{
    text: string;
    emoji: string;
    rarity: string;
    category: string;
  }>;
  anchorCards: Array<{
    title: string;
    duration: number;
    category: string;
  }>;
  message: string;
}

export function useCoachAssess() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [result, setResult] = useState<CoachResult | null>(null);
  const { toast } = useToast();

  const startSession = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('coach-assess-start', {
        body: {}
      });

      if (error) throw error;

      setSession(data);
      return data;
    } catch (error) {
      console.error('Erreur démarrage session coach:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitSession = async (
    sessionId: string,
    responses: Record<string, number>,
    sessionDuration: number
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('coach-assess-submit', {
        body: { sessionId, responses, sessionDuration }
      });

      if (error) throw error;

      setResult(data);
      
      // Toast avec le badge
      toast({
        title: "✨ Jardin des Pensées",
        description: data.message,
        duration: 5000,
      });

      return data;
    } catch (error) {
      console.error('Erreur soumission session coach:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la session",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSession(null);
    setResult(null);
  };

  return {
    session,
    result,
    loading,
    startSession,
    submitSession,
    reset,
  };
}