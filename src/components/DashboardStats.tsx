import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Smile, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award
} from "lucide-react";

const DashboardStats = () => {
  const moodData = [
    { emotion: "Joie", value: 85, color: "bg-gradient-secondary", icon: Smile },
    { emotion: "Calme", value: 72, color: "bg-gradient-primary", icon: Heart },
    { emotion: "Énergie", value: 68, color: "bg-gradient-healing", icon: Brain },
    { emotion: "Confiance", value: 79, color: "bg-secondary", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Bien-être global</p>
                <p className="text-3xl font-bold">87%</p>
                <p className="text-xs text-primary-foreground/60 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% cette semaine
                </p>
              </div>
              <Heart className="h-10 w-10 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-secondary text-secondary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm">Streak quotidien</p>
                <p className="text-3xl font-bold">15</p>
                <p className="text-xs text-secondary-foreground/60 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  jours consécutifs
                </p>
              </div>
              <Award className="h-10 w-10 text-secondary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-healing text-accent-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm">Sessions complétées</p>
                <p className="text-3xl font-bold">42</p>
                <p className="text-xs text-accent-foreground/60 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  cette semaine
                </p>
              </div>
              <Brain className="h-10 w-10 text-accent-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Objectifs atteints</p>
                <p className="text-3xl font-bold text-foreground">8/10</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  ce mois-ci
                </p>
              </div>
              <Target className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Analysis */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smile className="h-5 w-5 text-primary" />
            <span>Analyse émotionnelle aujourd'hui</span>
            <Badge variant="outline" className="ml-auto">
              Très positif
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moodData.map((mood, index) => {
            const Icon = mood.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{mood.emotion}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{mood.value}%</span>
                </div>
                <Progress 
                  value={mood.value} 
                  className="h-2"
                  style={{
                    backgroundColor: `hsl(var(--muted))`,
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-soft bg-gradient-calm">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Journal", icon: "📝" },
              { label: "Méditation", icon: "🧘‍♀️" },
              { label: "Respiration", icon: "🫁" },
              { label: "Chat IA", icon: "🤖" },
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50 group"
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium">{action.label}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;