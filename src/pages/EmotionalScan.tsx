import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Camera, Smile } from "lucide-react";

const EmotionalScan = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Scan className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Galerie des Masques
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Scannez vos émotions en temps réel. Découvrez ce que votre visage révèle.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-primary" />
              <span>Scan émotionnel</span>
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

            <div className="grid md:grid-cols-4 gap-4">
              {['Joie', 'Tristesse', 'Colère', 'Surprise'].map((emotion) => (
                <Card key={emotion} className="border-0 bg-gradient-primary/5">
                  <CardContent className="pt-6 text-center space-y-2">
                    <Smile className="h-8 w-8 text-primary mx-auto" />
                    <p className="font-medium">{emotion}</p>
                    <p className="text-2xl font-bold text-primary">0%</p>
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

export default EmotionalScan;
