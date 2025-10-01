import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface MixVisualizerProps {
  valence: number;
  arousal: number;
  color: string;
  isStabilized: boolean;
}

export const MixVisualizer = ({ valence, arousal, color, isStabilized }: MixVisualizerProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Card className="max-w-2xl mx-auto border-0 shadow-glow p-8 bg-card/50 backdrop-blur-md relative overflow-hidden">
        {/* Central visualization */}
        <div className="relative h-64 flex items-center justify-center">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4"
            style={{ 
              borderColor: color,
              opacity: 0.3
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-8 rounded-full border-4"
            style={{ 
              borderColor: color,
              opacity: 0.5
            }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [360, 0]
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />

          {/* Inner core */}
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`
            }}
            animate={{
              scale: isStabilized ? [1, 1.2, 1] : 1,
              boxShadow: isStabilized 
                ? [`0 0 40px ${color}, 0 0 80px ${color}`, `0 0 60px ${color}, 0 0 120px ${color}`, `0 0 40px ${color}, 0 0 80px ${color}`]
                : `0 0 20px ${color}, 0 0 40px ${color}`
            }}
            transition={{
              duration: 1,
              repeat: isStabilized ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Frequency indicators inside core */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 bg-white/80 origin-bottom"
                  style={{
                    height: `${20 + (arousal / 100) * 30}px`,
                    transform: `rotate(${i * 30}deg) translateY(-${40 + (arousal / 100) * 20}px)`
                  }}
                  animate={{
                    scaleY: [1, 1 + (arousal / 200), 1]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                opacity: 0.6,
                left: '50%',
                top: '50%',
                transformOrigin: `${80 + i * 10}px 0px`
              }}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 4 - (arousal / 100),
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* Stats display */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Valence</p>
            <motion.p 
              className="text-2xl font-bold"
              style={{ color }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              {valence}%
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Arousal</p>
            <motion.p 
              className="text-2xl font-bold"
              style={{ color }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              {arousal}%
            </motion.p>
          </div>
        </div>

        {isStabilized && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-primary font-semibold animate-pulse-soft">
              ✨ Mix stabilisé - Prêt à sauvegarder
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
