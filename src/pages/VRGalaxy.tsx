import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Glasses, Star, Sparkles } from "lucide-react";

const VRGalaxy = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Star className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Constellation Émotionnelle
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque émotion vécue allume une étoile. Naviguez d'une galaxie à l'autre, dessinez votre carte céleste.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌠 Votre ciel émotionnel, à vous seul 🌠
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-primary/5">
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
                <Star className="h-16 w-16 text-primary mx-auto animate-float" />
                <p className="text-lg font-medium">Exploration galactique</p>
                <p className="text-muted-foreground">Naviguez à travers vos constellations émotionnelles</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="mr-2 h-4 w-4" />
                Commencer le voyage
              </Button>
              <Button variant="outline">
                Guide d'utilisation
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VRGalaxy;
