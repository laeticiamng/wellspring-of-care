import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { useEffect, useState } from "react";

const WeeklyBars = () => {
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(4);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedMilestones, setUnlockedMilestones] = useState<string[]>([]);

  const milestones = [
    { id: 'mile1', name: '🌱 Semaine 1', unlockLevel: 1, xp: 100 },
    { id: 'mile2', name: '🌿 Mois 1', unlockLevel: 3, xp: 200 },
    { id: 'mile3', name: '🌳 3 Mois', unlockLevel: 5, xp: 300 },
    { id: 'mile4', name: '🌲 6 Mois', unlockLevel: 8, xp: 500 },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('weekly_bars_progress');
    if (saved) {
      const { level, xp, weeks, milestones: unlocked } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setTotalWeeks(weeks || 4);
      setUnlockedMilestones(unlocked || []);
    }
  }, []);

  const weeks = [
    { week: 'Sem 1', score: 72, sessions: 12, trend: '+5%', softModules: 8 },
    { week: 'Sem 2', score: 78, sessions: 15, trend: '+8%', softModules: 10 },
    { week: 'Sem 3', score: 85, sessions: 18, trend: '+9%', softModules: 14 },
    { week: 'Sem 4', score: 82, sessions: 16, trend: '-4%', softModules: 12 }
  ];

  const maxScore = Math.max(...weeks.map(w => w.score));
  const avgSoftModules = weeks.reduce((sum, w) => sum + w.softModules, 0) / weeks.length;

  useEffect(() => {
    // Track preference for soft modules over weeks
    if (avgSoftModules >= 10) {
      track({
        instrument: "WHO5",
        item_id: "overall",
        proxy: "repeat",
        value: "soft_modules",
        context: { avg: String(avgSoftModules.toFixed(1)) }
      });

      // Unlock additional plantes
      if (collections.plantes && collections.plantes.items[1]) {
        unlockItem('plantes', collections.plantes.items[1].id);
      }
    }
  }, []);

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-gradient-calm relative">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">📊</div>
              <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
              <p className="text-muted-foreground">Nouveau palier atteint</p>
            </div>
          </Card>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BarChart3 className="h-12 w-12 text-primary animate-pulse-soft" />
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Barres Hebdomadaires
                </h1>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalWeeks} semaines</span>
                  <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Votre jardin intérieur s'étend. Chaque semaine ajoute une plante de couleur unique à votre galerie émotionnelle.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌈 Petit à petit, votre jardin devient une galerie vivante 🌈
          </p>
          
          {/* Milestones débloqués */}
          <div className="flex justify-center gap-2 flex-wrap">
            {milestones.map(milestone => (
              <div
                key={milestone.id}
                className={`px-3 py-1 rounded-full text-xs ${
                  unlockedMilestones.includes(milestone.id)
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : userLevel >= milestone.unlockLevel
                    ? 'bg-accent/20 text-accent border border-accent/40 animate-pulse'
                    : 'bg-muted/50 text-muted-foreground opacity-50'
                }`}
              >
                {milestone.name}
              </div>
            ))}
          </div>
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
