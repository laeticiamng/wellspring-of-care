import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, Award, TrendingUp, Flame, Target, Star, Lock } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";

export const GamificationPanel = () => {
  const { achievements, badges, stats, loading } = useGamification();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Trophy className="w-8 h-8 text-primary" />
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (stats.xp / stats.nextLevelXP) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Progression & Récompenses
        </CardTitle>
        <CardDescription>
          Niveau <span data-testid="user-level">{stats.level}</span> • <span data-testid="user-xp">{stats.xp}</span>/{stats.nextLevelXP} XP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression niveau */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Stats clés */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Streak actuel</span>
            </div>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">
              Record: {stats.longestStreak} semaines
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Cartes</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalCards}</div>
            <div className="text-xs text-muted-foreground">
              {stats.cardsThisWeek} cette semaine
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Score WHO-5</span>
            </div>
            <div className="text-2xl font-bold">{stats.averageWHO5Score}</div>
            <div className="text-xs text-muted-foreground">
              {stats.totalWHO5Assessments} évaluations
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Interactions</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalInteractions}</div>
            <div className="text-xs text-muted-foreground">
              Total actions
            </div>
          </div>
        </div>

        {/* Achievements & Badges */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="w-4 h-4 mr-2" />
              Badges ({badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-3 mt-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-colors ${
                  achievement.unlocked 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-muted/30 border-border opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-xs text-primary mt-1">
                        Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={achievement.unlocked ? "default" : "outline"}
                    className={
                      achievement.rarity === 'legendary' ? 'bg-yellow-500' :
                      achievement.rarity === 'epic' ? 'bg-purple-500' :
                      achievement.rarity === 'rare' ? 'bg-blue-500' : ''
                    }
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="space-y-3 mt-4">
            {badges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun badge pour le moment</p>
                <p className="text-xs mt-1">Continue à progresser pour débloquer des badges !</p>
              </div>
            ) : (
              badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {badge.description}
                      </div>
                      <div className="text-xs text-primary mt-1">
                        {new Date(badge.awarded_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
