import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Mic, Sparkles, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { CardGallery } from '@/components/CardGallery';
import { FloatingCard } from '@/components/FloatingCard';
import { useMicrophone } from '@/hooks/useMicrophone';

export default function JournalNew() {
  const [view, setView] = useState<'input' | 'library'>('input');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showNewPage, setShowNewPage] = useState(false);
  const [newEntry, setNewEntry] = useState<any>(null);
  
  const { entries, loading, saveEntry } = useMoodEntries();
  const { startListening, stopListening, isListening } = useMicrophone();

  const handleVoiceRecord = async () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    const entry = await saveEntry(content);
    if (entry) {
      setNewEntry(entry);
      setShowNewPage(true);
      setContent('');
      
      // Afficher la page pendant 3 secondes avant de l'envoyer à la bibliothèque
      setTimeout(() => {
        setShowNewPage(false);
        setNewEntry(null);
      }, 3000);
    }
  };

  const preciousEntries = entries.filter(e => e.is_precious);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Effet de brume animée */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10" />
            La Bibliothèque des Émotions
          </h1>
          <p className="text-white/70">Écris ou parle, et transforme tes mots en lumière 📔</p>
        </motion.div>

        {/* Boutons de navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setView('input')}
            variant={view === 'input' ? 'default' : 'outline'}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Nouvelle Page
          </Button>
          <Button
            onClick={() => setView('library')}
            variant={view === 'library' ? 'default' : 'outline'}
            className="gap-2"
          >
            <Library className="w-4 h-4" />
            Bibliothèque ({entries.length})
          </Button>
          {preciousEntries.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <Sparkles className="w-4 h-4" />
              Précieuses ({preciousEntries.length})
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {view === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Zone de saisie */}
              <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Exprime ce que tu ressens... Les mots deviennent lumière ✨"
                  className="min-h-[200px] bg-transparent text-white placeholder:text-white/40 border-white/20 resize-none text-lg"
                />

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleSave}
                    disabled={!content.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Créer ma Page ✨
                  </Button>
                  <Button
                    onClick={handleVoiceRecord}
                    variant={isRecording ? "destructive" : "outline"}
                    className="gap-2"
                  >
                    <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                    {isRecording ? 'Arrêter' : 'Voix'}
                  </Button>
                </div>
              </div>

              {/* Nouvelle page qui flotte */}
              <AnimatePresence>
                {showNewPage && newEntry && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -100 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        y: [-10, 10, -10],
                        rotate: [-2, 2, -2]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FloatingCard
                        content={newEntry.content}
                        colorPalette={newEntry.color_palette}
                        badgeText={newEntry.badge_text}
                        isPrecious={newEntry.is_precious}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {loading ? (
                <div className="text-center text-white/60 py-20">
                  Chargement de votre bibliothèque...
                </div>
              ) : (
                <CardGallery entries={entries} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
