import { motion } from 'framer-motion';
import { Card } from './ui/card';

interface ActChoiceCardProps {
  text: string;
  mood: string;
  music: string;
  isSelected?: boolean;
  onSelect: () => void;
  delay?: number;
}

export function ActChoiceCard({
  text,
  mood,
  music,
  isSelected = false,
  onSelect,
  delay = 0,
}: ActChoiceCardProps) {
  // Couleur selon le mood
  const getMoodColor = () => {
    switch (mood) {
      case 'calm': return 'from-blue-500/20 to-cyan-500/20';
      case 'curious': return 'from-yellow-500/20 to-amber-500/20';
      case 'grounded': return 'from-amber-700/20 to-orange-700/20';
      case 'open': return 'from-purple-500/20 to-pink-500/20';
      case 'centered': return 'from-green-500/20 to-emerald-500/20';
      case 'wonder': return 'from-indigo-500/20 to-blue-500/20';
      case 'warmth': return 'from-orange-500/20 to-red-500/20';
      case 'peace': return 'from-green-400/20 to-teal-400/20';
      default: return 'from-primary/20 to-accent/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300
          ${isSelected 
            ? 'border-primary shadow-lg shadow-primary/50 ring-2 ring-primary' 
            : 'border-border/50 hover:border-primary/50'
          }
        `}
        onClick={onSelect}
      >
        {/* Gradient de fond */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getMoodColor()} opacity-50`} />
        
        {/* Particules flottantes */}
        {isSelected && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '50%',
                }}
                animate={{
                  y: [-20, -40],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}

        <div className="relative p-6 space-y-3">
          {/* Texte principal */}
          <p className="text-lg font-medium text-center leading-relaxed">
            {text}
          </p>

          {/* Indicateur de mood */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="opacity-60">{mood}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className="opacity-60">{music}</span>
          </div>

          {/* Halo de sélection */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                boxShadow: 'inset 0 0 30px rgba(var(--primary), 0.5)',
              }}
            />
          )}
        </div>

        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}
