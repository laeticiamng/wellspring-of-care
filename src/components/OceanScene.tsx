import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
}

interface OceanSceneProps {
  breathPhase: 'idle' | 'inhale' | 'hold' | 'exhale';
  anxietyLevel: number; // 0-1
  cyclesCompleted: number;
  isActive: boolean;
}

const OceanScene = ({ breathPhase, anxietyLevel, cyclesCompleted, isActive }: OceanSceneProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mainBubbleY, setMainBubbleY] = useState(60);

  // Generate ambient bubbles
  useEffect(() => {
    const newBubbles: Bubble[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 10 + Math.random() * 30,
      speed: 2 + Math.random() * 3,
      delay: Math.random() * 5
    }));
    setBubbles(newBubbles);
  }, []);

  // Main bubble animation based on breath phase
  useEffect(() => {
    if (breathPhase === 'inhale') {
      setMainBubbleY(20); // Rise up
    } else if (breathPhase === 'exhale') {
      setMainBubbleY(60); // Return down
      
      // Generate explosion particles
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: 50,
        y: 30,
        angle: (i / 12) * Math.PI * 2,
        speed: 30 + Math.random() * 20
      }));
      setParticles(prev => [...prev, ...newParticles].slice(-50));
    }
  }, [breathPhase]);

  // Ocean color based on anxiety level
  const getOceanColor = () => {
    if (anxietyLevel > 0.6) return 'from-slate-900 via-blue-950 to-indigo-950'; // Dark/anxious
    if (anxietyLevel > 0.3) return 'from-blue-900 via-cyan-900 to-teal-900'; // Medium
    return 'from-cyan-800 via-blue-800 to-indigo-800'; // Calm/clear
  };

  // Wave speed based on anxiety
  const waveSpeed = anxietyLevel > 0.5 ? 8 : 15;

  return (
    <div className={`relative w-full h-screen bg-gradient-to-b ${getOceanColor()} overflow-hidden rounded-lg transition-colors duration-1000`}>
      {/* Light rays */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute top-0 w-1 h-full bg-gradient-to-b from-white/40 to-transparent"
            style={{
              left: `${20 + i * 20}%`,
              transformOrigin: 'top'
            }}
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Waves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute bottom-0 w-[200%] h-32 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, rgba(96, 165, 250, 0.4), transparent)`,
            bottom: `${i * 15}%`
          }}
          animate={{
            x: [-100, 0],
          }}
          transition={{
            duration: waveSpeed + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 1200 100" className="w-full h-full">
            <path
              d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z"
              fill="rgba(96, 165, 250, 0.3)"
            />
          </svg>
        </motion.div>
      ))}

      {/* Ambient bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-400/40 backdrop-blur-sm border border-white/30"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
          }}
          animate={{
            y: [`${bubble.y}%`, '-10%'],
            x: [0, (Math.random() - 0.5) * 50, 0],
            scale: [1, 1.1, 1],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: bubble.speed * 3,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut"
          }}
        >
          {/* Bubble highlight */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/60" />
        </motion.div>
      ))}

      {/* Main breath bubble */}
      {isActive && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          animate={{
            y: `${mainBubbleY}%`,
          }}
          transition={{
            duration: breathPhase === 'hold' ? 0 : 2,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className={`w-40 h-40 rounded-full bg-gradient-to-br ${
              breathPhase === 'inhale' ? 'from-cyan-200 to-blue-400' :
              breathPhase === 'hold' ? 'from-blue-200 to-purple-400' :
              'from-teal-200 to-cyan-400'
            } shadow-glow-legendary border-4 border-white/50 backdrop-blur-xl`}
            animate={{
              scale: breathPhase === 'inhale' ? 1.3 :
                     breathPhase === 'hold' ? 1.3 :
                     breathPhase === 'exhale' ? 0.8 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-4 rounded-full bg-white/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            
            {/* Highlight */}
            <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/60 blur-md" />
            
            {/* Ripples on exhale */}
            {breathPhase === 'exhale' && Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`ripple-${i}`}
                className="absolute inset-0 rounded-full border-2 border-cyan-300"
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.6, 0, 0]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Explosion particles on exhale */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(particle.angle) * particle.speed,
            y: Math.sin(particle.angle) * particle.speed,
            opacity: 0,
            scale: [1, 1.5, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Floating jellyfish (decorative) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`jellyfish-${i}`}
          className="absolute opacity-20"
          style={{
            left: `${20 + i * 30}%`,
            width: '60px',
            height: '80px'
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-8 bg-gradient-to-b from-purple-300/40 to-transparent rounded-full" />
          <div className="flex gap-1 justify-center mt-1">
            {Array.from({ length: 4 }).map((_, j) => (
              <motion.div
                key={j}
                className="w-1 h-12 bg-purple-300/30 rounded-full"
                animate={{
                  scaleY: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: j * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Bottom seaweed */}
      <div className="absolute bottom-0 w-full h-32 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`seaweed-${i}`}
            className="absolute bottom-0 w-2 bg-gradient-to-t from-emerald-700 to-transparent"
            style={{
              left: `${10 + i * 12}%`,
              height: `${40 + Math.random() * 40}px`
            }}
            animate={{
              rotate: [-5, 5, -5],
              scaleX: [1, 1.1, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Cycle counter */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-6xl font-bold text-white drop-shadow-lg">
          {cyclesCompleted}
        </p>
        <p className="text-sm text-cyan-300 mt-1">cycles respiratoires</p>
      </motion.div>
    </div>
  );
};

export default OceanScene;
