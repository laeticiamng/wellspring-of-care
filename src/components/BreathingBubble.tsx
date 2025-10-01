import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BreathingBubbleProps {
  breathLevel: number;
  isActive: boolean;
  onBreathCycle?: () => void;
}

export default function BreathingBubble({ breathLevel, isActive, onBreathCycle }: BreathingBubbleProps) {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number; speed: number }>>([]);
  const [phaseTimer, setPhaseTimer] = useState(0);

  // Guided breathing with 4 phases (4-2-6-2 pattern)
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setPhaseTimer(prev => {
        const newTimer = prev + 0.1;
        
        // 4s inhale → 2s hold → 6s exhale → 2s hold
        if (breathPhase === 'inhale' && newTimer >= 4) {
          setBreathPhase('hold-in');
          return 0;
        }
        if (breathPhase === 'hold-in' && newTimer >= 2) {
          setBreathPhase('exhale');
          return 0;
        }
        if (breathPhase === 'exhale' && newTimer >= 6) {
          setBreathPhase('hold-out');
          return 0;
        }
        if (breathPhase === 'hold-out' && newTimer >= 2) {
          setBreathPhase('inhale');
          setCycleCount(prev => prev + 1);
          onBreathCycle?.();
          return 0;
        }
        
        return newTimer;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive, breathPhase, onBreathCycle]);

  // Generate enhanced cosmic particles
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const newParticle = {
        id: Date.now() + Math.random(),
        x: 50,
        y: 50,
        angle,
        speed: 20 + Math.random() * 30,
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
    }, 300);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // Get phase progress (0-1)
  const getPhaseProgress = () => {
    const durations = {
      'inhale': 4,
      'hold-in': 2,
      'exhale': 6,
      'hold-out': 2
    };
    return Math.min(phaseTimer / durations[breathPhase], 1);
  };
  
  // Calculate breath scale based on phase
  const getBreathScale = () => {
    const progress = getPhaseProgress();
    if (breathPhase === 'inhale') return 1 + progress * 0.8;
    if (breathPhase === 'hold-in') return 1.8;
    if (breathPhase === 'exhale') return 1.8 - progress * 0.8;
    return 1; // hold-out
  };
  
  const breathScale = getBreathScale();
  
  // Phase colors
  const phaseColors = {
    'inhale': 'from-blue-400 via-cyan-400 to-purple-400',
    'hold-in': 'from-purple-400 via-pink-400 to-purple-400',
    'exhale': 'from-green-400 via-emerald-400 to-blue-400',
    'hold-out': 'from-indigo-400 via-blue-400 to-indigo-400'
  };
  
  // Phase instructions
  const phaseInstructions = {
    'inhale': 'Inspire profondément ✨',
    'hold-in': 'Retiens... 🌟',
    'exhale': 'Expire lentement 🌊',
    'hold-out': 'Pause... 💫'
  };

  const opacity = 0.5 + getPhaseProgress() * 0.5;

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Phase instruction */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
        key={breathPhase}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <div className="text-center">
          <p className="text-xl font-semibold text-primary mb-1">
            {phaseInstructions[breathPhase]}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => {
                const durations = { 'inhale': 4, 'hold-in': 2, 'exhale': 6, 'hold-out': 2 };
                const current = durations[breathPhase];
                return (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{
                      opacity: i < Math.floor(phaseTimer) ? 1 : 0.3,
                      scale: i === Math.floor(phaseTimer) ? 1.5 : 1
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Outer halo */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full bg-gradient-to-r ${phaseColors[breathPhase]} blur-3xl`}
        animate={{
          scale: [breathScale * 1.2, breathScale * 1.4, breathScale * 1.2],
          opacity: [opacity * 0.3, opacity * 0.5, opacity * 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main sphere */}
      <motion.div
        className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${phaseColors[breathPhase]} shadow-glow-legendary`}
        animate={{
          scale: breathScale,
          opacity: opacity,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Breathing rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-full border-2 border-white/30`}
            animate={{
              scale: [1 + i * 0.3, 1.5 + i * 0.3],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Enhanced cosmic particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              breathPhase === 'inhale' ? '#60A5FA' :
              breathPhase === 'exhale' ? '#34D399' : '#A78BFA'
            }, transparent)`,
            left: '50%',
            top: '50%',
          }}
          initial={{
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.speed,
            y: Math.sin(particle.angle) * particle.speed,
            opacity: 0,
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}

      {/* Luminous pulsing core */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-white/90 shadow-glow-legendary"
        animate={{
          scale: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 1.3 : 1,
          opacity: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 1 : 0.7,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, white, transparent)`
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Cycle counter */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-3xl font-bold text-white drop-shadow-lg">
          {cycleCount}
        </p>
        <p className="text-xs text-white/70">cycles</p>
      </motion.div>
    </div>
  );
}
