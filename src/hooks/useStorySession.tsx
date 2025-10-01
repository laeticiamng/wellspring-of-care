import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface StoryAct {
  id: string;
  act_code: string;
  title: string;
  theme: string;
  description: string | null;
  duration_minutes: number;
  scenes: any[];
  music_palette: string[];
  visual_palette: any;
}

export interface StoryFragment {
  id: string;
  fragment_code: string;
  act_code: string;
  title: string;
  description: string | null;
  rarity: string;
  visual_asset: string | null;
  ambient_unlock: string | null;
  unlocked_at: string;
  times_viewed: number;
  is_favorite: boolean;
}

export function useStorySession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer les actes disponibles
  const { data: acts, isLoading: isLoadingActs } = useQuery({
    queryKey: ['story-acts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('story_acts_catalog')
        .select('*')
        .order('difficulty_level', { ascending: true });

      if (error) {
        console.error('Error fetching acts:', error);
        return [];
      }

      return data as StoryAct[];
    },
  });

  // Récupérer les fragments de l'utilisateur
  const { data: fragments, isLoading: isLoadingFragments } = useQuery({
    queryKey: ['story-fragments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('story_fragments')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching fragments:', error);
        return [];
      }

      return data as StoryFragment[];
    },
    enabled: !!user?.id,
  });

  // Récupérer les sessions passées
  const { data: sessions } = useQuery({
    queryKey: ['story-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('story_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Créer une nouvelle session
  const createSessionMutation = useMutation({
    mutationFn: async ({ actCode }: { actCode: string }) => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await supabase
        .from('story_sessions')
        .insert({
          user_id: user.id,
          act_code: actCode,
          choices: [],
          scenes_completed: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-sessions', user?.id] });
    },
    onError: (error: any) => {
      console.error('Error creating session:', error);
      toast.error('Impossible de démarrer l\'histoire');
    }
  });

  // Enregistrer un choix
  const recordChoiceMutation = useMutation({
    mutationFn: async ({ 
      sessionId, 
      sceneId, 
      choiceId 
    }: { 
      sessionId: string; 
      sceneId: number;
      choiceId: string;
    }) => {
      // Récupérer la session actuelle
      const { data: session } = await supabase
        .from('story_sessions')
        .select('choices, scenes_completed')
        .eq('id', sessionId)
        .single();

      if (!session) throw new Error('Session not found');

      const newChoices = [
        ...(session.choices as any[] || []),
        { sceneId, choiceId, timestamp: new Date().toISOString() }
      ];

      const { error } = await supabase
        .from('story_sessions')
        .update({
          choices: newChoices,
          scenes_completed: Math.max(session.scenes_completed, sceneId)
        })
        .eq('id', sessionId);

      if (error) throw error;
    },
    onError: (error: any) => {
      console.error('Error recording choice:', error);
    }
  });

  // Compléter une session
  const completeSessionMutation = useMutation({
    mutationFn: async ({ 
      sessionId, 
      badge,
      fragmentsToUnlock
    }: { 
      sessionId: string; 
      badge: string;
      fragmentsToUnlock: string[];
    }) => {
      const { data, error } = await supabase
        .rpc('complete_story_session', {
          p_session_id: sessionId,
          p_badge: badge,
          p_fragments_to_unlock: fragmentsToUnlock
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['story-sessions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['story-fragments', user?.id] });
      
      // Toast avec badge
      if (data && typeof data === 'object') {
        toast.success(data.badge || 'Session terminée', {
          description: `${(data.fragments || []).length} fragment(s) débloqué(s) ✨`,
          duration: 4000,
        });
      }
    },
    onError: (error: any) => {
      console.error('Error completing session:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  // Marquer un fragment comme favori
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (fragmentId: string) => {
      const { data: fragment } = await supabase
        .from('story_fragments')
        .select('is_favorite')
        .eq('id', fragmentId)
        .single();

      const { error } = await supabase
        .from('story_fragments')
        .update({ is_favorite: !fragment?.is_favorite })
        .eq('id', fragmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-fragments', user?.id] });
    }
  });

  return {
    acts,
    isLoadingActs,
    fragments,
    isLoadingFragments,
    sessions,
    createSession: createSessionMutation.mutate,
    recordChoice: recordChoiceMutation.mutate,
    completeSession: completeSessionMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isCreatingSession: createSessionMutation.isPending,
  };
}
