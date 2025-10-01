import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Heart } from 'lucide-react';
import { Badge } from './ui/badge';

interface FragmentCardProps {
  title: string;
  description: string | null;
  rarity: string;
  visualData: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  delay?: number;
}

export function FragmentCard({
  title,
  description,
  rarity,
  visualData,
  isFavorite,
  onToggleFavorite,
  delay = 0,
}: FragmentCardProps) {
  const getRarityColor = () => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBadgeVariant = () => {
    switch (rarity) {
      case 'legendary': return 'default';
      case 'epic': return 'secondary';
      case 'rare': return 'outline';
      default: return 'outline';
    }
  };

  // Extraire les couleurs du visual_data
  const colors = typeof visualData === 'string' 
    ? JSON.parse(visualData).colors || ['#ccc', '#999']
    : visualData?.colors || ['#ccc', '#999'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
        {/* Image/Visuel */}
        <div 
          className="relative aspect-square"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`,
          }}
        >
          {/* Effet de particules */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20],
                  opacity: [0.3, 0.8, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Badge rarity */}
          <div className="absolute top-2 left-2">
            <Badge variant={getRarityBadgeVariant()} className="capitalize">
              {rarity}
            </Badge>
          </div>

          {/* Bouton favori */}
          <motion.button
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur"
            onClick={onToggleFavorite}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </motion.button>

          {/* Brillance au survol */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getRarityColor()} opacity-0 group-hover:opacity-20 transition-opacity`}
          />
        </div>

        {/* Informations */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Bordure animée pour légendaires */}
        {rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.3)',
                '0 0 30px rgba(255, 215, 0, 0.5)',
                '0 0 20px rgba(255, 215, 0, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Card>
    </motion.div>
  );
}
