import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BreathingBubble from '@/components/BreathingBubble';
import { BadgeReveal } from '@/components/BadgeReveal';
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
        badge={badge.badge}
        badgeColor={badge.badgeColor}
        badgeEmoji={badge.badgeEmoji}
        reductionPercent={badge.reductionPercent}
        cocoonUnlocked={badge.cocoonUnlocked}
        nextAction={badge.nextAction}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950">
      <Header />
      
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

          <h1 className="text-6xl font-bold text-white mb-6">
            Nyvée
          </h1>

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
