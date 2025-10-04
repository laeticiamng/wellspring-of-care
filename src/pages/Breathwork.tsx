import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flower2, Box, Wind, Radio, Flame, Play, Pause, Check, Lock, BookOpen, Sparkles, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useToast } from "@/hooks/use-toast";
import { useModuleProgress } from "@/hooks/useModuleProgress";

interface BreathPattern {
  name: string;
  icon: any;
  inhale: number;
  hold: number;
  exhale: number;
  rounds: number;
  description: string;
  color: string;
  story: string;
  unlock: number;
  xp: number;
  ambiance: string;
}

const breathPatterns: BreathPattern[] = [
  { 
    name: 'Éveil du Phénix', 
    icon: Zap,
    inhale: 4, 
    hold: 4, 
    exhale: 4, 
    rounds: 8,
    description: 'Renaître avec énergie',
    color: 'from-yellow-500 to-orange-500',
    story: 'Le Phénix s\'éveille à l\'aube. Chaque respiration est une étincelle de vie nouvelle. Inspire la lumière, expire les cendres du passé.',
    unlock: 0,
    xp: 50,
    ambiance: 'sunrise'
  },
  { 
    name: 'Repos du Lotus', 
    icon: Flower2,
    inhale: 4, 
    hold: 7, 
    exhale: 8, 
    rounds: 12,
    description: 'Sommeil profond garanti',
    color: 'from-purple-500 to-indigo-500',
    story: 'Le Lotus se ferme au crépuscule. Laisse ton esprit s\'apaiser comme ses pétales. Dans le silence, trouve le repos éternel.',
    unlock: 2,
    xp: 75,
    ambiance: 'twilight'
  },
  { 
    name: 'Cube du Sage', 
    icon: Box,
    inhale: 4, 
    hold: 4, 
    exhale: 4, 
    rounds: 16,
    description: 'Équilibre parfait',
    color: 'from-blue-500 to-cyan-500',
    story: 'Le Sage respire en carrés parfaits. Trouve l\'équilibre dans la symétrie. Chaque angle est une vérité.',
    unlock: 5,
    xp: 100,
    ambiance: 'zen'
  },
  { 
    name: 'Souffle du Glacier', 
    icon: Wind,
    inhale: 2, 
    hold: 1, 
    exhale: 2, 
    rounds: 30,
    description: 'Méthode du froid extrême',
    color: 'from-cyan-500 to-blue-600',
    story: 'Maîtrise le froid comme le Glacier éternel. Respire, retiens, transcende. L\'impossible devient possible.',
    unlock: 10,
    xp: 150,
    ambiance: 'ice'
  },
  { 
    name: 'Onde de Résonance', 
    icon: Radio,
    inhale: 5, 
    hold: 5, 
    exhale: 5, 
    rounds: 20,
    description: 'Cohérence cardiaque',
    color: 'from-green-500 to-emerald-500',
    story: 'Entre en résonance avec ton cœur. 5-5-5, la fréquence de l\'harmonie. Ton souffle et ton cœur ne font qu\'un.',
    unlock: 15,
    xp: 125,
    ambiance: 'forest'
  },
  { 
    name: 'Tempête du Guerrier', 
    icon: Flame,
    inhale: 6, 
    hold: 2, 
    exhale: 8, 
    rounds: 45,
    description: 'Puissance maximale',
    color: 'from-red-500 to-pink-500',
    story: 'Le Guerrier respire dans la tempête. Chaque cycle forge ta volonté d\'acier. Tu es invincible.',
    unlock: 25,
    xp: 200,
    ambiance: 'storm'
  }
];

