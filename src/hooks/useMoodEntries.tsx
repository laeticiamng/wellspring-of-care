import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  content: string;
  audio_url?: string | null;
  affect_positive?: number | null;
  affect_negative?: number | null;
  color_palette: any; // Json type from Supabase
  badge_text?: string | null;
  is_precious: boolean;
  tags: string[] | null;
  created_at: string;
}

export function useMoodEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (content: string, audioUrl?: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Simuler analyse PANAS pour affect
      const affectPositive = Math.floor(Math.random() * 20) + 10; // 10-30
      const affectNegative = Math.floor(Math.random() * 20) + 5; // 5-25
      
      // Générer palette de couleurs basée sur affect
      const isPreciousRoll = Math.random() < 0.1; // 10% chance d'être précieux
      const colorPalette = generateColorPalette(affectPositive, affectNegative, isPreciousRoll);
      const badgeText = generateBadge(affectPositive, affectNegative);

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: user.id,
          content,
          audio_url: audioUrl || null,
          affect_positive: affectPositive,
          affect_negative: affectNegative,
          color_palette: colorPalette as any,
          badge_text: badgeText,
          is_precious: isPreciousRoll,
          tags: extractTags(content)
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      
      toast({
        title: isPreciousRoll ? "✨ Page précieuse créée!" : "Page créée",
        description: badgeText
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'entrée",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchEntries();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('journal_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'journal_entries'
      }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { entries, loading, saveEntry, refreshEntries: fetchEntries };
}

function generateColorPalette(positive: number, negative: number, isPrecious: boolean) {
  if (isPrecious) {
    return {
      primary: "hsl(45, 90%, 60%)", // Or
      secondary: "hsl(35, 80%, 50%)"
    };
  }

  const ratio = positive / (positive + negative);
  
  if (ratio > 0.65) {
    // Affect positif dominant - couleurs chaudes
    return {
      primary: "hsl(40, 85%, 65%)", // Jaune chaleureux
      secondary: "hsl(15, 75%, 60%)" // Orange doux
    };
  } else if (ratio < 0.35) {
    // Affect négatif dominant - couleurs froides
    return {
      primary: "hsl(220, 60%, 55%)", // Bleu
      secondary: "hsl(260, 50%, 50%)" // Violet
    };
  } else {
    // Équilibré - dégradés doux
    return {
      primary: "hsl(180, 50%, 60%)", // Cyan
      secondary: "hsl(200, 55%, 65%)" // Bleu clair
    };
  }
}

function generateBadge(positive: number, negative: number): string {
  const badges = {
    highPositive: ["Clarté retrouvée ☀️", "Lumière en mots 🌟", "Joie exprimée 🌈"],
    highNegative: ["Un poids exprimé 🌙", "Ombre accueillie 🌑", "Libération en cours 💫"],
    balanced: ["Douceur en mots 🌿", "Équilibre trouvé ⚖️", "Paix écrite 🕊️"]
  };

  const ratio = positive / (positive + negative);
  
  if (ratio > 0.65) {
    return badges.highPositive[Math.floor(Math.random() * badges.highPositive.length)];
  } else if (ratio < 0.35) {
    return badges.highNegative[Math.floor(Math.random() * badges.highNegative.length)];
  } else {
    return badges.balanced[Math.floor(Math.random() * badges.balanced.length)];
  }
}

function extractTags(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const emotionKeywords = ['joie', 'tristesse', 'peur', 'colère', 'amour', 'espoir', 'anxiété'];
  return words.filter(word => emotionKeywords.includes(word)).slice(0, 3);
}
