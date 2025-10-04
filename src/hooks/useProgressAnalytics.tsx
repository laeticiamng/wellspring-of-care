import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProgressStats {
  user_id: string;
  total_xp: number;
  average_level: number;
  modules_count: number;
  last_activity: string;
}

export interface ModulePopularity {
  module_name: string;
  users_count: number;
  total_xp: number;
  avg_level: number;
}

export interface LevelDistribution {
  level: number;
  users_count: number;
  module_name: string;
}

export interface ProgressionAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalXP: number;
  averageLevel: number;
  topUsers: UserProgressStats[];
  modulePopularity: ModulePopularity[];
  levelDistribution: LevelDistribution[];
}

export const useProgressAnalytics = (timeRange: '7d' | '30d' | 'all' = 'all') => {
  return useQuery({
    queryKey: ['progress-analytics', timeRange],
    queryFn: async (): Promise<ProgressionAnalytics> => {
      // Calculate date filter
      let dateFilter = '';
      if (timeRange === '7d') {
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (timeRange === '30d') {
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Get all module progress data
      let query = supabase
        .from('module_progress')
        .select('*');

      if (dateFilter) {
        query = query.gte('updated_at', dateFilter);
      }

      const { data: progressData, error } = await query;

      if (error) throw error;
      if (!progressData) throw new Error('No data found');

      // Calculate metrics
      const uniqueUsers = new Set(progressData.map(p => p.user_id));
      const totalUsers = uniqueUsers.size;

      const totalXP = progressData.reduce((sum, p) => sum + (p.total_xp || 0), 0);
      const averageLevel = progressData.length > 0
        ? progressData.reduce((sum, p) => sum + (p.user_level || 1), 0) / progressData.length
        : 0;

      // Top users by total XP
      const userXPMap = new Map<string, number>();
      const userLevelMap = new Map<string, number[]>();
      const userModulesMap = new Map<string, Set<string>>();
      const userLastActivityMap = new Map<string, string>();

      progressData.forEach(p => {
        const currentXP = userXPMap.get(p.user_id) || 0;
        userXPMap.set(p.user_id, currentXP + (p.total_xp || 0));

        const levels = userLevelMap.get(p.user_id) || [];
        levels.push(p.user_level || 1);
        userLevelMap.set(p.user_id, levels);

        const modules = userModulesMap.get(p.user_id) || new Set();
        modules.add(p.module_name);
        userModulesMap.set(p.user_id, modules);

        const lastActivity = userLastActivityMap.get(p.user_id);
        if (!lastActivity || p.updated_at > lastActivity) {
          userLastActivityMap.set(p.user_id, p.updated_at);
        }
      });

      const topUsers: UserProgressStats[] = Array.from(userXPMap.entries())
        .map(([user_id, total_xp]) => ({
          user_id,
          total_xp,
          average_level: userLevelMap.get(user_id)!.reduce((a, b) => a + b, 0) / userLevelMap.get(user_id)!.length,
          modules_count: userModulesMap.get(user_id)!.size,
          last_activity: userLastActivityMap.get(user_id)!,
        }))
        .sort((a, b) => b.total_xp - a.total_xp)
        .slice(0, 10);

      // Module popularity
      const moduleMap = new Map<string, { users: Set<string>; xp: number; levels: number[] }>();

      progressData.forEach(p => {
        const module = moduleMap.get(p.module_name) || { users: new Set(), xp: 0, levels: [] };
        module.users.add(p.user_id);
        module.xp += p.total_xp || 0;
        module.levels.push(p.user_level || 1);
        moduleMap.set(p.module_name, module);
      });

      const modulePopularity: ModulePopularity[] = Array.from(moduleMap.entries())
        .map(([module_name, data]) => ({
          module_name,
          users_count: data.users.size,
          total_xp: data.xp,
          avg_level: data.levels.reduce((a, b) => a + b, 0) / data.levels.length,
        }))
        .sort((a, b) => b.users_count - a.users_count);

      // Level distribution
      const levelDistMap = new Map<string, Map<number, number>>();

      progressData.forEach(p => {
        const moduleLevels = levelDistMap.get(p.module_name) || new Map<number, number>();
        const currentCount = moduleLevels.get(p.user_level || 1) || 0;
        moduleLevels.set(p.user_level || 1, currentCount + 1);
        levelDistMap.set(p.module_name, moduleLevels);
      });

      const levelDistribution: LevelDistribution[] = [];
      levelDistMap.forEach((levels, module_name) => {
        levels.forEach((users_count, level) => {
          levelDistribution.push({ module_name, level, users_count });
        });
      });

      // Active users (activity in last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const activeUsers = Array.from(userLastActivityMap.values()).filter(
        date => date >= sevenDaysAgo
      ).length;

      return {
        totalUsers,
        activeUsers,
        totalXP,
        averageLevel: Math.round(averageLevel * 10) / 10,
        topUsers,
        modulePopularity,
        levelDistribution,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
  });
};
