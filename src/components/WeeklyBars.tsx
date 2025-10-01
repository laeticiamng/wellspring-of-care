import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

interface WeeklyBarsProps {
  verbalWeek: string[];
  onCTAClick?: () => void;
  ctaText?: string;
  isExecuting?: boolean;
}

const barColors: Record<string, string> = {
  'posé': 'from-teal-400/20 to-teal-600/40 border-teal-500',
  'doux': 'from-pink-400/20 to-pink-600/40 border-pink-500',
  'actif': 'from-amber-400/20 to-amber-600/40 border-amber-500',
  'clair': 'from-green-400/20 to-green-600/40 border-green-500',
  'nuit': 'from-indigo-400/20 to-indigo-600/40 border-indigo-500',
  'dense': 'from-purple-400/20 to-purple-600/40 border-purple-500',
  'fatigué': 'from-slate-400/20 to-slate-600/40 border-slate-500',
};

const barLabels: Record<string, string> = {
  'posé': '🌿 Posé',
  'doux': '🌸 Doux',
  'actif': '⚡ Actif',
  'clair': '✨ Clair',
  'nuit': '🌙 Nuit',
  'dense': '🌊 Dense',
  'fatigué': '☁️ Fatigué',
};

export function WeeklyBars({ 
  verbalWeek = [], 
  onCTAClick, 
  ctaText = "Respirer 2 min ?",
  isExecuting = false 
}: WeeklyBarsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 
          className="text-2xl font-semibold text-foreground"
          id="weekly-bars-title"
          tabIndex={0}
        >
          Ta semaine
        </h2>
        <p 
          className="text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {verbalWeek.join(' • ')}
        </p>
      </div>

      {/* Bars */}
      <div 
        className="space-y-4"
        role="list"
        aria-labelledby="weekly-bars-title"
      >
        {verbalWeek.slice(0, 3).map((verbal, index) => (
          <motion.div
            key={verbal}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`
              relative p-4 rounded-lg border-2 
              bg-gradient-to-r ${barColors[verbal] || barColors['doux']}
              overflow-hidden
            `}
            role="listitem"
            aria-label={`État émotionnel: ${barLabels[verbal] || verbal}`}
          >
            {/* Halo effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Content */}
            <div className="relative flex items-center gap-3">
              <Circle className="w-3 h-3 fill-current" />
              <span className="text-lg font-medium">
                {barLabels[verbal] || verbal}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      {onCTAClick && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCTAClick}
          disabled={isExecuting}
          className="
            w-full py-4 px-6 rounded-lg
            bg-gradient-to-r from-primary/80 to-primary
            text-primary-foreground font-medium
            hover:from-primary hover:to-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          "
          aria-label={isExecuting ? 'Action en cours' : ctaText}
        >
          {isExecuting ? 'En cours...' : ctaText}
        </motion.button>
      )}
    </motion.div>
  );
}
