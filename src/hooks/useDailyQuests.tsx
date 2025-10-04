import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  module_name: string;
  target_count: number;
  current_count: number;
  xp_reward: number;
  completed: boolean;
  expires_at: string;
}

// Generate daily quests based on available modules
const QUEST_TEMPLATES = [
  { module: 'journal', title: '📝 Journal du jour', description: 'Écrire 1 entrée dans le journal', target: 1, xp: 50 },
  { module: 'meditation', title: '🧘 Moment zen', description: 'Compléter 1 session de méditation', target: 1, xp: 50 },
  { module: 'breathwork', title: '🫁 Respiration consciente', description: 'Pratiquer 3 exercices de respiration', target: 3, xp: 75 },
  { module: 'mood_mixer', title: '🎵 Mix créatif', description: 'Générer 2 mix émotionnels', target: 2, xp: 60 },
  { module: 'emotional_scan', title: '🔍 Scan émotionnel', description: 'Effectuer 1 scan émotionnel', target: 1, xp: 50 },
  { module: 'ar_filters', title: '📸 Masque expressif', description: 'Essayer 2 filtres AR', target: 2, xp: 60 },
  { module: 'vr_breath', title: '🌊 VR Immersion', description: 'Session VR de 10 minutes', target: 1, xp: 75 },
  { module: 'flash_glow', title: '✨ Flash créatif', description: 'Générer 3 flash glows', target: 3, xp: 60 },
];

const generateDailyQuests = (): Omit<DailyQuest, 'current_count' | 'completed'>[] => {
  // Shuffle and pick 3 random quests per day
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return selected.map((template, index) => ({
    id: `quest-${new Date().toISOString().split('T')[0]}-${index}`,
    title: template.title,
    description: template.description,
    module_name: template.module,
    target_count: template.target,
    xp_reward: template.xp,
    expires_at: tomorrow.toISOString(),
  }));
};

export const useDailyQuests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch or generate quests
  const { data: quests, isLoading } = useQuery({
    queryKey: ['daily-quests', user?.id],
    queryFn: async (): Promise<DailyQuest[]> => {
      if (!user) return [];

      // Check if we have quests in metadata
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `daily-quests-${today}`;
      
      // Try to get from localStorage first (for quick access)
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.userId === user.id) {
          return parsed.quests;
        }
      }

      // Generate new quests for today
      const generated = generateDailyQuests();
      const questsWithProgress: DailyQuest[] = generated.map(q => ({
        ...q,
        current_count: 0,
        completed: false,
      }));

      // Cache in localStorage
      localStorage.setItem(storageKey, JSON.stringify({
        userId: user.id,
        quests: questsWithProgress,
      }));

      return questsWithProgress;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Update quest progress
  const updateQuestProgress = useMutation({
    mutationFn: async ({ questId, increment = 1 }: { questId: string; increment?: number }) => {
      if (!quests) return;

      const updatedQuests = quests.map(quest => {
        if (quest.id === questId && !quest.completed) {
          const newCount = Math.min(quest.current_count + increment, quest.target_count);
          const isCompleted = newCount >= quest.target_count;

          return {
            ...quest,
            current_count: newCount,
            completed: isCompleted,
          };
        }
        return quest;
      });

      // Update cache
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `daily-quests-${today}`;
      localStorage.setItem(storageKey, JSON.stringify({
        userId: user?.id,
        quests: updatedQuests,
      }));

      return updatedQuests;
    },
    onSuccess: (updatedQuests) => {
      if (!updatedQuests) return;

      queryClient.setQueryData(['daily-quests', user?.id], updatedQuests);

      // Check for newly completed quests
      const newlyCompleted = updatedQuests.find(q => 
        q.completed && 
        !quests?.find(oldQ => oldQ.id === q.id)?.completed
      );

      if (newlyCompleted) {
        toast({
          title: '🎉 Quête accomplie !',
          description: `${newlyCompleted.title} - +${newlyCompleted.xp_reward} XP`,
          duration: 5000,
        });
      }
    },
  });

  // Track module activity (call this when user completes an action)
  const trackModuleActivity = (moduleName: string, count: number = 1) => {
    if (!quests) return;

    const relevantQuest = quests.find(
      q => q.module_name === moduleName && !q.completed
    );

    if (relevantQuest) {
      updateQuestProgress.mutate({ questId: relevantQuest.id, increment: count });
    }
  };

  // Calculate total available XP and completion status
  const totalXP = quests?.reduce((sum, q) => sum + q.xp_reward, 0) || 0;
  const earnedXP = quests?.reduce((sum, q) => q.completed ? sum + q.xp_reward : sum, 0) || 0;
  const completedCount = quests?.filter(q => q.completed).length || 0;
  const totalCount = quests?.length || 0;

  return {
    quests: quests || [],
    isLoading,
    trackModuleActivity,
    totalXP,
    earnedXP,
    completedCount,
    totalCount,
    allCompleted: completedCount === totalCount && totalCount > 0,
  };
};
