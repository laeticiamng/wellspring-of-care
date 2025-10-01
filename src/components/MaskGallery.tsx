import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MaskOption {
  id: string;
  emoji: string;
  theme: string;
  gradient: string;
  floating: { x: number; y: number; rotate: number };
}

const MASKS: MaskOption[] = [
  { id: 'warm', emoji: '🔥', theme: 'Chaleureux', gradient: 'from-orange-500 to-red-500', floating: { x: -20, y: -15, rotate: -15 } },
  { id: 'cool', emoji: '❄️', theme: 'Apaisant', gradient: 'from-blue-500 to-cyan-500', floating: { x: 15, y: -10, rotate: 10 } },
  { id: 'nature', emoji: '🌿', theme: 'Nature', gradient: 'from-green-500 to-emerald-500', floating: { x: -15, y: 10, rotate: -8 } },
  { id: 'cosmos', emoji: '✨', theme: 'Cosmique', gradient: 'from-purple-500 to-pink-500', floating: { x: 20, y: 15, rotate: 12 } },
];

const GESTURES = [
  { id: 'long_exhale', emoji: '🌬️', name: 'Expiration longue' },
  { id: 'shake', emoji: '💫', name: 'Secouer' },
  { id: 'breathe', emoji: '🫁', name: 'Respirer' },
];

interface MaskGalleryProps {
  onThemeSelect: (theme: string) => void;
  onGestureSelect: (gesture: string) => void;
  selectedTheme: string;
  selectedGesture: string;
}

export function MaskGallery({ onThemeSelect, onGestureSelect, selectedTheme, selectedGesture }: MaskGalleryProps) {
  const [hoveredMask, setHoveredMask] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 space-y-12">
        {/* Floating masks selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Choisis ton thème</h2>
            <p className="text-muted-foreground">Chaque masque capte une essence différente</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {MASKS.map((mask, index) => {
              const isSelected = selectedTheme === mask.id;
              const isHovered = hoveredMask === mask.id;

              return (
                <motion.button
                  key={mask.id}
                  onClick={() => onThemeSelect(mask.id)}
                  onHoverStart={() => setHoveredMask(mask.id)}
                  onHoverEnd={() => setHoveredMask(null)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: isHovered ? mask.floating.x * 0.5 : 0,
                    y: isHovered ? mask.floating.y * 0.5 : 0,
                    rotate: isHovered ? mask.floating.rotate * 0.5 : 0,
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className={`
                    relative p-8 rounded-2xl bg-gradient-to-br ${mask.gradient}
                    transition-all duration-300 group
                    ${isSelected ? 'ring-4 ring-primary scale-110 shadow-2xl' : 'opacity-70 hover:opacity-100'}
                  `}
                >
                  {/* Glow effect */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <motion.div
                    className="text-6xl mb-3"
                    animate={{
                      rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                      scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {mask.emoji}
                  </motion.div>
                  <p className="text-white font-semibold text-sm">{mask.theme}</p>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Gesture selection */}
        {selectedTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Choisis ton geste</h2>
              <p className="text-muted-foreground">Comment te sens-tu maintenant ?</p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {GESTURES.map((gesture, index) => {
                const isSelected = selectedGesture === gesture.id;

                return (
                  <motion.button
                    key={gesture.id}
                    onClick={() => onGestureSelect(gesture.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      p-6 rounded-xl bg-card border-2 transition-all
                      ${isSelected ? 'border-primary scale-105 shadow-xl' : 'border-muted hover:border-primary/50'}
                    `}
                  >
                    <motion.div
                      className="text-5xl mb-2"
                      animate={isSelected ? {
                        rotate: [0, -5, 5, -5, 0],
                      } : {}}
                      transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0, repeatDelay: 1 }}
                    >
                      {gesture.emoji}
                    </motion.div>
                    <p className="font-semibold text-sm">{gesture.name}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
