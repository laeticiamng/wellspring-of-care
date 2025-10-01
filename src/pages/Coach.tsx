import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoachAssess } from "@/hooks/useCoachAssess";
import { ThoughtBubble } from "@/components/ThoughtBubble";
import { AnchorCard } from "@/components/AnchorCard";
import { Grimoire } from "@/components/Grimoire";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Coach() {
  const [view, setView] = useState<'garden' | 'grimoire'>('garden');
  const [showThoughts, setShowThoughts] = useState(false);
  const { result, loading, startSession, submitSession, reset } = useCoachAssess();
  const { toast } = useToast();

  useEffect(() => {
    // Lancer automatiquement une session au montage
    initSession();
  }, []);

  const initSession = async () => {
    const session = await startSession();
    if (session) {
      // Simuler des réponses aléatoires pour l'instant (sera remplacé par un vrai questionnaire)
      const mockResponses: Record<string, number> = {};
      session.instrument.questions.forEach((q: any) => {
        mockResponses[q.id] = Math.floor(Math.random() * 7) + 1; // 1-7
      });
      
      // Soumettre après 2 secondes
      setTimeout(async () => {
        await submitSession(session.sessionId, mockResponses, 2);
        setShowThoughts(true);
      }, 2000);
    }
  };

  const collectThought = async (thought: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('thought_grimoire')
        .insert({
          user_id: user.id,
          thought_text: thought.text,
          thought_emoji: thought.emoji,
          rarity: thought.rarity,
          category: thought.category
        });

      if (error) throw error;

      // Son cristallin
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0MWKzn77BkHgo/ldjzxnMnBSh+zPLaizsIGGS76+mdTgwPT6Lh8bllHgo5jdTzym8qBSl9y/HajD4HGGe97+OYUg0MWq3n77BkHgo5k9Tyx3IoBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0MWKzn77BkHgo5jdTzym8qBSl9y/HajD4HF2e97+OYUg0');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      toast({
        title: "✨ Pensée collectée",
        description: `${thought.text} ajouté au grimoire`,
        duration: 3000,
      });

      // Retirer la pensée après collection
      if (result) {
        result.thoughts = result.thoughts.filter(t => t.text !== thought.text);
      }
    } catch (error) {
      console.error('Error collecting thought:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={view === 'garden' ? 'default' : 'outline'}
            onClick={() => setView('garden')}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Jardin
          </Button>
          <Button
            variant={view === 'grimoire' ? 'default' : 'outline'}
            onClick={() => setView('grimoire')}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Grimoire
          </Button>
        </div>

        {view === 'garden' ? (
          <div className="max-w-4xl mx-auto">
            {/* Titre avec effet */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <motion.h1
                className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                Le Jardin des Pensées
              </motion.h1>
              <p className="text-lg text-muted-foreground">
                Un espace de sagesse éphémère
              </p>
            </motion.div>

            {/* Scène principale */}
            <div className="relative min-h-[500px]">
              {/* Brume de fond */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-muted/30 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Contenu */}
              <div className="relative z-10 p-8">
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-12 h-12 mx-auto text-primary" />
                    </motion.div>
                    <p className="text-lg text-muted-foreground mt-4">
                      Le jardin se prépare...
                    </p>
                  </motion.div>
                )}

                {!loading && result && showThoughts && (
                  <>
                    {/* Bulles de pensées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      <AnimatePresence>
                        {result.thoughts.map((thought, index) => (
                          <ThoughtBubble
                            key={`${thought.text}-${index}`}
                            text={thought.text}
                            emoji={thought.emoji}
                            rarity={thought.rarity as 'common' | 'rare' | 'legendary'}
                            onCollect={() => collectThought(thought)}
                            delay={index * 0.2}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Cartes d'ancrage */}
                    {result.anchorCards && result.anchorCards.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12"
                      >
                        <h3 className="text-2xl font-semibold text-center mb-6">
                          Micro-pratiques suggérées
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {result.anchorCards.slice(0, 4).map((card, index) => (
                            <AnchorCard
                              key={index}
                              title={card.title}
                              duration={card.duration}
                              category={card.category}
                              onStart={() => {
                                toast({
                                  title: "🧘 Pratique lancée",
                                  description: card.title,
                                  duration: 2000,
                                });
                              }}
                              delay={0.9 + index * 0.1}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Bouton nouvelle session */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-center mt-12"
                    >
                      <Button
                        onClick={() => {
                          reset();
                          setShowThoughts(false);
                          initSession();
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Nouvelle visite
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Grimoire />
        )}
      </div>
    </div>
  );
}