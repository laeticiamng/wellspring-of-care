import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Smile, Sparkles } from "lucide-react";

const ARFilters = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Camera className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Chambre des Reflets
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Filtres AR thérapeutiques. Transformez votre visage, transformez votre humeur.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-6 w-6 text-primary" />
              <span>Filtres de bien-être</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Caméra désactivée</p>
                <Button className="bg-gradient-primary text-primary-foreground">
                  Activer la caméra
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-0 bg-gradient-primary/5 hover:bg-gradient-primary/10 transition-colors cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Sparkles className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-xs mt-2">Filtre {i + 1}</p>
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

export default ARFilters;
