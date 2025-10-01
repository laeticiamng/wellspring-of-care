import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const FlashGlow = () => {
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState("medium");
  const [duration, setDuration] = useState(60);
  const [mantrasCollected, setMantrasCollected] = useState(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const startTime = useRef<number>(0);
  const focusTime = useRef<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);

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

  const handleComplete = () => {
    track({
      instrument: "SUDS",
      item_id: "focus",
      proxy: "duration",
      value: focusTime.current
    });

    // Unlock mantras after successful sessions
    setMantrasCollected(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 && collections.mantras?.items[0]) {
        unlockItem('mantras', collections.mantras.items[0].id);
      }
      return newCount;
    });

    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Chambre des Lumières
            </h1>
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

            {/* Intensity Control */}
            <div className="space-y-3">
              <h3 className="font-medium text-center">Intensité</h3>
              <div className="flex justify-center space-x-3">
                {['low', 'medium', 'high'].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={intensity === level ? "default" : "outline"}
                    className={intensity === level ? "bg-gradient-primary" : ""}
                    onClick={() => setIntensity(level)}
                    disabled={isActive}
                  >
                    {level === 'low' ? 'Basse' : level === 'medium' ? 'Moyenne' : 'Haute'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration Control */}
            <div className="space-y-3">
              <h3 className="font-medium text-center">Durée</h3>
              <div className="flex justify-center space-x-3">
                {[30, 60, 120].map((sec) => (
                  <Button
                    key={sec}
                    size="sm"
                    variant={duration === sec ? "default" : "outline"}
                    className={duration === sec ? "bg-gradient-primary" : ""}
                    onClick={() => setDuration(sec)}
                    disabled={isActive}
                  >
                    {sec}s
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
