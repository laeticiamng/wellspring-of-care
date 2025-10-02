import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Moon, Sun, Sparkles, Play, Pause, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import OceanScene from "@/components/OceanScene";
import BadgeReveal from "@/components/BadgeReveal";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useToast } from "@/hooks/use-toast";

type SessionType = 'quick' | 'sleep' | null;
type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

interface BreathBadge {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
  description: string;
}

const Breathwork = () => {
  const [sessionType, setSessionType] = useState<SessionType>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [anxietyLevel, setAnxietyLevel] = useState(0.5); // 0-1, simulated
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<BreathBadge | null>(null);
  const [badges, setBadges] = useState<BreathBadge[]>([]);
  const [phaseTimer, setPhaseTimer] = useState(0);
  
  const { track } = useImplicitTracking();
  const { toast } = useToast();

  // Guided breathing patterns - ENRICHED
  const breathPatterns = {
    quick: { inhale: 4, hold: 4, exhale: 6, name: "Calme Rapide" }, 
    sleep: { inhale: 4, hold: 7, exhale: 8, name: "4-7-8 Sommeil" },
    box: { inhale: 4, hold: 4, exhale: 4, name: "Box Breathing" },
    wim: { inhale: 2, hold: 0, exhale: 2, name: "Wim Hof" },
    resonant: { inhale: 5, hold: 0, exhale: 5, name: "Cohérence" },
    power: { inhale: 3, hold: 3, exhale: 6, name: "Power Breath" }
  };

  // Simulate anxiety decrease during session
  useEffect(() => {
    if (sessionActive) {
      const interval = setInterval(() => {
        setAnxietyLevel(prev => Math.max(0.1, prev - 0.02)); // Decrease anxiety
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [sessionActive]);

  // Breath cycle management
  useEffect(() => {
    if (!sessionActive || !sessionType) return;

    const pattern = breathPatterns[sessionType];
    
    const cycleInterval = setInterval(() => {
      setPhaseTimer(prev => {
        const newTimer = prev + 0.1;
        
        if (breathPhase === 'idle') {
          setBreathPhase('inhale');
          return 0;
        }
        
        if (breathPhase === 'inhale' && newTimer >= pattern.inhale) {
          setBreathPhase('hold');
          return 0;
        }
        
        if (breathPhase === 'hold' && newTimer >= pattern.hold) {
          setBreathPhase('exhale');
          return 0;
        }
        
        if (breathPhase === 'exhale' && newTimer >= pattern.exhale) {
          setBreathPhase('inhale');
          setCyclesCompleted(prev => prev + 1);
          
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(30);
          }
          
          return 0;
        }
        
        return newTimer;
      });
    }, 100);

    return () => clearInterval(cycleInterval);
  }, [sessionActive, breathPhase, sessionType]);

  const calculateBadgeRarity = (cycles: number, anxiety: number): BreathBadge['rarity'] => {
    const score = cycles * 10 + (1 - anxiety) * 100;
    const rand = Math.random();
    
    if (score > 150 && rand > 0.97) return 'legendary';
    if (score > 100 && rand > 0.90) return 'epic';
    if (score > 50 && rand > 0.75) return 'rare';
    return 'common';
  };

  const badgeLibrary = {
    common: [
      { name: "Premier Souffle", emoji: "🫧", description: "Tu as commencé ton voyage océanique" },
      { name: "Vague Douce", emoji: "🌊", description: "Respiration calme et posée" },
      { name: "Bulles Zen", emoji: "✨", description: "Quelques cycles apaisants" }
    ],
    rare: [
      { name: "Maître de l'Expire", emoji: "💨", description: "Expire longue maîtrisée" },
      { name: "Océan Calme", emoji: "🌅", description: "Anxiété significativement réduite" },
      { name: "Perle Marine", emoji: "🦪", description: "Session complète réussie" }
    ],
    epic: [
      { name: "Gardien des Profondeurs", emoji: "🐋", description: "Respiration profonde exceptionnelle" },
      { name: "Cristal Aquatique", emoji: "💎", description: "Clarté mentale atteinte" },
      { name: "Marée Mystique", emoji: "🌙", description: "État méditatif avancé" }
    ],
    legendary: [
      { name: "Gardien du Sommeil", emoji: "⭐", description: "Préparation sommeil parfaite" },
      { name: "Souverain de l'Océan", emoji: "👑", description: "Maîtrise totale du souffle" },
      { name: "Aurore Abyssale", emoji: "🌌", description: "Transformation complète" }
    ]
  };

  const handleStartSession = (type: SessionType) => {
    if (!type) return;
    
    setSessionType(type);
    setSessionActive(true);
    setSessionStartTime(Date.now());
    setCyclesCompleted(0);
    setAnxietyLevel(0.7); // Start with moderate anxiety
    setBreathPhase('idle');
    
    // Track session start
    track({
      instrument: type === 'quick' ? 'STAI-6' : 'ISI',
      item_id: `breathwork_${type}_start`,
      proxy: 'start',
      value: 'initiated',
      context: { session_type: type }
    });
    
    toast({
      title: type === 'quick' ? "🌊 Océan activé" : "🌙 Plongée nocturne",
      description: type === 'quick' ? "2-3 minutes de calme" : "10 minutes vers le sommeil",
    });
  };

  const handleEndSession = () => {
    if (!sessionType) return;
    
    const duration = Date.now() - sessionStartTime;
    const rarity = calculateBadgeRarity(cyclesCompleted, anxietyLevel);
    const badgeOptions = badgeLibrary[rarity];
    const selectedBadge = badgeOptions[Math.floor(Math.random() * badgeOptions.length)];
    
    const newBadge: BreathBadge = {
      id: `badge-${Date.now()}`,
      ...selectedBadge,
      rarity,
      unlockedAt: Date.now()
    };
    
    setBadges(prev => [newBadge, ...prev]);
    setCurrentBadge(newBadge);
    setShowBadge(true);
    
    // Track session completion
    track({
      instrument: sessionType === 'quick' ? 'STAI-6' : 'ISI',
      item_id: `breathwork_${sessionType}_complete`,
      proxy: 'completion',
      value: String(1 - anxietyLevel),
      context: {
        duration: String(duration),
        cycles: String(cyclesCompleted),
        anxiety_reduction: String(0.7 - anxietyLevel),
        rarity
      }
    });
    
    setSessionActive(false);
    setBreathPhase('idle');
    setTimeout(() => setShowBadge(false), 5000);
  };

  const getPhaseInstruction = () => {
    const instructions = {
      idle: "Prépare-toi...",
      inhale: "Inspire profondément 🌊",
      hold: "Retiens ton souffle 💫",
      exhale: "Expire lentement 🫧"
    };
    return instructions[breathPhase];
  };

  const targetDuration = sessionType === 'quick' ? 150 : 600; // seconds
  const progress = sessionActive ? Math.min((Date.now() - sessionStartTime) / (targetDuration * 1000), 1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-indigo-950 to-purple-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        {!sessionActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <Waves className="h-12 w-12 text-cyan-400 animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                L'Océan Intérieur
              </h1>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Plonge dans ton souffle. Chaque respiration transforme ton océan intérieur.
            </p>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-sm text-cyan-400"
            >
              🌊 Laisse les vagues t'apaiser 🌊
            </motion.p>

            {/* Session Type Selection - ENRICHED */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
              {Object.entries(breathPatterns).map(([key, pattern]) => (
                <motion.div key={key} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                  <Card 
                    className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-950/50 to-blue-950/50 hover:shadow-glow-intense cursor-pointer"
                    onClick={() => handleStartSession(key as SessionType)}
                  >
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                      {key === 'quick' && <Sun className="h-16 w-16 text-cyan-400 mx-auto" />}
                      {key === 'sleep' && <Moon className="h-16 w-16 text-indigo-400 mx-auto" />}
                      {key === 'box' && <div className="text-5xl">📦</div>}
                      {key === 'wim' && <div className="text-5xl">❄️</div>}
                      {key === 'resonant' && <div className="text-5xl">💓</div>}
                      {key === 'power' && <div className="text-5xl">⚡</div>}
                      <h3 className="text-2xl font-bold text-white">{pattern.name}</h3>
                      <p className="text-gray-300 text-sm">
                        {pattern.inhale}s - {pattern.hold}s - {pattern.exhale}s
                      </p>
                      <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow">
                        <Play className="mr-2 h-5 w-5" />
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Session */}
        {sessionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Ocean Scene */}
            <OceanScene 
              breathPhase={breathPhase}
              anxietyLevel={anxietyLevel}
              cyclesCompleted={cyclesCompleted}
              isActive={sessionActive}
            />

            {/* Controls Overlay */}
            <div className="fixed top-24 right-8 z-20 space-y-4">
              <Card className="bg-black/50 border-cyan-500/30 backdrop-blur-lg">
                <CardContent className="p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{getPhaseInstruction()}</p>
                    <p className="text-sm text-cyan-300 mt-2">{cyclesCompleted} cycles</p>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                      animate={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  
                  {/* Anxiety indicator */}
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          anxietyLevel > 0.6 ? 'bg-red-400' :
                          anxietyLevel > 0.3 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        animate={{ width: `${(1 - anxietyLevel) * 100}%` }}
                      />
                    </div>
                    <span>{anxietyLevel > 0.6 ? 'Tendu' : anxietyLevel > 0.3 ? 'Calme' : 'Zen'}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full bg-black/30 hover:bg-black/50 border-cyan-500/50 text-white"
                    onClick={handleEndSession}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Terminer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Badge Reveal */}
        <AnimatePresence>
          {showBadge && currentBadge && (
            <BadgeReveal badge={currentBadge} onClose={() => setShowBadge(false)} />
          )}
        </AnimatePresence>

        {/* Badges Gallery */}
        {!sessionActive && badges.length > 0 && (
          <Card className="max-w-6xl mx-auto border-0 shadow-glow bg-gradient-to-br from-cyan-950/50 to-indigo-950/50 backdrop-blur">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Coffre au Trésor Marin</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.slice(0, 12).map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-2 ${
                      badge.rarity === 'legendary' ? 'border-yellow-500 shadow-glow-legendary' :
                      badge.rarity === 'epic' ? 'border-purple-500 shadow-glow-intense' :
                      badge.rarity === 'rare' ? 'border-blue-500 shadow-glow' :
                      'border-cyan-500/30'
                    } bg-gradient-to-br from-blue-950/50 to-indigo-950/50 hover:scale-105 transition-transform`}>
                      <CardContent className="p-4 text-center space-y-2">
                        <motion.div
                          className="text-5xl"
                          animate={badge.rarity === 'legendary' ? {
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {badge.emoji}
                        </motion.div>
                        <p className="text-sm font-semibold text-white">{badge.name}</p>
                        <p className="text-xs text-gray-400">{badge.description}</p>
                        <p className="text-xs text-cyan-400 capitalize">{badge.rarity}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <p className="text-center text-sm text-gray-400 mt-4">
                {badges.length} badges débloqués • Continue ta collection marine
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Breathwork;
