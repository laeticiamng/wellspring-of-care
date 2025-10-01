import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InsightsPanel } from '@/components/InsightsPanel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { activities, loading, getActivityStats } = useAnalytics();

  const stats = getActivityStats(7);

  // Prepare chart data
  const chartData = Object.entries(stats.byType).map(([type, count]) => ({
    name: type.replace('_', ' '),
    count: count,
  }));

  // Activity labels
  const activityLabels: Record<string, string> = {
    journal_entry: 'Entrées journal',
    meditation_session: 'Méditations',
    music_generation: 'Musiques générées',
    emotional_scan: 'Scans émotionnels',
    chat_message: 'Messages chat',
    exercise_completed: 'Exercices',
    badge_earned: 'Badges gagnés',
    login: 'Connexions',
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Analytics & Insights</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Activités (7 jours)</CardTitle>
            <CardDescription>Total d'activités cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Moyenne: {stats.avgPerDay.toFixed(1)} par jour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type le plus fréquent</CardTitle>
            <CardDescription>Votre activité favorite</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.byType).length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {activityLabels[Object.entries(stats.byType).sort(([, a], [, b]) => b - a)[0][0]]}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {Object.entries(stats.byType).sort(([, a], [, b]) => b - a)[0][1]} fois
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Aucune activité</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Régularité</CardTitle>
            <CardDescription>Votre engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgPerDay >= 3 ? '🔥 Excellent' : stats.avgPerDay >= 1 ? '👍 Bien' : '💪 À améliorer'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Continuez comme ça!
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Répartition des activités</CardTitle>
            <CardDescription>Derniers 7 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <InsightsPanel />
    </div>
  );
}
