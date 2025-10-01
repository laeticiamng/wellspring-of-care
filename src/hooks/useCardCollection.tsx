import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WeeklyCard {
  id: string;
  week_number: number;
  year: number;
  card_data: any;
  unlocked: boolean;
  unlocked_at?: string;
}

export function useCardCollection() {
  return useQuery({
    queryKey: ["card-collection"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Pour l'instant, retourner des données mockées jusqu'à ce que la table soit créée
      const mockCards: WeeklyCard[] = [
        {
          id: "1",
          week_number: 1,
          year: 2025,
          card_data: {
            title: "Première semaine",
            description: "Félicitations pour votre première semaine!",
            badge: "🌟",
            rarity: "common",
          },
          unlocked: true,
          unlocked_at: new Date().toISOString(),
        },
        {
          id: "2",
          week_number: 2,
          year: 2025,
          card_data: {
            title: "Deuxième semaine",
            description: "Continuez sur cette lancée!",
            badge: "💫",
            rarity: "rare",
          },
          unlocked: false,
        },
      ];

      const unlockedCards = mockCards.filter(c => c.unlocked).length;
      const rarityCount = {
        common: 1,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      return {
        cards: mockCards,
        stats: {
          total: mockCards.length,
          unlocked: unlockedCards,
          locked: mockCards.length - unlockedCards,
          rarityCount,
        },
      };
    },
  });
}
