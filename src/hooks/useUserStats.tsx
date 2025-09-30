import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  totalMoodEntries: number;
  averageMood: number;
  streakDays: number;
  completedSessions: number;
  goalsAchieved: number;
  totalGoals: number;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalMoodEntries: 0,
    averageMood: 0,
    streakDays: 0,
    completedSessions: 0,
    goalsAchieved: 8,
    totalGoals: 10
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch mood entries
      const { data: moodEntries, error: moodError } = await supabase
        .from('mood_entries')
        .select('mood_level, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (moodError) throw moodError;

      const totalMoodEntries = moodEntries?.length || 0;
      const averageMood = totalMoodEntries > 0
        ? moodEntries.reduce((acc, entry) => acc + entry.mood_level, 0) / totalMoodEntries
        : 0;

      // Calculate streak
      const streakDays = calculateStreak(moodEntries || []);

      setStats({
        totalMoodEntries,
        averageMood: Math.round(averageMood),
        streakDays,
        completedSessions: totalMoodEntries,
        goalsAchieved: 8,
        totalGoals: 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (entries: Array<{ created_at: string }>) => {
    if (entries.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length - 1; i++) {
      const currentDate = new Date(entries[i].created_at);
      const nextDate = new Date(entries[i + 1].created_at);
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  };

  return { stats, loading, refetch: fetchStats };
}
