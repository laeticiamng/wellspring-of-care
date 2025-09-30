import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Calendar, 
  Video, 
  Brain,
  Heart,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Utilisateur";

  const upcomingSessions = [
    {
      type: "Thérapie individuelle",
      therapist: "Dr. Sarah Lopez",
      time: "14:00 - 15:00",
      date: "Aujourd'hui",
      status: "Confirmé"
    },
    {
      type: "Groupe de soutien",
      therapist: "Emma Wilson",
      time: "16:30 - 17:30",
      date: "Demain",
      status: "En attente"
    }
  ];

  const recentActivities = [
    {
      type: "Journal",
      title: "Entrée du matin",
      time: "Il y a 2h",
      mood: "😊",
      description: "Sentiment de gratitude et d'optimisme"
    },
    {
      type: "Méditation",
      title: "Respiration consciente",
      time: "Il y a 4h",
      mood: "🧘‍♀️",
      description: "Session de 10 minutes complétée"
    },
    {
      type: "Chat IA",
      title: "Conversation avec Emma",
      time: "Hier",
      mood: "💙",
      description: "Discussion sur la gestion du stress"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Bonjour {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre bien-être aujourd'hui
          </p>
        </div>

        {/* Stats Dashboard */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat Quick Access */}
            <Card className="border-0 shadow-soft bg-gradient-primary/5 border border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-primary p-3 rounded-full">
                      <Brain className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Emma vous attend</h3>
                      <p className="text-muted-foreground">
                        Votre assistante IA est prête à vous écouter
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                    onClick={() => navigate('/chat')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Activité récente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="text-2xl">{activity.mood}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mood Trend Chart */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Évolution de votre humeur</span>
                  <Badge className="ml-auto bg-gradient-secondary text-secondary-foreground">
                    Tendance positive
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-calm rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Heart className="h-12 w-12 text-primary mx-auto animate-pulse-soft" />
                    <p className="text-muted-foreground">Graphique d'évolution</p>
                    <p className="text-sm text-muted-foreground">7 derniers jours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Prochaines sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={session.status === "Confirmé" ? "default" : "outline"}
                        className={session.status === "Confirmé" ? "bg-gradient-secondary text-secondary-foreground" : ""}
                      >
                        {session.status}
                      </Badge>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{session.type}</h4>
                      <p className="text-sm text-muted-foreground">{session.therapist}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{session.date}</span>
                      <span>{session.time}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Rejoindre
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/journal')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Nouveau journal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/meditation')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Méditation guidée
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/community')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Rejoindre communauté
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/therapy')}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Prendre RDV
                </Button>
              </CardContent>
            </Card>

            {/* Daily Inspiration */}
            <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Inspiration du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-center space-y-3">
                  <p className="text-foreground">
                    "La guérison n'est pas un état de perfection, mais un processus de croissance."
                  </p>
                  <cite className="text-sm text-muted-foreground">
                    - Anonyme
                  </cite>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;