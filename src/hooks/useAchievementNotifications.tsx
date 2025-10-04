import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface AchievementEvent {
  type: 'level_up' | 'item_unlocked' | 'milestone';
  title: string;
  description: string;
  moduleName: string;
  data?: any;
}

export const useAchievementNotifications = () => {
  const { toast } = useToast();
  const previousValuesRef = useRef<Map<string, { level: number; xp: number; unlockedCount: number }>>(new Map());

  const showAchievementToast = (event: AchievementEvent) => {
    const icons = {
      level_up: Trophy,
      item_unlocked: Star,
      milestone: Sparkles,
    };

    const Icon = icons[event.type];

    toast({
      title: (
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span>{event.title}</span>
        </div>
      ) as any,
      description: event.description,
      duration: 5000,
      className: "border-primary bg-card",
    });
  };

  const checkLevelUp = (moduleName: string, currentLevel: number, previousLevel?: number) => {
    if (previousLevel && currentLevel > previousLevel) {
      showAchievementToast({
        type: 'level_up',
        title: '🎉 Niveau supérieur !',
        description: `${moduleName}: Niveau ${currentLevel} atteint !`,
        moduleName,
        data: { newLevel: currentLevel, previousLevel },
      });
    }
  };

  const checkItemUnlocked = (moduleName: string, currentUnlockedCount: number, previousCount?: number) => {
    if (previousCount !== undefined && currentUnlockedCount > previousCount) {
      const newItemsCount = currentUnlockedCount - previousCount;
      showAchievementToast({
        type: 'item_unlocked',
        title: '⭐ Nouvel item débloqué !',
        description: `${moduleName}: ${newItemsCount} ${newItemsCount > 1 ? 'items débloqués' : 'item débloqué'} !`,
        moduleName,
        data: { newItemsCount },
      });
    }
  };

  const checkMilestone = (moduleName: string, currentXP: number, previousXP?: number) => {
    const milestones = [100, 500, 1000, 2500, 5000, 10000];
    
    if (previousXP !== undefined) {
      const reachedMilestone = milestones.find(
        milestone => previousXP < milestone && currentXP >= milestone
      );

      if (reachedMilestone) {
        showAchievementToast({
          type: 'milestone',
          title: '✨ Étape franchie !',
          description: `${moduleName}: ${reachedMilestone} XP atteints !`,
          moduleName,
          data: { milestone: reachedMilestone },
        });
      }
    }
  };

  const trackProgress = (
    moduleName: string,
    level: number,
    xp: number,
    unlockedItemsCount: number
  ) => {
    const key = moduleName;
    const previous = previousValuesRef.current.get(key);

    if (previous) {
      checkLevelUp(moduleName, level, previous.level);
      checkItemUnlocked(moduleName, unlockedItemsCount, previous.unlockedCount);
      checkMilestone(moduleName, xp, previous.xp);
    }

    // Update stored values
    previousValuesRef.current.set(key, {
      level,
      xp,
      unlockedCount: unlockedItemsCount,
    });
  };

  return {
    trackProgress,
    showAchievementToast,
  };
};
