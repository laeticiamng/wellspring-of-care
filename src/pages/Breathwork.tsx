import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Waves, Cloud } from "lucide-react";

const Breathwork = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Waves className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              L'Océan Intérieur
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Techniques de breathwork avancées. Plongez dans les profondeurs de votre souffle.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-healing/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-primary" />
              <span>Breathwork guidé</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Cloud className="h-20 w-20 text-primary mx-auto animate-pulse-soft" />
                <p className="text-xl font-semibold">Technique Wim Hof</p>
                <p className="text-muted-foreground">30 respirations • 3 cycles</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                Commencer la session
              </Button>
              <Button variant="outline">
                Choisir une technique
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Wim Hof', desc: '30 respirations profondes' },
                { name: 'Pranayama', desc: 'Respiration yogique' },
                { name: 'Holotropique', desc: 'Exploration profonde' }
              ].map((technique) => (
                <Card key={technique.name} className="border-0 shadow-soft hover:shadow-glow transition-shadow cursor-pointer">
                  <CardContent className="pt-6 text-center space-y-2">
                    <Wind className="h-8 w-8 text-primary mx-auto" />
                    <p className="font-medium">{technique.name}</p>
                    <p className="text-sm text-muted-foreground">{technique.desc}</p>
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

export default Breathwork;
