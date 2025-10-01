import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: ["recent-activities", limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Récupérer différents types d'activités
      const [assessments, moodEntries, sessions] = await Promise.all([
        supabase
          .from("assessments")
          .select("id, instrument, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        
        supabase
          .from("mood_entries")
          .select("id, mood_level, emotions, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        
        supabase
          .from("music_therapy_sessions")
          .select("id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      const activities: Activity[] = [];

      // Transformer les évaluations en activités
      assessments.data?.forEach(assessment => {
        activities.push({
          id: assessment.id,
          type: "assessment",
          title: `Évaluation ${assessment.instrument}`,
          timestamp: assessment.created_at,
          icon: "clipboard-check",
        });
      });

      // Transformer les entrées d'humeur
      moodEntries.data?.forEach(entry => {
        const emotionLabel = entry.emotions?.[0] || `Niveau ${entry.mood_level}/10`;
        activities.push({
          id: entry.id,
          type: "mood",
          title: `Humeur: ${emotionLabel}`,
          timestamp: entry.created_at,
          icon: "smile",
        });
      });

      // Transformer les sessions de thérapie musicale
      sessions.data?.forEach(session => {
        activities.push({
          id: session.id,
          type: "music-therapy",
          title: "Session de thérapie musicale",
          timestamp: session.created_at,
          icon: "music",
        });
      });

      // Trier par date et limiter
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    },
  });
}
