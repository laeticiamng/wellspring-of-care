import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface StoryTheatreCurtainProps {
  isOpen: boolean;
  onComplete: () => void;
  storyTitle: string;
}

export const StoryTheatreCurtain = ({
  isOpen,
  onComplete,
  storyTitle,
}: StoryTheatreCurtainProps) => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleCurtainOpen = () => {
    // Generate sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 overflow-hidden">
      {/* Stage Lights */}
      <motion.div
        className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-yellow-300/20 blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-blue-300/20 blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.5,
        }}
      />

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </AnimatePresence>

      {/* Left Curtain */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-900 via-red-800 to-red-700 border-r-4 border-yellow-600/50"
        initial={{ x: 0 }}
        animate={{
          x: isOpen ? "-100%" : 0,
        }}
        transition={{
          duration: 2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        onAnimationComplete={() => isOpen && handleCurtainOpen()}
        style={{
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Curtain Folds */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent bg-[length:50px_100%] animate-[shimmer_3s_linear_infinite]" />
        <div className="absolute inset-y-0 right-0 w-1 bg-yellow-600/30" />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900 via-red-800 to-red-700 border-l-4 border-yellow-600/50"
        initial={{ x: 0 }}
        animate={{
          x: isOpen ? "100%" : 0,
        }}
        transition={{
          duration: 2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        style={{
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Curtain Folds */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-transparent bg-[length:50px_100%] animate-[shimmer_3s_linear_infinite]" />
        <div className="absolute inset-y-0 left-0 w-1 bg-yellow-600/30" />
      </motion.div>

      {/* Title Placard */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <div className="relative p-8 bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 rounded-2xl border-4 border-yellow-600/50 shadow-2xl">
              {/* Ornamental Corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

              <h2 className="text-4xl font-bold text-yellow-100 text-center whitespace-nowrap">
                {storyTitle}
              </h2>
              <div className="mt-2 text-center text-sm text-yellow-300/80">
                Une histoire immersive
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Floor */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-950/80 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      />

      {/* Start Button */}
      {!isOpen && (
        <motion.button
          onClick={onComplete}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Commencer l'histoire
        </motion.button>
      )}
    </div>
  );
};
