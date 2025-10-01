import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, SkipForward } from "lucide-react";

const MusicTherapy = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Music className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Forêt Sonore
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Laissez-vous bercer par des mélodies thérapeutiques adaptées à votre état émotionnel.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-healing/10">
          <CardHeader>
            <CardTitle>Lecture en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <Music className="h-24 w-24 text-primary animate-pulse-soft" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Sérénité matinale</h3>
              <p className="text-muted-foreground">Composition thérapeutique • 432Hz</p>
            </div>

            <div className="flex justify-center items-center space-x-6">
              <Button size="icon" variant="outline" className="rounded-full">
                <SkipForward className="h-4 w-4 rotate-180" />
              </Button>
              <Button size="icon" className="h-16 w-16 rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                <Play className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>2:34</span>
                <span>8:42</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-primary"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {['Relaxation', 'Concentration', 'Énergie'].map((mood) => (
            <Card key={mood} className="border-0 shadow-soft hover:shadow-glow transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center space-y-3">
                <Music className="h-8 w-8 text-primary mx-auto" />
                <p className="font-medium">{mood}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Écouter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MusicTherapy;
