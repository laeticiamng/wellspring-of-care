import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Glasses, Wind, Sparkles } from "lucide-react";

const VRBreath = () => {
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
            Expérience de respiration en réalité virtuelle. Immersion totale dans la sérénité.
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
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                Lancer l'expérience
              </Button>
              <Button variant="outline">
                Mode 2D
              </Button>
            </div>

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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VRBreath;
