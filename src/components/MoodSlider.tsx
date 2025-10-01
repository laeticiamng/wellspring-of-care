import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface MoodSliderProps {
  label: string;
  emoji: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

export const MoodSlider = ({ label, emoji, value, onChange, color }: MoodSliderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 border-2 border-primary/20 bg-card/80 backdrop-blur-sm relative overflow-hidden">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {emoji}
              </p>
            </div>
            
            <motion.div
              className="text-3xl font-bold"
              style={{ color }}
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              {value}%
            </motion.div>
          </div>

          <div className="relative">
            <Slider
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
              max={100}
              step={1}
              className="relative"
            />
            
            {/* Value indicator glow */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
              style={{
                left: `${value}%`,
                backgroundColor: color,
                boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`
              }}
              animate={{
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Frequency bars visualization */}
          <div className="flex items-end justify-between gap-1 h-12">
            {[...Array(30)].map((_, i) => {
              const intensity = Math.abs(i - (value / 100 * 30)) / 30;
              const height = (1 - intensity) * 100;
              
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    backgroundColor: color,
                    opacity: 0.3 + (1 - intensity) * 0.7
                  }}
                  animate={{
                    height: `${height * 0.6 + Math.random() * 20}%`
                  }}
                  transition={{
                    duration: 0.2 + Math.random() * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
