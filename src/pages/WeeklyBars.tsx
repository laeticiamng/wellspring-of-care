import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const WeeklyBars = () => {
  const weeks = [
    { week: 'Sem 1', score: 72, sessions: 12, trend: '+5%' },
    { week: 'Sem 2', score: 78, sessions: 15, trend: '+8%' },
    { week: 'Sem 3', score: 85, sessions: 18, trend: '+9%' },
    { week: 'Sem 4', score: 82, sessions: 16, trend: '-4%' }
  ];

  const maxScore = Math.max(...weeks.map(w => w.score));

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BarChart3 className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Barres Hebdomadaires
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Votre jardin intérieur s'étend. Chaque semaine ajoute une plante de couleur unique à votre galerie émotionnelle.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌈 Petit à petit, votre jardin devient une galerie vivante 🌈
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <Calendar className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">Semaines actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <BarChart3 className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">79</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">+18%</p>
              <p className="text-sm text-muted-foreground">Progression globale</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Graphique hebdomadaire</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {weeks.map((week) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium w-16">{week.week}</span>
                      <span className="text-sm text-muted-foreground">{week.sessions} sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={week.trend.startsWith('+') ? 'default' : 'outline'}>
                        {week.trend}
                      </Badge>
                      <span className="font-bold text-primary w-12 text-right">{week.score}</span>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(week.score / maxScore) * 100}%` }}
                    >
                      <span className="text-xs text-primary-foreground font-medium">{week.score}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto border-0 shadow-soft bg-gradient-healing/10">
          <CardHeader>
            <CardTitle>Analyse de progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Tendance positive</p>
                <p className="text-sm text-muted-foreground">
                  Votre score moyen a augmenté de 18% sur les 4 dernières semaines. Continuez vos efforts !
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Régularité</p>
                <p className="text-sm text-muted-foreground">
                  Vous avez maintenu une activité constante avec une moyenne de 15 sessions par semaine.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WeeklyBars;
