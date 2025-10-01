import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StorySynth = () => {
  const stories = [
    { title: 'Le Voyage Intérieur', mood: 'Calme', duration: '15 min', status: 'Nouveau' },
    { title: 'Force et Courage', mood: 'Motivant', duration: '12 min', status: 'Populaire' },
    { title: 'La Lumière de Demain', mood: 'Espoir', duration: '18 min', status: '' }
  ];

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
            Histoires thérapeutiques générées par IA. Laissez-vous guider par des récits personnalisés.
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

            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Une histoire créée spécialement pour vous, basée sur votre état émotionnel actuel
              </p>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Play className="mr-2 h-4 w-4" />
                Écouter l'histoire
              </Button>
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
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StorySynth;
