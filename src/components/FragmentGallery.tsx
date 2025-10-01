import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";

interface Fragment {
  id: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: number;
  breathCycles: number;
  style: string;
}

interface FragmentGalleryProps {
  fragments: Fragment[];
}

const rarityConfig = {
  common: { 
    color: 'from-gray-400 to-gray-500', 
    glow: 'shadow-md',
    emoji: '✨',
    label: 'Commun'
  },
  rare: { 
    color: 'from-blue-400 to-blue-600', 
    glow: 'shadow-glow',
    emoji: '💎',
    label: 'Rare'
  },
  epic: { 
    color: 'from-purple-400 to-pink-600', 
    glow: 'shadow-glow-intense',
    emoji: '🌟',
    label: 'Épique'
  },
  legendary: { 
    color: 'from-amber-400 via-orange-500 to-red-600', 
    glow: 'shadow-glow-legendary',
    emoji: '👑',
    label: 'Légendaire'
  }
};

const FragmentGallery = ({ fragments }: FragmentGalleryProps) => {
  const lockedSlots = Array.from({ length: Math.max(0, 6 - fragments.length) });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Mes Fresques Respiratoires
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {fragments.length} / ∞ fresques créées
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fragments.map((fragment, index) => {
          const config = rarityConfig[fragment.rarity];
          return (
            <motion.div
              key={fragment.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-0 ${config.glow} hover:scale-105 transition-transform cursor-pointer overflow-hidden`}>
                <CardContent className="p-4">
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center relative overflow-hidden`}>
                    {/* Pattern abstrait */}
                    <div className="absolute inset-0 opacity-30">
                      {Array.from({length: 12}).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute bg-white/20 rounded-full"
                          style={{
                            width: `${20 + i * 5}%`,
                            height: '2px',
                            top: `${10 + i * 7}%`,
                            left: `${Math.sin(i) * 20 + 10}%`,
                            transform: `rotate(${i * 15}deg)`
                          }}
                          animate={{
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, 10, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                    
                    <span className="text-4xl z-10">{config.emoji}</span>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-primary">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {fragment.breathCycles} cycles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {lockedSlots.map((_, index) => (
          <Card key={`locked-${index}`} className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-4">
              <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">À découvrir</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FragmentGallery;
