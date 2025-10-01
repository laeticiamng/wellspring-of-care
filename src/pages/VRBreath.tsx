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
  
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const { isListening, breathLevel, startListening, stopListening } = useMicrophone();
  const { toast } = useToast();

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <Glasses className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Le Temple de l'Air
            </h1>
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
            {/* Sphère respiratoire */}
            {sessionActive ? (
              <div className="py-8">
                <BreathingBubble 
                  breathLevel={breathLevel} 
                  isActive={isListening}
                  onBreathCycle={handleBreathCycle}
                />
                
                <div className="text-center mt-6 space-y-2">
                  <p className="text-lg font-medium text-primary">
                    Respirez avec la sphère
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div>Inspire {breathLevel > 0.5 ? '✨' : '○'}</div>
                    <div>•</div>
                    <div>Expire {breathLevel <= 0.5 ? '🌙' : '○'}</div>
                  </div>
                </div>

                {/* Ondes lumineuses */}
                <div className="mt-8 relative h-32 overflow-hidden">
                  {Array.from({length: 5}).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      animate={{
                        y: [-20, -120],
                        opacity: [0, breathLevel, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
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
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Temple zen', emoji: '🏛️' },
                  { name: 'Forêt mystique', emoji: '🌲' },
                  { name: 'Galaxie cosmique', emoji: '🌌' }
                ].map((env) => (
                  <motion.div
                    key={env.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/20 hover:to-accent/20 transition-all cursor-pointer">
                      <CardContent className="pt-6 text-center">
                        <span className="text-4xl mb-2 block">{env.emoji}</span>
                        <p className="font-medium">{env.name}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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
