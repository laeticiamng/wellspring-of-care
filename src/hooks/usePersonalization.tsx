import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedContent {
  recommendedActivities: string[];
  suggestedTimes: string[];
  preferredThemes: string[];
  contentPriority: 'meditation' | 'breathwork' | 'journal' | 'therapy' | 'mixed';
}

interface UserPattern {
  favoriteTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredActivities: string[];
  averageSessionDuration: number;
  engagementTrend: 'increasing' | 'stable' | 'decreasing';
}

export function usePersonalization() {
  const { user } = useAuth();
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    recommendedActivities: [],
    suggestedTimes: [],
    preferredThemes: [],
    contentPriority: 'mixed',
  });
  const [userPattern, setUserPattern] = useState<UserPattern | null>(null);
  const [loading, setLoading] = useState(true);

  // Analyser les patterns utilisateur
  const analyzeUserPatterns = async () => {
    if (!user) return;

    try {
      // Récupérer l'historique WHO-5
      const { data: who5Data } = await supabase
        .from('who5_assessments')
        .select('total_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      // Récupérer les cartes tirées
      const { data: cardsData } = await supabase
        .from('weekly_card_draws')
        .select('drawn_at, card_id')
        .eq('user_id', user.id)
        .order('drawn_at', { ascending: false })
        .limit(50);

      // Analyser les heures préférées
      const hours = cardsData?.map(d => new Date(d.drawn_at).getHours()) || [];
      const avgHour = hours.length > 0 ? hours.reduce((a, b) => a + b, 0) / hours.length : 12;
      
      let favoriteTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
      if (avgHour < 12) favoriteTimeOfDay = 'morning';
      else if (avgHour < 17) favoriteTimeOfDay = 'afternoon';
      else if (avgHour < 22) favoriteTimeOfDay = 'evening';
      else favoriteTimeOfDay = 'night';

      // Analyser les tendances WHO-5
      let engagementTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (who5Data && who5Data.length >= 3) {
        const recent = who5Data.slice(0, 3).map(d => d.total_score);
        const older = who5Data.slice(-3).map(d => d.total_score);
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        if (recentAvg > olderAvg + 5) engagementTrend = 'increasing';
        else if (recentAvg < olderAvg - 5) engagementTrend = 'decreasing';
      }

      setUserPattern({
        favoriteTimeOfDay,
        preferredActivities: ['cards', 'meditation', 'breathwork'],
        averageSessionDuration: 15,
        engagementTrend,
      });

      // Générer recommandations personnalisées
      generateRecommendations(favoriteTimeOfDay, engagementTrend);
      
    } catch (error) {
      console.error('Erreur analyse patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  // Générer recommandations basées sur les patterns
  const generateRecommendations = (timeOfDay: string, trend: string) => {
    const activities: string[] = [];
    const times: string[] = [];
    const themes: string[] = [];
    let priority: 'meditation' | 'breathwork' | 'journal' | 'therapy' | 'mixed' = 'mixed';

    // Recommandations selon l'heure préférée
    if (timeOfDay === 'morning') {
      activities.push('Méditation matinale', 'Respiration énergisante', 'Journal de gratitude');
      times.push('7h-9h', '9h-11h');
      themes.push('Énergie', 'Nouveau départ', 'Motivation');
      priority = 'meditation';
    } else if (timeOfDay === 'afternoon') {
      activities.push('Pause méditative', 'Respiration de concentration', 'Réflexion guidée');
      times.push('12h-14h', '15h-17h');
      themes.push('Focus', 'Clarté', 'Équilibre');
      priority = 'breathwork';
    } else if (timeOfDay === 'evening') {
      activities.push('Méditation du soir', 'Respiration apaisante', 'Journal du jour');
      times.push('18h-20h', '20h-22h');
      themes.push('Calme', 'Détente', 'Réflexion');
      priority = 'meditation';
    } else {
      activities.push('Respiration pour dormir', 'Méditation nocturne', 'Gratitude du jour');
      times.push('22h-23h', '23h-minuit');
      themes.push('Sommeil', 'Paix', 'Lâcher-prise');
      priority = 'breathwork';
    }

    // Ajuster selon la tendance
    if (trend === 'decreasing') {
      activities.push('Session découverte', 'Nouveau challenge', 'Contenu motivant');
      themes.push('Renouveau', 'Inspiration', 'Changement');
    } else if (trend === 'increasing') {
      activities.push('Approfondissement', 'Pratique avancée', 'Nouvelle dimension');
      themes.push('Progression', 'Maîtrise', 'Excellence');
    }

    setPersonalizedContent({
      recommendedActivities: activities,
      suggestedTimes: times,
      preferredThemes: themes,
      contentPriority: priority,
    });
  };

  // Obtenir une recommandation spécifique
  const getSmartRecommendation = (): string => {
    if (!userPattern) return "Continue ton voyage de bien-être ! 🌟";

    const { engagementTrend, favoriteTimeOfDay } = userPattern;
    
    if (engagementTrend === 'decreasing') {
      return "Tu sembles avoir besoin d'un nouveau souffle ! Que dirais-tu d'essayer une nouvelle activité ? ✨";
    }
    
    if (engagementTrend === 'increasing') {
      return "Tu es sur une excellente lancée ! Continue comme ça, tu progresses magnifiquement ! 🚀";
    }

    if (favoriteTimeOfDay === 'morning') {
      return "Les matinées sont ton moment fort ! Profite de cette énergie pour avancer 🌅";
    }

    return "Tu crées ta propre routine bien-être. C'est parfait ! 💫";
  };

  useEffect(() => {
    analyzeUserPatterns();
  }, [user]);

  return {
    personalizedContent,
    userPattern,
    loading,
    refresh: analyzeUserPatterns,
    getSmartRecommendation,
  };
}
