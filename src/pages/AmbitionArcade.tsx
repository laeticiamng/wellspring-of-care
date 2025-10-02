import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Zap, Trophy, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const AmbitionArcade = () => {
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();

  const objectives = [
    { id: "simple", name: "Marcher 10 min", emoji: "🚶", difficulty: "Simple", points: 10 },
    { id: "medium", name: "Méditer 15 min", emoji: "🧘", difficulty: "Moyen", points: 25 },
    { id: "ambitious", name: "Écrire 30 min", emoji: "✍️", difficulty: "Ambitieux", points: 50 },
    { id: "reading", name: "Lire 20 min", emoji: "📚", difficulty: "Simple", points: 15 },
    { id: "exercise", name: "Sport 30 min", emoji: "🏃", difficulty: "Moyen", points: 30 },
    { id: "creative", name: "Créer 45 min", emoji: "🎨", difficulty: "Ambitieux", points: 60 },
    { id: "learning", name: "Apprendre 1h", emoji: "🎓", difficulty: "Difficile", points: 75 },
    { id: "social", name: "Contact social 30 min", emoji: "💬", difficulty: "Moyen", points: 35 },
    { id: "nature", name: "Nature 40 min", emoji: "🌳", difficulty: "Moyen", points: 40 },
  ];

  const microLevers = [
    { id: "1", action: "Préparer l'espace", progress: 20 },
    { id: "2", action: "Commencer 5 min", progress: 40 },
    { id: "3", action: "Continuer 10 min", progress: 70 },
    { id: "4", action: "Terminer l'objectif", progress: 100 },
  ];

  const handleSelectObjective = (objId: string) => {
    setSelectedObjective(objId);
    setProgress(0);
    
    track({
      instrument: "GAS",
      item_id: "scaling",
      proxy: "choice",
      value: objId,
      context: { objective: objectives.find(o => o.id === objId)?.name || "" }
    });
  };

  const handleMicroLever = (leverProgress: number) => {
    setProgress(leverProgress);
    
    const completionRatio = leverProgress / 100;
    track({
      instrument: "GAS",
      item_id: "progress",
      proxy: "completion",
      value: completionRatio,
      context: { objective: selectedObjective }
    });

    // Unlock artifacts on full completion
    if (leverProgress === 100) {
      setCompletedMissions(prev => {
        const newCount = prev + 1;
        if (newCount >= 3 && collections.artefacts?.items[0]) {
          unlockItem('artefacts', collections.artefacts.items[0].id);
        }
        return newCount;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Target className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              L'Arcade des Ambitions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque objectif est une mission courte. Complétez des micro-leviers pour débloquer des artefacts rares.
          </p>
          <div className="flex justify-center space-x-2">
            {['🎯', '⚡', '🏆', '🌟'].map((emoji, i) => (
              <span key={i} className="text-2xl animate-bounce-soft" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <Trophy className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">{completedMissions}</p>
              <p className="text-sm text-muted-foreground">Missions accomplies</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <Star className="h-8 w-8 text-accent mx-auto" />
              <p className="text-3xl font-bold text-accent">
                {collections.artefacts?.unlockedCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Artefacts débloqués</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-secondary mx-auto" />
              <p className="text-3xl font-bold text-secondary">{progress}%</p>
              <p className="text-sm text-muted-foreground">Progression</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-5xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary" />
              <span>Choisissez votre objectif</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {objectives.map((obj) => (
                <Card
                  key={obj.id}
                  className={`border-0 cursor-pointer transition-all hover:scale-105 ${
                    selectedObjective === obj.id
                      ? 'bg-gradient-primary/20 shadow-glow'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleSelectObjective(obj.id)}
                >
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="text-4xl">{obj.emoji}</div>
                    <p className="font-medium">{obj.name}</p>
                    <Badge variant="outline">{obj.difficulty}</Badge>
                    <div className="flex items-center justify-center space-x-1 text-primary">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-bold">{obj.points} pts</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedObjective && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Micro-leviers</h3>
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    {progress}% complété
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="space-y-3">
                  {microLevers.map((lever, idx) => (
                    <Button
                      key={lever.id}
                      variant={progress >= lever.progress ? "default" : "outline"}
                      className={progress >= lever.progress ? "bg-gradient-primary text-primary-foreground" : ""}
                      onClick={() => handleMicroLever(lever.progress)}
                      disabled={idx > 0 && progress < microLevers[idx - 1].progress}
                    >
                      {progress >= lever.progress ? "✓" : idx + 1}. {lever.action}
                    </Button>
                  ))}
                </div>

                {progress === 100 && (
                  <div className="text-center p-6 bg-gradient-primary/10 rounded-lg border border-primary/20 animate-scale-in">
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-3 animate-bounce" />
                    <p className="text-lg font-bold text-primary">Mission accomplie ! 🎉</p>
                    <p className="text-sm text-muted-foreground">
                      +{objectives.find(o => o.id === selectedObjective)?.points} points
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Artifacts Collection */}
        {collections.artefacts && collections.artefacts.unlockedCount > 0 && (
          <Card className="max-w-5xl mx-auto border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-accent" />
                <span>Artefacts d'ambition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {collections.artefacts.items.filter(item => item.unlocked).map(item => (
                  <Card key={item.id} className="border-0 bg-gradient-primary/5 hover:scale-105 transition-transform">
                    <CardContent className="pt-6 text-center space-y-2">
                      <div className="text-3xl">{item.emoji}</div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <Badge variant="outline" className="text-xs">{item.rarity}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center text-xs text-primary mt-4">
                {collections.artefacts.unlockedCount}/{collections.artefacts.totalItems} artefacts débloqués
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AmbitionArcade;
