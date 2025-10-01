import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FloatingCardProps {
  content: string;
  colorPalette: {
    primary: string;
    secondary: string;
  };
  badgeText?: string;
  isPrecious: boolean;
  onClick?: () => void;
}

export function FloatingCard({ content, colorPalette, badgeText, isPrecious, onClick }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.secondary})`,
      }}
    >
      <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 shadow-xl border border-white/20 overflow-hidden min-h-[200px]">
        {/* Effet de lueur pour pages précieuses */}
        {isPrecious && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
          </>
        )}

        {/* Contenu */}
        <div className="relative z-10">
          <p className="text-white/90 text-lg leading-relaxed line-clamp-4">
            {content}
          </p>
        </div>

        {/* Badge émotionnel */}
        {badgeText && (
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <p className="text-white/80 text-sm text-center font-medium">
                {badgeText}
              </p>
            </div>
          </motion.div>
        )}

        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}
