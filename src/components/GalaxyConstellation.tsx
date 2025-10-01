import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  connected: boolean;
}

interface GalaxyConstellationProps {
  moodLevel: number;
  emotionType: string;
}

export const GalaxyConstellation = ({ moodLevel, emotionType }: GalaxyConstellationProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    const numStars = Math.round(10 + moodLevel * 15);
    const newStars: Star[] = Array.from({ length: numStars }, (_, i) => ({
      id: i,
      x: Math.random() * 600,
      y: Math.random() * 400,
      size: 2 + Math.random() * 4,
      brightness: 0.5 + Math.random() * 0.5,
      connected: false,
    }));
    setStars(newStars);

    // Create constellation connections
    const newConnections: [number, number][] = [];
    newStars.forEach((star, i) => {
      newStars.slice(i + 1).forEach((otherStar, j) => {
        const distance = Math.hypot(star.x - otherStar.x, star.y - otherStar.y);
        if (distance < 120 && Math.random() > 0.7) {
          newConnections.push([i, i + j + 1]);
        }
      });
    });
    setConnections(newConnections);
  }, [moodLevel]);

  const getConstellationColor = () => {
    const colors = {
      joy: "from-yellow-400 to-orange-400",
      calm: "from-blue-400 to-cyan-400",
      energy: "from-red-400 to-pink-400",
      focus: "from-purple-400 to-indigo-400",
      default: "from-white to-blue-200",
    };
    return colors[emotionType as keyof typeof colors] || colors.default;
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-950 rounded-2xl overflow-hidden border border-purple-500/20">
      {/* Nebula Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Shooting Stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: -50,
            y: Math.random() * 400,
            opacity: 0,
          }}
          animate={{
            x: 700,
            y: Math.random() * 400 + 50,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 5,
            repeat: Infinity,
            repeatDelay: 10,
          }}
          style={{
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
          }}
        />
      ))}

      {/* Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([i, j], idx) => {
          const star1 = stars[i];
          const star2 = stars[j];
          if (!star1 || !star2) return null;
          
          const isHovered = hoveredStar === i || hoveredStar === j;
          
          return (
            <motion.line
              key={`line-${idx}`}
              x1={star1.x}
              y1={star1.y}
              x2={star2.x}
              y2={star2.y}
              stroke="url(#lineGradient)"
              strokeWidth={isHovered ? 2 : 1}
              opacity={isHovered ? 0.8 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: idx * 0.05 }}
            />
          );
        })}
        <defs>
          <linearGradient id="lineGradient">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={`absolute rounded-full bg-gradient-to-br ${getConstellationColor()} cursor-pointer`}
          style={{
            left: star.x,
            top: star.y,
            width: star.size * 2,
            height: star.size * 2,
            boxShadow: hoveredStar === star.id
              ? `0 0 20px 4px rgba(168, 85, 247, 0.8)`
              : `0 0 ${star.size * 3}px ${star.size}px rgba(255, 255, 255, ${star.brightness})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: hoveredStar === star.id ? 2 : 1,
            opacity: star.brightness,
          }}
          transition={{
            scale: { duration: 0.3 },
            opacity: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          whileHover={{ scale: 2 }}
          onHoverStart={() => setHoveredStar(star.id)}
          onHoverEnd={() => setHoveredStar(null)}
        />
      ))}

      {/* Center Pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Info Overlay */}
      <div className="absolute top-4 left-4 p-4 bg-black/40 backdrop-blur rounded-lg border border-purple-500/30">
        <div className="text-xs text-purple-300 mb-1">Constellation Émotionnelle</div>
        <div className="text-sm font-semibold text-white">{emotionType}</div>
        <div className="text-xs text-blue-300 mt-2">
          {stars.length} étoiles · {connections.length} connexions
        </div>
      </div>
    </div>
  );
};
