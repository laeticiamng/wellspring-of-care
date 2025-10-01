import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Glasses, Wind, Sparkles } from "lucide-react";
import { useState } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const VRBreath = () => {
  const [particlesReduced, setParticlesReduced] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionStartTime(Date.now());
  };

  const handleEndSession = () => {
    const duration = Date.now() - sessionStartTime;
    
    // Track SSQ discomfort if quit early
    if (duration < 45000) {
      track({
        instrument: "SSQ",
        item_id: "discomfort",
        proxy: "skip",
        value: "<45s",
        context: { duration: String(duration) }
      });
    } else {
      // Success - unlock temple cocons
      if (collections.cocons?.items[1]) {
        unlockItem('cocons', collections.cocons.items[1].id);
      }
    }
    
    setSessionActive(false);
  };

  const handleReduceParticles = () => {
    setParticlesReduced(true);
    track({
      instrument: "SSQ",
      item_id: "nausea",
      proxy: "choice",
      value: "reduce_particles"
    });
  };
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Glasses className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Temple de l'Air
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temple suspendu dans le ciel. Chaque respiration peint une onde lumineuse sur les colonnes.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌬️ Votre souffle devient œuvre d'art 🌬️
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-primary" />
              <span>Environnement VR</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Glasses className="h-16 w-16 text-primary mx-auto animate-float" />
                <p className="text-lg font-medium">Mettez votre casque VR</p>
                <p className="text-muted-foreground">L'expérience commence dans 3 secondes...</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-gradient-primary text-primary-foreground shadow-glow"
                onClick={sessionActive ? handleEndSession : handleStartSession}
              >
                {sessionActive ? "Terminer l'expérience" : "Lancer l'expérience"}
              </Button>
              <Button variant="outline">
                Mode 2D
              </Button>
              {sessionActive && (
                <Button variant="outline" onClick={handleReduceParticles}>
                  {particlesReduced ? "✓ Particules réduites" : "Réduire particules"}
                </Button>
              )}
            </div>

            {sessionActive && (
              <div className="text-center p-4 bg-gradient-primary/10 rounded-lg">
                <p className="text-sm text-primary">Session en cours... Respirez profondément 🌬️</p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {['Temple zen', 'Forêt mystique', 'Plage céleste'].map((env) => (
                <Card key={env} className="border-0 bg-muted/50 hover:bg-primary/10 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">{env}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Temple Cocons Collection */}
            {collections.cocons && collections.cocons.unlockedCount > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-healing/10 border border-accent/20">
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-accent">🏛️ Cocons temples</p>
                  <div className="flex justify-center space-x-3">
                    {collections.cocons.items.filter(item => item.unlocked).map(item => (
                      <div key={item.id} className="text-center">
                        <span className="text-2xl">{item.emoji}</span>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary">
                    {collections.cocons.unlockedCount}/{collections.cocons.totalItems} cocons débloqués
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

export default VRBreath;
