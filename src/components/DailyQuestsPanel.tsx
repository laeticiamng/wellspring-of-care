import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { CheckCircle2, Circle, Trophy, Clock } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export const DailyQuestsPanel = () => {
  const { quests, isLoading, totalXP, earnedXP, completedCount, totalCount, allCompleted } = useDailyQuests();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quêtes Quotidiennes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h restantes`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Quêtes Quotidiennes
            </CardTitle>
            <CardDescription>
              Complétez les défis pour gagner des XP bonus
            </CardDescription>
          </div>
          {quests.length > 0 && (
            <Badge variant={allCompleted ? 'default' : 'secondary'} className="text-sm">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression du jour</span>
            <span className="font-medium">{earnedXP} / {totalXP} XP</span>
          </div>
          <Progress value={(earnedXP / totalXP) * 100} className="h-2" />
          {quests.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTimeRemaining(quests[0].expires_at)}
            </div>
          )}
        </div>

        {/* Quest List */}
        <div className="space-y-3">
          {quests.map(quest => (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border transition-all ${
                quest.completed
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-medium ${quest.completed ? 'text-primary' : ''}`}>
                      {quest.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      +{quest.xp_reward} XP
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {quest.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Progression
                      </span>
                      <span className={quest.completed ? 'text-primary font-medium' : ''}>
                        {quest.current_count} / {quest.target_count}
                      </span>
                    </div>
                    <Progress
                      value={(quest.current_count / quest.target_count) * 100}
                      className="h-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {allCompleted && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium text-primary">
              🎉 Toutes les quêtes accomplies !
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Revenez demain pour de nouveaux défis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
