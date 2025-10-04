import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { useModuleProgress } from "@/hooks/useModuleProgress";

const FlashGlow = () => {
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState("medium");
  const [duration, setDuration] = useState(60);
  const [mantrasCollected, setMantrasCollected] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const { track } = useImplicitTracking();
  const { collections, unlockItem: unlockCollectionItem } = useCollections();
  const startTime = useRef<number>(0);
  const focusTime = useRef<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const {
    userLevel,
    totalXP,
    unlockedItems: unlockedIntensities,
    addXP,
    unlockItem,
    metadata,
    setMetadata,
    loading: progressLoading
  } = useModuleProgress("flashglow");

  const intensityTiers = [
    { id: 'gentle', name: '🌙 Douce', unlockLevel: 1 },
    { id: 'low', name: '💫 Basse', unlockLevel: 1 },
    { id: 'medium', name: '✨ Moyenne', unlockLevel: 1 },
    { id: 'high', name: '⚡ Haute', unlockLevel: 3 },
    { id: 'ultra', name: '🔥 Ultra', unlockLevel: 6 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
        focusTime.current += 1000;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    startTime.current = Date.now();
    focusTime.current = 0;
    setTimeLeft(duration);
  };

  const handleStop = () => {
    if (isActive) {
      track({
        instrument: "SUDS",
        item_id: "distress",
        proxy: "repeat",
        value: "stop",
        context: { duration: String(focusTime.current) }
      });
    }
    setIsActive(false);
  };

  const handleAgain = () => {
    track({
      instrument: "SUDS",
      item_id: "distress",
      proxy: "repeat",
      value: "again",
      context: { duration: String(duration) }
    });
    handleStart();
  };

  const handleComplete = async () => {
    track({
      instrument: "SUDS",
      item_id: "focus",
      proxy: "duration",
      value: focusTime.current
    });

    // Calculate XP
    const baseXP = 35;
    const durationBonus = Math.floor(duration / 20) * 5;
    const intensityBonus = intensity === 'ultra' ? 30 : intensity === 'high' ? 20 : intensity === 'medium' ? 10 : 5;
    const totalXPGain = baseXP + durationBonus + intensityBonus;

    // Add XP
    await addXP(totalXPGain);
    
    // Update flash count in metadata
    const currentFlashes = (metadata.totalFlashes || 0) + 1;
    await setMetadata('totalFlashes', currentFlashes);

    // Check for intensity unlocks
    for (const tier of intensityTiers) {
      if (tier.unlockLevel <= userLevel && !unlockedIntensities.includes(tier.id)) {
        await unlockItem(tier.id);
      }
    }

    // Unlock mantras after successful sessions
    setMantrasCollected(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 && collections.mantras?.items[0]) {
        unlockCollectionItem('mantras', collections.mantras.items[0].id);
      }
      return newCount;
    });

    setIsActive(false);
  };

  const totalFlashes = metadata.totalFlashes || 0;
  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = ((totalXP % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-calm relative">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">⚡</div>
              <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
              <p className="text-muted-foreground">Nouvelle intensité débloquée</p>
            </div>
          </Card>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="h-12 w-12 text-primary animate-glow" />
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  La Chambre des Lumières
                </h1>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalFlashes} sessions</span>
                  <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Respirez au rythme des flashs lumineux. Chaque cycle dévoile un mot-clé caché.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            💫 Collectionnez les mantras secrets 💫
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Session Flash Glow</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`aspect-video rounded-lg flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-gradient-primary animate-pulse' 
                : 'bg-gradient-primary/20'
            }`}>
              <div className="text-center space-y-4">
                <Sparkles className={`h-20 w-20 mx-auto ${
                  isActive ? 'text-primary-foreground animate-spin' : 'text-primary'
                }`} />
                <p className="text-xl font-semibold">
                  {isActive 
                    ? `${timeLeft}s restantes` 
                    : "Démarrer Flash Glow"}
                </p>
                <p className="text-muted-foreground">
                  {isActive ? "Respirez en suivant la lumière..." : "Préparez-vous à briller"}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {!isActive ? (
                <>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground shadow-glow"
                    onClick={handleStart}
                  >
                    Démarrer Flash Glow
                  </Button>
                  {mantrasCollected > 0 && (
                    <Button variant="outline" onClick={handleAgain}>
                      Encore {duration}s
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="outline" onClick={handleStop}>
                  Arrêter
                </Button>
              )}
            </div>

            {/* Intensity Control - ENRICHED */}
            <div className="space-y-3">
              <h3 className="font-medium text-center">Intensité Lumineuse</h3>
              <div className="flex justify-center space-x-3 flex-wrap gap-2">
                {intensityTiers.map(({ id, name }) => (
                  <Button
                    key={id}
                    size="sm"
                    variant={intensity === id ? "default" : "outline"}
                    className={intensity === id ? "bg-gradient-primary" : ""}
                    onClick={() => setIntensity(id)}
                    disabled={isActive || !unlockedIntensities.includes(id)}
                  >
                    {unlockedIntensities.includes(id) ? name : '🔒 ' + name.split(' ')[1]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration Control - ENRICHED */}
            <div className="space-y-3">
              <h3 className="font-medium text-center">Durée de Session</h3>
              <div className="flex justify-center space-x-3 flex-wrap gap-2">
                {[
                  { sec: 15, label: 'Flash' },
                  { sec: 30, label: 'Rapide' },
                  { sec: 60, label: 'Standard' },
                  { sec: 120, label: 'Profond' },
                  { sec: 180, label: 'Immersif' },
                  { sec: 300, label: 'Transformatif' }
                ].map(({ sec, label }) => (
                  <Button
                    key={sec}
                    size="sm"
                    variant={duration === sec ? "default" : "outline"}
                    className={duration === sec ? "bg-gradient-primary" : ""}
                    onClick={() => setDuration(sec)}
                    disabled={isActive}
                  >
                    {sec}s • {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mantras Collection */}
            {collections.mantras && collections.mantras.unlockedCount > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-healing/10 border border-accent/20">
                <div className="text-center space-y-3">
                  <p className="text-sm font-semibold text-accent">🌱 Mantras débloqués</p>
                  <div className="space-y-2">
                    {collections.mantras.items.filter(item => item.unlocked).map(item => (
                      <div key={item.id} className="p-2 bg-muted/30 rounded">
                        <p className="text-sm font-medium">{item.emoji} {item.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary">
                    {collections.mantras.unlockedCount}/{collections.mantras.totalItems} mantras collectés
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FlashGlow;
