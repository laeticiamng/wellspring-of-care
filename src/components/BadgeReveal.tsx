import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Badge {
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

interface BadgeRevealProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeReveal = ({ badge, onClose }: BadgeRevealProps) => {
  const rarityConfig = {
    common: {
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-glow',
      particles: 8
    },
    rare: {
      gradient: 'from-blue-400 to-cyan-600',
      glow: 'shadow-glow-intense',
      particles: 12
    },
    epic: {
      gradient: 'from-purple-400 via-pink-500 to-purple-600',
      glow: 'shadow-glow-intense',
      particles: 16
    },
    legendary: {
      gradient: 'from-yellow-300 via-amber-400 to-orange-500',
      glow: 'shadow-glow-legendary',
      particles: 24
    }
  };

  const config = rarityConfig[badge.rarity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.5, rotateY: -180 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className={`border-0 ${config.glow} bg-gradient-to-br from-blue-950 to-indigo-950 backdrop-blur-xl max-w-md relative overflow-hidden`}>
          <CardContent className="pt-8 pb-8 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="text-center space-y-6">
              {/* Badge Icon */}
              <motion.div
                className="relative inline-block"
                animate={{
                  rotate: badge.rarity === 'legendary' ? [0, 360] : [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: badge.rarity === 'legendary' ? 3 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className={`text-9xl drop-shadow-2xl ${config.glow}`}>
                  {badge.emoji}
                </div>
                
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 blur-3xl rounded-full -z-10`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>

              {/* Title */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mb-2"
                >
                  <Sparkles className={`h-5 w-5 text-${badge.rarity === 'legendary' ? 'yellow' : 'cyan'}-400`} />
                  <p className={`text-sm font-bold uppercase tracking-wider bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                    {badge.rarity}
                  </p>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {badge.name}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 text-sm max-w-xs mx-auto"
                >
                  {badge.description}
                </motion.p>
              </div>

              {/* Confetti message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`p-4 rounded-lg bg-gradient-to-r ${config.gradient} bg-opacity-20 border border-white/20`}
              >
                <p className="text-white font-semibold">
                  🎉 Nouveau badge débloqué !
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Consulte ton coffre au trésor marin
                </p>
              </motion.div>
            </div>
          </CardContent>

          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: config.particles }).map((_, i) => {
              const angle = (i / config.particles) * Math.PI * 2;
              return (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${config.gradient}`}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos(angle) * 150,
                    y: Math.sin(angle) * 150,
                    opacity: [1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BadgeReveal;
