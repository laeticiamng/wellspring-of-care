import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Activity as ActivityIcon, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Activity = () => {
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activities = [
    { day: 'Lun', sessions: 3, mood: 'Excellent', score: 85 },
    { day: 'Mar', sessions: 2, mood: 'Bien', score: 75 },
    { day: 'Mer', sessions: 4, mood: 'Excellent', score: 90 },
    { day: 'Jeu', sessions: 2, mood: 'Moyen', score: 65 },
    { day: 'Ven', sessions: 5, mood: 'Excellent', score: 95 },
    { day: 'Sam', sessions: 3, mood: 'Bien', score: 80 },
    { day: 'Dim', sessions: 2, mood: 'Bien', score: 70 }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <ActivityIcon className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Jardin des Saisons
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chaque semaine, une nouvelle plante pousse. Selon votre état, elle change de couleur et de forme.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🌱 Votre jardin devient une galerie vivante d'émotions 🌱
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <Calendar className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">21</p>
              <p className="text-sm text-muted-foreground">Jours actifs</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">82%</p>
              <p className="text-sm text-muted-foreground">Bien-être moyen</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <ActivityIcon className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">45</p>
              <p className="text-sm text-muted-foreground">Sessions totales</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="pt-6 text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-primary mx-auto" />
              <p className="text-3xl font-bold text-primary">+12%</p>
              <p className="text-sm text-muted-foreground">Progression</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-6xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Activité de la semaine</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {activities.map((activity) => (
                <Card key={activity.day} className="border-0 bg-gradient-primary/5">
                  <CardContent className="pt-6 text-center space-y-3">
                    <p className="font-medium">{activity.day}</p>
                    <div className="space-y-2">
                      <div className="h-24 bg-gradient-primary rounded-lg flex items-center justify-center" 
                           style={{ opacity: activity.score / 100 }}>
                        <p className="text-2xl font-bold text-primary-foreground">{activity.sessions}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.mood}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-6xl mx-auto border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Historique détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.day} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-4">
                    <div className="font-bold text-primary">{activity.day}</div>
                    <div>
                      <p className="font-medium">{activity.sessions} sessions</p>
                      <p className="text-sm text-muted-foreground">Score: {activity.score}/100</p>
                    </div>
                  </div>
                  <Badge className={
                    activity.mood === 'Excellent' ? 'bg-gradient-primary text-primary-foreground' :
                    activity.mood === 'Bien' ? 'bg-gradient-secondary text-secondary-foreground' :
                    'bg-muted'
                  }>
                    {activity.mood}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Activity;
