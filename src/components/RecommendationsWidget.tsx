import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { Sparkles, Clock, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RecommendationsWidget() {
  const {
    recommendations,
    loading,
    generateRecommendations,
    dismissRecommendation,
    getPriorityColor,
    getContentIcon,
  } = usePersonalizedRecommendations();

  const navigate = useNavigate();

  const handleAction = (contentId: string) => {
    navigate(`/${contentId}`);
  };

  if (loading && recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommandations pour vous
            </CardTitle>
            <CardDescription>
              Basées sur votre activité et vos besoins
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucune recommandation pour le moment
            </p>
            <Button onClick={generateRecommendations} disabled={loading}>
              Générer des recommandations
            </Button>
          </div>
        ) : (
          recommendations.slice(0, 5).map((rec) => (
            <Card key={rec.id} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getContentIcon(rec.content_type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(rec.priority_level)}>
                          {rec.priority_level === 'high' ? 'Prioritaire' : 
                           rec.priority_level === 'medium' ? 'Recommandé' : 
                           'Suggéré'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.estimated_time} min
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissRecommendation(rec.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm">{rec.reason}</p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(rec.content_id)}
                        className="w-full"
                      >
                        Commencer
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Confiance: {Math.round(rec.confidence_score * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
