import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Glasses, Wind, Sparkles, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { useMicrophone } from "@/hooks/useMicrophone";
import BreathingBubble from "@/components/BreathingBubble";
import FragmentGallery from "@/components/FragmentGallery";
import ForestScene from "@/components/ForestScene";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Fragment {
  id: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: number;
  breathCycles: number;
  style: string;
}

const VRBreath = () => {
  const [particlesReduced, setParticlesReduced] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [breathCycles, setBreathCycles] = useState(0);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const [currentRarity, setCurrentRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [environment, setEnvironment] = useState<'temple' | 'forest' | 'cosmos'>('temple');
  
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const { isListening, breathLevel, startListening, stopListening } = useMicrophone();
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [totalFrescos, setTotalFrescos] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedEnvironments, setUnlockedEnvironments] = useState<string[]>(['temple']);

  const environments = [
    { id: 'temple', name: '🏛️ Temple Zen', unlockLevel: 1 },
    { id: 'forest', name: '🌲 Forêt Mystique', unlockLevel: 3 },
    { id: 'cosmos', name: '🌌 Cosmos Infini', unlockLevel: 5 },
  ];

  useState(() => {
    const saved = localStorage.getItem('vr_breath_progress');
    if (saved) {
      const { level, xp, frescos, envs } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setTotalFrescos(frescos || 0);
      setUnlockedEnvironments(envs || ['temple']);
    }
  });

  // Calculer rareté basée sur les cycles et chance
  const calculateRarity = (cycles: number): 'common' | 'rare' | 'epic' | 'legendary' => {
    const rand = Math.random();
    const bonus = Math.min(cycles / 20, 0.3); // Bonus jusqu'à 30% basé sur cycles
    
    if (rand + bonus > 0.98) return 'legendary';
    if (rand + bonus > 0.90) return 'epic';
    if (rand + bonus > 0.70) return 'rare';
    return 'common';
  };

  const handleStartSession = async () => {
    setSessionActive(true);
    setSessionStartTime(Date.now());
    setBreathCycles(0);
    await startListening();
    
    toast({
      title: "🌬️ Temple activé",
      description: "Respirez et créez votre fresque cosmique",
    });
  };

  const handleEndSession = async () => {
    const duration = Date.now() - sessionStartTime;
    await stopListening();
    
    // Calculer rareté
    const rarity = calculateRarity(breathCycles);
    setCurrentRarity(rarity);
    
    // Calculate XP
    const baseXP = 50;
    const cycleBonus = breathCycles * 5;
    const rarityBonus = rarity === 'legendary' ? 150 : rarity === 'epic' ? 100 : rarity === 'rare' ? 50 : 0;
    const envBonus = environment === 'cosmos' ? 30 : environment === 'forest' ? 20 : 10;
    const totalXPGain = baseXP + cycleBonus + rarityBonus + envBonus;

    const newXP = totalXP + totalXPGain;
    const newLevel = Math.floor(newXP / 500) + 1;
    const newFrescoCount = totalFrescos + 1;
    const leveledUp = newLevel > userLevel;

    // Check for environment unlocks
    const newUnlocks = environments.filter(env => 
      env.unlockLevel <= newLevel && !unlockedEnvironments.includes(env.id)
    ).map(env => env.id);

    if (leveledUp) {
      setUserLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    if (newUnlocks.length > 0) {
      setUnlockedEnvironments([...unlockedEnvironments, ...newUnlocks]);
      toast({
        title: "🌌 Nouvel environnement débloqué!",
        description: environments.find(e => e.id === newUnlocks[0])?.name,
      });
    }

    setTotalXP(newXP);
    setTotalFrescos(newFrescoCount);

    localStorage.setItem('vr_breath_progress', JSON.stringify({
      level: newLevel,
      xp: newXP,
      frescos: newFrescoCount,
      envs: [...unlockedEnvironments, ...newUnlocks]
    }));
    
    // Créer fragment
    const newFragment: Fragment = {
      id: `fragment-${Date.now()}`,
      rarity,
      timestamp: Date.now(),
      breathCycles,
      style: `style-${Math.floor(Math.random() * 10)}`
    };
    
    setFragments(prev => [newFragment, ...prev]);
    
    // Badge selon performance
    const badges = {
      legendary: "👑 Maître du Souffle Cosmique",
      epic: "🌟 Artiste Respiratoire Épique", 
      rare: "💎 Créateur de Lumière Rare",
      common: "✨ Explorateur du Temple"
    };
    
    setBadgeText(badges[rarity]);
    setShowBadge(true);
    
    // Track SSQ selon durée
    if (duration < 45000) {
      track({
        instrument: "SSQ",
        item_id: "discomfort",
        proxy: "skip",
        value: "<45s",
        context: { duration: String(duration) }
      });
    } else {
      track({
        instrument: "SSQ",
        item_id: "comfort",
        proxy: "completion",
        value: "success",
        context: { cycles: String(breathCycles), rarity }
      });
      
      // Unlock cocons
      if (collections.cocons?.items[1]) {
        unlockItem('cocons', collections.cocons.items[1].id);
      }
    }
    
    setSessionActive(false);
    
    setTimeout(() => setShowBadge(false), 5000);
  };

  const handleBreathCycle = () => {
    setBreathCycles(prev => prev + 1);
    
    // Vibration haptic
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleReduceParticles = () => {
    setParticlesReduced(true);
    track({
      instrument: "SSQ",
      item_id: "nausea",
      proxy: "choice",
      value: "reduce_particles"
    });
  };
  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/10 relative">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">🌬️</div>
              <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
              <p className="text-muted-foreground">Nouvel environnement accessible</p>
            </div>
          </Card>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <Glasses className="h-12 w-12 text-primary animate-glow" />
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Le Temple de l'Air
                </h1>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalFrescos} fresques</span>
                  <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Respirez et créez des fresques cosmiques uniques. Chaque souffle sculpte la lumière.
          </p>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-sm text-primary"
          >
            🌬️ Votre souffle devient œuvre d'art 🌬️
          </motion.p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow-intense">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-primary" />
              <span>Expérience Respiratoire</span>
              {sessionActive && (
                <span className="ml-auto text-sm font-normal text-accent">
                  {breathCycles} cycles 🌟
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Environnement respiratoire */}
            {sessionActive ? (
              <div className="py-8 space-y-6">
                {environment === 'temple' && (
                  <BreathingBubble 
                    breathLevel={breathLevel} 
                    isActive={isListening}
                    onBreathCycle={handleBreathCycle}
                  />
                )}
                
                {environment === 'forest' && (
                  <ForestScene 
                    breathLevel={breathLevel}
                    isActive={isListening}
                  />
                )}
                
                {environment === 'cosmos' && (
                  <div className="relative w-full h-96 bg-gradient-to-b from-black via-indigo-950 to-purple-950 rounded-lg overflow-hidden">
                    <BreathingBubble 
                      breathLevel={breathLevel} 
                      isActive={isListening}
                      onBreathCycle={handleBreathCycle}
                    />
                    {/* Stars background */}
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                  {Array.from({length: 30}).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-accent/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center space-y-4 z-10">
                  <Glasses className="h-16 w-16 text-primary mx-auto animate-float" />
                  <p className="text-lg font-medium">Prêt à créer votre fresque ?</p>
                  <p className="text-muted-foreground text-sm">Chaque session génère une œuvre unique</p>
                </div>
              </div>
            )}

            {/* Contrôles */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow-intense hover:scale-105 transition-transform"
                onClick={sessionActive ? handleEndSession : handleStartSession}
              >
                {sessionActive ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Terminer la session
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Commencer l'expérience
                  </>
                )}
              </Button>
              
              {sessionActive && (
                <Button variant="outline" onClick={handleReduceParticles}>
                  {particlesReduced ? "✓ Mode confort" : "Réduire effets"}
                </Button>
              )}
            </div>

            {/* Environnements */}
            {!sessionActive && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">Choisissez votre environnement</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {environments.map((env) => (
                    <motion.div
                      key={env.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => unlockedEnvironments.includes(env.id) && setEnvironment(env.id as any)}
                    >
                      <Card className={`border-2 transition-all ${
                        !unlockedEnvironments.includes(env.id)
                          ? 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                          : environment === env.id 
                            ? 'border-primary bg-gradient-to-br from-primary/20 to-accent/20 shadow-glow cursor-pointer' 
                            : 'border-muted bg-gradient-to-br from-muted/50 to-muted/30 hover:border-primary/50 cursor-pointer'
                      }`}>
                        <CardContent className="pt-6 text-center space-y-2">
                          <span className="text-5xl block">
                            {unlockedEnvironments.includes(env.id) ? env.name.split(' ')[0] : '🔒'}
                          </span>
                          <p className="font-semibold">{env.name.split(' ').slice(1).join(' ')}</p>
                          {!unlockedEnvironments.includes(env.id) && (
                            <p className="text-xs text-muted-foreground">Niv.{env.unlockLevel} requis</p>
                          )}
                          {environment === env.id && unlockedEnvironments.includes(env.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center justify-center gap-1 text-xs text-primary"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>Sélectionné</span>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badge de réussite */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <Card className="border-0 shadow-glow-legendary bg-gradient-to-r from-accent via-primary to-accent">
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-white">{badgeText}</p>
                  <p className="text-sm text-white/80 mt-2">Fresque sauvegardée ✨</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Galerie de fresques */}
        {fragments.length > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-glow">
            <CardContent className="pt-6">
              <FragmentGallery fragments={fragments} />
            </CardContent>
          </Card>
        )}

        {/* Collection cocons */}
        {collections.cocons && collections.cocons.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-glow">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm font-semibold text-accent">🏛️ Cocons Temples Débloqués</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {collections.cocons.items.filter(item => item.unlocked).map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.1 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
                    >
                      <span className="text-3xl block">{item.emoji}</span>
                      <p className="text-xs text-muted-foreground mt-1">{item.name}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-primary">
                  {collections.cocons.unlockedCount}/{collections.cocons.totalItems} cocons
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default VRBreath;
