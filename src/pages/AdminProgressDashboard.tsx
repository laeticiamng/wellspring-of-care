import { useState } from 'react';
import { useProgressAnalytics } from '@/hooks/useProgressAnalytics';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProgressionChart } from '@/components/ProgressionChart';
import { ModulePopularityChart } from '@/components/ModulePopularityChart';
import { LevelDistributionChart } from '@/components/LevelDistributionChart';
import { TopUsersTable } from '@/components/TopUsersTable';
import { Users, Activity, TrendingUp, Target } from 'lucide-react';

const AdminProgressDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const { data: analytics, isLoading, error } = useProgressAnalytics(timeRange);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erreur</CardTitle>
              <CardDescription>
                Impossible de charger les analytics: {error?.message || 'Erreur inconnue'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Mock data for progression chart (would need real time-series data)
  const progressionData = [
    { date: 'Lun', xp: analytics.totalXP * 0.7 },
    { date: 'Mar', xp: analytics.totalXP * 0.75 },
    { date: 'Mer', xp: analytics.totalXP * 0.82 },
    { date: 'Jeu', xp: analytics.totalXP * 0.88 },
    { date: 'Ven', xp: analytics.totalXP * 0.93 },
    { date: 'Sam', xp: analytics.totalXP * 0.97 },
    { date: 'Dim', xp: analytics.totalXP },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Progression</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble du système de progression utilisateurs
            </p>
          </div>
          
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="all">Tout le temps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Utilisateurs avec progression
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Actifs dans les 7 derniers jours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">XP Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalXP.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Tous modules confondus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau Moyen</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageLevel}</div>
              <p className="text-xs text-muted-foreground">
                Moyenne tous utilisateurs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="levels">Niveaux</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProgressionChart data={progressionData} />
              <ModulePopularityChart data={analytics.modulePopularity} />
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <ModulePopularityChart data={analytics.modulePopularity} />
            
            <Card>
              <CardHeader>
                <CardTitle>Détails par Module</CardTitle>
                <CardDescription>
                  Statistiques détaillées pour chaque module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.modulePopularity.map(module => (
                    <div key={module.module_name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{module.module_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Niveau moyen: {Math.round(module.avg_level * 10) / 10}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{module.users_count} utilisateurs</div>
                        <div className="text-sm text-muted-foreground">
                          {module.total_xp.toLocaleString()} XP total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="levels" className="space-y-4">
            <LevelDistributionChart data={analytics.levelDistribution} />
            
            {/* Level distribution by module */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analytics.modulePopularity.slice(0, 4).map(module => (
                <LevelDistributionChart
                  key={module.module_name}
                  data={analytics.levelDistribution}
                  moduleName={module.module_name}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <TopUsersTable users={analytics.topUsers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminProgressDashboard;
