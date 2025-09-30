import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Therapist {
  id: string;
  full_name: string;
  specialization: string;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  price_per_session: number;
  languages: string[];
  available: boolean;
  created_at: string;
}

export interface TherapySession {
  id: string;
  user_id: string;
  therapist_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  meeting_url: string | null;
  created_at: string;
}

export const useTherapy = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTherapists();
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Erreur lors du chargement des thérapeutes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setSessions((data || []).map(session => ({
        ...session,
        status: session.status as 'scheduled' | 'completed' | 'cancelled'
      })));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const bookSession = async (
    therapistId: string,
    scheduledAt: Date,
    durationMinutes: number = 60
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté pour réserver');
      return;
    }

    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          therapist_id: therapistId,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: durationMinutes,
          status: 'scheduled',
        });

      if (error) throw error;

      toast.success('Session réservée avec succès !');
      await fetchSessions();
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Erreur lors de la réservation');
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Session annulée');
      await fetchSessions();
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  return {
    therapists,
    sessions,
    loading,
    bookSession,
    cancelSession,
    refetch: fetchTherapists,
  };
};
