import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Play, Zap } from "lucide-react";

const BubbleBeat = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Circle className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Labo des Bulles
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Laboratoire coloré de bulles. Tendu, elles éclatent vite. Calme, elles flottent doucement.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🫧 Collectionnez des bulles rares arc-en-ciel 🫧
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Zone de jeu</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <Circle
                  key={i}
                  className="absolute h-16 w-16 text-primary animate-float opacity-50"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
              <div className="text-center space-y-4 relative z-10">
                <Play className="h-16 w-16 text-primary mx-auto" />
                <p className="text-lg font-medium">Prêt à jouer?</p>
                <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                  Lancer le jeu
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 bg-muted/50 text-center">
                <CardContent className="pt-6 space-y-2">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-muted/50 text-center">
                <CardContent className="pt-6 space-y-2">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Combo</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-muted/50 text-center">
                <CardContent className="pt-6 space-y-2">
                  <p className="text-3xl font-bold text-primary">1</p>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BubbleBeat;
