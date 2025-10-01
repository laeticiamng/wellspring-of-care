import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WHO5Result {
  who5Score: number;
  emotionalLevel: 'low' | 'moderate' | 'high';
  recommendedCard: any;
  personalizedMessage: string;
  insights: {
    dwellTimeAnalysis: string | null;
    interactionAnalysis: string | null;
  };
}

export function useWHO5Calculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WHO5Result | null>(null);
  const { toast } = useToast();

  const calculateWHO5 = async (implicitData: {
    dwellTime?: number;
    interactionCount?: number;
    cardDrawChoice?: boolean;
    emotionalState?: number;
  }) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('calculate-who5-card', {
        body: { implicitData }
      });

      if (error) throw error;

      setResult(data);
      
      // Toast avec le message personnalisé
      toast({
        title: "Analyse émotionnelle 🧠",
        description: data.personalizedMessage,
        duration: 5000,
      });

      return data;
    } catch (error) {
      console.error('Erreur calcul WHO-5:', error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer ton état émotionnel",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateWHO5,
    loading,
    result,
  };
}
