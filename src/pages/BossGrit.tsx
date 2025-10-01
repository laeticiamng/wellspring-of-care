import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sword, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BossGrit = () => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sword className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              L'Arène de la Persévérance
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Affrontez vos défis intérieurs. Développez votre résilience et votre grit.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-primary" />
                <span>Boss actuel</span>
              </span>
              <Badge className="bg-gradient-secondary text-secondary-foreground">
                Niveau 1
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-primary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Sword className="h-20 w-20 text-primary mx-auto animate-float" />
                <p className="text-xl font-semibold">Le Doute Persistent</p>
                <p className="text-muted-foreground">Vaincre les pensées négatives</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Points de vie Boss</span>
                <span className="font-medium">100/100</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Sword className="mr-2 h-4 w-4" />
                Commencer le combat
              </Button>
              <Button variant="outline">
                Stratégie
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { stat: 'Grit Score', value: '65/100' },
                { stat: 'Résilience', value: '72/100' },
                { stat: 'Boss vaincus', value: '0' }
              ].map((item) => (
                <Card key={item.stat} className="border-0 bg-muted/50 text-center">
                  <CardContent className="pt-6 space-y-2">
                    <p className="text-2xl font-bold text-primary">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.stat}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>Récompenses débloquées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Affrontez votre premier boss pour débloquer des récompenses
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BossGrit;
