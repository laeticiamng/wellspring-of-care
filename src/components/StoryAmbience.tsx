import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StoryAmbienceProps {
  theme: string;
  colorPrimary: string;
  colorSecondary: string;
  particleType?: string;
  intensity?: number;
}

export function StoryAmbience({
  theme,
  colorPrimary,
  colorSecondary,
  particleType = 'fireflies',
  intensity = 50,
}: StoryAmbienceProps) {
  const [particles, setParticles] = useState<Array<{ 
    x: number; 
    y: number; 
    size: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Générer des particules selon le type
    const count = Math.floor(intensity / 2);
    const newParticles = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, [intensity, particleType]);

  const getParticleAnimation = () => {
    switch (particleType) {
      case 'fireflies':
        return {
          y: [0, -30, 0],
          x: [-10, 10, -10],
          opacity: [0.3, 0.9, 0.3],
        };
      case 'stardust':
        return {
          y: [0, -50],
          opacity: [0.8, 0],
        };
      case 'embers':
        return {
          y: [0, -40],
          x: [-5, 5],
          opacity: [0.6, 0],
        };
      default:
        return {
          y: [0, -20, 0],
          opacity: [0.4, 0.8, 0.4],
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Gradient de fond */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${colorPrimary}15, ${colorSecondary}05, transparent)`,
        }}
      />

      {/* Nebula effect */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px]"
        style={{
          background: colorPrimary,
          opacity: 0.1,
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]"
        style={{
          background: colorSecondary,
          opacity: 0.1,
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Particules */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: colorPrimary,
              boxShadow: `0 0 ${particle.size * 3}px ${colorPrimary}`,
            }}
            animate={getParticleAnimation()}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-full origin-top"
            style={{
              left: `${30 + i * 20}%`,
              background: `linear-gradient(to bottom, transparent, ${colorPrimary}30, transparent)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
