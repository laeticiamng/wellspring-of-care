import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BadgeRevealProps {
  badge: string;
  badgeColor: string;
  badgeEmoji: string;
  reductionPercent: number;
  cocoonUnlocked: string | null;
  nextAction: 'silence' | 'anchor' | 'flashglow';
  onContinue: (action: string) => void;
  onRestart: () => void;
}

export function BadgeReveal({
  badge,
  badgeColor,
  badgeEmoji,
  reductionPercent,
  cocoonUnlocked,
  nextAction,
  onContinue,
  onRestart,
}: BadgeRevealProps) {
  const nextActionLabels = {
    silence: 'Prolonger le silence',
    anchor: 'Ancrage 5-4-3-2-1',
    flashglow: 'Flash Glow',
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 overflow-hidden">
      {/* Explosion de particules */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: badgeColor }}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.02,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Badge central */}
      <motion.div
        className="text-center z-10 px-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="text-9xl mb-8"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {badgeEmoji}
        </motion.div>

        <h2
          className="text-5xl font-bold mb-4"
          style={{ color: badgeColor }}
        >
          {badge}
        </h2>

        <p className="text-white/80 text-xl mb-6">
          Anxiété réduite de {reductionPercent}%
        </p>

        {cocoonUnlocked && (
          <motion.div
            className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-white/90 text-lg font-medium">
              Cocon rare débloqué !
            </p>
            <p className="text-white/60 text-sm mt-2 capitalize">
              Texture "{cocoonUnlocked}"
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-8">
          <Button
            size="lg"
            onClick={() => onContinue(nextAction)}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border border-white/30 shadow-glow"
          >
            {nextActionLabels[nextAction]}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            size="lg"
            variant="ghost"
            onClick={onRestart}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Recommencer
          </Button>
        </div>
      </motion.div>

      {/* Halo lumineux */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${badgeColor}20, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
