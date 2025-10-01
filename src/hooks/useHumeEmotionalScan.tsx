import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmotionResult {
  scan_id: string;
  emotions: Record<string, number>;
  top_emotion: string;
  confidence: number;
}

export function useHumeEmotionalScan() {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const scanFromText = async (text: string): Promise<EmotionResult | null> => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('hume-emotion-detect', {
        body: {
          scanType: 'text',
          textContent: text,
        },
      });

      if (error) throw error;

      toast({
        title: 'Scan émotionnel terminé',
        description: `Émotion dominante: ${data.top_emotion}`,
      });

      return data;
    } catch (error) {
      console.error('Emotional scan error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de réaliser le scan émotionnel',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const scanFromVoice = async (audioBlob: Blob): Promise<EmotionResult | null> => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      const audioData = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });

      const { data, error } = await supabase.functions.invoke('hume-emotion-detect', {
        body: {
          scanType: 'voice',
          audioData,
        },
      });

      if (error) throw error;

      toast({
        title: 'Scan vocal terminé',
        description: `Émotion dominante: ${data.top_emotion}`,
      });

      return data;
    } catch (error) {
      console.error('Voice scan error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de réaliser le scan vocal',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const getHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('emotional_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching scan history:', error);
      return [];
    }
  };

  return {
    isScanning,
    scanFromText,
    scanFromVoice,
    getHistory,
  };
}
