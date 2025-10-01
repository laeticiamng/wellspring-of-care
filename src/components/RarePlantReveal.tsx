import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PlantAsset } from '@/utils/gardenAssets';

interface RarePlantRevealProps {
  plant: PlantAsset;
  onComplete?: () => void;
}

export function RarePlantReveal({ plant, onComplete }: RarePlantRevealProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-labelledby="rare-plant-title"
          aria-describedby="rare-plant-description"
        >
          {/* Particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 20,
                  opacity: 0,
                }}
                animate={{
                  y: -20,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              >
                {i % 2 === 0 ? (
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                ) : (
                  <Star className="w-3 h-3 text-blue-300" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.5, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="relative z-10 max-w-md mx-4 p-8 bg-gradient-to-br from-card to-card/80 rounded-2xl border-2 border-primary shadow-2xl"
          >
            {/* Rarity badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`
                absolute -top-4 left-1/2 -translate-x-1/2
                px-4 py-1 rounded-full text-xs font-bold uppercase
                ${plant.rarity === 'legendary' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}
              `}
            >
              {plant.rarity === 'legendary' ? '✨ Légendaire' : '⭐ Rare'}
            </motion.div>

            {/* Plant emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
              className="text-8xl text-center mb-6"
              role="img"
              aria-label={plant.name}
            >
              {plant.emoji}
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center space-y-3"
            >
              <h2 
                id="rare-plant-title"
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                {plant.name}
              </h2>
              <p 
                id="rare-plant-description"
                className="text-muted-foreground"
              >
                {plant.description}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="pt-4"
              >
                <p className="text-sm text-primary font-medium">
                  Une graine rare a été plantée dans ton jardin 🌟
                </p>
              </motion.div>
            </motion.div>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-xs text-center text-muted-foreground mt-6"
            >
              Cette fenêtre se fermera automatiquement
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
