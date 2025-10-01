import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WeeklyCard {
  draw_id: string;
  card_code: string;
  mantra: string;
  mantra_emoji: string;
  color_primary: string;
  color_secondary: string;
  icon_name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_new_draw: boolean;
  unlock_rewards: string[];
}

export function useWeeklyCard() {
  const [card, setCard] = useState<WeeklyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchWeeklyCard = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase
        .rpc('get_or_create_weekly_draw', { p_user_id: user.id });

      if (rpcError) throw rpcError;

      if (data && data.length > 0) {
        const cardData = data[0];
        setCard({
          ...cardData,
          rarity: cardData.rarity as 'common' | 'rare' | 'epic' | 'legendary',
          unlock_rewards: Array.isArray(cardData.unlock_rewards) 
            ? cardData.unlock_rewards as string[]
            : []
        });
      }
    } catch (err) {
      console.error('Error fetching weekly card:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weekly card');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyCard();
  }, [user]);

  return {
    card,
    loading,
    error,
    refetch: fetchWeeklyCard
  };
}
