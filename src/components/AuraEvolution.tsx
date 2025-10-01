import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles, Crown } from "lucide-react";

interface AuraEvolutionProps {
  level: number;
}

export const AuraEvolution = ({ level }: AuraEvolutionProps) => {
  const getAuraColor = () => {
    if (level <= 3) return "from-blue-500 to-cyan-500";
    if (level <= 6) return "from-purple-500 to-pink-500";
    if (level <= 8) return "from-yellow-500 to-orange-500";
    return "from-yellow-300 via-pink-500 to-purple-600";
  };

  const getAuraIcon = () => {
    if (level <= 3) return Trophy;
    if (level <= 6) return Sparkles;
    return Crown;
  };

  const AuraIcon = getAuraIcon();
  const auraColor = getAuraColor();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Card className="max-w-2xl mx-auto border-0 shadow-glow p-6 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-6">
          {/* Left accent */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>

          {/* Aura display */}
          <div className="relative">
            <motion.div
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${auraColor} flex items-center justify-center relative`}
              animate={{
                boxShadow: [
                  `0 0 20px rgba(var(--primary), 0.3)`,
                  `0 0 40px rgba(var(--primary), 0.6)`,
                  `0 0 20px rgba(var(--primary), 0.3)`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                transform: `scale(${1 + level * 0.05})`
              }}
            >
              <AuraIcon className="w-16 h-16 text-white" />
              
              {/* Orbiting particles */}
              {[...Array(level)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3 - (i * 0.2),
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: `${70 + i * 5}px 0px`
                  }}
                />
              ))}
            </motion.div>

            {/* Level badge */}
            <motion.div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${auraColor} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Niveau {level}
            </motion.div>
          </div>

          {/* Right accent */}
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        {/* Aura description */}
        <motion.div
          className="text-center mt-6 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Aura Héroïque
          </p>
          <p className="text-sm text-muted-foreground">
            {level <= 3 && "Ton aura commence à briller 🌟"}
            {level > 3 && level <= 6 && "Ton aura devient puissante ⚡"}
            {level > 6 && level <= 8 && "Ton aura rayonne de force 🔥"}
            {level > 8 && "Ton aura est légendaire 👑"}
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};
