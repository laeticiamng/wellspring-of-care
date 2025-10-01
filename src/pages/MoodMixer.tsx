import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Sliders, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const MoodMixer = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Music2 className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Studio DJ des Émotions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Studio futuriste. Les sliders modulent musique, basses et lumières en direct.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🎛️ Devenez le DJ de votre état intérieur 🎛️
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sliders className="h-6 w-6 text-primary" />
              <span>Table de mixage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="aspect-video bg-gradient-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Music2 className="h-20 w-20 text-primary mx-auto animate-pulse-soft" />
                <p className="text-lg font-medium">Créez votre mix émotionnel</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Joie', color: 'text-yellow-500', value: 50 },
                { name: 'Calme', color: 'text-blue-500', value: 70 },
                { name: 'Énergie', color: 'text-red-500', value: 30 },
                { name: 'Concentration', color: 'text-purple-500', value: 60 }
              ].map((emotion) => (
                <div key={emotion.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`font-medium ${emotion.color}`}>{emotion.name}</span>
                    <span className="text-muted-foreground">{emotion.value}%</span>
                  </div>
                  <Slider defaultValue={[emotion.value]} max={100} step={1} />
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Play className="mr-2 h-4 w-4" />
                Générer le mix
              </Button>
              <Button variant="outline">
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MoodMixer;
