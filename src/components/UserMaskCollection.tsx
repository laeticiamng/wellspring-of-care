import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MaskData } from '@/hooks/useEmotionalScan';

interface UserMaskCollectionProps {
  masks: MaskData[];
}

export function UserMaskCollection({ masks }: UserMaskCollectionProps) {
  const rarityStats = {
    common: masks.filter(m => m.rarity === 'common').length,
    rare: masks.filter(m => m.rarity === 'rare').length,
    legendary: masks.filter(m => m.rarity === 'legendary').length,
  };

  return (
    <div className="space-y-8">
      {/* Collection header */}
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent"
        >
          Ta Galerie de Masques
        </motion.h2>
        <p className="text-muted-foreground">
          {masks.length} masque{masks.length > 1 ? 's' : ''} collecté{masks.length > 1 ? 's' : ''}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-4">
          {rarityStats.common > 0 && (
            <Badge variant="outline" className="text-sm">
              🎭 {rarityStats.common} Communs
            </Badge>
          )}
          {rarityStats.rare > 0 && (
            <Badge variant="outline" className="text-sm bg-purple-500/10">
              💎 {rarityStats.rare} Rares
            </Badge>
          )}
          {rarityStats.legendary > 0 && (
            <Badge variant="outline" className="text-sm bg-yellow-500/10">
              ✨ {rarityStats.legendary} Légendaires
            </Badge>
          )}
        </div>
      </div>

      {/* Mask grid */}
      {masks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-6xl mb-4">🎭</p>
          <p className="text-xl text-muted-foreground mb-2">
            Ta galerie est vide
          </p>
          <p className="text-sm text-muted-foreground">
            Scanne ton état émotionnel pour débloquer ton premier masque
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {masks.map((mask, index) => (
            <motion.div
              key={mask.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className={`
                p-6 text-center space-y-3 relative overflow-hidden
                ${mask.rarity === 'legendary' ? 'border-yellow-500/50 shadow-yellow-500/20 shadow-lg' : ''}
                ${mask.rarity === 'rare' ? 'border-purple-500/50 shadow-purple-500/20 shadow-lg' : ''}
              `}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mask.gradient} opacity-10`} />
                
                {/* Rarity badge */}
                {mask.rarity !== 'common' && (
                  <Badge 
                    className={`
                      absolute top-2 right-2 text-xs
                      ${mask.rarity === 'legendary' ? 'bg-yellow-500 text-black' : 'bg-purple-500'}
                    `}
                  >
                    {mask.rarity === 'legendary' ? '✨' : '💎'}
                  </Badge>
                )}

                <motion.div
                  className="text-6xl relative z-10"
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  {mask.emoji}
                </motion.div>

                <div className="relative z-10 space-y-1">
                  <p className="font-semibold text-sm">{mask.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(mask.unlocked_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>

                {/* Shine effect for legendary */}
                {mask.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: [-200, 200],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
