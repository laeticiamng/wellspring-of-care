import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface InteractiveMaskProps {
  emotion: string;
  intensity: number;
  onInteract: () => void;
}

export const InteractiveMask = ({ emotion, intensity, onInteract }: InteractiveMaskProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const getMaskShape = () => {
    const shapes = {
      joy: "😊",
      sad: "😢",
      anger: "😠",
      fear: "😨",
      surprise: "😮",
      calm: "😌",
      default: "😐",
    };
    return shapes[emotion as keyof typeof shapes] || shapes.default;
  };

  const getMaskColor = () => {
    const colors = {
      joy: "from-yellow-400 via-orange-400 to-pink-400",
      sad: "from-blue-400 via-cyan-400 to-indigo-400",
      anger: "from-red-400 via-orange-500 to-yellow-400",
      fear: "from-purple-400 via-indigo-500 to-blue-400",
      surprise: "from-pink-400 via-purple-400 to-cyan-400",
      calm: "from-green-400 via-emerald-400 to-teal-400",
      default: "from-gray-400 via-slate-400 to-zinc-400",
    };
    return colors[emotion as keyof typeof colors] || colors.default;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative w-48 h-64 cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onInteract}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Mask Back */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/20"
          style={{
            transform: "translateZ(-20px)",
          }}
        />

        {/* Mask Front */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getMaskColor()} border-2 border-white/10 overflow-hidden`}
          style={{
            boxShadow: isHovered
              ? "0 20px 60px -10px rgba(168, 85, 247, 0.5)"
              : "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />

          {/* Emoji Face */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-8xl"
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                duration: 0.6,
                repeat: isHovered ? Infinity : 0,
              }}
            >
              {getMaskShape()}
            </motion.div>
          </div>

          {/* Particles */}
          {isHovered &&
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/60"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 4) * 100],
                  y: [0, Math.sin((i * Math.PI) / 4) * 100],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}

          {/* Intensity Indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/80"
                initial={{ width: 0 }}
                animate={{ width: `${intensity * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Glow Rings */}
          {isHovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-white/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-white/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
            </>
          )}
        </motion.div>

        {/* Label */}
        <motion.div
          className="absolute -bottom-8 left-0 right-0 text-center text-sm font-semibold text-white"
          style={{
            transform: "translateZ(30px)",
          }}
        >
          {emotion}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
