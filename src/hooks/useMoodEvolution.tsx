import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";
import { fr } from "date-fns/locale";

export interface MoodDataPoint {
  date: string;
  value: number;
  mood?: string;
  count: number;
}

export function useMoodEvolution(days: number = 7) {
  return useQuery({
    queryKey: ["mood-evolution", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Récupérer les entrées d'humeur
      const { data: moodEntries, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Créer un tableau de tous les jours
      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      
      // Mapper les données par jour
      const moodByDay = new Map<string, { total: number; count: number; levels: number[] }>();
      
      moodEntries?.forEach(entry => {
        const dateKey = format(new Date(entry.created_at), 'yyyy-MM-dd');
        const existing = moodByDay.get(dateKey) || { total: 0, count: 0, levels: [] };
        
        const moodValue = entry.mood_level || 5;
        
        moodByDay.set(dateKey, {
          total: existing.total + moodValue,
          count: existing.count + 1,
          levels: [...existing.levels, moodValue],
        });
      });

      // Créer les données finales
      const data: MoodDataPoint[] = allDays.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayData = moodByDay.get(dateKey);
        
        return {
          date: format(day, 'dd MMM', { locale: fr }),
          value: dayData ? Math.round(dayData.total / dayData.count) : 0,
          mood: dayData?.levels[0]?.toString(),
          count: dayData?.count || 0,
        };
      });

      return data;
    },
  });
}

function getMoodValue(mood: string | null): number {
  const moodMap: Record<string, number> = {
    'très-bien': 5,
    'bien': 4,
    'neutre': 3,
    'pas-bien': 2,
    'mal': 1,
    'joyeux': 5,
    'calme': 4,
    'anxieux': 2,
    'triste': 1,
    'énergique': 5,
    'fatigué': 2,
  };
  
  return mood ? (moodMap[mood.toLowerCase()] || 3) : 3;
}
