import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  type: 'reminder' | 'nudge' | 'celebration';
  trigger: string;
  message: string;
  schedule?: string;
}

export function useSmartNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Vérifier permission notifications navigateur
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      setNotificationsEnabled(perm === 'granted');
      
      toast({
        title: perm === 'granted' ? "✅ Notifications activées" : "❌ Notifications refusées",
        description: perm === 'granted' 
          ? "Tu recevras des rappels intelligents personnalisés"
          : "Tu peux changer cela dans les paramètres du navigateur",
      });
    }
  };

  const sendNotification = (title: string, body: string, icon?: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'emotionscare',
        requireInteraction: false,
      });
    }
  };

  // Analyser les patterns utilisateur et envoyer nudges
  const analyzeAndNudge = async () => {
    if (!user) return;

    try {
      // Récupérer l'historique WHO-5
      const { data: assessments, error } = await supabase
        .from('who5_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;

      if (!assessments || assessments.length === 0) {
        // Nudge pour première évaluation
        toast({
          title: "🌟 Prends un instant pour toi",
          description: "Tire ta carte de la semaine pour commencer ton parcours émotionnel",
        });
        return;
      }

      // Calculer tendance
      const latestScore = assessments[0]?.total_score || 50;
      const averageScore = assessments.reduce((acc: number, a: any) => acc + (a.total_score || 50), 0) / assessments.length;

      // Nudge basé sur la tendance
      if (latestScore < averageScore - 15) {
        sendNotification(
          "💙 Prends soin de toi",
          "Je remarque que tu as besoin d'un peu de douceur aujourd'hui. Que dirais-tu d'une séance de méditation ?"
        );
        
        toast({
          title: "💙 Prends soin de toi",
          description: "Je remarque que tu as besoin d'un peu de douceur aujourd'hui.",
          duration: 8000,
        });
      } else if (latestScore > averageScore + 15) {
        sendNotification(
          "✨ Tu rayonnes !",
          "Continue sur cette belle lancée ! Partage ton énergie positive avec la communauté ?"
        );
        
        toast({
          title: "✨ Tu rayonnes !",
          description: "Continue sur cette belle lancée !",
          duration: 8000,
        });
      }

      // Vérifier dernière visite
      const lastVisit = assessments[0]?.created_at;
      if (lastVisit) {
        const daysSinceLastVisit = Math.floor(
          (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastVisit >= 3) {
          toast({
            title: "🌙 On t'a manqué !",
            description: `Cela fait ${daysSinceLastVisit} jours. Ta carte t'attend pour une nouvelle semaine.`,
            duration: 10000,
          });
        }
      }

    } catch (error) {
      console.error('Erreur analyse patterns:', error);
    }
  };

  // Rappel basé sur la carte de la semaine
  const sendWeeklyCardReminder = (cardMantra: string) => {
    const hour = new Date().getHours();
    
    // Rappels à des moments clés
    if (hour === 9) {
      toast({
        title: `☀️ Bonjour ! Souviens-toi : ${cardMantra}`,
        description: "Commence ta journée avec cette intention",
        duration: 6000,
      });
    } else if (hour === 14) {
      toast({
        title: `🌸 Petite pause : ${cardMantra}`,
        description: "Respire et reconnecte avec ton intention",
        duration: 6000,
      });
    } else if (hour === 20) {
      toast({
        title: `🌙 Avant de dormir : ${cardMantra}`,
        description: "Termine ta journée en douceur",
        duration: 6000,
      });
    }

    if (permission === 'granted') {
      sendNotification(
        `Rappel : ${cardMantra}`,
        "Prends un moment pour intégrer cette intention dans ta journée"
      );
    }
  };

  // Célébration de milestones
  const celebrateMilestone = (milestone: {
    type: 'streak' | 'cards_collected' | 'who5_improvement';
    value: number;
  }) => {
    const messages = {
      streak: `🔥 ${milestone.value} jours de suite ! Tu es incroyable !`,
      cards_collected: `✨ ${milestone.value} cartes dans ta collection ! Continue !`,
      who5_improvement: `📈 +${milestone.value}% de bien-être ! Bravo !`,
    };

    const descriptions = {
      streak: "Ta régularité fait toute la différence",
      cards_collected: "Chaque carte est une étape vers l'équilibre",
      who5_improvement: "Ton évolution est inspirante",
    };

    toast({
      title: messages[milestone.type],
      description: descriptions[milestone.type],
      duration: 10000,
    });

    if (permission === 'granted') {
      sendNotification(
        "🎉 Milestone atteint !",
        messages[milestone.type]
      );
    }
  };

  // Nudge contextuel basé sur l'heure et l'usage
  const sendContextualNudge = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();

    // Lundi matin - nouvelle semaine
    if (day === 1 && hour === 8) {
      toast({
        title: "🌟 Nouvelle semaine, nouvelle carte !",
        description: "C'est parti pour 7 jours d'intentions positives",
      });
    }

    // Vendredi soir - bilan
    if (day === 5 && hour === 18) {
      toast({
        title: "🎉 Bravo pour cette semaine !",
        description: "Prends un moment pour célébrer tes progrès",
      });
    }

    // Week-end - détente
    if ((day === 0 || day === 6) && hour === 10) {
      toast({
        title: "☀️ Week-end bien-être",
        description: "Profite pour explorer les méditations ou exercices de breathwork",
      });
    }
  };

  return {
    notificationsEnabled,
    permission,
    requestPermission,
    sendNotification,
    analyzeAndNudge,
    sendWeeklyCardReminder,
    celebrateMilestone,
    sendContextualNudge,
  };
}
