import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Sparkles, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

export function InsightsPanel() {
  const { insights, loading, markInsightAsRead, generateInsights } = useAnalytics();

  const unreadInsights = insights.filter(i => !i.is_read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'progress':
        return <TrendingUp className="h-5 w-5" />;
      case 'pattern':
        return <Sparkles className="h-5 w-5" />;
      case 'recommendation':
        return <Target className="h-5 w-5" />;
      case 'achievement':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vos Insights</h2>
          <p className="text-muted-foreground">
            {unreadInsights.length} nouveau{unreadInsights.length > 1 ? 'x' : ''}
          </p>
        </div>
        <Button onClick={generateInsights} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Générer Insights
        </Button>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Aucun insight disponible</CardTitle>
              <CardDescription className="text-center">
                Utilisez l'application pendant quelques jours pour obtenir des insights personnalisés
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          insights.map((insight) => (
            <Card
              key={insight.id}
              className={!insight.is_read ? 'border-primary' : ''}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(insight.priority)} bg-opacity-10`}>
                      {getIcon(insight.insight_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {insight.insight_type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(insight.priority)}`}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {!insight.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markInsightAsRead(insight.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                {insight.action_items && insight.action_items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Actions recommandées:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {insight.action_items.map((action, idx) => (
                        <li key={idx} className="text-muted-foreground">{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
