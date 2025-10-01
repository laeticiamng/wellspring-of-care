import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useEmotionalScan } from "@/hooks/useEmotionalScan";
import { MaskGallery } from "@/components/MaskGallery";
import { MaskFusion } from "@/components/MaskFusion";
import { MoodBadge } from "@/components/MoodBadge";
import { UserMaskCollection } from "@/components/UserMaskCollection";
import { motion } from "framer-motion";
import { Scan } from "lucide-react";

const EmotionalScan = () => {
  const { scanning, result, startScan, submitScan, reset } = useEmotionalScan();
  const [phase, setPhase] = useState<'welcome' | 'scanning' | 'fusion' | 'badge' | 'collection'>('welcome');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedGesture, setSelectedGesture] = useState<string>('');
  const [gestureStartTime, setGestureStartTime] = useState<number>(0);
  const [collectedMasks, setCollectedMasks] = useState<any[]>([]);

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

  const handleContinue = () => {
    if (result) {
      setCollectedMasks([...collectedMasks, result.maskGenerated]);
    }
    setPhase('collection');
  };

  const handleNewScan = () => {
    reset();
    setPhase('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <Header />

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
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                La Galerie des Masques
              </h1>
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

          {collectedMasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={() => setPhase('collection')}
              >
                Voir ma collection ({collectedMasks.length})
              </Button>
            </motion.div>
          )}
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
