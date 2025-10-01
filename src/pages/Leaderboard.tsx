import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";

const Leaderboard = () => {
  const [viewMode, setViewMode] = useState<"performance" | "calm">("calm");
  const [calmCardsUsed, setCalmCardsUsed] = useState(0);
  const { track } = useImplicitTracking();

  useEffect(() => {
    // Track preference for "calm" vs "performance" cards
    if (viewMode === "calm") {
      setCalmCardsUsed(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          track({
            instrument: "WHO5",
            item_id: "overall_calm",
            proxy: "choice",
            value: "calm_cards_bias",
            context: { view_count: String(newCount) }
          });
        }
        return newCount;
      });
    }
  }, [viewMode]);

  const topUsers = [
    { rank: 1, name: 'Sophie Martin', score: 2850, trend: '+12%', level: 42, aura: '✨' },
    { rank: 2, name: 'Thomas Dubois', score: 2720, trend: '+8%', level: 38, aura: '🌟' },
    { rank: 3, name: 'Emma Wilson', score: 2640, trend: '+15%', level: 36, aura: '💫' },
    { rank: 4, name: 'Lucas Bernard', score: 2480, trend: '+5%', level: 34, aura: '⭐' },
    { rank: 5, name: 'Clara Lopez', score: 2350, trend: '+10%', level: 32, aura: '🌠' }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Ciel des Auras
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Classement communautaire. Célébrez votre progression avec la communauté.
          </p>
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              size="sm"
              variant={viewMode === "calm" ? "default" : "outline"}
              className={viewMode === "calm" ? "bg-gradient-primary" : ""}
              onClick={() => setViewMode("calm")}
            >
              🌊 Auras douces
            </Button>
            <Button
              size="sm"
              variant={viewMode === "performance" ? "default" : "outline"}
              className={viewMode === "performance" ? "bg-gradient-secondary" : ""}
              onClick={() => setViewMode("performance")}
            >
              🏆 Performance
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {topUsers.slice(0, 3).map((user, index) => (
            <Card
              key={user.rank}
              className={`border-0 shadow-glow text-center ${
                index === 0 ? 'md:col-start-2 md:row-start-1' : ''
              }`}
            >
              <CardContent className="pt-6 space-y-4">
                {index === 0 && <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />}
                {index === 1 && <Medal className="h-10 w-10 text-gray-400 mx-auto" />}
                {index === 2 && <Medal className="h-10 w-10 text-orange-600 mx-auto" />}
                
                <Avatar className="h-20 w-20 mx-auto relative">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                  <div className="absolute -top-2 -right-2 text-2xl animate-pulse-soft">
                    {user.aura}
                  </div>
                </Avatar>
                
                <div>
                  <p className="font-bold text-lg">{user.name}</p>
                  {viewMode === "calm" ? (
                    <>
                      <p className="text-2xl font-bold text-primary my-2">{user.aura}</p>
                      <p className="text-sm text-muted-foreground">Aura de bien-être</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-primary my-2">{user.score}</p>
                      <Badge className="bg-gradient-secondary text-secondary-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {user.trend}
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Top 10 de la semaine</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-bold text-2xl text-primary w-8">#{user.rank}</div>
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Niveau {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xl font-bold text-primary">{user.score}</p>
                    <Badge variant="outline" className="text-xs">
                      {user.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
