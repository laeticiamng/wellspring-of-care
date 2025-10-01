import { useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { Swords, Trophy, Sword } from "lucide-react";

const BossGrit = () => {
  const { track } = useImplicitTracking();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completionRatio, setCompletionRatio] = useState(0);
  const [auraLevel, setAuraLevel] = useState(1);

  const challenges = [
    { id: 1, name: 'Défi du Courage', difficulty: 'Facile', emoji: '⚔️' },
    { id: 2, name: 'Défi de la Patience', difficulty: 'Moyen', emoji: '🛡️' },
    { id: 3, name: 'Défi de la Ténacité', difficulty: 'Difficile', emoji: '👑' },
  ];

  const handleChallengeComplete = (ratio: number) => {
    setCompletionRatio(ratio);
    track({
      instrument: "GRITS",
      item_id: "consistency",
      proxy: "completion",
      value: ratio
    });

    if (ratio >= 0.8) {
      setAuraLevel(prev => Math.min(prev + 1, 10));
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
      }
    }
  };

  const handleRetry = () => {
    track({
      instrument: "BRS",
      item_id: "bounce",
      proxy: "repeat",
      value: "retry_48h"
    });
    setCompletionRatio(0);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sword className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              L'Arène de la Persévérance
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Arène RPG émotionnelle. Chaque défi réussi agrandit votre aura héroïque, comme un chevalier émotionnel.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            ⚔️ Votre aura se renforce à chaque retour ⚔️
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 animate-scale-in space-y-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Swords className="w-12 h-12 text-primary animate-pulse-soft" />
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center animate-glow"
                  style={{
                    transform: `scale(${1 + (auraLevel / 20)})`,
                    transition: 'transform 0.5s ease-out'
                  }}
                >
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  Niveau {auraLevel}
                </div>
              </div>
              <Swords className="w-12 h-12 text-primary animate-pulse-soft" />
            </div>
            <p className="text-2xl font-bold mb-2">Arène de la Persévérance</p>
            <p className="text-muted-foreground">Ton aura héroïque grandit à chaque victoire</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Défi actuel : {challenges[currentChallenge].name}
            </h3>
            
            <div className="p-6 bg-muted rounded-lg text-center space-y-4">
              <div className="text-6xl">{challenges[currentChallenge].emoji}</div>
              <div className="space-y-2">
                <p className="font-semibold">Difficulté: {challenges[currentChallenge].difficulty}</p>
                <Progress value={completionRatio * 100} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Progression: {Math.round(completionRatio * 100)}%
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleChallengeComplete(0.3)}
                variant="outline"
              >
                Tentative (+30%)
              </Button>
              <Button
                size="lg"
                onClick={() => handleChallengeComplete(0.7)}
                variant="outline"
              >
                Bon effort (+70%)
              </Button>
              <Button
                size="lg"
                onClick={() => handleChallengeComplete(1.0)}
              >
                Victoire! (+100%)
              </Button>
            </div>

            {completionRatio > 0 && completionRatio < 1 && (
              <div className="text-center">
                <Button variant="ghost" onClick={handleRetry}>
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        </Card>

        {auraLevel >= 3 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-soft p-6 animate-fade-in bg-gradient-to-br from-primary/5 to-primary/20">
            <p className="text-center text-lg">
              🌟 Ton aura héroïque rayonne ! Continue pour la faire grandir encore plus.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BossGrit;
