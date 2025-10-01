import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BreathingBubbleProps {
  breathLevel: number;
  isActive: boolean;
  onBreathCycle?: () => void;
}

export default function BreathingBubble({ breathLevel, isActive, onBreathCycle }: BreathingBubbleProps) {
  const [previousLevel, setPreviousLevel] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
  // Détection de cycle respiratoire complet
  useEffect(() => {
    if (breathLevel > 0.7 && previousLevel <= 0.7) {
      onBreathCycle?.();
    }
    setPreviousLevel(breathLevel);
  }, [breathLevel, previousLevel, onBreathCycle]);

  // Générer particules cosmiques
  useEffect(() => {
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);
  
  const scale = 1 + (breathLevel * 1.2);
  const glow = breathLevel > 0.6 ? 'shadow-glow-intense' : 'shadow-glow';
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Halo externe */}
      <motion.div
        animate={{
          scale: isActive ? scale * 1.3 : 1,
          opacity: breathLevel * 0.4
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
        className="absolute inset-0 rounded-full bg-gradient-radial from-primary/30 via-accent/20 to-transparent blur-2xl"
      />
      
      {/* Sphère principale */}
      <motion.div
        animate={{
          scale: isActive ? scale : 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary/60 via-accent/50 to-primary/40 backdrop-blur-xl border-2 border-primary/40 ${glow}`}
      >
        {/* Ondes intérieures */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full border-2 border-accent/30"
          />
        ))}
      </motion.div>
      
      {/* Particules cosmiques */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          animate={{
            x: [particle.x, particle.x * 1.5, particle.x],
            y: [particle.y, particle.y * 1.5, particle.y],
            opacity: [0, breathLevel, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-accent/80"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`
          }}
        />
      ))}
      
      {/* Noyau lumineux */}
      <motion.div
        animate={{
          scale: isActive ? breathLevel * 0.8 : 0.3,
          opacity: breathLevel > 0.5 ? 1 : 0.5
        }}
        transition={{
          duration: 0.3
        }}
        className="absolute inset-20 rounded-full bg-gradient-radial from-white/90 via-accent/60 to-transparent"
      />
    </div>
  );
}
