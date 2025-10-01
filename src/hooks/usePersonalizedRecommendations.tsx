import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Recommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  content_type: string;
  content_id: string;
  priority_level: string;
  confidence_score: number;
  reason: string;
  estimated_time: number;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export function usePersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch active recommendations
  const fetchRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('priority_level', { ascending: false })
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate new recommendations
  const generateRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-recommendations');

      if (error) throw error;

      await fetchRecommendations();

      toast({
        title: 'Recommandations générées',
        description: `${data.recommendations_count} nouvelles recommandations disponibles`,
      });

      return data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer les recommandations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Dismiss a recommendation
  const dismissRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ is_active: false })
        .eq('id', recommendationId);

      if (error) throw error;

      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get content type icon
  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'meditation':
        return '🧘';
      case 'journal':
        return '📝';
      case 'music_therapy':
        return '🎵';
      case 'breathwork':
        return '💨';
      case 'community':
        return '👥';
      case 'ai_chat':
        return '🤖';
      default:
        return '✨';
    }
  };

  useEffect(() => {
    fetchRecommendations();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRecommendations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    recommendations,
    loading,
    fetchRecommendations,
    generateRecommendations,
    dismissRecommendation,
    getPriorityColor,
    getContentIcon,
  };
}
