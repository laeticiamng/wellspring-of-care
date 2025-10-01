import { motion } from 'framer-motion';
import { Sparkles, Flame, Waves, Sprout, Moon, Star, Wind, Home, Sunrise, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const IconMap: Record<string, any> = {
  Sparkles,
  Flame,
  Waves,
  Sprout,
  Moon,
  Star,
  Wind,
  Home,
  Sunrise,
  Stars: Sparkles,
  Sun: Star
};

interface CardDraw {
  id: string;
  drawn_at: string;
  week_start: string;
  emotion_cards: {
    code: string;
    mantra: string;
    mantra_emoji: string;
    color_primary: string;
    color_secondary: string;
    icon_name: string;
    rarity: string;
    description: string;
  };
}

export const CardGallery = () => {
  const [cards, setCards] = useState<CardDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGallery = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('weekly_card_draws')
          .select(`
            id,
            drawn_at,
            week_start,
            emotion_cards (
              code,
              mantra,
              mantra_emoji,
              color_primary,
              color_secondary,
              icon_name,
              rarity,
              description
            )
          `)
          .eq('user_id', user.id)
          .order('drawn_at', { ascending: false });

        if (error) throw error;
        setCards(data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [user]);

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-4 border-yellow-500 shadow-xl shadow-yellow-500/50';
      case 'epic': return 'border-4 border-purple-500 shadow-lg shadow-purple-500/50';
      case 'rare': return 'border-2 border-blue-500 shadow-md shadow-blue-500/50';
      default: return 'border border-primary/30';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Mon Grimoire ✨
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Ton Grimoire des Cartes Émotionnelles
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <BookOpen className="w-16 h-16 mb-4 opacity-50" />
              <p>Aucune carte tirée pour le moment</p>
              <p className="text-sm">Reviens lundi pour ta première carte !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
              {cards.map((draw, index) => {
                const cardData = draw.emotion_cards;
                const CardIcon = IconMap[cardData.icon_name] || Sparkles;
                
                return (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`overflow-hidden ${getRarityBorder(cardData.rarity)} hover:scale-105 transition-transform`}
                      style={{
                        background: `linear-gradient(135deg, ${cardData.color_primary}20, ${cardData.color_secondary}20)`,
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                            style={{
                              background: `linear-gradient(135deg, ${cardData.color_primary}, ${cardData.color_secondary})`,
                            }}
                          >
                            <CardIcon className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-bold mb-1">
                            {cardData.mantra} {cardData.mantra_emoji}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(draw.week_start).toLocaleDateString('fr-FR', { 
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                          
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {cardData.description}
                          </p>
                          
                          <span className={`text-xs mt-2 px-2 py-1 rounded-full ${
                            cardData.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                            cardData.rarity === 'epic' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' :
                            cardData.rarity === 'rare' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {cardData.rarity === 'legendary' ? 'Légendaire' :
                             cardData.rarity === 'epic' ? 'Épique' :
                             cardData.rarity === 'rare' ? 'Rare' : 'Commune'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
