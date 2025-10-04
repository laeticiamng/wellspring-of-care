import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Heart, 
  Brain,
  Leaf,
  Moon,
  Star,
  Award,
  Lock,
  Trophy,
  Sparkles,
  Timer,
  Volume2,
  ChevronRight,
  Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useModuleProgress } from "@/hooks/useModuleProgress";

interface MeditationSession {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  durationMinutes: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  rating: number;
  plays: string;
  category: string;
  icon: string;
  description: string;
  story: string;
  unlockLevel: number;
  xp: number;
  audio?: string;
}

const Meditation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  const [progress, setProgress] = useState(0);
  const [showJourney, setShowJourney] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const { toast } = useToast();
  
  const {
    userLevel,
    totalXP,
    unlockedItems: completedSessions,
    addXP,
    unlockItem,
    metadata,
    setMetadata,
    loading: progressLoading
  } = useModuleProgress("meditation");

  const sessions: MeditationSession[] = [
    {
      id: 1,
      title: "Éveil de l'Aube",
      instructor: "Maître Zen",
      duration: "10 min",
      durationMinutes: 10,
      difficulty: "Débutant",
      rating: 4.9,
      plays: "12.5k",
      category: "Énergie",
      icon: "🌅",
      description: "Accueille le jour avec sérénité et gratitude",
      story: "Chaque matin est une renaissance. Ouvre tes yeux intérieurs à la lumière.",
      unlockLevel: 0,
      xp: 100
    },
    {
      id: 2,
      title: "Scan Corporel Profond",
      instructor: "Dr. Sarah Chen",
      duration: "20 min",
      durationMinutes: 20,
      difficulty: "Intermédiaire",
      rating: 4.8,
      plays: "8.2k",
      category: "Détente",
      icon: "🌊",
      description: "Voyage à travers chaque cellule de ton corps",
      story: "Ton corps est un océan de sensations. Explore chaque vague, chaque courant.",
      unlockLevel: 3,
      xp: 150
    },
    {
      id: 3,
      title: "Méditation du Guerrier",
      instructor: "Emma Wilson",
      duration: "15 min",
      durationMinutes: 15,
      difficulty: "Débutant",
      rating: 4.9,
      plays: "15.7k",
      category: "Force",
      icon: "⚔️",
      description: "Forge ta volonté d'acier dans le silence",
      story: "Le guerrier ne combat pas. Il observe, respire, devient invincible.",
      unlockLevel: 0,
      xp: 120
    },
    {
      id: 4,
      title: "Voyage Astral",
      instructor: "Luc Martin",
      duration: "30 min",
      durationMinutes: 30,
      difficulty: "Avancé",
      rating: 4.9,
      plays: "6.3k",
      category: "Conscience",
      icon: "🌌",
      description: "Explore les dimensions de ta conscience",
      story: "Au-delà du corps, au-delà de l'esprit. Tu es infini.",
      unlockLevel: 10,
      xp: 300
    },
    {
      id: 5,
      title: "Portail du Sommeil",
      instructor: "Sophie Laurent",
      duration: "25 min",
      durationMinutes: 25,
      difficulty: "Débutant",
      rating: 4.8,
      plays: "11.2k",
      category: "Sommeil",
      icon: "🌙",
      description: "Traverse le portail vers le royaume des rêves",
      story: "La nuit t'appelle. Laisse-toi porter dans les bras de Morphée.",
      unlockLevel: 0,
      xp: 200
    },
    {
      id: 6,
      title: "Feu Créatif",
      instructor: "Alex Chen",
      duration: "15 min",
      durationMinutes: 15,
      difficulty: "Intermédiaire",
      rating: 4.7,
      plays: "9.1k",
      category: "Créativité",
      icon: "🎨",
      description: "Allume la flamme de ton génie créatif",
      story: "Chaque artiste porte un feu sacré. Laisse-le brûler, laisse-le créer.",
      unlockLevel: 5,
      xp: 130
    },
    {
      id: 7,
      title: "Racines de la Terre",
      instructor: "Yuna Kim",
      duration: "18 min",
      durationMinutes: 18,
      difficulty: "Intermédiaire",
      rating: 4.8,
      plays: "7.8k",
      category: "Ancrage",
      icon: "🌳",
      description: "Enracine-toi profondément dans la stabilité",
      story: "Comme l'arbre millénaire, trouve ta force dans tes racines profondes.",
      unlockLevel: 7,
      xp: 140
    },
    {
      id: 8,
      title: "Cristal de Clarté",
      instructor: "Marcus Silva",
      duration: "12 min",
      durationMinutes: 12,
      difficulty: "Débutant",
      rating: 4.9,
      plays: "10.5k",
      category: "Mental",
      icon: "💎",
      description: "Affine ta clarté mentale comme un cristal pur",
      story: "Dans le silence, ton esprit devient cristal. Transparent, lumineux, parfait.",
      unlockLevel: 0,
      xp: 110
    },
    {
      id: 9,
      title: "Temple Intérieur",
      instructor: "Ananda Devi",
      duration: "40 min",
      durationMinutes: 40,
      difficulty: "Expert",
      rating: 5.0,
      plays: "4.2k",
      category: "Transcendance",
      icon: "⛩️",
      description: "Entre dans le temple secret de ton âme",
      story: "Au cœur de toi existe un temple éternel. Franchis les portes sacrées.",
      unlockLevel: 20,
      xp: 500
    }
  ];

  // Load meditation time from metadata
  useEffect(() => {
    if (metadata.meditationTime) {
      setMeditationTime(metadata.meditationTime);
    }
  }, [metadata]);

  // Session timer
  useEffect(() => {
    if (!isPlaying || !currentSession) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentSession.durationMinutes * 60));
        if (newProgress >= 100) {
          completeSession();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSession]);

  const startSession = (session: MeditationSession) => {
    setCurrentSession(session);
    setIsPlaying(true);
    setProgress(0);
    setShowJourney(true);
  };

  const completeSession = async () => {
    if (!currentSession) return;
    
    setIsPlaying(false);
    const xpGained = currentSession.xp;
    const newTime = meditationTime + currentSession.durationMinutes;
    
    // Update time and save to metadata
    setMeditationTime(newTime);
    await setMetadata('meditationTime', newTime);
    
    // Add XP and unlock session
    await addXP(xpGained, currentSession.id.toString());
    
    toast({
      title: "✨ Méditation complétée",
      description: `+${xpGained} XP • ${currentSession.durationMinutes} min de paix • Niveau ${userLevel}`,
    });
    
    setShowJourney(false);
    setTimeout(() => setCurrentSession(null), 2000);
  };

  const unlockedSessions = sessions.filter(s => s.unlockLevel <= userLevel);
  const nextUnlock = sessions.find(s => s.unlockLevel > userLevel);
  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = ((totalXP % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Progression */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Maître de Méditation</h2>
                <p className="text-sm text-muted-foreground">Niveau {userLevel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{meditationTime}</p>
              <p className="text-xs text-muted-foreground">minutes de méditation</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{totalXP} XP</span>
              <span className="text-muted-foreground">{xpToNextLevel} XP vers niveau {userLevel + 1}</span>
            </div>
            <div className="w-full h-3 bg-secondary/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          
          {nextUnlock && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              🔒 Prochaine méditation : <span className="text-primary font-bold">{nextUnlock.title}</span> (Niveau {nextUnlock.unlockLevel})
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center space-y-2">
              <Trophy className="w-8 h-8 text-primary mx-auto" />
              <div className="text-3xl font-bold">{completedSessions.filter(id => sessions.find(s => s.id.toString() === id)).length}</div>
              <p className="text-sm text-muted-foreground">Sessions</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardContent className="p-6 text-center space-y-2">
              <Award className="w-8 h-8 text-secondary mx-auto" />
              <div className="text-3xl font-bold">{unlockedSessions.length}</div>
              <p className="text-sm text-muted-foreground">Débloquées</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-6 text-center space-y-2">
              <Star className="w-8 h-8 text-accent mx-auto" />
              <div className="text-3xl font-bold">{userLevel}</div>
              <p className="text-sm text-muted-foreground">Niveau</p>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🧘 Sanctuaire de Méditation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {sessions.length} voyages intérieurs t'attendent
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const isLocked = session.unlockLevel > userLevel;
            const isCompleted = completedSessions.includes(session.id.toString());
            
            return (
              <motion.div
                key={session.id}
                whileHover={{ scale: isLocked ? 1 : 1.03, y: -5 }}
                whileTap={{ scale: isLocked ? 1 : 0.98 }}
              >
                <Card className={`border-0 shadow-lg transition-all duration-300 relative overflow-hidden ${
                  isLocked ? 'opacity-60 grayscale' : 'hover:shadow-2xl'
                }`}>
                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" /> Complété
                      </div>
                    </div>
                  )}
                  
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                      <div className="text-center space-y-2 text-white">
                        <Lock className="w-10 h-10 mx-auto" />
                        <div className="font-bold">Niveau {session.unlockLevel} requis</div>
                        <div className="text-xs opacity-70">
                          {session.unlockLevel - userLevel} niveaux restants
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-0">
                    {/* Hero Section */}
                    <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-8 text-center">
                      <div className="text-7xl mb-4">{session.icon}</div>
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white border-0">
                        {session.category}
                      </Badge>
                      <Badge className="absolute top-4 left-4" variant="outline">
                        {session.difficulty}
                      </Badge>
                    </div>
                    
                    {/* Info Section */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-xl mb-2">{session.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-primary" />
                          <span>{session.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span>{session.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Par {session.instructor}</span>
                        <span>{session.plays} écoutes</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-primary font-bold text-sm">+{session.xp} XP</span>
                        <Button 
                          disabled={isLocked}
                          className="bg-gradient-to-r from-primary to-secondary text-white border-0"
                          onClick={() => {
                            setCurrentSession(session);
                            setShowJourney(true);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Journey Modal */}
        <AnimatePresence>
          {showJourney && currentSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full space-y-6"
              >
                {/* Intro story */}
                {!isPlaying && (
                  <div className="text-center space-y-6">
                    <div className="text-8xl mx-auto">{currentSession.icon}</div>
                    <h2 className="text-3xl font-bold">{currentSession.title}</h2>
                    <p className="text-muted-foreground italic leading-relaxed text-lg">
                      {currentSession.story}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowJourney(false);
                          setCurrentSession(null);
                        }}
                      >
                        Retour
                      </Button>
                      <Button
                        onClick={() => setIsPlaying(true)}
                        className="bg-gradient-to-r from-primary to-secondary text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Débuter le voyage
                      </Button>
                    </div>
                  </div>
                )}

                {/* Active meditation */}
                {isPlaying && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div
                        className="text-9xl mx-auto"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {currentSession.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold mt-4">{currentSession.title}</h3>
                      <p className="text-muted-foreground">{currentSession.instructor}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{Math.floor(progress / 100 * currentSession.durationMinutes)} min</span>
                        <span>{currentSession.duration}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsPlaying(false)}
                      >
                        <Pause className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setIsPlaying(false);
                          setShowJourney(false);
                          setCurrentSession(null);
                        }}
                      >
                        Terminer
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Player */}
        {currentSession && !showJourney && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-6 right-6 z-40"
          >
            <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{currentSession.icon}</div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{currentSession.title}</h4>
                        <p className="text-xs text-muted-foreground">{currentSession.instructor}</p>
                      </div>
                      <span className="text-sm text-primary font-bold">+{currentSession.xp} XP</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowJourney(true)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Meditation;
