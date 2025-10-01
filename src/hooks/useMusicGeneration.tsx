import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedSong {
  song_id: string;
  audio_url: string;
  duration: number;
  metadata: {
    bpm: number;
    key: string;
    instruments: string[];
  };
}

export function useMusicGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateMusic = async (
    emotion: string,
    duration: number,
    style: string
  ): Promise<GeneratedSong | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generate', {
        body: { emotion, duration, style },
      });

      if (error) {
        if (error.message.includes('quota')) {
          toast({
            title: 'Quota dépassé',
            description: 'Vous avez atteint votre limite mensuelle de générations',
            variant: 'destructive',
          });
          return null;
        }
        throw error;
      }

      toast({
        title: 'Musique générée',
        description: `Piste de ${duration}s créée avec succès`,
      });

      return data;
    } catch (error) {
      console.error('Music generation error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer la musique',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching music library:', error);
      return [];
    }
  };

  const getQuota = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase
        .from('music_generation_usage')
        .select('*')
        .eq('month_year', currentMonth)
        .maybeSingle();

      if (error) throw error;
      return data || { generated_count: 0, quota_limit: 10 };
    } catch (error) {
      console.error('Error fetching quota:', error);
      return { generated_count: 0, quota_limit: 10 };
    }
  };

  return {
    isGenerating,
    generateMusic,
    getLibrary,
    getQuota,
  };
}
