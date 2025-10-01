import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { breathSounds } from '@/utils/breathSounds';
import { useMicrophone } from '@/hooks/useMicrophone';

interface BreathingBubbleProps {
  isActive: boolean;
  onCycleComplete?: () => void;
  onPhaseChange?: (phase: 'inhale' | 'exhale') => void;
}

export function BreathingBubble({ isActive, onCycleComplete, onPhaseChange }: BreathingBubbleProps) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [cycle, setCycle] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { isActive: micActive, breathLevel, startListening, stopListening } = useMicrophone();
  const totalCycles = 6;

  useEffect(() => {
    if (!isActive) {
      breathSounds.stopAmbient();
      return;
    }

    // Démarrer l'ambiance sonore
    if (isSoundEnabled) {
      breathSounds.startAmbient();
    }

    const cycleDuration = 10000; // 10 sec par cycle (5s inhale + 5s exhale)
    
    const timer = setInterval(() => {
      setPhase(prev => {
        const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
        
        // Jouer le son correspondant
        if (isSoundEnabled) {
          if (newPhase === 'inhale') {
            breathSounds.playInhale();
          } else {
            breathSounds.playExhale();
          }
        }
        
        if (newPhase === 'inhale') {
          const newCycle = cycle + 1;
          setCycle(newCycle);
          
          if (newCycle >= totalCycles) {
            clearInterval(timer);
            breathSounds.stopAmbient();
            onCycleComplete?.();
          }
        }
        
        onPhaseChange?.(newPhase);
        
        // Haptic feedback on exhale
        if (newPhase === 'exhale' && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        
        return newPhase;
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      breathSounds.stopAmbient();
    };
  }, [isActive, cycle, isSoundEnabled, onCycleComplete, onPhaseChange]);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    breathSounds.setMuted(!newState);
  };

  const toggleMicrophone = () => {
    if (micActive) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Taille dynamique basée sur le micro ou l'animation
  const baseBubbleSize = phase === 'inhale' ? 400 : 200;
  const bubbleSize = micActive 
    ? baseBubbleSize + (breathLevel * 100)
    : baseBubbleSize;
  const particleCount = 30;

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950">
      {/* Contrôles en haut */}
      <div className="absolute top-8 right-8 flex gap-3 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-lg"
        >
          {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMicrophone}
          className={`backdrop-blur-lg border-white/30 ${
            micActive 
              ? 'bg-red-500/30 hover:bg-red-500/40 text-white' 
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
      </div>

      {/* Particules flottantes */}
      <AnimatePresence>
        {Array.from({ length: particleCount }).map((_, i) => {
          const angle = (i / particleCount) * Math.PI * 2;
          const distance = 200 + Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                background: `radial-gradient(circle, rgba(255,255,255,${0.6 + Math.random() * 0.4}), transparent)`,
              }}
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + Math.cos(angle) * distance,
                y: window.innerHeight / 2 + Math.sin(angle) * distance,
                opacity: phase === 'exhale' ? [1, 0] : [0, 1, 1],
                scale: phase === 'inhale' ? [0, 1.5, 1] : [1, 0.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
                times: phase === 'inhale' ? [0, 0.5, 1] : [0, 0.5, 1],
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* La bulle centrale */}
      <motion.div
        className="relative rounded-full backdrop-blur-xl border-4 border-white/30 shadow-2xl flex items-center justify-center"
        style={{
          background: phase === 'inhale'
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2))'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.2))',
        }}
        animate={{
          width: bubbleSize,
          height: bubbleSize,
          boxShadow:
            phase === 'inhale'
              ? '0 0 100px rgba(59, 130, 246, 0.8), 0 0 200px rgba(139, 92, 246, 0.6)'
              : '0 0 50px rgba(139, 92, 246, 0.6), 0 0 100px rgba(59, 130, 246, 0.4)',
        }}
        transition={{
          duration: 5,
          ease: 'easeInOut',
        }}
      >
        <Sparkles className="w-16 h-16 text-white/80 animate-pulse" />
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-32 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          className="text-white/90 text-3xl font-light mb-2"
          animate={{
            scale: phase === 'inhale' ? [1, 1.1, 1] : [1, 0.95, 1],
          }}
          transition={{ duration: 5, ease: 'easeInOut' }}
        >
          {phase === 'inhale' ? '✨ Inspire...' : '💫 Expire...'}
        </motion.p>
        <p className="text-white/60 text-sm mb-2">
          Cycle {cycle + 1} / {totalCycles}
        </p>
        {micActive && (
          <motion.p
            className="text-blue-400 text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎤 Synchronisé avec ta respiration
          </motion.p>
        )}
      </motion.div>

      {/* Vague d'énergie */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            phase === 'inhale'
              ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 60%)'
              : 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 60%)',
        }}
        animate={{
          scale: phase === 'inhale' ? 1.5 : 1,
          opacity: phase === 'inhale' ? 0.8 : 0.3,
        }}
        transition={{
          duration: 5,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
