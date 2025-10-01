import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ForestScene from "@/components/ForestScene";
import { MusicSync } from "@/components/MusicSync";
import FragmentGallery from "@/components/FragmentGallery";
import { useMusicTherapy } from "@/hooks/useMusicTherapy";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";

type Phase = 'welcome' | 'journey' | 'result' | 'gallery';

export default function MusicTherapy() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [audioLevel, setAudioLevel] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const { session, result, loading, startSession, submitSession, reset } = useMusicTherapy();
  const { track } = useImplicitTracking();

  const handleStart = async () => {
    // Track start
    track({
      instrument: 'music-therapy',
      item_id: 'session-start',
      proxy: 'engagement',
      value: 1,
    });

    // Mood state implicite (à partir du dernier scan ou par défaut)
    const moodState = {
      tension: 3,
      fatigue: 3,
      energy: 3,
    };

    const sessionData = await startSession(moodState);
    if (sessionData) {
      setPhase('journey');
      setSessionStartTime(Date.now());
    }
  };

  const handleTreeTouch = (treeId: number) => {
    setInteractions(prev => prev + 1);
    track({
      instrument: 'music-therapy',
      item_id: `tree-${treeId}`,
      proxy: 'interaction',
      value: 1,
    });
  };

  const handleMove = () => {
    setInteractions(prev => prev + 1);
  };

  const handleSessionEnd = async () => {
    if (!session) return;

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const moodStatePost = {
      tension: 2,
      fatigue: 2,
      energy: 4,
    };

    const resultData = await submitSession(session.sessionId, moodStatePost, duration, interactions);
    if (resultData) {
      setPhase('result');
    }
  };

  const handleViewGallery = () => {
    setPhase('gallery');
  };

  const handleRestart = () => {
    reset();
    setPhase('welcome');
    setInteractions(0);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Phase: Welcome */}
      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <Card className="max-w-md bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6 text-center space-y-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Music className="w-16 h-16 mx-auto text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">La Forêt Sonore 🌲🎶</h1>
                  <p className="text-muted-foreground">
                    Plonge dans ta forêt musicale
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Touche les arbres lumineux</p>
                  <p>• Laisse-toi porter par les sons</p>
                  <p>• Découvre des fragments rares</p>
                </div>
                <Button
                  onClick={handleStart}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Chargement..." : "Commencer le voyage"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewGallery}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Voir ma collection
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Phase: Journey */}
        {phase === 'journey' && session && (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            <ForestScene
              breathLevel={audioLevel}
              isActive={phase === 'journey'}
            />
            <MusicSync
              musicUrl={session.musicUrl}
              onAudioLevel={setAudioLevel}
              onEnded={handleSessionEnd}
            />

            {/* UI Overlay */}
            <div className="fixed top-4 left-4 right-4 z-10 flex justify-between items-start">
              <Card className="bg-card/30 backdrop-blur-sm border-border/30">
                <CardContent className="p-3 text-xs">
                  <div className="text-muted-foreground">Interactions</div>
                  <div className="text-xl font-bold">{interactions}</div>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSessionEnd}
                className="bg-card/30 backdrop-blur-sm"
              >
                Terminer
              </Button>
            </div>

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
              <Card className="bg-card/30 backdrop-blur-sm border-border/30">
                <CardContent className="p-3 text-sm text-center text-muted-foreground">
                  Touche les arbres lumineux 🌲
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <Card className="max-w-md bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="text-6xl mb-4">
                    {result.badge.includes('Apaisement') && '🌿'}
                    {result.badge.includes('Fatigue') && '🎶'}
                    {result.badge.includes('Sérénité') && '✨'}
                    {result.badge.includes('tendu') && '🌌'}
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold">{result.badge}</h2>
                
                {result.fragmentUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Fragment débloqué !</p>
                    <p className="text-sm text-muted-foreground">
                      Rareté : {result.fragment?.rarity}
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleViewGallery} variant="outline" className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Collection
                  </Button>
                  <Button onClick={handleRestart} className="flex-1">
                    Rejouer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Phase: Gallery */}
        {phase === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-4 py-20"
          >
            <div className="max-w-6xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setPhase('welcome')}
                className="mb-6"
              >
                ← Retour
              </Button>
              <FragmentGallery fragments={[]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
