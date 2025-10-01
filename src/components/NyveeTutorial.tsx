import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles } from 'lucide-react';

interface NyveeTutorialProps {
  onComplete: () => void;
}

export function NyveeTutorial({ onComplete }: NyveeTutorialProps) {
  const [step, setStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('nyvee_tutorial_seen');
    if (seen === 'true') {
      setHasSeenTutorial(true);
      onComplete();
    }
  }, [onComplete]);

  const steps = [
    {
      title: 'Bienvenue dans Nyvée',
      description: 'Ton refuge émotionnel personnel. Un cocon pour respirer quand ça monte.',
      emoji: '🫧',
    },
    {
      title: 'Suis la bulle',
      description: 'La bulle gonfle = inspire. La bulle rétrécit = expire. C\'est tout.',
      emoji: '💫',
    },
    {
      title: 'Active le micro (optionnel)',
      description: 'La bulle se synchronisera avec ta vraie respiration. Magique.',
      emoji: '🎤',
    },
    {
      title: 'Collecte des cocons rares',
      description: 'Chaque session peut débloquer un cocon unique. Collectionne-les tous !',
      emoji: '✨',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('nyvee_tutorial_seen', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('nyvee_tutorial_seen', 'true');
    onComplete();
  };

  if (hasSeenTutorial) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative max-w-md mx-4 p-8 bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 rounded-3xl border-2 border-white/30 shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* Bouton fermer */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Contenu */}
          <div className="text-center space-y-6">
            <motion.div
              key={step}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-8xl"
            >
              {steps[step].emoji}
            </motion.div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {steps[step].title}
              </h2>
              <p className="text-white/80 leading-relaxed">
                {steps[step].description}
              </p>
            </div>

            {/* Indicateurs de progression */}
            <div className="flex justify-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {step > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 text-white hover:bg-white/10"
                >
                  Retour
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border border-white/30"
              >
                {step === steps.length - 1 ? (
                  <>
                    Commencer
                    <Sparkles className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {step === 0 && (
              <button
                onClick={handleSkip}
                className="text-white/50 hover:text-white/70 text-sm transition-colors"
              >
                Passer le tutoriel
              </button>
            )}
          </div>

          {/* Particules décoratives */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
