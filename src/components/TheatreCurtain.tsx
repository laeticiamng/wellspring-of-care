import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TheatreCurtainProps {
  isOpen: boolean;
  onAnimationComplete?: () => void;
}

export function TheatreCurtain({ isOpen, onAnimationComplete }: TheatreCurtainProps) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Générer des particules de poussière d'étoiles
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Particules de poussière */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-200/60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Rideau gauche */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#4a0e0e] via-[#6b1414] to-[#8b1818]"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '-100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.6, 0.01, 0.05, 0.95] }}
        onAnimationComplete={onAnimationComplete}
        style={{
          boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Plis du rideau */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-[1px] bg-black/20"
            style={{ left: `${(i + 1) * 12.5}%` }}
          />
        ))}
        
        {/* Reflets dorés */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Rideau droit */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4a0e0e] via-[#6b1414] to-[#8b1818]"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.6, 0.01, 0.05, 0.95] }}
        style={{
          boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Plis du rideau */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-[1px] bg-black/20"
            style={{ right: `${(i + 1) * 12.5}%` }}
          />
        ))}
        
        {/* Reflets dorés */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-200/10 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Barre supérieure décorative */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#2d0a0a] to-transparent"
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-yellow-600/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
