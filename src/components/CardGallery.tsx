import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

interface Entry {
  id: string;
  content: string;
  color_palette: {
    primary: string;
    secondary: string;
  };
  badge_text?: string;
  is_precious: boolean;
  created_at: string;
}

interface CardGalleryProps {
  entries: Entry[];
  onCardClick?: (entry: Entry) => void;
}

export function CardGallery({ entries, onCardClick }: CardGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = entries.length - 1;
      if (nextIndex >= entries.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-white/60">
        <p className="text-lg mb-2">Votre bibliothèque est vide</p>
        <p className="text-sm">Écrivez votre première page émotionnelle ✨</p>
      </div>
    );
  }

  const currentEntry = entries[currentIndex];
  const preciousCount = entries.filter(e => e.is_precious).length;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Stats en haut */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-sm text-white/60">
          {currentIndex + 1} / {entries.length} pages
        </div>
        {preciousCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <Sparkles className="w-4 h-4" />
            <span>{preciousCount} précieuses</span>
          </div>
        )}
      </div>

      {/* Carrousel principal */}
      <div className="relative h-[400px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            <FloatingCard
              content={currentEntry.content}
              colorPalette={currentEntry.color_palette}
              badgeText={currentEntry.badge_text}
              isPrecious={currentEntry.is_precious}
              onClick={() => onCardClick?.(currentEntry)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contrôles de navigation */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Indicateurs de points */}
        <div className="flex gap-2">
          {entries.slice(Math.max(0, currentIndex - 2), Math.min(entries.length, currentIndex + 3)).map((_, idx) => {
            const actualIndex = Math.max(0, currentIndex - 2) + idx;
            return (
              <motion.div
                key={actualIndex}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  actualIndex === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/30'
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  setDirection(actualIndex > currentIndex ? 1 : -1);
                  setCurrentIndex(actualIndex);
                }}
              />
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Instructions swipe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4 text-sm text-white/50"
      >
        ← Swipe pour naviguer →
      </motion.div>
    </div>
  );
}
