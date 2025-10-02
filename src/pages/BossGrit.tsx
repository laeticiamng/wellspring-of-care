import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { ArenaScene } from "@/components/ArenaScene";
import { BossChallenge } from "@/components/BossChallenge";
import { AuraEvolution } from "@/components/AuraEvolution";
import { TrophyGallery } from "@/components/TrophyGallery";
import BadgeReveal from "@/components/BadgeReveal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Howl } from "howler";

const epicSound = new Howl({
  src: ['/sounds/epic-drums.mp3'],
  volume: 0.3,
  html5: true
});

const victorySound = new Howl({
  src: ['/sounds/victory.mp3'],
  volume: 0.5,
  html5: true
});

const BossGrit = () => {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auraLevel, setAuraLevel] = useState(1);
  const [trophies, setTrophies] = useState<any[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<any>(null);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const challenges = [
    { 
      id: 1, 
      name: 'Défi du Courage', 
      difficulty: 'Facile', 
      emoji: '⚔️',
      description: 'Tiens 2 minutes dans ton souffle',
      duration: 2,
      type: 'breathing'
    },
    { 
      id: 2, 
      name: 'Défi de la Patience', 
      difficulty: 'Moyen', 
      emoji: '🛡️',
      description: 'Note 3 gratitudes ce soir',
      duration: 3,
      type: 'gratitude'
    },
    { 
      id: 3, 
      name: 'Défi de la Ténacité', 
      difficulty: 'Difficile', 
      emoji: '👑',
      description: 'Reviens demain pour ton streak',
      duration: 5,
      type: 'streak'
    },
    { 
      id: 4, 
      name: 'Défi de la Force', 
      difficulty: 'Difficile', 
      emoji: '💪',
      description: 'Complète 10 minutes de méditation',
      duration: 10,
      type: 'meditation'
    },
    { 
      id: 5, 
      name: 'Défi de la Sagesse', 
      difficulty: 'Expert', 
      emoji: '🧙',
      description: 'Journal émotionnel pendant 7 jours',
      duration: 7,
      type: 'journal'
    },
    { 
      id: 6, 
      name: 'Défi Légendaire', 
      difficulty: 'Légendaire', 
      emoji: '⭐',
      description: '30 jours de pratique quotidienne',
      duration: 30,
      type: 'legendary'
    },
  ];

  useEffect(() => {
    loadUserData();
    epicSound.play();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load trophies from localStorage for now
    const savedTrophies = localStorage.getItem(`trophies_${user.id}`);
    if (savedTrophies) {
      setTrophies(JSON.parse(savedTrophies));
    }

    const savedAura = localStorage.getItem(`aura_${user.id}`);
    if (savedAura) {
      setAuraLevel(parseInt(savedAura));
    }
  };

  const startChallenge = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('assess-start', {
        body: { 
          instruments: ['GRITS', 'BRS'],
          context: { 
            challenge_id: challenges[currentChallenge].id,
            challenge_type: challenges[currentChallenge].type
          }
        }
      });

      if (error) throw error;
      setSessionId(data.session_id);
      
      toast({
        title: "Défi accepté ⚔️",
        description: challenges[currentChallenge].name,
      });
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le défi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeChallenge = async (success: boolean, completion: number) => {
    if (!sessionId) return;

    if (navigator.vibrate) {
      navigator.vibrate(success ? [200, 100, 200] : 100);
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('assess-submit', {
        body: { 
          session_id: sessionId,
          responses: {
            completion_ratio: completion,
            challenge_success: success
          }
        }
      });

      if (error) throw error;

      if (success) {
        victorySound.play();
        const newAura = Math.min(auraLevel + 1, 10);
        setAuraLevel(newAura);
        localStorage.setItem(`aura_${user.id}`, newAura.toString());

        // Rare trophy drop (20% chance)
        if (Math.random() < 0.2) {
          const rareTrophy = {
            id: Date.now(),
            name: data.badge || 'Force Intérieure',
            emoji: '🏆',
            rarity: 'legendary',
            earnedAt: new Date().toISOString()
          };
          const newTrophies = [...trophies, rareTrophy];
          setTrophies(newTrophies);
          localStorage.setItem(`trophies_${user.id}`, JSON.stringify(newTrophies));
        }

        setCurrentBadge({
          name: data.badge || 'Force Intérieure 🌟',
          description: data.message || 'Tu as relevé le défi avec succès',
          rarity: 'epic'
        });
        setShowBadge(true);

        if (currentChallenge < challenges.length - 1) {
          setTimeout(() => {
            setCurrentChallenge(prev => prev + 1);
          }, 3000);
        }
      }

      setSessionId(null);
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le défi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      <Header />
      
      <ArenaScene auraLevel={auraLevel} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            L'Arène de la Persévérance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relève ton défi, nourris ton aura ⚔️
          </p>
        </div>

        <AuraEvolution level={auraLevel} />

        <BossChallenge
          challenge={challenges[currentChallenge]}
          onStart={startChallenge}
          onComplete={completeChallenge}
          isLoading={isLoading}
          hasStarted={!!sessionId}
        />

        {trophies.length > 0 && (
          <TrophyGallery trophies={trophies} />
        )}

        {currentChallenge < challenges.length - 1 && auraLevel >= 3 && (
          <div className="text-center animate-pulse-soft">
            <p className="text-primary font-semibold">
              🔥 Continue ton ascension héroïque
            </p>
          </div>
        )}
      </main>

      {showBadge && currentBadge && (
        <BadgeReveal
          badge={currentBadge}
          onClose={() => setShowBadge(false)}
        />
      )}
    </div>
  );
};

export default BossGrit;
