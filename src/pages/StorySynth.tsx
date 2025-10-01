import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const StorySynth = () => {
  const [selectedNarration, setSelectedNarration] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedStories, setCompletedStories] = useState(0);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const playStartTime = useRef<number>(0);

  const stories = [
    { id: 'voyage', title: 'Le Voyage Intérieur', mood: 'Calme', duration: '15 min', status: 'Nouveau' },
    { id: 'force', title: 'Force et Courage', mood: 'Motivant', duration: '12 min', status: 'Populaire' },
    { id: 'lumiere', title: 'La Lumière de Demain', mood: 'Espoir', duration: '18 min', status: '' }
  ];

  const handleNarrationChoice = (choice: string) => {
    setSelectedNarration(choice);
    track({
      instrument: "POMS",
      item_id: "tension",
      proxy: "choice",
      value: choice === "slow" ? "slow_narration+breath" : "voice_fast",
      context: { narration: choice }
    });
  };

  const handlePlay = (storyId: string) => {
    setIsPlaying(true);
    playStartTime.current = Date.now();
  };

  const handleStoryComplete = () => {
    const duration = Date.now() - playStartTime.current;
    
    // Track completion
    if (duration < 60000) {
      track({
        instrument: "POMS",
        item_id: "tension",
        proxy: "skip",
        value: "voice_fast"
      });
    } else {
      // Unlock contes fragments
      setCompletedStories(prev => {
        const newCount = prev + 1;
        if (newCount >= 2 && collections.contes?.items[0]) {
          unlockItem('contes', collections.contes.items[0].id);
        }
        return newCount;
      });
    }
    
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BookOpen className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Théâtre des Histoires
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Théâtre vivant où lumière et musique changent selon vos choix. Chaque histoire terminée est un fragment de conte.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            📖 Construisez votre bibliothèque magique d'histoires 📖
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-healing/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Histoire du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <BookOpen className="h-20 w-20 text-primary mx-auto animate-pulse-soft" />
                <p className="text-xl font-semibold">Le Jardin Secret</p>
                <p className="text-muted-foreground">Histoire personnalisée • 20 minutes</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                Une histoire créée spécialement pour vous, basée sur votre état émotionnel actuel
              </p>
              
              {/* Narration Choice */}
              <div className="flex justify-center space-x-3">
                <Button 
                  size="sm"
                  variant={selectedNarration === "slow" ? "default" : "outline"}
                  className={selectedNarration === "slow" ? "bg-gradient-primary" : ""}
                  onClick={() => handleNarrationChoice("slow")}
                >
                  🐌 Narration lente
                </Button>
                <Button 
                  size="sm"
                  variant={selectedNarration === "normal" ? "default" : "outline"}
                  className={selectedNarration === "normal" ? "bg-gradient-primary" : ""}
                  onClick={() => handleNarrationChoice("normal")}
                >
                  🎭 Narration standard
                </Button>
              </div>

              <div className="text-center">
                <Button 
                  className="bg-gradient-primary text-primary-foreground shadow-glow"
                  onClick={() => handlePlay('featured')}
                  disabled={!selectedNarration || isPlaying}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isPlaying ? "En cours..." : "Écouter l'histoire"}
                </Button>
                {isPlaying && (
                  <Button 
                    variant="outline" 
                    className="ml-3"
                    onClick={handleStoryComplete}
                  >
                    Terminer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Bibliothèque d'histoires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stories.map((story, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.status && (
                      <Badge className="bg-gradient-secondary text-secondary-foreground">
                        {story.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Ambiance: {story.mood}</span>
                    <span>•</span>
                    <span>{story.duration}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePlay(story.id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contes Collection */}
        {collections.contes && collections.contes.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-accent" />
                <span>Bibliothèque de contes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {collections.contes.items.filter(item => item.unlocked).map(item => (
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
                {collections.contes.unlockedCount}/{collections.contes.totalItems} contes débloqués
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StorySynth;
