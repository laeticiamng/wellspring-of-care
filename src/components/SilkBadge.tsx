import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SilkBadgeProps {
  badge: string;
}

export function SilkBadge({ badge }: SilkBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="relative"
    >
      <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-lg">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center gap-3 text-primary mb-4"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        
        <h3 className="text-2xl md:text-3xl font-light text-center text-foreground">
          {badge}
        </h3>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          Tes yeux te remercient
        </p>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
