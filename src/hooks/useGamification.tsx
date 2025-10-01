import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  conditions: any;
  rewards: any;
  unlocked: boolean;
  unlockedAt?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at: string;
}

interface UserStats {
  totalCards: number;
  cardsThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  totalWHO5Assessments: number;
  averageWHO5Score: number;
  totalInteractions: number;
  level: number;
  xp: number;
  nextLevelXP: number;
}

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCards: 0,
    cardsThisWeek: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWHO5Assessments: 0,
    averageWHO5Score: 0,
    totalInteractions: 0,
    level: 1,
    xp: 0,
    nextLevelXP: 100,
  });
  const [loading, setLoading] = useState(true);

  // Charger les achievements disponibles
  const loadAchievements = async () => {
    if (!user) return;

    try {
      const { data: allAchievements, error } = await supabase
        .from('achievements')
        .select('*');

      if (error) throw error;

      // Vérifier quels achievements sont débloqués
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (userError) throw userError;

      const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
      
      const enrichedAchievements = allAchievements?.map(ach => ({
        ...ach,
        unlocked: unlockedIds.has(ach.id),
        unlockedAt: userAchievements?.find(ua => ua.achievement_id === ach.id)?.unlocked_at,
      })) || [];

      setAchievements(enrichedAchievements);
    } catch (error) {
      console.error('Erreur chargement achievements:', error);
    }
  };

  // Charger les badges
  const loadBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Erreur chargement badges:', error);
    }
  };

  // Calculer les stats utilisateur
  const calculateStats = async () => {
    if (!user) return;

    try {
      // Total cartes tirées
      const { count: totalCards } = await supabase
        .from('weekly_card_draws')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Cartes cette semaine
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { count: cardsThisWeek } = await supabase
        .from('weekly_card_draws')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('drawn_at', weekStart.toISOString());

      // WHO-5 assessments
      const { data: who5Data, count: totalWHO5 } = await supabase
        .from('who5_assessments')
        .select('total_score', { count: 'exact' })
        .eq('user_id', user.id);

      const averageWHO5 = who5Data && who5Data.length > 0
        ? who5Data.reduce((acc, d) => acc + (d.total_score || 0), 0) / who5Data.length
        : 0;

      // Streak (cartes consécutives par semaine)
      const { data: allDraws } = await supabase
        .from('weekly_card_draws')
        .select('week_start')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false });

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      if (allDraws && allDraws.length > 0) {
        const weeks = allDraws.map(d => new Date(d.week_start).getTime());
        const uniqueWeeks = [...new Set(weeks)].sort((a, b) => b - a);

        // Calculer streak actuel
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        thisWeek.setHours(0, 0, 0, 0);
        const thisWeekTime = thisWeek.getTime();

        for (let i = 0; i < uniqueWeeks.length; i++) {
          const expectedWeek = thisWeekTime - (i * 7 * 24 * 60 * 60 * 1000);
          if (uniqueWeeks[i] === expectedWeek) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculer plus long streak
        tempStreak = 1;
        for (let i = 1; i < uniqueWeeks.length; i++) {
          const diff = uniqueWeeks[i - 1] - uniqueWeeks[i];
          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          
          if (diff === oneWeek) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      // Calculer niveau et XP
      const totalXP = (totalCards || 0) * 50 + (totalWHO5 || 0) * 10 + currentStreak * 100;
      const level = Math.floor(totalXP / 100) + 1;
      const xp = totalXP % 100;
      const nextLevelXP = 100;

      setStats({
        totalCards: totalCards || 0,
        cardsThisWeek: cardsThisWeek || 0,
        currentStreak,
        longestStreak,
        totalWHO5Assessments: totalWHO5 || 0,
        averageWHO5Score: Math.round(averageWHO5),
        totalInteractions: (totalCards || 0) + (totalWHO5 || 0),
        level,
        xp,
        nextLevelXP,
      });
    } catch (error) {
      console.error('Erreur calcul stats:', error);
    }
  };

  // Vérifier et débloquer achievements
  const checkAchievements = async () => {
    if (!user) return;

    for (const achievement of achievements) {
      if (achievement.unlocked) continue;

      let unlocked = false;

      // Vérifier conditions selon le type
      const conditions = achievement.conditions as any;

      if (conditions.type === 'streak' && stats.currentStreak >= conditions.value) {
        unlocked = true;
      } else if (conditions.type === 'cards_collected' && stats.totalCards >= conditions.value) {
        unlocked = true;
      } else if (conditions.type === 'who5_score' && stats.averageWHO5Score >= conditions.value) {
        unlocked = true;
      } else if (conditions.type === 'level' && stats.level >= conditions.value) {
        unlocked = true;
      }

      if (unlocked) {
        await unlockAchievement(achievement);
      }
    }
  };

  // Débloquer un achievement
  const unlockAchievement = async (achievement: Achievement) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
        });

      if (error) throw error;

      // Notification célébration
      toast({
        title: `🎉 Achievement débloqué !`,
        description: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
        duration: 10000,
      });

      // Ajouter badge si rewards inclus
      const rewards = achievement.rewards as any;
      if (rewards?.badge) {
        await awardBadge(rewards.badge, achievement.name);
      }

      // Recharger achievements
      await loadAchievements();
    } catch (error) {
      console.error('Erreur déblocage achievement:', error);
    }
  };

  // Attribuer un badge
  const awardBadge = async (badgeName: string, description: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('badges')
        .insert({
          user_id: user.id,
          name: badgeName,
          description,
        });

      if (error) throw error;

      toast({
        title: `✨ Nouveau badge !`,
        description: `Tu as obtenu le badge "${badgeName}"`,
      });

      await loadBadges();
    } catch (error) {
      console.error('Erreur attribution badge:', error);
    }
  };

  // Charger toutes les données
  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      loadAchievements(),
      loadBadges(),
      calculateStats(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [user]);

  // Vérifier achievements après calcul stats
  useEffect(() => {
    if (stats.totalCards > 0 && achievements.length > 0) {
      checkAchievements();
    }
  }, [stats, achievements]);

  return {
    achievements,
    badges,
    stats,
    loading,
    refresh: loadAll,
    unlockAchievement,
    awardBadge,
  };
}
