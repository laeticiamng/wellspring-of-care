import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Music, Sparkles, Lock, Trophy, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ForestScene from "@/components/ForestScene";
import { MusicSync } from "@/components/MusicSync";
import FragmentGallery from "@/components/FragmentGallery";
import { useMusicTherapy } from "@/hooks/useMusicTherapy";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useModuleProgress } from "@/hooks/useModuleProgress";

type Phase = 'welcome' | 'select' | 'journey' | 'result' | 'gallery';

type ForestType = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  xpReward: number;
  mood: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

const forests: ForestType[] = [
  { id: 'spring', name: 'Forêt du Printemps', emoji: '🌸', description: 'Douce renaissance', unlockLevel: 1, xpReward: 100, mood: 'calm', rarity: 'common' },
  { id: 'summer', name: 'Jungle d\'Été', emoji: '☀️', description: 'Énergie vibrante', unlockLevel: 1, xpReward: 100, mood: 'energized', rarity: 'common' },
  { id: 'autumn', name: 'Bois d\'Automne', emoji: '🍂', description: 'Contemplation paisible', unlockLevel: 3, xpReward: 150, mood: 'contemplative', rarity: 'rare' },
  { id: 'winter', name: 'Clairière Hivernale', emoji: '❄️', description: 'Silence cristallin', unlockLevel: 5, xpReward: 200, mood: 'serene', rarity: 'rare' },
  { id: 'mystic', name: 'Forêt Mystique', emoji: '🌙', description: 'Magie nocturne', unlockLevel: 7, xpReward: 250, mood: 'mystical', rarity: 'epic' },
  { id: 'cosmic', name: 'Bosquet Cosmique', emoji: '🌌', description: 'Entre les étoiles', unlockLevel: 10, xpReward: 300, mood: 'transcendent', rarity: 'epic' },
  { id: 'aurora', name: 'Forêt Boréale', emoji: '🌈', description: 'Lumières dansantes', unlockLevel: 15, xpReward: 400, mood: 'ethereal', rarity: 'legendary' },
  { id: 'crystal', name: 'Vallée de Cristal', emoji: '💎', description: 'Résonance pure', unlockLevel: 20, xpReward: 500, mood: 'harmonic', rarity: 'legendary' },
];

const XP_PER_LEVEL = 500;

export default function MusicTherapy() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [audioLevel, setAudioLevel] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [selectedForest, setSelectedForest] = useState<ForestType | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const { session, result, loading, startSession, submitSession, reset } = useMusicTherapy();
  const { track } = useImplicitTracking();
  const progress = useModuleProgress('music_therapy');

  const handleForestSelect = (forest: ForestType) => {
    if (forest.unlockLevel > progress.userLevel) return;
    setSelectedForest(forest);
  };

  const handleStart = async () => {
    if (!selectedForest) return;
    
    track({
      instrument: 'music-therapy',
      item_id: `forest-${selectedForest.id}`,
      proxy: 'engagement',
      value: 1,
    });

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
    if (!session || !selectedForest) return;

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const moodStatePost = {
      tension: 2,
      fatigue: 2,
      energy: 4,
    };

    const resultData = await submitSession(session.sessionId, moodStatePost, duration, interactions);
    if (resultData) {
      // Calculate XP
      const baseXP = selectedForest.xpReward;
      const durationBonus = Math.floor(duration / 60) * 5;
      const totalEarnedXP = baseXP + durationBonus;
      
      // Add XP and unlock forest
      await progress.addXP(totalEarnedXP, selectedForest.id);
      
      const newLevel = Math.floor((progress.totalXP + totalEarnedXP) / XP_PER_LEVEL) + 1;
      if (newLevel > progress.userLevel) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      // Update session count
      const currentSessions = progress.metadata.completedSessions || 0;
      await progress.setMetadata('completedSessions', currentSessions + 1);

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
    setSelectedForest(null);
  };

  const currentLevelXP = progress.totalXP % XP_PER_LEVEL;
  const progressPercent = (currentLevelXP / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - currentLevelXP;

  if (progress.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-primary text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Level up animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow">
              <CardContent className="pt-6 text-center space-y-4">
                <Trophy className="w-20 h-20 mx-auto text-primary animate-bounce" />
                <h2 className="text-4xl font-bold">Niveau {progress.userLevel}!</h2>
                <p className="text-muted-foreground">Nouvelles forêts débloquées</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">Les Forêts Sonores</h1>
                    <div className="px-3 py-1 bg-primary/20 rounded-full">
                      <span className="text-sm font-bold text-primary">Niv.{progress.userLevel}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Explore des forêts musicales uniques
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="text-primary">{progress.totalXP} XP ({xpToNextLevel} vers niv.{progress.userLevel + 1})</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPhase('select')}
                    size="lg"
                    className="flex-1"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Choisir une forêt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewGallery}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Phase: Forest Selection */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-4 py-20"
          >
            <div className="max-w-6xl mx-auto space-y-6">
              <Button variant="ghost" onClick={() => setPhase('welcome')}>
                ← Retour
              </Button>
              <h2 className="text-3xl font-bold text-center">Choisis ta forêt</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forests.map((forest) => {
                  const isLocked = forest.unlockLevel > progress.userLevel;
                  const isCompleted = progress.unlockedItems.includes(forest.id);
                  return (
                    <motion.div
                      key={forest.id}
                      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          isLocked ? 'opacity-50' : 
                          selectedForest?.id === forest.id ? 'border-primary shadow-glow' :
                          'hover:border-primary/50'
                        } ${isCompleted ? 'bg-primary/5' : ''}`}
                        onClick={() => handleForestSelect(forest)}
                      >
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="text-5xl">{forest.emoji}</div>
                          <h3 className="font-bold">{forest.name}</h3>
                          <p className="text-sm text-muted-foreground">{forest.description}</p>
                          <div className="flex items-center justify-center gap-2">
                            {isLocked ? (
                              <>
                                <Lock className="w-4 h-4" />
                                <span className="text-xs">Niveau {forest.unlockLevel}</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs text-primary">+{forest.xpReward} XP</span>
                              </>
                            )}
                          </div>
                          {isCompleted && (
                            <div className="text-xs text-primary">✓ Complétée</div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              {selectedForest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button
                    onClick={handleStart}
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-primary"
                  >
                    {loading ? "Chargement..." : `Explorer ${selectedForest.name}`}
                  </Button>
                </motion.div>
              )}
            </div>
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
