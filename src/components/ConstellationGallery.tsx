import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Lock, Star } from "lucide-react";

interface Constellation {
  id: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: number;
  starsCount: number;
  tension: number;
  name: string;
}

interface ConstellationGalleryProps {
  constellations: Constellation[];
}

const rarityConfig = {
  common: { 
    color: 'from-blue-400 to-blue-600', 
    glow: 'shadow-md',
    emoji: '⭐',
    label: 'Constellation Simple',
    border: 'border-blue-500/30'
  },
  rare: { 
    color: 'from-purple-400 to-purple-600', 
    glow: 'shadow-glow',
    emoji: '💫',
    label: 'Constellation Rare',
    border: 'border-purple-500/50'
  },
  epic: { 
    color: 'from-pink-400 via-purple-500 to-blue-600', 
    glow: 'shadow-glow-intense',
    emoji: '🌟',
    label: 'Constellation Épique',
    border: 'border-pink-500/70'
  },
  legendary: { 
    color: 'from-amber-300 via-yellow-400 to-orange-500', 
    glow: 'shadow-glow-legendary',
    emoji: '✨',
    label: 'Constellation Légendaire',
    border: 'border-yellow-500/90'
  }
};

const ConstellationGallery = ({ constellations }: ConstellationGalleryProps) => {
  const lockedSlots = Array.from({ length: Math.max(0, 9 - constellations.length) });

  // Stats
  const stats = {
    total: constellations.length,
    common: constellations.filter(c => c.rarity === 'common').length,
    rare: constellations.filter(c => c.rarity === 'rare').length,
    epic: constellations.filter(c => c.rarity === 'epic').length,
    legendary: constellations.filter(c => c.rarity === 'legendary').length,
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          Ma Galaxie Personnelle
        </h3>
        <p className="text-sm text-muted-foreground">
          {constellations.length} constellations découvertes
        </p>
      </div>

      {/* Stats rareté */}
      {constellations.length > 0 && (
        <div className="grid grid-cols-4 gap-2 p-4 rounded-lg bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border border-purple-500/20">
          {Object.entries(stats).slice(1).map(([rarity, count]) => {
            const config = rarityConfig[rarity as keyof typeof rarityConfig];
            return (
              <div key={rarity} className="text-center">
                <div className="text-2xl font-bold" style={{
                  background: `linear-gradient(to right, ${config.color.replace('from-', '').replace('to-', ',')})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {count}
                </div>
                <div className="text-xs text-muted-foreground">{config.emoji}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Galerie */}
      <div className="grid grid-cols-3 gap-4">
        {constellations.map((constellation, index) => {
          const config = rarityConfig[constellation.rarity];
          return (
            <motion.div
              key={constellation.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
            >
              <Card className={`border-2 ${config.border} ${config.glow} hover:scale-105 transition-transform cursor-pointer overflow-hidden relative`}>
                <CardContent className="p-4">
                  {/* Constellation visuelle */}
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center relative overflow-hidden`}>
                    {/* Étoiles de fond */}
                    <div className="absolute inset-0">
                      {Array.from({ length: constellation.starsCount }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-white"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Pattern constellation */}
                    <svg className="absolute inset-0 w-full h-full opacity-50">
                      {Array.from({ length: constellation.starsCount - 1 }).map((_, i) => {
                        const x1 = 20 + (i % 3) * 30;
                        const y1 = 20 + Math.floor(i / 3) * 30;
                        const x2 = 20 + ((i + 1) % 3) * 30;
                        const y2 = 20 + Math.floor((i + 1) / 3) * 30;
                        return (
                          <line
                            key={i}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="white"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                        );
                      })}
                    </svg>

                    {/* Emoji central */}
                    <motion.span 
                      className="text-5xl z-10"
                      animate={constellation.rarity === 'legendary' ? {
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    >
                      {config.emoji}
                    </motion.span>

                    {/* Particules légendaires */}
                    {constellation.rarity === 'legendary' && (
                      <>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`particle-${i}`}
                            className="absolute w-2 h-2 rounded-full bg-white"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            animate={{
                              x: Math.cos((i / 6) * Math.PI * 2) * 60,
                              y: Math.sin((i / 6) * Math.PI * 2) * 60,
                              opacity: [1, 0],
                              scale: [0, 1.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="mt-3 text-center space-y-1">
                    <p className="text-xs font-semibold text-primary">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {constellation.name}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {constellation.starsCount} étoiles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Slots verrouillés */}
        {lockedSlots.map((_, index) => (
          <Card key={`locked-${index}`} className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-4">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
                <Lock className="h-12 w-12 text-muted-foreground/40" />
                
                {/* Étoiles de fond floues */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/20 blur-sm"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-muted-foreground">À découvrir</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message encouragement */}
      {constellations.length > 0 && constellations.length < 9 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/20"
        >
          <Sparkles className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Continue d'explorer pour débloquer des constellations légendaires
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ConstellationGallery;
