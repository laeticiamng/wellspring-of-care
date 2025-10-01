import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Swords } from "lucide-react";

interface Challenge {
  id: number;
  name: string;
  difficulty: string;
  emoji: string;
  description: string;
  duration: number;
  type: string;
}

interface BossChallengeProps {
  challenge: Challenge;
  onStart: () => void;
  onComplete: (success: boolean, completion: number) => void;
  isLoading: boolean;
  hasStarted: boolean;
}

export const BossChallenge = ({
  challenge,
  onStart,
  onComplete,
  isLoading,
  hasStarted
}: BossChallengeProps) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!hasStarted || !isActive) return;

    const duration = challenge.duration * 60 * 1000; // minutes to ms
    const interval = 100;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsActive(false);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [hasStarted, isActive, challenge.duration]);

  const handleStart = () => {
    onStart();
    setIsActive(true);
    setProgress(0);
  };

  const handleComplete = (successLevel: number) => {
    const success = successLevel >= 0.7;
    onComplete(success, successLevel);
    setProgress(0);
    setIsActive(false);
  };

  const difficultyColor = {
    'Facile': 'text-green-500',
    'Moyen': 'text-yellow-500',
    'Difficile': 'text-red-500'
  }[challenge.difficulty] || 'text-primary';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-glow p-8 space-y-6 bg-card/90 backdrop-blur-sm">
        {/* Challenge Header */}
        <div className="text-center space-y-4">
          <motion.div
            className="flex justify-center"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <div className="text-8xl">{challenge.emoji}</div>
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {challenge.name}
            </h2>
            <p className={`text-lg font-semibold ${difficultyColor}`}>
              Difficulté: {challenge.difficulty}
            </p>
            <p className="text-muted-foreground">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        {hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-4 bg-muted"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Swords className="w-4 h-4 animate-pulse-soft" />
              <span>Combat en cours... {Math.round(progress)}%</span>
              <Swords className="w-4 h-4 animate-pulse-soft" />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!hasStarted ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={handleStart}
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Préparation..." : `Accepter le Défi ⚔️`}
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => handleComplete(0.3)}
                  variant="outline"
                  disabled={isLoading || progress < 20}
                  className="w-full"
                >
                  Tentative
                  <span className="block text-xs opacity-70">+30%</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => handleComplete(0.7)}
                  variant="outline"
                  disabled={isLoading || progress < 50}
                  className="w-full"
                >
                  Bon Effort
                  <span className="block text-xs opacity-70">+70%</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => handleComplete(1.0)}
                  disabled={isLoading || progress < 80}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                >
                  Victoire!
                  <span className="block text-xs opacity-90">+100%</span>
                </Button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Hints */}
        {hasStarted && progress < 30 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground italic"
          >
            💡 Concentre-toi sur ta respiration et reste dans le moment présent
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
