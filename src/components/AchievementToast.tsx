import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementToastProps {
  type: 'level_up' | 'item_unlocked' | 'milestone';
  title: string;
  description: string;
  onClose?: () => void;
  className?: string;
}

export const AchievementToast = ({
  type,
  title,
  description,
  onClose,
  className,
}: AchievementToastProps) => {
  const icons = {
    level_up: Trophy,
    item_unlocked: Star,
    milestone: Sparkles,
  };

  const colors = {
    level_up: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    item_unlocked: 'from-blue-500/20 to-purple-500/20 border-blue-500/50',
    milestone: 'from-pink-500/20 to-purple-500/20 border-pink-500/50',
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 bg-gradient-to-br p-6 shadow-2xl backdrop-blur-sm',
        colors[type],
        'animate-in slide-in-from-right-full duration-300',
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Content */}
      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-br from-primary/30 to-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-bold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Animated sparkles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-xl animate-pulse" />
    </div>
  );
};
