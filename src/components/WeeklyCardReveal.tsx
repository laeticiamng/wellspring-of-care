import { motion } from 'framer-motion';
import { Sparkles, Flame, Waves, Sprout, Moon, Star, Wind, Home, Sunrise } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WeeklyCard } from '@/hooks/useWeeklyCard';
import { useCardSounds } from '@/hooks/useCardSounds';

interface WeeklyCardRevealProps {
  card: WeeklyCard;
  onRevealComplete?: () => void;
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

export const WeeklyCardReveal = ({ card, onRevealComplete }: WeeklyCardRevealProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHalo, setShowHalo] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);
  const { playRevealSound } = useCardSounds();
  
  const CardIcon = IconMap[card.icon_name] || Sparkles;

  useEffect(() => {
    // Vibration haptic + son initial
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Déclencher les sons immersifs
    playRevealSound({ rarity: card.rarity });

    // Flip après 500ms
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    }, 500);

    // Halo après flip
    const haloTimer = setTimeout(() => {
      setShowHalo(true);
      // Générer particules explosives
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        angle: (i / 30) * 360,
        distance: 100 + Math.random() * 50
      }));
      setParticles(newParticles);
    }, 1700);

    // Les sons sont déjà gérés par playRevealSound

    // Complétion après toutes les animations
    const completeTimer = setTimeout(() => {
      onRevealComplete?.();
    }, 4000);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(haloTimer);
      clearTimeout(completeTimer);
    };
  }, [card.rarity, playRevealSound]);

  // Couleur de rareté
  const rarityGlow = {
    common: 'shadow-lg shadow-primary/50',
    rare: 'shadow-xl shadow-blue-500/60',
    epic: 'shadow-2xl shadow-purple-500/70',
    legendary: 'shadow-2xl shadow-yellow-500/80 animate-pulse'
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Halo cosmique */}
      {showHalo && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, ${card.color_primary}40 0%, transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          />
          
          {/* Particules explosives */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: card.color_secondary,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Carte avec flip */}
      <motion.div
        className="relative w-64 h-96 preserve-3d cursor-pointer"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Face arrière */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            background: `linear-gradient(135deg, ${card.color_primary}, ${card.color_secondary})`,
          }}
        >
          <div className="absolute inset-4 border-2 border-white/40 rounded-xl flex items-center justify-center">
            <Sparkles className="w-20 h-20 text-white/60" />
          </div>
        </div>

        {/* Face avant */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl ${rarityGlow[card.rarity]} overflow-hidden`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg, ${card.color_primary}, ${card.color_secondary})`,
          }}
        >
          {/* Contenu de la carte */}
          <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
            {/* Icône principale */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isFlipped ? 1 : 0 }}
              transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
            >
              <CardIcon className="w-24 h-24 mb-4 drop-shadow-lg" />
            </motion.div>

            {/* Mantra */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
                {card.mantra} {card.mantra_emoji}
              </h2>
              <p className="text-sm font-medium opacity-90 px-4">
                Carte {card.rarity === 'legendary' ? 'légendaire' : card.rarity === 'epic' ? 'épique' : card.rarity === 'rare' ? 'rare' : 'commune'}
              </p>
            </motion.div>

            {/* Effet de brillance */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isFlipped ? '200%' : '-100%' }}
              transition={{ delay: 2, duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