const Breathwork = () => {
  const [selectedPattern, setSelectedPattern] = useState(breathPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(selectedPattern.inhale);
  const [round, setRound] = useState(1);
  const [showStory, setShowStory] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const { track } = useImplicitTracking();
  const { toast } = useToast();
  
  const {
    userLevel,
    totalXP,
    unlockedItems: completedPatterns,
    addXP,
    unlockItem,
    loading: progressLoading
  } = useModuleProgress("breathwork");


  const startExercise = () => {
    setIsActive(true);
    setRound(1);
    setPhase('inhale');
    setCountdown(selectedPattern.inhale);
    setShowStory(false);
    
    // Créer des particules d'ambiance
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    
    track({
      instrument: 'BREATHING',
      item_id: `breathwork_${selectedPattern.name}_start`,
      proxy: 'engagement',
      value: '1',
      context: { pattern: selectedPattern.name }
    });
  };

  const completeSession = async () => {
    const xpGained = selectedPattern.xp;
    
    // Add XP and unlock pattern
    await addXP(xpGained, selectedPattern.name);
    
    toast({
      title: "✨ Session complétée !",
      description: `+${xpGained} XP gagné • ${round} cycles • Niveau ${userLevel}`,
    });
    
    track({
      instrument: 'BREATHING',
      item_id: `breathwork_${selectedPattern.name}_complete`,
      proxy: 'completion',
      value: round.toString(),
      context: { pattern: selectedPattern.name, xp: String(xpGained) }
    });
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return selectedPattern.hold;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return selectedPattern.exhale;
          } else {
            if (round >= selectedPattern.rounds) {
              setIsActive(false);
              completeSession();
              return 0;
            } else {
              setRound(round + 1);
              setPhase('inhale');
              return selectedPattern.inhale;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, round, selectedPattern]);

  const unlockedPatterns = breathPatterns.filter(p => p.unlock <= userLevel);
  const nextUnlock = breathPatterns.find(p => p.unlock > userLevel);
  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = ((totalXP % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-8 relative overflow-hidden">
      {/* Particules d'ambiance */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
      
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8 relative z-10 mt-20"
      >
        {/* Barre de progression utilisateur */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold" data-testid="user-level">Maître du Souffle - Niveau {userLevel}</span>
            </div>
            <span className="text-sm text-muted-foreground" data-testid="user-xp">{totalXP} XP</span>
          </div>
          <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {nextUnlock && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {xpToNextLevel} XP vers niv.{userLevel + 1} • Prochaine technique : {nextUnlock.name}
            </p>
          )}
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🫁 Temple du Souffle
          </h1>
          <p className="text-xl text-muted-foreground">
            Maîtrise les {breathPatterns.length} techniques ancestrales du souffle
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" />
              {completedPatterns.filter(name => breathPatterns.find(p => p.name === name)).length}/{breathPatterns.length} Maîtrisées
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-primary" />
              {unlockedPatterns.length} Débloquées
            </div>
          </div>
        </div>

        {!isActive && (
          <div className="grid md:grid-cols-3 gap-6">
            {breathPatterns.map((pattern) => {
              const Icon = pattern.icon;
              const isSelected = selectedPattern.name === pattern.name;
              const isLocked = userLevel < pattern.unlock;
              const isCompleted = completedPatterns.includes(pattern.name);
              
              return (
                <motion.div
                  key={pattern.name}
                  whileHover={{ scale: isLocked ? 1 : 1.05 }}
                  whileTap={{ scale: isLocked ? 1 : 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all relative overflow-hidden ${
                      isLocked 
                        ? 'opacity-50 grayscale cursor-not-allowed' 
                        : isSelected 
                          ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30' 
                          : 'hover:border-primary/50'
                    }`}
                    onClick={() => !isActive && !isLocked && setSelectedPattern(pattern)}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3" /> Maîtrisé
                        </div>
                      </div>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-10">
                        <div className="text-center space-y-2">
                          <Lock className="w-8 h-8 mx-auto text-white" />
                          <div className="text-sm text-white font-bold">
                            Niveau {pattern.unlock} requis
                          </div>
                          <div className="text-xs text-white/70">
                            {pattern.unlock - userLevel} niveaux restants
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6 space-y-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pattern.color} flex items-center justify-center mx-auto shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h3 className="font-bold text-lg">{pattern.name}</h3>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        {!isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowStory(true);
                              setSelectedPattern(pattern);
                            }}
                            className="text-xs"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Lire l'histoire
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-around text-sm">
                        <div className="text-center">
                          <div className="font-bold text-primary">{pattern.inhale}s</div>
                          <div className="text-xs text-muted-foreground">Inspire</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-secondary">{pattern.hold}s</div>
                          <div className="text-xs text-muted-foreground">Retiens</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-accent">{pattern.exhale}s</div>
                          <div className="text-xs text-muted-foreground">Expire</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{pattern.rounds} cycles</span>
                        <span className="text-primary font-bold">+{pattern.xp} XP</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Dialog histoire */}
        <AnimatePresence>
          {showStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowStory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border border-border rounded-lg p-8 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedPattern.color} flex items-center justify-center mx-auto shadow-2xl`}>
                    {<selectedPattern.icon className="w-10 h-10 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-center">{selectedPattern.name}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed italic">
                    {selectedPattern.story}
                  </p>
                  <Button onClick={() => {
                    setShowStory(false);
                    startExercise();
                  }} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Commencer le voyage
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Animation */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: 2 }}
                className="text-center space-y-4"
              >
                <TrendingUp className="w-32 h-32 mx-auto text-primary" />
                <h2 className="text-6xl font-bold text-white">
                  NIVEAU {userLevel}
                </h2>
                <p className="text-2xl text-primary">Nouveau rang atteint !</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session active */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gradient-to-br from-black/90 via-primary/30 to-black/90 backdrop-blur-xl z-40 flex items-center justify-center"
          >
            <div className="text-center space-y-8">
              {/* Orbe de respiration */}
              <motion.div
                className={`w-64 h-64 rounded-full bg-gradient-to-br ${selectedPattern.color} mx-auto shadow-2xl`}
                animate={{
                  scale: phase === 'inhale' ? [1, 1.3] : phase === 'hold' ? 1.3 : [1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: phase === 'inhale' ? selectedPattern.inhale : 
                           phase === 'hold' ? selectedPattern.hold : 
                           selectedPattern.exhale,
                  ease: "easeInOut"
                }}
              />

              {/* Instructions */}
              <div className="space-y-4">
                <motion.h2 
                  className="text-5xl font-bold text-white"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {phase === 'inhale' ? 'Inspire' : phase === 'hold' ? 'Retiens' : 'Expire'}
                </motion.h2>
                <p className="text-6xl font-bold text-primary">{countdown}s</p>
                <p className="text-xl text-white/70">Cycle {round}/{selectedPattern.rounds}</p>
                
                <Progress value={(round / selectedPattern.rounds) * 100} className="w-64 mx-auto" />
              </div>

              {/* Contrôles */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsActive(false);
                    setRound(1);
                  }}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Breathwork;
