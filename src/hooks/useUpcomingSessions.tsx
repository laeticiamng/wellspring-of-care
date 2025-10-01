import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

export interface UpcomingSession {
  id: string;
  type: string;
  title: string;
  scheduledFor: string;
  duration?: number;
  status: "scheduled" | "completed" | "cancelled";
}

export function useUpcomingSessions(days: number = 7) {
  return useQuery({
    queryKey: ["upcoming-sessions", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const endDate = addDays(new Date(), days);
      const sessions: UpcomingSession[] = [];

      // Récupérer les sessions de thérapie musicale planifiées
      const { data: musicSessions } = await supabase
        .from("music_therapy_sessions")
        .select("id, created_at")
        .eq("user_id", user.id)
        .gte("created_at", new Date().toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      musicSessions?.forEach(session => {
        sessions.push({
          id: session.id,
          type: "music-therapy",
          title: "Session de thérapie musicale",
          scheduledFor: session.created_at,
          duration: 30,
          status: "scheduled",
        });
      });

      // Récupérer les sessions coach AI planifiées
      const { data: coachSessions } = await supabase
        .from("ai_coach_sessions")
        .select("id, created_at")
        .eq("user_id", user.id)
        .gte("created_at", new Date().toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true })
        .limit(5);

      coachSessions?.forEach(session => {
        sessions.push({
          id: session.id,
          type: "coach",
          title: "Session Coach IA",
          scheduledFor: session.created_at,
          duration: 45,
          status: "scheduled",
        });
      });

      // Trier par date
      return sessions.sort((a, b) => 
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      );
    },
  });
}
