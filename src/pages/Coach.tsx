import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoachAssess } from "@/hooks/useCoachAssess";
import { ThoughtBubble } from "@/components/ThoughtBubble";
import { AnchorCard } from "@/components/AnchorCard";
import { Grimoire } from "@/components/Grimoire";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Coach() {
  const [view, setView] = useState<'garden' | 'grimoire'>('garden');
  const [showThoughts, setShowThoughts] = useState(false);
  const { result, loading, startSession, submitSession, reset } = useCoachAssess();
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [thoughtsCollected, setThoughtsCollected] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const gardens = [
    { id: 'gard1', name: '🌸 Jardin de Sérénité', unlockLevel: 1 },
    { id: 'gard2', name: '🌿 Jardin de Sagesse', unlockLevel: 3 },
    { id: 'gard3', name: '🌺 Jardin Mystique', unlockLevel: 5 },
    { id: 'gard4', name: '🌟 Jardin Céleste', unlockLevel: 8 },
  ];
  const [unlockedGardens, setUnlockedGardens] = useState<string[]>([]);

  useEffect(() => {
    // Lancer automatiquement une session au montage
    initSession();
    
    const saved = localStorage.getItem('coach_progress');
    if (saved) {
      const { level, xp, thoughts, gardens: unlocked } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setThoughtsCollected(thoughts || 0);
      setUnlockedGardens(unlocked || []);
    }
  }, []);

  const initSession = async () => {
    const session = await startSession();
    if (session) {
      // Simuler des réponses aléatoires pour l'instant (sera remplacé par un vrai questionnaire)
      const mockResponses: Record<string, number> = {};
      session.instrument.questions.forEach((q: any) => {
        mockResponses[q.id] = Math.floor(Math.random() * 7) + 1; // 1-7
      });
      
      // Soumettre après 2 secondes
      setTimeout(async () => {
        await submitSession(session.sessionId, mockResponses, 2);
        setShowThoughts(true);
      }, 2000);
    }
  };

  const collectThought = async (thought: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('thought_grimoire')
        .insert({
          user_id: user.id,
          thought_text: thought.text,
          thought_emoji: thought.emoji,
          rarity: thought.rarity,
          category: thought.category
        });

      if (error) throw error;

      // Calculate XP
      const rarityXP = thought.rarity === 'legendary' ? 100 : thought.rarity === 'rare' ? 50 : 30;
      const totalXPGain = rarityXP;

      const newXP = totalXP + totalXPGain;
      const newLevel = Math.floor(newXP / 500) + 1;
      const newThoughtCount = thoughtsCollected + 1;
      const leveledUp = newLevel > userLevel;

      // Check for garden unlocks
      const newUnlocks = gardens.filter(g => 
        g.unlockLevel <= newLevel && !unlockedGardens.includes(g.id)
      ).map(g => g.id);

      if (leveledUp) {
        setUserLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      if (newUnlocks.length > 0) {
        setUnlockedGardens([...unlockedGardens, ...newUnlocks]);
      }

      setTotalXP(newXP);
      setThoughtsCollected(newThoughtCount);

      localStorage.setItem('coach_progress', JSON.stringify({
        level: newLevel,
        xp: newXP,
        thoughts: newThoughtCount,
        gardens: [...unlockedGardens, ...newUnlocks]
      }));

      // Son cristallin
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0MWKzn77BkHgo/ldjzxnMnBSh+zPLaizsIGGS76+mdTgwPT6Lh8bllHgo5jdTzym8qBSl9y/HajD4HGGe97+OYUg0MWq3n77BkHgo5k9Tyx3IoBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      toast({
        title: "✨ Pensée collectée",
        description: `${thought.text} (+${rarityXP} XP)`,
        duration: 3000,
      });

      // Retirer la pensée après collection
      if (result) {
        result.thoughts = result.thoughts.filter(t => t.text !== thought.text);
      }
    } catch (error) {
      console.error('Error collecting thought:', error);
    }
  };

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in rounded-lg p-8 text-center space-y-4">
            <div className="text-6xl animate-bounce">🌸</div>
            <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
            <p className="text-muted-foreground">Nouveau jardin accessible</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={view === 'garden' ? 'default' : 'outline'}
            onClick={() => setView('garden')}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Jardin
          </Button>
          <Button
            variant={view === 'grimoire' ? 'default' : 'outline'}
            onClick={() => setView('grimoire')}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Grimoire
          </Button>
        </div>

        {view === 'garden' ? (
          <div className="max-w-4xl mx-auto">
            {/* Titre avec effet */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <motion.h1
                className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 100%'
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <span>Le Jardin des Pensées</span>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
            </motion.h1>
            <p className="text-lg text-muted-foreground">
              Un espace de sagesse éphémère
            </p>
            <div className="max-w-md mx-auto space-y-1 mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{thoughtsCollected} pensées collectées</span>
                <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            {/* Jardins débloqués */}
            <div className="flex justify-center gap-2 flex-wrap mt-4">
              {gardens.map(garden => (
                <div
                  key={garden.id}
                  className={`px-3 py-1 rounded-full text-xs ${
                    unlockedGardens.includes(garden.id)
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : userLevel >= garden.unlockLevel
                      ? 'bg-accent/20 text-accent border border-accent/40 animate-pulse'
                      : 'bg-muted/50 text-muted-foreground opacity-50'
                  }`}
                >
                  {garden.name}
                </div>
              ))}
            </div>
            </motion.div>

            {/* Scène principale */}
            <div className="relative min-h-[500px]">
              {/* Brume de fond */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-muted/30 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Contenu */}
              <div className="relative z-10 p-8">
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-12 h-12 mx-auto text-primary" />
                    </motion.div>
                    <p className="text-lg text-muted-foreground mt-4">
                      Le jardin se prépare...
                    </p>
                  </motion.div>
                )}

                {!loading && result && showThoughts && (
                  <>
                    {/* Bulles de pensées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      <AnimatePresence>
                        {result.thoughts.map((thought, index) => (
                          <ThoughtBubble
                            key={`${thought.text}-${index}`}
                            text={thought.text}
                            emoji={thought.emoji}
                            rarity={thought.rarity as 'common' | 'rare' | 'legendary'}
                            onCollect={() => collectThought(thought)}
                            delay={index * 0.2}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Cartes d'ancrage */}
                    {result.anchorCards && result.anchorCards.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12"
                      >
                        <h3 className="text-2xl font-semibold text-center mb-6">
                          Micro-pratiques suggérées
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {result.anchorCards.slice(0, 4).map((card, index) => (
                            <AnchorCard
                              key={index}
                              title={card.title}
                              duration={card.duration}
                              category={card.category}
                              onStart={() => {
                                toast({
                                  title: "🧘 Pratique lancée",
                                  description: card.title,
                                  duration: 2000,
                                });
                              }}
                              delay={0.9 + index * 0.1}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Bouton nouvelle session */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-center mt-12"
                    >
                      <Button
                        onClick={() => {
                          reset();
                          setShowThoughts(false);
                          initSession();
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Nouvelle visite
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Grimoire />
        )}
      </div>
    </div>
  );
}