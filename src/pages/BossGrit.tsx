import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { ArenaScene } from "@/components/ArenaScene";
import { BossChallenge } from "@/components/BossChallenge";
import { AuraEvolution } from "@/components/AuraEvolution";
import { TrophyGallery } from "@/components/TrophyGallery";
import BadgeReveal from "@/components/BadgeReveal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useModuleProgress } from "@/hooks/useModuleProgress";
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
  const { userLevel, totalXP, unlockedItems, addXP, unlockItem, setMetadata, loading: progressLoading } = useModuleProgress('boss_grit');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<any>(null);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

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
    epicSound.play();
  }, []);

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

        // Calculate XP based on challenge difficulty
        const challenge = challenges[currentChallenge];
        const baseXP = challenge.difficulty === 'Facile' ? 50 : challenge.difficulty === 'Moyen' ? 75 : challenge.difficulty === 'Difficile' ? 100 : challenge.difficulty === 'Expert' ? 150 : 200;
        const completionBonus = Math.floor(completion * 50);
        const totalXPGain = baseXP + completionBonus;

        const prevLevel = userLevel;
        await addXP(totalXPGain);
        
        // Check for level up
        const newLevel = Math.floor((totalXP + totalXPGain) / 500) + 1;
        if (newLevel > prevLevel) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }

        // Rare trophy drop (20% chance)
        if (Math.random() < 0.2) {
          const trophyId = `trophy_${Date.now()}`;
          await unlockItem(trophyId);
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

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;
  const trophies = unlockedItems.filter(id => id.startsWith('trophy_')).map(id => ({
    id,
    name: 'Trophée Légendaire',
    emoji: '🏆',
    rarity: 'legendary',
    earnedAt: new Date().toISOString()
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="max-w-md bg-gradient-to-r from-primary to-accent border-primary/50 shadow-glow-legendary animate-scale-in rounded-lg p-8 text-center space-y-4 text-white">
            <div className="text-6xl animate-bounce">⚔️</div>
            <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
            <p className="text-white/80">Ton aura se renforce</p>
          </div>
        </div>
      )}
      
      <ArenaScene auraLevel={userLevel} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            L'Arène de la Persévérance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relève ton défi, nourris ton aura ⚔️
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto space-y-2 mb-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Niveau {userLevel}</span>
            <span>{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
          </div>
          <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <AuraEvolution level={userLevel} />

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

        {currentChallenge < challenges.length - 1 && userLevel >= 3 && (
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
