import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeamAssessment {
  id: string;
  org_id: string;
  team_name: string;
  period_start: string;
  period_end: string;
  phrases: string[];
  hints: Record<string, any>;
  response_count: number;
  can_show: boolean;
  color_mood: string;
  created_at: string;
}

interface ManagerAction {
  id: string;
  org_id: string;
  team_name: string;
  action_type: string;
  action_description: string;
  scheduled_at: string | null;
  completed: boolean;
  completed_at: string | null;
}

export function useTeamAggregate(orgId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['team-assessments', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_assessments')
        .select('*')
        .eq('org_id', orgId)
        .order('period_start', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as TeamAssessment[];
    },
    enabled: !!orgId,
  });

  const { data: actions } = useQuery({
    queryKey: ['manager-actions', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manager_actions')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ManagerAction[];
    },
    enabled: !!orgId,
  });

  const generateAssessment = useMutation({
    mutationFn: async ({ teamName, periodStart, periodEnd }: {
      teamName: string;
      periodStart: string;
      periodEnd: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('team-aggregate-b2b', {
        body: {
          org_id: orgId,
          team_name: teamName,
          period_start: periodStart,
          period_end: periodEnd,
          instruments: ['SWEMWBS', 'CBI', 'UWES']
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-assessments'] });
      toast({
        title: "Analyse générée ✨",
        description: "Les données de l'équipe ont été agrégées",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer l'analyse",
        variant: "destructive",
      });
    },
  });

  const scheduleAction = useMutation({
    mutationFn: async ({ teamName, actionType, description, scheduledAt }: {
      teamName: string;
      actionType: string;
      description: string;
      scheduledAt?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('manager_actions')
        .insert({
          org_id: orgId,
          team_name: teamName,
          manager_id: userData.user.id,
          action_type: actionType,
          action_description: description,
          scheduled_at: scheduledAt || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-actions'] });
      toast({
        title: "Action planifiée 🎯",
        description: "L'action a été enregistrée",
        duration: 2000,
      });
    },
  });

  const completeAction = useMutation({
    mutationFn: async (actionId: string) => {
      const { error } = await supabase
        .from('manager_actions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-actions'] });
    },
  });

  return {
    assessments,
    actions,
    isLoading,
    generateAssessment: generateAssessment.mutate,
    scheduleAction: scheduleAction.mutate,
    completeAction: completeAction.mutate,
    isGenerating: generateAssessment.isPending,
  };
}