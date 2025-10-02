import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BreathingBubble from '@/components/BreathingBubble';
import BadgeReveal from '@/components/BadgeReveal';
import { CocoonGallery } from '@/components/CocoonGallery';
import { NyveeTutorial } from '@/components/NyveeTutorial';
import { useNyveeSession } from '@/hooks/useNyveeSession';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

const Nyvee = () => {
  const navigate = useNavigate();
  const { session, badge, loading, startSession, submitSession, reset } = useNyveeSession();
  const [phase, setPhase] = useState<'tutorial' | 'welcome' | 'breathing' | 'badge'>('tutorial');
  const [breathStartTime, setBreathStartTime] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedBubbles, setUnlockedBubbles] = useState<string[]>([]);

  const bubbleTypes = [
    { id: 'bubble1', name: '🫧 Bulle Calme', unlockLevel: 1, xp: 50 },
    { id: 'bubble2', name: '💫 Bulle Étoilée', unlockLevel: 3, xp: 100 },
    { id: 'bubble3', name: '🌊 Bulle Océan', unlockLevel: 5, xp: 150 },
    { id: 'bubble4', name: '✨ Bulle Cosmique', unlockLevel: 8, xp: 200 },
  ];

  useState(() => {
    const saved = localStorage.getItem('nyvee_progress');
    if (saved) {
      const { level, xp, sessions, bubbles } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setTotalSessions(sessions || 0);
      setUnlockedBubbles(bubbles || []);
    }
  });

  // Son cristallin (simulation - en prod on utiliserait Howler.js)
  const playBreathSound = (type: 'inhale' | 'exhale') => {
    // Note: Howler.js serait utilisé ici pour jouer les vrais sons
    console.log(`Playing ${type} sound`);
  };

  const handleStart = async () => {
    const sessionData = await startSession();
    if (sessionData) {
      setPhase('breathing');
      setBreathStartTime(Date.now());
    }
  };

  const handleCycleComplete = async () => {
    const breathDuration = Math.floor((Date.now() - breathStartTime) / 1000);
    const badgeData = await submitSession(breathDuration);
    
    // Calculate XP
    const baseXP = 40;
    const durationBonus = Math.floor(breathDuration / 30) * 10;
    const qualityBonus = breathDuration >= 120 ? 30 : breathDuration >= 60 ? 15 : 0;
    const totalXPGain = baseXP + durationBonus + qualityBonus;

    const newXP = totalXP + totalXPGain;
    const newLevel = Math.floor(newXP / 500) + 1;
    const newSessionCount = totalSessions + 1;
    const leveledUp = newLevel > userLevel;

    // Check for bubble unlocks
    const newUnlocks = bubbleTypes.filter(bt => 
      bt.unlockLevel <= newLevel && !unlockedBubbles.includes(bt.id)
    ).map(bt => bt.id);

    if (leveledUp) {
      setUserLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    if (newUnlocks.length > 0) {
      setUnlockedBubbles([...unlockedBubbles, ...newUnlocks]);
    }

    setTotalXP(newXP);
    setTotalSessions(newSessionCount);

    localStorage.setItem('nyvee_progress', JSON.stringify({
      level: newLevel,
      xp: newXP,
      sessions: newSessionCount,
      bubbles: [...unlockedBubbles, ...newUnlocks]
    }));
    
    if (badgeData) {
      setPhase('badge');
    }
  };

  const handlePhaseChange = (newPhase: 'inhale' | 'exhale') => {
    setCurrentPhase(newPhase);
    playBreathSound(newPhase);
  };

  const handleContinue = (action: string) => {
    switch (action) {
      case 'silence':
        navigate('/meditation');
        break;
      case 'anchor':
        navigate('/emotional-scan');
        break;
      case 'flashglow':
        navigate('/flash-glow');
        break;
    }
  };

  const handleRestart = () => {
    reset();
    setPhase('welcome');
  };

  const handleTutorialComplete = () => {
    setPhase('welcome');
  };

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  if (phase === 'tutorial') {
    return <NyveeTutorial onComplete={handleTutorialComplete} />;
  }

  if (phase === 'breathing') {
    return (
      <BreathingBubble
        isActive={true}
        breathLevel={0.5}
      />
    );
  }

  if (phase === 'badge' && badge) {
    return (
      <BadgeReveal
        badge={{
          name: badge.badge,
          emoji: badge.badgeEmoji,
          rarity: 'epic',
          description: badge.message
        }}
        onClose={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 relative">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="max-w-md bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400/50 shadow-glow-legendary animate-scale-in rounded-lg p-8 text-center space-y-4 text-white">
            <div className="text-6xl animate-bounce">🫧</div>
            <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
            <p className="text-white/80">Nouvelles bulles débloquées</p>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        {/* Retour */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="absolute top-24 left-8 text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>

        {/* Écran d'accueil */}
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Bulle preview */}
          <motion.div
            className="w-64 h-64 mx-auto mb-12 rounded-full backdrop-blur-xl border-4 border-white/30 shadow-2xl flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2))',
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 100px rgba(59, 130, 246, 0.8)',
                '0 0 150px rgba(139, 92, 246, 0.9)',
                '0 0 100px rgba(59, 130, 246, 0.8)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-20 h-20 text-white/80 animate-pulse" />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-6xl font-bold text-white">
              Nyvée
            </h1>
            <div className="px-3 py-1 bg-purple-600/30 rounded-full border border-purple-400/50">
              <span className="text-sm font-bold text-purple-200">Niv.{userLevel}</span>
            </div>
          </div>
          
          <div className="max-w-md mx-auto space-y-1 mb-4">
            <div className="flex justify-between text-xs text-white/60">
              <span>{totalSessions} sessions</span>
              <span>{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
            </div>
            <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xl text-white/80 mb-4">
            Ton refuge émotionnel
          </p>

          <p className="text-white/60 mb-12 max-w-lg mx-auto">
            Plonge dans une bulle respirante qui se synchronise avec toi.
            <br />
            2 minutes pour retrouver le calme.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={loading}
              className="text-xl px-12 py-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border-2 border-white/40 shadow-glow transition-all hover:scale-105"
            >
              {loading ? 'Préparation...' : 'Prêt à respirer ensemble ?'}
            </Button>

            <CocoonGallery />
            
            {/* Bulles débloquées */}
            <div className="flex justify-center gap-2 flex-wrap mt-6">
              {bubbleTypes.map(bubble => (
                <div
                  key={bubble.id}
                  className={`px-3 py-1 rounded-full text-xs ${
                    unlockedBubbles.includes(bubble.id)
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50'
                      : userLevel >= bubble.unlockLevel
                      ? 'bg-blue-600/30 text-blue-200 border border-blue-400/50 animate-pulse'
                      : 'bg-gray-800/50 text-gray-500 opacity-50'
                  }`}
                >
                  {bubble.name}
                </div>
              ))}
            </div>
          </div>

          {/* Particules d'ambiance */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Nyvee;
