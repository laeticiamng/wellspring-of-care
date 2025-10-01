import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface HouseAvatarProps {
  lightIntensity?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const HouseAvatar = ({ lightIntensity = 0, size = 'md', showLabel = false }: HouseAvatarProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const intensity = Math.min(lightIntensity, 100);
  const glowOpacity = Math.min(intensity / 100, 0.8);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`${sizeClasses[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20`}
        animate={{
          boxShadow: [
            `0 0 ${20 * glowOpacity}px hsla(var(--primary), ${glowOpacity})`,
            `0 0 ${30 * glowOpacity}px hsla(var(--primary), ${glowOpacity * 0.8})`,
            `0 0 ${20 * glowOpacity}px hsla(var(--primary), ${glowOpacity})`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Home 
          className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} text-primary`}
          style={{ filter: `brightness(${1 + intensity / 50})` }}
        />
        
        {/* Particules lumineuses */}
        {intensity > 20 && (
          <>
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-primary"
              animate={{
                y: [-10, -20],
                opacity: [0.8, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              style={{ top: '20%', left: '30%' }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-accent"
              animate={{
                y: [-10, -20],
                opacity: [0.8, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.8,
                delay: 0.3,
              }}
              style={{ top: '20%', right: '30%' }}
            />
          </>
        )}
      </motion.div>

      {showLabel && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {intensity > 0 ? `Luminosité: ${intensity}` : 'Première lumière ?'}
          </p>
        </div>
      )}
    </div>
  );
};
