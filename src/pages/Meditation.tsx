import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Heart, 
  Brain,
  Leaf,
  Moon,
  Sun,
  Volume2,
  Clock,
  Star,
  Award,
  Headphones
} from "lucide-react";
import { useState } from "react";

const Meditation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const meditationCategories = [
    {
      icon: Heart,
      title: "Stress & Anxiété",
      color: "bg-gradient-primary",
      sessions: 24,
      description: "Retrouvez votre calme intérieur"
    },
    {
      icon: Moon,
      title: "Sommeil",
      color: "bg-gradient-healing",
      sessions: 18,
      description: "Endormez-vous paisiblement"
    },
    {
      icon: Brain,
      title: "Focus & Concentration",
      color: "bg-gradient-secondary",
      sessions: 15,
      description: "Améliorez votre concentration"
    },
    {
      icon: Leaf,
      title: "Pleine Conscience",
      color: "bg-secondary",
      sessions: 32,
      description: "Vivez l'instant présent"
    }
  ];

  const featuredSessions = [
    {
      id: 1,
      title: "Respiration apaisante",
      instructor: "Dr. Sarah Chen",
      duration: "10 min",
      difficulty: "Débutant",
      rating: 4.9,
      plays: "12.5k",
      category: "Stress",
      image: "🧘‍♀️",
      description: "Une technique de respiration pour calmer instantanément votre esprit"
    },
    {
      id: 2,
      title: "Scan corporel profond",
      instructor: "Marc Dubois",
      duration: "20 min",
      difficulty: "Intermédiaire",
      rating: 4.8,
      plays: "8.2k",
      category: "Détente",
      image: "🌊",
      description: "Relâchez toutes les tensions de votre corps"
    },
    {
      id: 3,
      title: "Méditation du matin",
      instructor: "Emma Wilson",
      duration: "15 min",
      difficulty: "Débutant",
      rating: 4.9,
      plays: "15.7k",
      category: "Énergie",
      image: "☀️",
      description: "Commencez votre journée avec sérénité et énergie positive"
    },
    {
      id: 4,
      title: "Voyage intérieur",
      instructor: "Luc Martin",
      duration: "30 min",
      difficulty: "Avancé",
      rating: 4.9,
      plays: "6.3k",
      category: "Introspection",
      image: "🌌",
      description: "Explorez les profondeurs de votre conscience"
    },
    {
      id: 5,
      title: "Méditation guidée sommeil",
      instructor: "Sophie Laurent",
      duration: "25 min",
      difficulty: "Débutant",
      rating: 4.8,
      plays: "11.2k",
      category: "Sommeil",
      image: "🌙",
      description: "Préparez-vous à une nuit de repos profond"
    },
    {
      id: 6,
      title: "Concentration créative",
      instructor: "Alex Chen",
      duration: "15 min",
      difficulty: "Intermédiaire",
      rating: 4.7,
      plays: "9.1k",
      category: "Focus",
      image: "🎨",
      description: "Stimulez votre créativité et votre focus"
    }
  ];

  const userStats = {
    totalMinutes: 847,
    streakDays: 12,
    completedSessions: 56,
    favoriteCategory: "Pleine Conscience"
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Centre de Méditation
            <span className="block text-2xl font-normal text-muted-foreground mt-2">
              Cultivez votre paix intérieure
            </span>
          </h1>
        </div>

        {/* User Progress */}
        <Card className="border-0 shadow-soft bg-gradient-primary/5 border border-primary/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{userStats.totalMinutes}</div>
                <p className="text-sm text-muted-foreground">Minutes de méditation</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-secondary">{userStats.streakDays}</div>
                <p className="text-sm text-muted-foreground">Jours consécutifs</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-accent">{userStats.completedSessions}</div>
                <p className="text-sm text-muted-foreground">Sessions complétées</p>
              </div>
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Méditateur régulier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Explorez par catégorie</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {meditationCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-all duration-300 group hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`${category.color} p-4 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {category.sessions} sessions
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Sessions populaires</h2>
            <Button variant="outline">
              Voir tout
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {featuredSessions.map((session) => (
              <Card key={session.id} className="border-0 shadow-soft hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-0">
                  {/* Session Image/Icon */}
                  <div className="relative bg-gradient-primary/10 p-8 text-center">
                    <div className="text-6xl mb-4">{session.image}</div>
                    <Badge className="absolute top-4 right-4 bg-gradient-secondary text-secondary-foreground">
                      {session.category}
                    </Badge>
                  </div>
                  
                  {/* Session Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{session.instructor}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>{session.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{session.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Headphones className="h-3 w-3" />
                          <span>{session.plays}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{session.difficulty}</Badge>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                      onClick={() => {
                        setCurrentSession(session);
                        setIsPlaying(true);
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Session Player */}
        {currentSession && (
          <Card className="border-0 shadow-heal bg-gradient-primary/5 border border-primary/20 fixed bottom-6 left-6 right-6 z-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{currentSession.image}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{currentSession.title}</h4>
                      <p className="text-sm text-muted-foreground">{currentSession.instructor}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      3:24 / {currentSession.duration}
                    </div>
                  </div>
                  
                  <Progress value={33} className="h-2" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary text-primary-foreground border-0"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setCurrentSession(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Start */}
        <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
          <CardHeader>
            <CardTitle className="text-center">Démarrage rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { duration: "3 min", title: "Respiration minute", icon: "🫁" },
                { duration: "5 min", title: "Pause méditative", icon: "⏸️" },
                { duration: "10 min", title: "Calme profond", icon: "🌊" }
              ].map((quick, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-accent/10 border-accent/20"
                >
                  <div className="text-2xl">{quick.icon}</div>
                  <div className="text-center">
                    <p className="font-medium">{quick.title}</p>
                    <p className="text-xs text-muted-foreground">{quick.duration}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Meditation;