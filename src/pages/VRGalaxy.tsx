import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Glasses, Stars, Sparkles } from "lucide-react";
import { useState } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const VRGalaxy = () => {
  const [navigationSpeed, setNavigationSpeed] = useState<string>("");
  const [effectsReduced, setEffectsReduced] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();

  const handleStartSession = (speed: string) => {
    setNavigationSpeed(speed);
    setSessionActive(true);
    setSessionStartTime(Date.now());

    // Track navigation choice for POMS tension
    track({
      instrument: "POMS",
      item_id: "tension",
      proxy: "choice",
      value: speed === "slow" ? "slow_nav" : "fast_nav",
      context: { environment: "galaxy" }
    });
  };

  const handleReduceEffects = () => {
    setEffectsReduced(true);
    track({
      instrument: "SSQ",
      item_id: "nausea",
      proxy: "choice",
      value: "reduce_effects"
    });
  };

  const handleEndSession = () => {
    const duration = Date.now() - sessionStartTime;
    
    // Unlock constellations after successful journey
    if (duration >= 60000 && collections.constellations?.items[0]) {
      unlockItem('constellations', collections.constellations.items[0].id);
    }
    
    setSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Stars className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Constellation des Émotions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Voyagez entre les étoiles. Chaque constellation porte une émotion que vous pouvez explorer.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            ✨ Débloquez des constellations rares ✨
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Glasses className="h-6 w-6 text-primary" />
              <span>Voyage galactique</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNTAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjciLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-50"></div>
              <div className="text-center space-y-4 relative z-10">
                <Stars className="h-20 w-20 text-primary mx-auto animate-float" />
                <p className="text-xl font-semibold">
                  {sessionActive ? "En voyage..." : "Prêt pour l'exploration"}
                </p>
                <p className="text-muted-foreground">
                  {sessionActive 
                    ? `Navigation ${navigationSpeed === "slow" ? "lente" : "standard"} activée` 
                    : "Sélectionnez votre vitesse de navigation"}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {!sessionActive ? (
                <>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground shadow-glow"
                    onClick={() => handleStartSession("slow")}
                  >
                    Navigation lente
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleStartSession("standard")}
                  >
                    Navigation standard
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground"
                    onClick={handleEndSession}
                  >
                    Terminer le voyage
                  </Button>
                  <Button variant="outline" onClick={handleReduceEffects}>
                    {effectsReduced ? "✓ Effets réduits" : "Réduire effets"}
                  </Button>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {['Nébuleuse calme', 'Amas stellaire', 'Trou noir contemplatif'].map((zone, idx) => (
                <Card key={zone} className="border-0 bg-muted/50 hover:bg-primary/10 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center space-y-2">
                    <Sparkles className="h-8 w-8 text-primary mx-auto" />
                    <p className="font-medium text-sm">{zone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Constellations Collection */}
            {collections.constellations && collections.constellations.unlockedCount > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-healing/10 border border-accent/20">
                <div className="text-center space-y-3">
                  <p className="text-sm font-semibold text-accent">✨ Constellations découvertes</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {collections.constellations.items.filter(item => item.unlocked).map(item => (
                      <div key={item.id} className="text-center">
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary">
                    {collections.constellations.unlockedCount}/{collections.constellations.totalItems} constellations débloquées
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

export default VRGalaxy;
