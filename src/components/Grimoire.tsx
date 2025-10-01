import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Star, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GrimoireEntry {
  id: string;
  thought_text: string;
  thought_emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  category: string;
  collected_at: string;
  times_viewed: number;
  is_favorite: boolean;
}

export function Grimoire() {
  const [entries, setEntries] = useState<GrimoireEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<GrimoireEntry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGrimoire();
  }, []);

  const loadGrimoire = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('thought_grimoire')
        .select('*')
        .eq('user_id', user.id)
        .order('collected_at', { ascending: false });

      if (error) throw error;
      setEntries((data || []) as GrimoireEntry[]);
    } catch (error) {
      console.error('Error loading grimoire:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (entry: GrimoireEntry) => {
    try {
      const { error } = await supabase
        .from('thought_grimoire')
        .update({ is_favorite: !entry.is_favorite })
        .eq('id', entry.id);

      if (error) throw error;

      setEntries(entries.map(e => 
        e.id === entry.id ? { ...e, is_favorite: !e.is_favorite } : e
      ));

      toast({
        title: entry.is_favorite ? "Retiré des favoris" : "Ajouté aux favoris ⭐",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const rarityIcons = {
    common: null,
    rare: Sparkles,
    legendary: Star
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <BookOpen className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Grimoire des Pensées</h2>
        </motion.div>
        <p className="text-muted-foreground">
          {entries.length} pensées collectées
        </p>
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">
            Ton grimoire est vide
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Collectionne des pensées dans le Jardin
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {entries.map((entry, index) => {
              const RarityIcon = rarityIcons[entry.rarity];
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-background/40 backdrop-blur-lg border rounded-2xl p-6 cursor-pointer hover:bg-background/50 transition-all ${
                    entry.rarity === 'legendary' 
                      ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
                      : entry.rarity === 'rare'
                      ? 'border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'border-border/50'
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  {/* Badge de rareté */}
                  {RarityIcon && (
                    <div className="absolute -top-2 -right-2">
                      <RarityIcon 
                        className={`w-5 h-5 ${
                          entry.rarity === 'legendary' ? 'text-yellow-400' : 'text-purple-400'
                        }`}
                        fill="currentColor"
                      />
                    </div>
                  )}

                  {/* Favori */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(entry);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${entry.is_favorite ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>

                  {/* Emoji */}
                  <div className="text-4xl mb-3">{entry.thought_emoji}</div>

                  {/* Texte */}
                  <p className="text-base font-medium text-foreground">
                    {entry.thought_text}
                  </p>

                  {/* Métadonnées */}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{entry.category}</span>
                    <span>{new Date(entry.collected_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}