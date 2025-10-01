import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Wind, Sparkles } from "lucide-react";

const Nyvee = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Cloud className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Bulle Respirante
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une immense bulle suspendue respire avec vous. Plus vous respirez calmement, plus elle révèle des constellations cachées.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            ✨ Inspirez des étoiles, expirez la lumière ✨
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-primary" />
              <span>Session de respiration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-square max-w-md mx-auto bg-gradient-calm rounded-full flex items-center justify-center animate-pulse-soft">
              <div className="text-center space-y-4">
                <Sparkles className="h-16 w-16 text-primary mx-auto animate-glow" />
                <p className="text-2xl font-semibold">Inspirez...</p>
                <p className="text-muted-foreground">Suivez le rythme de la bulle</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                Commencer
              </Button>
              <Button variant="outline">
                Personnaliser
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-0 shadow-soft text-center">
            <CardContent className="pt-6 space-y-2">
              <p className="text-3xl font-bold text-primary">4-7-8</p>
              <p className="text-sm text-muted-foreground">Respiration apaisante</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft text-center">
            <CardContent className="pt-6 space-y-2">
              <p className="text-3xl font-bold text-primary">5-5</p>
              <p className="text-sm text-muted-foreground">Cohérence cardiaque</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft text-center">
            <CardContent className="pt-6 space-y-2">
              <p className="text-3xl font-bold text-primary">Box</p>
              <p className="text-sm text-muted-foreground">Respiration carrée</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Nyvee;
