import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface WeeksCarouselProps {
  weeks: Array<{
    id: string;
    week_iso: string;
    verbal_week: string[];
    season: string;
    created_at: string;
  }>;
}

const seasonEmojis: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

export function WeeksCarousel({ weeks = [] }: WeeksCarouselProps) {
  if (weeks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Semaine calme. On plante une première graine ?</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-foreground">
        Tes jardins passés
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {weeks.map((week, index) => (
          <motion.div
            key={week.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="
              relative aspect-square rounded-lg
              bg-gradient-to-br from-card to-card/50
              border-2 border-border
              overflow-hidden
              cursor-pointer
              group
            "
          >
            {/* Season emoji */}
            <div className="absolute top-2 right-2 text-3xl">
              {seasonEmojis[week.season] || '🌿'}
            </div>

            {/* Week info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-xs text-white/80 font-medium">
                {week.week_iso}
              </p>
              <p className="text-xs text-white/60">
                {week.verbal_week.slice(0, 2).join(' • ')}
              </p>
            </div>

            {/* Hover effect */}
            <div className="
              absolute inset-0 
              bg-primary/10 
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            " />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
