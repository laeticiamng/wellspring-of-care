import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  audio_url: string | null;
  category: string;
  instructor: string;
  difficulty_level: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface MeditationProgress {
  id: string;
  meditation_id: string;
  completed: boolean;
  progress_seconds: number;
  completed_at: string | null;
}

export const useMeditation = () => {
  const [meditations, setMeditations] = useState<MeditationContent[]>([]);
  const [progress, setProgress] = useState<MeditationProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeditations();
      fetchProgress();
    }
  }, [user]);

  const fetchMeditations = async () => {
    try {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeditations(data || []);
    } catch (error) {
      console.error('Error fetching meditations:', error);
      toast.error('Erreur lors du chargement des méditations');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_meditation_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateProgress = async (meditationId: string, progressSeconds: number, completed: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_meditation_progress')
        .upsert({
          user_id: user.id,
          meditation_id: meditationId,
          progress_seconds: progressSeconds,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,meditation_id'
        });

      if (error) throw error;
      
      await fetchProgress();
      if (completed) {
        toast.success('Méditation complétée !');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getProgressForMeditation = (meditationId: string) => {
    return progress.find(p => p.meditation_id === meditationId);
  };

  return {
    meditations,
    progress,
    loading,
    updateProgress,
    getProgressForMeditation,
    refetch: fetchMeditations,
  };
};
