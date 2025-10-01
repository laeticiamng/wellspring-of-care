import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Fragment {
  id: string;
  rarity: 'common' | 'rare' | 'legendary';
  unlocked_at: string;
  session_id: string;
}

export function FragmentGallery() {
  const { user } = useAuth();
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFragments();
  }, [user]);

  const loadFragments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('music_fragments')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      setFragments((data || []).map(f => ({
        ...f,
        rarity: f.rarity as 'common' | 'rare' | 'legendary'
      })));
    } catch (error) {
      console.error('Erreur chargement fragments:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: 'hsl(var(--muted))',
    rare: 'hsl(var(--accent))',
    legendary: 'hsl(var(--warning))',
  };

  const rarityLabels = {
    common: 'Commun',
    rare: 'Rare',
    legendary: 'Légendaire',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Music className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (fragments.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6 text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Aucun fragment musical débloqué pour le moment.
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Complète des sessions pour collectionner des mélodies secrètes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: fragments.length,
    common: fragments.filter(f => f.rarity === 'common').length,
    rare: fragments.filter(f => f.rarity === 'rare').length,
    legendary: fragments.filter(f => f.rarity === 'legendary').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Playlist Secrète
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: rarityColors.common }}>{stats.common}</div>
              <div className="text-xs text-muted-foreground">Commun</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: rarityColors.rare }}>{stats.rare}</div>
              <div className="text-xs text-muted-foreground">Rare</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: rarityColors.legendary }}>{stats.legendary}</div>
              <div className="text-xs text-muted-foreground">Légendaire</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fragments */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fragments.map((fragment, index) => (
          <motion.div
            key={fragment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all"
              style={{
                boxShadow: fragment.rarity === 'legendary' 
                  ? `0 0 20px ${rarityColors.legendary}40` 
                  : 'none'
              }}
            >
              <CardContent className="pt-6 text-center">
                <motion.div
                  animate={fragment.rarity === 'legendary' ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {fragment.rarity === 'legendary' && (
                    <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: rarityColors.legendary }} />
                  )}
                  {fragment.rarity === 'rare' && (
                    <Music className="w-8 h-8 mx-auto mb-2" style={{ color: rarityColors.rare }} />
                  )}
                  {fragment.rarity === 'common' && (
                    <Music className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  )}
                </motion.div>
                <Badge 
                  variant="outline" 
                  className="mb-2"
                  style={{ 
                    borderColor: rarityColors[fragment.rarity],
                    color: rarityColors[fragment.rarity],
                  }}
                >
                  {rarityLabels[fragment.rarity]}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {new Date(fragment.unlocked_at).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
