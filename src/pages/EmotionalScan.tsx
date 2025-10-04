import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEmotionalScan } from "@/hooks/useEmotionalScan";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Lock, Trophy, Sparkles as SparklesIcon, Scan } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MaskGallery } from "@/components/MaskGallery";
import { MaskFusion } from "@/components/MaskFusion";
import { MoodBadge } from "@/components/MoodBadge";
import { UserMaskCollection } from "@/components/UserMaskCollection";
import { motion, AnimatePresence } from "framer-motion";

type MaskRarity = 'common' | 'rare' | 'epic' | 'legendary';

const maskTiers = [
  { rarity: 'common' as MaskRarity, unlockLevel: 1, xpReward: 50, emoji: '🎭' },
  { rarity: 'rare' as MaskRarity, unlockLevel: 3, xpReward: 100, emoji: '✨' },
  { rarity: 'epic' as MaskRarity, unlockLevel: 7, xpReward: 200, emoji: '💫' },
  { rarity: 'legendary' as MaskRarity, unlockLevel: 12, xpReward: 400, emoji: '🌟' },
];

const EmotionalScan = () => {
  const { scanning, result, startScan, submitScan, reset } = useEmotionalScan();
  const [phase, setPhase] = useState<'welcome' | 'scanning' | 'fusion' | 'badge' | 'collection'>('welcome');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedGesture, setSelectedGesture] = useState<string>('');
  const [gestureStartTime, setGestureStartTime] = useState<number>(0);
  const [collectedMasks, setCollectedMasks] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const {
    userLevel,
    totalXP,
    addXP,
    metadata,
    setMetadata,
    loading: progressLoading
  } = useModuleProgress("emotional-scan");

  const handleStart = () => {
    startScan();
    setPhase('scanning');
    setSelectedTheme('');
    setSelectedGesture('');
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleGestureSelect = (gesture: string) => {
    setSelectedGesture(gesture);
    setGestureStartTime(Date.now());
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    // Auto-submit after selection
    setTimeout(() => {
      const duration = Date.now() - gestureStartTime;
      const scanResult = submitScan(selectedTheme, gesture, duration);
      setPhase('fusion');
    }, 800);
  };

  const handleFusionComplete = () => {
    setPhase('badge');
  };

  const handleContinue = async () => {
    if (result) {
      const maskRarity = result.maskGenerated.rarity || 'common';
      const tier = maskTiers.find(t => t.rarity === maskRarity);
      const xpGain = tier?.xpReward || 50;
      
      // Add XP
      await addXP(xpGain, result.maskGenerated.id || Date.now().toString());

      const newMasks = [...collectedMasks, { ...result.maskGenerated, timestamp: Date.now() }];
      setCollectedMasks(newMasks);
      
      // Update masks and fusions in metadata
      await setMetadata('collectedMasks', newMasks);

      // Check for fusion opportunity (every 3 masks)
      if (newMasks.length % 3 === 0) {
        const currentFusions = (metadata.fusionCount || 0) + 1;
        await setMetadata('fusionCount', currentFusions);
      }
    }
    setPhase('collection');
  };

  const handleNewScan = () => {
    reset();
    setPhase('welcome');
  };

  const fusionCount = metadata.fusionCount || 0;
  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = ((totalXP % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <Header />

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
                <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
                <p className="text-muted-foreground">Nouveaux masques débloqués</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome phase */}
      {phase === 'welcome' && (
        <div className="container mx-auto px-4 py-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <Scan className="h-16 w-16 text-primary" />
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    La Galerie des Masques
                  </h1>
                  <div className="px-3 py-1 bg-primary/20 rounded-full">
                    <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progression</span>
                <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une galerie de masques flottants. À chaque geste, un masque s'anime et vient se poser près de toi.
            </p>
            
            <motion.p
              className="text-lg text-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎭 Ton avatar se transforme sous tes yeux 🎭
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleStart}
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Choisis ton masque aujourd'hui 🎭
            </Button>
          </motion.div>

          <div className="flex gap-4 items-center justify-center">
            {collectedMasks.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setPhase('collection')}
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Collection ({collectedMasks.length} masques)
              </Button>
            )}
            {fusionCount > 0 && (
              <div className="px-4 py-2 bg-primary/20 rounded-full">
                <span className="text-sm font-bold text-primary">
                  🔮 {fusionCount} fusions disponibles
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scanning phase */}
      {phase === 'scanning' && (
        <MaskGallery
          onThemeSelect={handleThemeSelect}
          onGestureSelect={handleGestureSelect}
          selectedTheme={selectedTheme}
          selectedGesture={selectedGesture}
        />
      )}

      {/* Fusion phase */}
      {phase === 'fusion' && result && (
        <MaskFusion
          mask={result.maskGenerated}
          onComplete={handleFusionComplete}
        />
      )}

      {/* Badge reveal phase */}
      {phase === 'badge' && result && (
        <MoodBadge
          badge={result.badge}
          emoji={result.badgeEmoji}
          maskName={result.maskGenerated.name}
          onContinue={handleContinue}
        />
      )}

      {/* Collection phase */}
      {phase === 'collection' && (
        <div className="container mx-auto px-4 py-12">
          <UserMaskCollection masks={collectedMasks} />
          
          <div className="text-center mt-12 space-x-4">
            <Button
              size="lg"
              onClick={handleNewScan}
            >
              Scanner à nouveau 🎭
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              Retour au Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalScan;
