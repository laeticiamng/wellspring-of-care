import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenSilkScene } from './ScreenSilkScene';
import { SilkBadge } from './SilkBadge';
import { Button } from './ui/button';
import { Eye, Sparkles, Pause } from 'lucide-react';

interface PauseSequenceProps {
  onComplete: (durationSeconds: number) => void;
  onSkip?: () => void;
}

type Phase = 'intro' | 'blink' | 'horizon' | 'rest' | 'complete';

export function PauseSequence({ onComplete, onSkip }: PauseSequenceProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [startTime] = useState(Date.now());
  const [badge, setBadge] = useState<string | null>(null);

  const phaseConfig = {
    intro: { duration: 2500, next: 'blink', text: 'Une pause pour tes yeux 🌙' },
    blink: { duration: 8000, next: 'horizon', text: 'Cligne doucement des yeux...' },
    horizon: { duration: 10000, next: 'rest', text: 'Regarde au loin, vers l\'horizon...' },
    rest: { duration: 15000, next: 'complete', text: 'Laisse tes yeux se reposer...' },
    complete: { duration: 0, next: null, text: 'Pause terminée ✨' }
  };

  useEffect(() => {
    const config = phaseConfig[phase];
    if (!config.next) return;

    const timer = setTimeout(() => {
      if (config.next === 'complete') {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const tempBadge = ["Regard reposé 👁️", "Vision apaisée 🌿", "Clarté revenue ✨"][
          Math.floor(Math.random() * 3)
        ];
        setBadge(tempBadge);
        setTimeout(() => {
          onComplete(duration);
        }, 3000);
      }
      setPhase(config.next as Phase);
    }, config.duration);

    return () => clearTimeout(timer);
  }, [phase, startTime, onComplete]);

  const getIcon = () => {
    switch (phase) {
      case 'blink':
        return <Eye className="w-6 h-6" />;
      case 'horizon':
        return <Sparkles className="w-6 h-6" />;
      case 'rest':
        return <Pause className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen">
      <ScreenSilkScene 
        phase={phase} 
        onPhaseComplete={() => {
          // Scene animation complete callback if needed
        }}
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
        <AnimatePresence mode="wait">
          {phase !== 'complete' ? (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{
                  scale: phase === 'blink' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: phase === 'blink' ? Infinity : 0,
                }}
                className="flex justify-center text-primary"
              >
                {getIcon()}
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-light text-foreground">
                {phaseConfig[phase].text}
              </h2>

              {phase === 'intro' && (
                <p className="text-muted-foreground text-sm">
                  Séquence de 30 secondes pour reposer tes yeux
                </p>
              )}

              {phase !== 'intro' && onSkip && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const duration = Math.floor((Date.now() - startTime) / 1000);
                    onSkip();
                    onComplete(duration);
                  }}
                  className="mt-8 text-muted-foreground hover:text-foreground"
                >
                  Passer
                </Button>
              )}
            </motion.div>
          ) : (
            badge && <SilkBadge badge={badge} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
