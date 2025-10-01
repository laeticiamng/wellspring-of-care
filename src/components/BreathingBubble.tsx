import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BreathingBubbleProps {
  isActive: boolean;
  onCycleComplete?: () => void;
  onPhaseChange?: (phase: 'inhale' | 'exhale') => void;
}

export function BreathingBubble({ isActive, onCycleComplete, onPhaseChange }: BreathingBubbleProps) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [cycle, setCycle] = useState(0);
  const totalCycles = 6;

  useEffect(() => {
    if (!isActive) return;

    const cycleDuration = 10000; // 10 sec par cycle (5s inhale + 5s exhale)
    
    const timer = setInterval(() => {
      setPhase(prev => {
        const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
        
        if (newPhase === 'inhale') {
          const newCycle = cycle + 1;
          setCycle(newCycle);
          
          if (newCycle >= totalCycles) {
            clearInterval(timer);
            onCycleComplete?.();
          }
        }
        
        onPhaseChange?.(newPhase);
        
        // Haptic feedback on exhale
        if (newPhase === 'exhale' && 'vibrate' in navigator) {
          navigator.vibrate(100);
        }
        
        return newPhase;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isActive, cycle, onCycleComplete, onPhaseChange]);

  const bubbleSize = phase === 'inhale' ? 400 : 200;
  const particleCount = 20;

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950">
      {/* Particules flottantes */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: phase === 'exhale' ? 0 : 0.5,
            scale: phase === 'inhale' ? 1.5 : 0.5,
          }}
          transition={{
            duration: 5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      ))}

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
        <p className="text-white/90 text-2xl font-light mb-2">
          {phase === 'inhale' ? 'Inspire...' : 'Expire...'}
        </p>
        <p className="text-white/60 text-sm">
          Cycle {cycle + 1} / {totalCycles}
        </p>
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
