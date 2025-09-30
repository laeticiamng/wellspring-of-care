import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number;
  emotions: string[];
  notes: string | null;
  created_at: string;
}

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les entrées",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (moodLevel: number, emotions: string[], notes: string) => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user?.id,
          mood_level: moodLevel,
          emotions,
          notes
        })
        .select()
        .single();

      if (error) throw error;

      setEntries([data, ...entries]);
      toast({
        title: "Succès",
        description: "Entrée enregistrée avec succès"
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée",
        variant: "destructive"
      });
      return null;
    }
  };

  const getMoodStats = () => {
    if (entries.length === 0) return null;

    const avgMood = entries.reduce((acc, entry) => acc + entry.mood_level, 0) / entries.length;
    const emotionsCount = entries.reduce((acc, entry) => {
      entry.emotions.forEach(emotion => {
        acc[emotion] = (acc[emotion] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return { avgMood, emotionsCount };
  };

  return { entries, loading, createEntry, fetchEntries, getMoodStats };
}
