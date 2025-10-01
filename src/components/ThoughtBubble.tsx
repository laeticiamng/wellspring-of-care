import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";

interface ThoughtBubbleProps {
  text: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  onCollect: () => void;
  delay?: number;
}

export function ThoughtBubble({ text, emoji, rarity, onCollect, delay = 0 }: ThoughtBubbleProps) {
  const rarityConfig = {
    common: {
      glow: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      icon: null,
      halo: false
    },
    rare: {
      glow: "rgba(147, 51, 234, 0.3)",
      border: "rgba(147, 51, 234, 0.5)",
      icon: Sparkles,
      halo: true
    },
    legendary: {
      glow: "rgba(251, 191, 36, 0.4)",
      border: "rgba(251, 191, 36, 0.6)",
      icon: Star,
      halo: true
    }
  };

  const config = rarityConfig[rarity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ 
        delay, 
        duration: 0.6,
        ease: "easeOut"
      }}
      className="relative"
    >
      {/* Halo pour rare/legendary */}
      {config.halo && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ 
            background: config.glow,
            transform: 'scale(1.5)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.4, 1.6, 1.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Bulle principale */}
      <motion.button
        onClick={onCollect}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-background/40 backdrop-blur-xl border-2 rounded-3xl p-8 text-center cursor-pointer transition-all hover:bg-background/50"
        style={{
          borderColor: config.border,
          boxShadow: `0 10px 40px ${config.glow}`
        }}
      >
        {/* Icône de rareté */}
        {Icon && (
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon 
              className={`w-6 h-6 ${rarity === 'legendary' ? 'text-yellow-400' : 'text-purple-400'}`}
              fill="currentColor"
            />
          </motion.div>
        )}

        {/* Emoji */}
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {emoji}
        </motion.div>

        {/* Texte */}
        <p className="text-xl font-medium text-foreground">
          {text}
        </p>

        {/* Badge de rareté */}
        {rarity !== 'common' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 }}
            className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              rarity === 'legendary' 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}
          >
            <Zap className="w-3 h-3" />
            {rarity === 'legendary' ? 'Légendaire' : 'Rare'}
          </motion.div>
        )}

        {/* Particules flottantes */}
        {config.halo && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-current"
                style={{
                  top: `${20 + i * 30}%`,
                  left: `${10 + i * 35}%`,
                  color: rarity === 'legendary' ? '#fbbf24' : '#a855f7'
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </>
        )}
      </motion.button>
    </motion.div>
  );
}