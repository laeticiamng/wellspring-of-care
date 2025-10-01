import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScreenSilkSceneProps {
  phase: 'intro' | 'blink' | 'horizon' | 'rest' | 'complete';
  onPhaseComplete?: () => void;
}

export function ScreenSilkScene({ phase, onPhaseComplete }: ScreenSilkSceneProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate silk particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const getBackgroundGradient = () => {
    switch (phase) {
      case 'intro':
        return 'from-background via-primary/5 to-background';
      case 'blink':
        return 'from-primary/10 via-secondary/5 to-background';
      case 'horizon':
        return 'from-accent/20 via-primary/10 to-background';
      case 'rest':
        return 'from-primary/5 via-accent/10 to-secondary/5';
      case 'complete':
        return 'from-primary/20 via-accent/15 to-primary/10';
      default:
        return 'from-background to-background';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Silk particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: ['0%', '100vh'],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 15 + particle.delay * 5,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Silk curtain effect */}
      {phase === 'intro' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          onAnimationComplete={onPhaseComplete}
        />
      )}

      {/* Blink halo */}
      {phase === 'blink' && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-primary/30 blur-2xl"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}

      {/* Horizon effect */}
      {phase === 'horizon' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: 'easeOut' }}
          />
        </motion.div>
      )}

      {/* Rest state - fluid silk */}
      {phase === 'rest' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(var(--accent), 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(var(--secondary), 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}
