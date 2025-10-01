import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Lightbulb, Sparkles } from "lucide-react";

const FlashGlow = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Chambre des Lumières
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Salle obscure qui s'illumine à votre rythme. Chaque respiration allume une lampe magique.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            💡 Construisez votre mur de lumière 💡
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span>Session Flash Glow</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-square max-w-md mx-auto bg-gradient-primary/10 rounded-lg flex items-center justify-center animate-pulse-soft">
              <Sparkles className="h-32 w-32 text-primary animate-glow" />
            </div>

            <div className="text-center space-y-4">
              <p className="text-lg font-medium">Session prête</p>
              <p className="text-muted-foreground">
                Installez-vous confortablement dans une pièce sombre
              </p>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Zap className="mr-2 h-4 w-4" />
                Démarrer Flash Glow
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 bg-muted/50">
                <CardContent className="pt-6 space-y-2">
                  <p className="font-medium">Intensité</p>
                  <div className="flex space-x-2">
                    {['Doux', 'Moyen', 'Intense'].map((level) => (
                      <Button key={level} variant="outline" size="sm">
                        {level}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-muted/50">
                <CardContent className="pt-6 space-y-2">
                  <p className="font-medium">Durée</p>
                  <div className="flex space-x-2">
                    {['5min', '10min', '15min'].map((duration) => (
                      <Button key={duration} variant="outline" size="sm">
                        {duration}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FlashGlow;
