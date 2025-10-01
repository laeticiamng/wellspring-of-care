import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MaskData } from '@/hooks/useEmotionalScan';

interface MaskFusionProps {
  mask: MaskData;
  onComplete: () => void;
}

export function MaskFusion({ mask, onComplete }: MaskFusionProps) {
  const [phase, setPhase] = useState<'materialize' | 'flying' | 'fusion' | 'complete'>('materialize');

  useEffect(() => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    const timer1 = setTimeout(() => setPhase('flying'), 1500);
    const timer2 = setTimeout(() => setPhase('fusion'), 3000);
    const timer3 = setTimeout(() => setPhase('complete'), 4500);
    const timer4 = setTimeout(() => {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden">
      {/* Particle explosion */}
      {phase === 'materialize' && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: mask.color,
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Mask materialization */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: phase === 'materialize' ? [0, 1.2, 1] : phase === 'flying' ? 0.8 : phase === 'fusion' ? 0.5 : 1,
          opacity: phase === 'complete' ? 0 : 1,
          x: phase === 'flying' ? 0 : phase === 'fusion' ? 0 : 0,
          y: phase === 'flying' ? -100 : phase === 'fusion' ? 0 : phase === 'complete' ? -200 : 0,
        }}
        transition={{
          duration: 1,
          type: 'spring',
          stiffness: 100,
        }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${mask.gradient} blur-3xl`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Mask */}
        <motion.div
          className={`relative z-10 w-64 h-64 rounded-full bg-gradient-to-br ${mask.gradient} flex items-center justify-center text-9xl shadow-2xl`}
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {mask.emoji}
        </motion.div>

        {/* Rarity indicator */}
        {mask.rarity !== 'common' && (
          <motion.div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className={`
              px-4 py-1 rounded-full text-xs font-bold
              ${mask.rarity === 'legendary' ? 'bg-yellow-500 text-black' : 'bg-purple-500 text-white'}
            `}>
              {mask.rarity === 'legendary' ? '✨ LÉGENDAIRE' : '💎 RARE'}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Phase text */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white text-xl font-medium">
          {phase === 'materialize' && '✨ Création du masque...'}
          {phase === 'flying' && '🎭 Fusion avec ton avatar...'}
          {phase === 'fusion' && '💫 Transformation...'}
          {phase === 'complete' && '✓ Masque intégré!'}
        </p>
      </motion.div>

      {/* Sound wave visualization */}
      {phase === 'fusion' && (
        <motion.div
          className="absolute bottom-40 left-1/2 transform -translate-x-1/2 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-primary rounded-full"
              animate={{
                height: [20, 60, 20],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
