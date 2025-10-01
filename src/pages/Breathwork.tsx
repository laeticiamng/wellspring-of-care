import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Waves, Cloud } from "lucide-react";
import { useState, useRef } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const Breathwork = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  const [nightsUsed, setNightsUsed] = useState(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const startTime = useRef<number>(0);
  const cadenceFollowed = useRef<number>(0);
  const cadenceTotal = useRef<number>(0);

  const handleStartSession = (technique: string) => {
    setSelectedTechnique(technique);
    setIsActive(true);
    startTime.current = Date.now();
    cadenceFollowed.current = 0;
    cadenceTotal.current = 0;
  };

  const handleBreathCycle = (followed: boolean) => {
    cadenceTotal.current += 1;
    if (followed) cadenceFollowed.current += 1;
  };

  const handleEndSession = () => {
    const duration = Date.now() - startTime.current;
    const followRatio = cadenceTotal.current > 0 
      ? cadenceFollowed.current / cadenceTotal.current 
      : 0;

    // Track cadence followed for STAI
    track({
      instrument: "STAI6",
      item_id: "calm",
      proxy: "cadence_followed",
      value: followRatio,
      context: { technique: selectedTechnique, duration: String(duration) }
    });

    // Track for ISI if sleep preset used repeatedly
    if (selectedTechnique === "sleep") {
      setNightsUsed(prev => {
        const newNights = prev + 1;
        if (newNights >= 2) {
          track({
            instrument: "ISI",
            item_id: "sleep_onset",
            proxy: "repeat",
            value: "preset_sleep",
            context: { nights: String(newNights) }
          });
        }
        return newNights;
      });
    }

    // Unlock badges after repeated use
    if (followRatio >= 0.7 && collections.badges_resp?.items[0]) {
      unlockItem('badges_resp', collections.badges_resp.items[0].id);
    }

    setIsActive(false);
  };
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Waves className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              L'Océan Intérieur
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plongez dans un océan calme. À chaque expiration, une vague douce vient vous porter.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌊 Devenez "Maître des vagues" 🌊
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-healing/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-primary" />
              <span>Breathwork guidé</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Cloud className="h-20 w-20 text-primary mx-auto animate-pulse-soft" />
                <p className="text-xl font-semibold">Technique Wim Hof</p>
                <p className="text-muted-foreground">30 respirations • 3 cycles</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-gradient-primary text-primary-foreground shadow-glow"
                onClick={() => handleStartSession("wim_hof")}
                disabled={isActive}
              >
                {isActive ? "Session en cours..." : "Commencer la session"}
              </Button>
              {isActive && (
                <Button variant="outline" onClick={handleEndSession}>
                  Terminer
                </Button>
              )}
            </div>

            {isActive && (
              <div className="space-y-4">
                <div className="text-center space-y-3 p-6 bg-gradient-primary/10 rounded-lg">
                  <Cloud className="h-16 w-16 text-primary mx-auto animate-pulse-soft" />
                  <p className="text-lg font-semibold">Suivez le rythme</p>
                  <div className="flex justify-center space-x-4">
                    <Button size="sm" onClick={() => handleBreathCycle(true)}>
                      ✓ Suivi
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBreathCycle(false)}>
                      Manqué
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cadenceFollowed.current}/{cadenceTotal.current} cycles suivis
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'wim_hof', name: 'Wim Hof', desc: '30 respirations profondes' },
                { id: 'pranayama', name: 'Pranayama', desc: 'Respiration yogique' },
                { id: 'sleep', name: 'Sommeil', desc: 'Expiration longue (ISI)' }
              ].map((technique) => (
                <Card 
                  key={technique.id} 
                  className={`border-0 shadow-soft hover:shadow-glow transition-shadow cursor-pointer ${
                    selectedTechnique === technique.id ? 'bg-gradient-primary/20' : ''
                  }`}
                  onClick={() => handleStartSession(technique.id)}
                >
                  <CardContent className="pt-6 text-center space-y-2">
                    <Wind className="h-8 w-8 text-primary mx-auto" />
                    <p className="font-medium">{technique.name}</p>
                    <p className="text-sm text-muted-foreground">{technique.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Badges Collection */}
            {collections.badges_resp && collections.badges_resp.unlockedCount > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-healing/10 border border-accent/20">
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-accent">🌊 Badges respiratoires</p>
                  <div className="flex justify-center space-x-3">
                    {collections.badges_resp.items.filter(item => item.unlocked).map(item => (
                      <div key={item.id} className="text-center">
                        <span className="text-2xl">{item.emoji}</span>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary">
                    {collections.badges_resp.unlockedCount}/{collections.badges_resp.totalItems} badges débloqués
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

export default Breathwork;
