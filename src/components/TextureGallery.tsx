import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Texture {
  id: string;
  texture_id: string;
  name: string;
  rarity: string;
  asset_url: string | null;
  unlocked_at: string;
}

interface TextureGalleryProps {
  textures: Texture[];
}

const rarityColors: Record<string, string> = {
  common: 'bg-muted',
  uncommon: 'bg-primary/20',
  rare: 'bg-accent/30',
  epic: 'bg-secondary/40',
  legendary: 'bg-primary/50'
};

const rarityLabels: Record<string, string> = {
  common: 'Commune',
  uncommon: 'Peu commune',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
};

const allTextures = [
  { id: 'silk-1', name: 'Soie lavande', rarity: 'common' },
  { id: 'silk-2', name: 'Lumière liquide', rarity: 'rare' },
  { id: 'silk-3', name: 'Voile pêche', rarity: 'common' },
  { id: 'silk-4', name: 'Horizon nocturne', rarity: 'uncommon' },
  { id: 'silk-5', name: "Soie d'or", rarity: 'epic' },
  { id: 'silk-6', name: 'Brume turquoise', rarity: 'uncommon' },
  { id: 'silk-7', name: 'Éclat stellaire', rarity: 'legendary' },
];

export function TextureGallery({ textures }: TextureGalleryProps) {
  const unlockedIds = new Set(textures.map(t => t.texture_id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-light">Collection de soies</h3>
        <Badge variant="secondary" className="ml-auto">
          {textures.length} / {allTextures.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allTextures.map((texture, index) => {
          const isUnlocked = unlockedIds.has(texture.id);
          const unlockedTexture = textures.find(t => t.texture_id === texture.id);

          return (
            <motion.div
              key={texture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden transition-all ${
                  isUnlocked 
                    ? 'hover:scale-105 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`aspect-square ${rarityColors[texture.rarity]} relative`}>
                  {isUnlocked ? (
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.3) 0%, transparent 50%)',
                          'radial-gradient(circle at 80% 50%, rgba(var(--accent), 0.3) 0%, transparent 50%)',
                          'radial-gradient(circle at 50% 80%, rgba(var(--secondary), 0.3) 0%, transparent 50%)',
                        ]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {isUnlocked ? texture.name : '???'}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {rarityLabels[texture.rarity]}
                  </Badge>
                  {isUnlocked && unlockedTexture && (
                    <p className="text-xs text-muted-foreground">
                      Débloquée {new Date(unlockedTexture.unlocked_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
