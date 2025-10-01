import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserAura {
  id: string;
  user_id: string;
  color_hue: number;
  luminosity: number;
  size_scale: number;
  animation_speed: number;
  who5_internal_level: number | null;
  last_who5_at: string | null;
  streak_weeks: number;
  interactions_count: number;
  is_rare: boolean;
  rare_type: string | null;
  unlocked_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface AuraHistory {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  color_hue: number;
  luminosity: number;
  size_scale: number;
  who5_badge: string | null;
  snapshot_data: any;
  created_at: string;
}

export interface RareAura {
  id: string;
  aura_type: string;
  name: string;
  description: string | null;
  color_palette: string[];
  unlock_conditions: any;
  rarity_level: string;
  animation_preset: string | null;
  icon: string | null;
}

export function useAuras() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer l'aura personnelle
  const { data: userAura, isLoading: isLoadingAura } = useQuery({
    queryKey: ['user-aura', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_auras')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user aura:', error);
        return null;
      }

      return data as UserAura | null;
    },
    enabled: !!user?.id,
  });

  // Récupérer toutes les auras pour la vue collective (anonymisée)
  const { data: communityAuras, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['community-auras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_auras')
        .select('id, color_hue, luminosity, size_scale, animation_speed, is_rare, rare_type')
        .limit(50); // Limiter pour performance

      if (error) {
        console.error('Error fetching community auras:', error);
        return [];
      }

      return data;
    },
  });

  // Récupérer l'historique des auras
  const { data: auraHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['aura-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('aura_history')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(12); // 12 semaines

      if (error) {
        console.error('Error fetching aura history:', error);
        return [];
      }

      return data as AuraHistory[];
    },
    enabled: !!user?.id,
  });

  // Récupérer le catalogue d'auras rares
  const { data: rareCatalog } = useQuery({
    queryKey: ['rare-auras-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rare_auras_catalog')
        .select('*')
        .order('rarity_level', { ascending: false });

      if (error) {
        console.error('Error fetching rare auras:', error);
        return [];
      }

      return data as RareAura[];
    },
  });

  // Incrémenter les interactions de l'aura
  const incrementInteractionMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user');

      const { error } = await supabase.rpc('increment_aura_interaction', {
        p_user_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-aura', user?.id] });
    },
    onError: (error: any) => {
      console.error('Error incrementing interaction:', error);
    }
  });

  // Mettre à jour l'aura depuis WHO-5
  const updateFromWho5Mutation = useMutation({
    mutationFn: async (who5Score: number) => {
      if (!user?.id) throw new Error('No user');

      const { error } = await supabase.rpc('update_aura_from_who5', {
        p_user_id: user.id,
        p_who5_score: who5Score
      });

      if (error) throw error;
    },
    onSuccess: (_, who5Score) => {
      queryClient.invalidateQueries({ queryKey: ['user-aura', user?.id] });
      
      // Toast avec badge verbal basé sur le score
      let badge = 'Respire doucement 🌿';
      if (who5Score >= 20) badge = 'Vitalité rayonnante 🌞';
      else if (who5Score >= 16) badge = 'Énergie douce 🌙';
      else if (who5Score >= 12) badge = 'Semaine posée ✨';
      else if (who5Score >= 8) badge = 'Présence calme 🕊️';

      toast.success(badge, {
        description: 'Ton aura évolue dans le ciel ✨',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Error updating aura from WHO-5:', error);
    }
  });

  // Récupérer les connexions entre auras
  const { data: auraConnections } = useQuery({
    queryKey: ['aura-connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('aura_connections')
        .select('*')
        .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`);

      if (error) {
        console.error('Error fetching connections:', error);
        return [];
      }

      return data;
    },
    enabled: !!user?.id,
  });

  return {
    userAura,
    isLoadingAura,
    communityAuras,
    isLoadingCommunity,
    auraHistory,
    isLoadingHistory,
    rareCatalog,
    auraConnections,
    incrementInteraction: incrementInteractionMutation.mutate,
    updateFromWho5: updateFromWho5Mutation.mutate,
  };
}
