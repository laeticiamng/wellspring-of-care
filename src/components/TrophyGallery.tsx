import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Sword, Shield, Star } from "lucide-react";

interface Trophy {
  id: number;
  name: string;
  emoji: string;
  rarity: string;
  earnedAt: string;
}

interface TrophyGalleryProps {
  trophies: Trophy[];
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500"
};

const rarityIcons = {
  common: Shield,
  rare: Sword,
  epic: Star,
  legendary: Crown
};

export const TrophyGallery = ({ trophies }: TrophyGalleryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-4xl mx-auto border-0 shadow-soft p-6 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Coffre aux Trésors
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trophies.map((trophy, index) => {
            const RarityIcon = rarityIcons[trophy.rarity as keyof typeof rarityIcons] || Shield;
            const rarityColor = rarityColors[trophy.rarity as keyof typeof rarityColors] || rarityColors.common;

            return (
              <motion.div
                key={trophy.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Card className={`p-4 border-2 bg-gradient-to-br ${rarityColor} relative overflow-hidden group cursor-pointer`}>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{trophy.emoji}</span>
                      <RarityIcon className="w-5 h-5 text-white/80" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-white line-clamp-2">
                        {trophy.name}
                      </p>
                      <p className="text-xs text-white/70 capitalize">
                        {trophy.rarity}
                      </p>
                    </div>
                  </div>

                  {/* Particles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        animate={{
                          y: [0, -50],
                          x: [0, Math.random() * 40 - 20],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeOut"
                        }}
                        style={{
                          left: `${20 + i * 15}%`,
                          bottom: '20%'
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {trophies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucun trophée pour l'instant</p>
            <p className="text-sm">Relève des défis pour remplir ton coffre ! ⚔️</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
