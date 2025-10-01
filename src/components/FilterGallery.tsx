import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lock } from "lucide-react";

interface Filter {
  id: string;
  emoji: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  uses: number;
  maxUses: number;
  unlocked: boolean;
  description: string;
}

interface FilterGalleryProps {
  filters: Filter[];
  onFilterSelect?: (filter: Filter) => void;
}

export const FilterGallery = ({ filters, onFilterSelect }: FilterGalleryProps) => {
  const getRarityConfig = (rarity: Filter['rarity']) => {
    const configs = {
      common: {
        gradient: 'from-gray-400 to-gray-600',
        borderColor: 'border-gray-400/30',
        glow: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]'
      },
      rare: {
        gradient: 'from-blue-400 to-cyan-600',
        borderColor: 'border-blue-400/30',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
      },
      epic: {
        gradient: 'from-purple-400 via-pink-500 to-purple-600',
        borderColor: 'border-purple-400/30',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]'
      },
      legendary: {
        gradient: 'from-yellow-300 via-amber-400 to-orange-500',
        borderColor: 'border-yellow-400/40',
        glow: 'shadow-[0_0_30px_rgba(251,191,36,0.8)]'
      }
    };
    return configs[rarity];
  };

  const getEvolutionStage = (uses: number, maxUses: number) => {
    const progress = uses / maxUses;
    if (progress >= 1) return { stage: '✨ Évolué', color: 'text-yellow-400' };
    if (progress >= 0.66) return { stage: '🌟 Avancé', color: 'text-purple-400' };
    if (progress >= 0.33) return { stage: '💫 Croissant', color: 'text-blue-400' };
    return { stage: '⭐ Débutant', color: 'text-gray-400' };
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Mes Miroirs Magiques
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Collection de filtres évolutifs • {filters.filter(f => f.unlocked).length}/{filters.length} débloqués
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filters.map((filter, index) => {
            const rarityConfig = getRarityConfig(filter.rarity);
            const evolution = getEvolutionStage(filter.uses, filter.maxUses);

            return (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: filter.unlocked ? 1.05 : 1 }}
                onClick={() => filter.unlocked && onFilterSelect?.(filter)}
                className={`relative rounded-xl border-2 ${rarityConfig.borderColor} ${rarityConfig.glow} 
                  ${filter.unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-4
                  transition-all duration-300`}
              >
                {/* Badge rareté */}
                <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full 
                  bg-gradient-to-r ${rarityConfig.gradient} text-xs font-bold text-white`}>
                  {filter.rarity.toUpperCase()}
                </div>

                {/* Filtre ou lock */}
                <div className="flex flex-col items-center gap-2">
                  {filter.unlocked ? (
                    <>
                      <motion.div
                        className="text-5xl"
                        animate={{
                          rotate: filter.rarity === 'legendary' ? [0, 10, -10, 0] : 0,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {filter.emoji}
                      </motion.div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-semibold text-white">{filter.name}</p>
                        <p className={`text-xs ${evolution.color} font-medium`}>
                          {evolution.stage}
                        </p>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${rarityConfig.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(filter.uses / filter.maxUses) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Lock className="h-8 w-8 text-white/30" />
                      <p className="text-xs text-white/50 text-center">
                        À débloquer
                      </p>
                    </div>
                  )}
                </div>

                {/* Effet de brillance pour légendaires */}
                {filter.unlocked && filter.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats globales */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-400">
                {filters.filter(f => f.unlocked && f.rarity === 'legendary').length}
              </p>
              <p className="text-xs text-white/60">Légendaires</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">
                {filters.reduce((sum, f) => sum + f.uses, 0)}
              </p>
              <p className="text-xs text-white/60">Utilisations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {filters.filter(f => f.uses >= f.maxUses).length}
              </p>
              <p className="text-xs text-white/60">Évolutions max</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
