import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Waves, Sprout, Moon, Star, Wind, Home, Sunrise } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCardSounds } from '@/hooks/useCardSounds';

interface WeeklyCardDeckProps {
  onCardSelect?: () => void;
  isRevealing?: boolean;
}

const IconMap: Record<string, any> = {
  Sparkles,
  Flame,
  Waves,
  Sprout,
  Moon,
  Star,
  Wind,
  Home,
  Sunrise,
  Stars: Sparkles,
  Sun: Star
};

export const WeeklyCardDeck = ({ onCardSelect, isRevealing = false }: WeeklyCardDeckProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const { playClickSound, playAmbient, stopAmbient } = useCardSounds();

  useEffect(() => {
    // Générer des particules cosmiques
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    // Démarrer musique d'ambiance
    playAmbient();

    return () => {
      stopAmbient();
    };
  }, [playAmbient, stopAmbient]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Fond cosmique animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-pulse-slow" />
      
      {/* Particules flottantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + particle.delay,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* Deck de cartes */}
      <AnimatePresence mode="wait">
        {!isRevealing && (
          <motion.div
            className="relative cursor-pointer group"
            onClick={() => {
              playClickSound();
              onCardSelect?.();
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Stack de 3 cartes pour effet depth */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 w-48 h-72 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl shadow-2xl"
                style={{
                  zIndex: 3 - i,
                  rotate: `${(i - 1) * 3}deg`,
                }}
                animate={{
                  y: [0, -5, 0],
                  rotate: `${(i - 1) * 3 + Math.sin(Date.now() / 1000 + i) * 2}deg`,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {/* Halo lumineux */}
                <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent rounded-xl animate-pulse" />
                
                {/* Pattern de carte */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white opacity-40" />
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-foreground/80"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Tire ta carte de la semaine ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
