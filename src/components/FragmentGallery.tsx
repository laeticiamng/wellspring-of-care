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
    label: 'Commun',
    border: 'border-gray-500/30'
  },
  rare: { 
    color: 'from-blue-400 to-blue-600', 
    glow: 'shadow-glow',
    emoji: '💎',
    label: 'Rare',
    border: 'border-blue-500/50'
  },
  epic: { 
    color: 'from-purple-400 to-pink-600', 
    glow: 'shadow-glow-intense',
    emoji: '🌟',
    label: 'Épique',
    border: 'border-purple-500/70'
  },
  legendary: { 
    color: 'from-amber-400 via-orange-500 to-red-600', 
    glow: 'shadow-glow-legendary',
    emoji: '👑',
    label: 'Légendaire',
    border: 'border-yellow-500/90'
  }
};

const FragmentGallery = ({ fragments }: FragmentGalleryProps) => {
  const lockedSlots = Array.from({ length: Math.max(0, 12 - fragments.length) });
  
  // Style patterns for fragments
  const getFragmentPattern = (styleId: string, rarity: string) => {
    const patterns = {
      'style-0': { type: 'spiral', color: 'cyan' },
      'style-1': { type: 'waves', color: 'purple' },
      'style-2': { type: 'mandala', color: 'pink' },
      'style-3': { type: 'geometric', color: 'blue' },
      'style-4': { type: 'organic', color: 'green' },
      'style-5': { type: 'crystalline', color: 'indigo' },
      'style-6': { type: 'nebula', color: 'violet' },
      'style-7': { type: 'aurora', color: 'teal' },
      'style-8': { type: 'lotus', color: 'rose' },
      'style-9': { type: 'galaxy', color: 'amber' },
    };
    return patterns[styleId as keyof typeof patterns] || patterns['style-0'];
  };

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

      {/* Galerie */}
      <div className="grid grid-cols-3 gap-4">
        {fragments.map((fragment, index) => {
          const config = rarityConfig[fragment.rarity];
          const pattern = getFragmentPattern(fragment.style, fragment.rarity);
          
          return (
            <motion.div
              key={fragment.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
            >
              <Card className={`border-2 ${config.border} ${config.glow} hover:scale-105 transition-transform cursor-pointer overflow-hidden relative group`}>
                <CardContent className="p-4">
                  {/* Fresque visuelle enrichie */}
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center relative overflow-hidden`}>
                    {/* Background pattern selon style */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                      {pattern.type === 'spiral' && (
                        <path
                          d="M 50 50 Q 60 40, 70 45 T 85 55 Q 85 70, 75 80 T 55 85 Q 40 85, 30 75 T 20 50 Q 20 30, 35 20"
                          stroke="white"
                          strokeWidth="1"
                          fill="none"
                        />
                      )}
                      {pattern.type === 'waves' && (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <path
                              key={i}
                              d={`M 0 ${20 + i * 15} Q 25 ${15 + i * 15}, 50 ${20 + i * 15} T 100 ${20 + i * 15}`}
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          ))}
                        </>
                      )}
                      {pattern.type === 'mandala' && (
                        <g>
                          {Array.from({ length: 12 }).map((_, i) => {
                            const angle = (i / 12) * Math.PI * 2;
                            return (
                              <circle
                                key={i}
                                cx={50 + Math.cos(angle) * 25}
                                cy={50 + Math.sin(angle) * 25}
                                r="8"
                                stroke="white"
                                strokeWidth="1"
                                fill="none"
                              />
                            );
                          })}
                        </g>
                      )}
                      {pattern.type === 'geometric' && (
                        <g>
                          <rect x="25" y="25" width="50" height="50" stroke="white" strokeWidth="1" fill="none" />
                          <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" fill="none" />
                        </g>
                      )}
                    </svg>
                    
                    {/* Breathing particles */}
                    <div className="absolute inset-0">
                      {Array.from({ length: fragment.breathCycles }).slice(0, 30).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-white"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.5, 0.8],
                            x: [0, (Math.random() - 0.5) * 10, 0],
                            y: [0, (Math.random() - 0.5) * 10, 0]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Central emoji with enhanced animation */}
                    <motion.span 
                      className="text-5xl z-10 drop-shadow-lg"
                      animate={fragment.rarity === 'legendary' ? {
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                      } : fragment.rarity === 'epic' ? {
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{
                        duration: fragment.rarity === 'legendary' ? 4 : 3,
                        repeat: Infinity
                      }}
                    >
                      {config.emoji}
                    </motion.span>

                    {/* Rarity overlay */}
                    {fragment.rarity !== 'common' && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)`,
                            `radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3), transparent)`,
                            `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)`,
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-primary">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {fragment.breathCycles} cycles • {pattern.type}
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
              <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center relative overflow-hidden">
                <Lock className="h-8 w-8 text-muted-foreground/40" />
                
                {/* Background dots */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/10"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
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
