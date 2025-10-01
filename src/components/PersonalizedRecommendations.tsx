import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, TrendingUp, Heart } from 'lucide-react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { motion } from 'framer-motion';

export function PersonalizedRecommendations() {
  const { personalizedContent, userPattern, loading, getSmartRecommendation } = usePersonalization();

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-semibold text-foreground">Personnalisation en cours...</h3>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      {/* En-tête */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Pour toi aujourd'hui</h3>
      </div>

      {/* Recommandation intelligente */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-background/50 rounded-lg border border-primary/10"
      >
        <p className="text-sm text-muted-foreground italic">
          {getSmartRecommendation()}
        </p>
      </motion.div>

      {/* Pattern utilisateur */}
      {userPattern && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Ton moment</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {userPattern.favoriteTimeOfDay === 'morning' && '🌅 Matinée'}
                {userPattern.favoriteTimeOfDay === 'afternoon' && '☀️ Après-midi'}
                {userPattern.favoriteTimeOfDay === 'evening' && '🌆 Soirée'}
                {userPattern.favoriteTimeOfDay === 'night' && '🌙 Nuit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tendance</p>
              <p className="text-sm font-medium text-foreground">
                {userPattern.engagementTrend === 'increasing' && '📈 En hausse'}
                {userPattern.engagementTrend === 'stable' && '➡️ Stable'}
                {userPattern.engagementTrend === 'decreasing' && '📉 À renforcer'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activités recommandées */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Activités suggérées
        </h4>
        <div className="space-y-2">
          {personalizedContent.recommendedActivities.slice(0, 3).map((activity, index) => (
            <motion.div
              key={activity}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm hover:bg-primary/10"
              >
                <span className="mr-2">•</span>
                {activity}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thèmes préférés */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Tes thèmes</h4>
        <div className="flex flex-wrap gap-2">
          {personalizedContent.preferredThemes.map((theme) => (
            <Badge
              key={theme}
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              {theme}
            </Badge>
          ))}
        </div>
      </div>

      {/* Horaires suggérés */}
      {personalizedContent.suggestedTimes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 Meilleurs créneaux : {personalizedContent.suggestedTimes.join(' • ')}
          </p>
        </div>
      )}
    </Card>
  );
}
