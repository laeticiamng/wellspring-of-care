import { motion } from 'framer-motion';
import { Sparkles, Flame, Waves, Sprout, Moon, Star, Wind, Home, Sunrise } from 'lucide-react';
import { WeeklyCard } from '@/hooks/useWeeklyCard';

interface FloatingCardProps {
  card: WeeklyCard;
}

const IconMap: Record<string, any> = {
  Sparkles,
  Flame,
  Waves,
  Sprout,
  Moon,
  Star,
  Wind,
  Home,
  Sunrise,
  Stars: Sparkles,
  Sun: Star
};

export const FloatingCard = ({ card }: FloatingCardProps) => {
  const CardIcon = IconMap[card.icon_name] || Sparkles;

  return (
    <motion.div
      className="fixed top-24 right-6 z-10 w-32 h-48"
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: [0.4, 0.6, 0.4],
        x: 0,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: {
          duration: 3,
          repeat: Infinity,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div
        className="relative w-full h-full rounded-xl shadow-lg overflow-hidden backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${card.color_primary}80, ${card.color_secondary}80)`,
        }}
      >
        {/* Halo subtil */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${card.color_primary}60, transparent 70%)`,
          }}
        />
        
        {/* Contenu */}
        <div className="relative h-full flex flex-col items-center justify-center p-3 text-white">
          <CardIcon className="w-12 h-12 mb-2 drop-shadow-md" />
          <p className="text-xs font-semibold text-center">
            {card.mantra}
          </p>
          <p className="text-lg">{card.mantra_emoji}</p>
        </div>

        {/* Brillance */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </div>
    </motion.div>
  );
};
