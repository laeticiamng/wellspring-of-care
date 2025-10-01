import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AuraOrbProps {
  colorHue: number;
  luminosity: number;
  sizeScale: number;
  animationSpeed?: number;
  isRare?: boolean;
  rareType?: string | null;
  onClick?: () => void;
  position?: { x: number; y: number };
  showPulse?: boolean;
}

export function AuraOrb({
  colorHue,
  luminosity,
  sizeScale,
  animationSpeed = 1,
  isRare = false,
  rareType,
  onClick,
  position = { x: 0, y: 0 },
  showPulse = true,
}: AuraOrbProps) {
  const [glow, setGlow] = useState(luminosity);

  useEffect(() => {
    if (!showPulse) return;
    
    const interval = setInterval(() => {
      setGlow(prev => {
        const variation = Math.sin(Date.now() / (1000 * animationSpeed)) * 10;
        return Math.max(30, Math.min(100, luminosity + variation));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [luminosity, animationSpeed, showPulse]);

  const baseSize = 80 * sizeScale;
  
  // Couleur principale
  const mainColor = `hsl(${colorHue}, 70%, ${glow}%)`;
  
  // Couleurs pour auras rares
  const getRareGradient = () => {
    switch (rareType) {
      case 'cosmic':
        return 'radial-gradient(circle, #533483 0%, #16213e 50%, #0f3460 100%)';
      case 'prismatic':
        return 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b)';
      case 'aurora':
        return 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 33%, #00f260 66%, #0575e6 100%)';
      case 'starlight':
        return 'radial-gradient(circle, #fff59d 0%, #ffeb3b 50%, #ffd54f 100%)';
      default:
        return mainColor;
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        width: baseSize,
        height: baseSize,
      }}
      onClick={onClick}
      animate={{
        y: [0, -10, 0],
        scale: showPulse ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 3 / animationSpeed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: isRare ? getRareGradient() : mainColor,
          opacity: 0.4,
        }}
        animate={{
          scale: showPulse ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2 / animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Middle layer */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background: isRare ? getRareGradient() : mainColor,
          opacity: 0.6,
          transform: 'scale(0.7)',
        }}
      />
      
      {/* Core orb */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isRare ? getRareGradient() : mainColor,
          transform: 'scale(0.5)',
          boxShadow: `0 0 ${20 * sizeScale}px ${mainColor}`,
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute top-[20%] left-[30%] w-[30%] h-[30%] rounded-full bg-white/30 blur-sm"
        />
      </div>
      
      {/* Particles for rare auras */}
      {isRare && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/60"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 4) * baseSize],
                y: [0, Math.sin(i * Math.PI / 4) * baseSize],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
