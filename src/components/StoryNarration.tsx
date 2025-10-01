import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StoryNarrationProps {
  text: string;
  subtitlesEnabled?: boolean;
  onComplete?: () => void;
}

export function StoryNarration({
  text,
  subtitlesEnabled = true,
  onComplete,
}: StoryNarrationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Vitesse d'affichage

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onComplete]);

  // Reset quand le texte change
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  if (!subtitlesEnabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          {/* Fond avec blur */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md rounded-2xl shadow-2xl" />
          
          {/* Contenu */}
          <div className="relative p-6">
            <p className="text-lg leading-relaxed text-center">
              {displayedText}
              {currentIndex < text.length && (
                <motion.span
                  className="inline-block w-1 h-5 ml-1 bg-primary"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </p>
          </div>

          {/* Bordure lumineuse */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: '0 0 20px rgba(var(--primary), 0.3)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(var(--primary), 0.3)',
                '0 0 30px rgba(var(--primary), 0.5)',
                '0 0 20px rgba(var(--primary), 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
