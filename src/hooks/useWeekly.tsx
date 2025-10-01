import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeeklySummary {
  id: string;
  week_iso: string;
  verbal_week: string[];
  helps: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  hints: Record<string, any>;
  created_at: string;
}

interface WeeklyGarden {
  id: string;
  week_iso: string;
  plant_state: Record<string, any>;
  sky_state: Record<string, any>;
  rarity: number;
  created_at: string;
}

export function useWeekly() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchWeeklySummary = async (period: 'this_week' | 'last_week' = 'this_week') => {
    const { data, error } = await supabase.functions.invoke('assess-aggregate', {
      body: { 
        instrument: 'WHO5', 
        period,
        locale: 'fr' 
      }
    });

    if (error) throw error;
    return data;
  };

  const { data: currentSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['weekly-summary', 'current'],
    queryFn: () => fetchWeeklySummary('this_week'),
  });

  const { data: weeklySummaries, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['weekly-summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_summary')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as WeeklySummary[];
    },
  });

  const { data: weeklyGardens } = useQuery({
    queryKey: ['weekly-gardens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_garden')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as WeeklyGarden[];
    },
  });

  const executeCTA = useMutation({
    mutationFn: async (ctaType: string) => {
      // Track CTA execution
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          activity_type: 'cta_clicked',
          activity_details: { type: ctaType }
        });

      if (error) console.error('Failed to log CTA:', error);
      return ctaType;
    },
    onSuccess: () => {
      toast({
        title: "Une graine plantée 🌱",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "On réessaie plus tard",
        variant: "destructive",
      });
    },
  });

  return {
    currentSummary,
    weeklySummaries,
    weeklyGardens,
    isLoadingSummary,
    isLoadingHistory,
    executeCTA: executeCTA.mutate,
    isExecutingCTA: executeCTA.isPending,
  };
}
