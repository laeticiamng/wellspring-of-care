import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lock } from 'lucide-react';

interface Cocoon {
  id: string;
  name: string;
  description: string;
  image_url: string;
  awarded_at: string;
}

export function CocoonGallery() {
  const { user } = useAuth();
  const [cocoons, setCocoons] = useState<Cocoon[]>([]);
  const [loading, setLoading] = useState(true);

  const allCocoonTypes = [
    { 
      name: 'Cocon cristal', 
      locked: true,
      emoji: '💎',
      color: 'from-cyan-400 to-blue-600',
      description: 'Transparence et clarté'
    },
    { 
      name: 'Cocon cosmos', 
      locked: true,
      emoji: '🌌',
      color: 'from-purple-600 to-indigo-900',
      description: 'Infini et mystère'
    },
    { 
      name: 'Cocon eau', 
      locked: true,
      emoji: '💧',
      color: 'from-blue-400 to-teal-500',
      description: 'Fluidité et paix'
    },
    { 
      name: 'Cocon feuillage', 
      locked: true,
      emoji: '🍃',
      color: 'from-green-400 to-emerald-600',
      description: 'Nature et renaissance'
    },
    { 
      name: 'Cocon aurore', 
      locked: true,
      emoji: '🌅',
      color: 'from-pink-400 via-purple-400 to-orange-400',
      description: 'Éveil et nouveaux départs'
    },
  ];

  useEffect(() => {
    loadCocoons();
  }, [user]);

  const loadCocoons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id)
        .like('name', 'Cocon%')
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setCocoons(data || []);
    } catch (error) {
      console.error('Error loading cocoons:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedNames = new Set(cocoons.map(c => c.name));
  const galleryItems = allCocoonTypes.map(type => ({
    ...type,
    locked: !unlockedNames.has(type.name),
    cocoon: cocoons.find(c => c.name === type.name),
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/30"
        >
          <Sparkles className="mr-2 w-5 h-5" />
          Collection de Cocons
          <Badge className="ml-2 bg-primary text-primary-foreground">
            {cocoons.length}/{allCocoonTypes.length}
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 border-white/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Collection de Cocons Rares
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 overflow-hidden ${
                item.locked
                  ? 'bg-white/5 border-white/10'
                  : 'border-white/30 shadow-glow'
              } backdrop-blur-lg`}
              whileHover={!item.locked ? { scale: 1.05 } : {}}
            >
              {!item.locked && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
              
              {item.locked ? (
                <div className="relative flex flex-col items-center justify-center h-32 text-center">
                  <Lock className="w-12 h-12 text-white/30 mb-3" />
                  <p className="text-white/40 text-xs">À débloquer</p>
                </div>
              ) : (
                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {item.emoji}
                  </motion.div>
                  <p className="text-white font-medium text-sm mb-1">
                    {item.name.replace('Cocon ', '')}
                  </p>
                  <p className="text-white/50 text-xs italic mb-2">
                    {item.description}
                  </p>
                  <p className="text-white/40 text-xs">
                    {new Date(item.cocoon!.awarded_at).toLocaleDateString('fr-FR')}
                  </p>
                  <Sparkles className="w-4 h-4 text-yellow-400 mt-2 animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/70 text-sm text-center">
            💡 Complète des sessions Nyvée pour débloquer tous les cocons rares
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
