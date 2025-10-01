import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Filter {
  id: string;
  emoji: string;
  name: string;
  color: string;
  uses: number;
  maxUses: number;
}

interface EmotionFilterProps {
  activeFilter: Filter | null;
  affectLevel: number;
  onFilterComplete: () => void;
}

export const EmotionFilter = ({ activeFilter, affectLevel, onFilterComplete }: EmotionFilterProps) => {
  const [filterParticles, setFilterParticles] = useState<Array<{ id: number; angle: number }>>([]);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (activeFilter) {
      // Générer particules autour du filtre
      const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * Math.PI * 2
      }));
      setFilterParticles(particles);

      // Pulse basé sur l'affect
      const pulseInterval = setInterval(() => {
        setPulseIntensity(prev => (prev + 1) % 100);
      }, 50);

      // Auto-completion après durée
      const timer = setTimeout(() => {
        onFilterComplete();
      }, 5000);

      return () => {
        clearInterval(pulseInterval);
        clearTimeout(timer);
      };
    }
  }, [activeFilter, onFilterComplete]);

  if (!activeFilter) return null;

  const getFilterSize = () => {
    const progress = activeFilter.uses / activeFilter.maxUses;
    return 60 + progress * 40; // 60px à 100px
  };

  const getFilterGlow = () => {
    if (affectLevel > 70) return 'drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]';
    if (affectLevel > 40) return 'drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]';
    return 'drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Particules orbitales */}
        {filterParticles.map(particle => {
          const radius = 80;
          const x = Math.cos(particle.angle + pulseIntensity * 0.05) * radius;
          const y = Math.sin(particle.angle + pulseIntensity * 0.05) * radius;

          return (
            <motion.div
              key={particle.id}
              className="absolute text-xl"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: particle.id * 0.1
              }}
            >
              ✨
            </motion.div>
          );
        })}

        {/* Filtre principal */}
        <motion.div
          className={`relative ${getFilterGlow()}`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: `${getFilterSize()}px`,
            height: `${getFilterSize()}px`,
          }}
        >
          <div className="text-center text-6xl">
            {activeFilter.emoji}
          </div>
        </motion.div>

        {/* Halo coloré */}
        <motion.div
          className={`absolute inset-0 rounded-full blur-2xl -z-10`}
          style={{
            background: activeFilter.color,
            opacity: affectLevel / 100 * 0.6
          }}
          animate={{
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />

        {/* Barre de progression d'évolution */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${(activeFilter.uses / activeFilter.maxUses) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 text-center mt-1">
            {activeFilter.uses}/{activeFilter.maxUses} évolutions
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
