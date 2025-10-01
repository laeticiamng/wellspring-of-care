import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  activity_type: string;
  activity_data: any;
  duration_seconds: number | null;
  created_at: string;
}

interface Insight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  priority: string;
  action_items: any;
  is_read: boolean;
  created_at: string;
}

export function useAnalytics() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Track activity
  const trackActivity = async (
    activityType: string,
    activityData: any = {},
    durationSeconds?: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData,
          duration_seconds: durationSeconds,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  // Fetch activities
  const fetchActivities = async (limit = 50) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch insights
  const fetchInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setInsights((data || []).map(insight => ({
        ...insight,
        action_items: Array.isArray(insight.action_items) ? insight.action_items : [],
      })));
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  // Generate new insights
  const generateInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights');

      if (error) throw error;

      await fetchInsights();

      toast({
        title: 'Insights générés',
        description: `${data.insights_count} nouveaux insights disponibles`,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer les insights',
        variant: 'destructive',
      });
    }
  };

  // Mark insight as read
  const markInsightAsRead = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('user_insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) throw error;
      await fetchInsights();
    } catch (error) {
      console.error('Error marking insight as read:', error);
    }
  };

  // Get activity stats
  const getActivityStats = (days = 7) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(
      a => new Date(a.created_at) > cutoffDate
    );

    const stats = {
      total: recentActivities.length,
      byType: recentActivities.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgPerDay: recentActivities.length / days,
    };

    return stats;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchActivities(), fetchInsights()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    activities,
    insights,
    loading,
    trackActivity,
    fetchActivities,
    fetchInsights,
    generateInsights,
    markInsightAsRead,
    getActivityStats,
  };
}
