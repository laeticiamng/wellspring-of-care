import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HeatmapGrid } from '@/components/HeatmapGrid';
import { ManagerActionsHistory } from '@/components/ManagerActionsHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, BarChart3, CheckSquare } from 'lucide-react';
import { useTeamAggregate } from '@/hooks/useTeamAggregate';
import { useToast } from '@/hooks/use-toast';

export default function RHDashboard() {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org');
  const { toast } = useToast();
  const { 
    assessments, 
    actions, 
    isLoading, 
    generateAssessment, 
    completeAction,
    isGenerating 
  } = useTeamAggregate(orgId || '');

  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    // For demo: generate assessment for current month
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    generateAssessment({
      teamName: 'Équipe principale',
      periodStart,
      periodEnd
    });
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Generate PDF content (simplified)
    const content = assessments?.map(a => ({
      team: a.team_name,
      period: `${a.period_start} - ${a.period_end}`,
      phrases: a.phrases
    })) || [];

    // Create downloadable content
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-rh-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    setIsExporting(false);
    toast({
      title: "Export réussi 📄",
      description: "Le rapport a été téléchargé",
      duration: 2000,
    });
  };

  if (!orgId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">Organisation non spécifiée</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Heatmap Vibes - Tableau Managers</title>
        <meta name="description" content="Tableau de bord managers pour le suivi collectif du bien-être" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Heatmap Vibes</h1>
              <p className="text-muted-foreground">
                Vue agrégée du climat collectif (k-anonymat ≥5)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || !assessments?.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
            </div>
          </div>

          {/* Info card */}
          <Card className="p-4 mb-6 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              💡 Les données sont anonymisées et agrégées. Chaque cellule nécessite minimum 5 réponses pour être affichée.
            </p>
          </Card>

          {/* Tabs for Heatmap and Actions */}
          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Heatmap Vibes
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Actions ({actions?.filter(a => !a.completed).length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="heatmap" className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              ) : !assessments || assessments.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Aucune donnée disponible pour le moment
                  </p>
                  <Button onClick={handleRefresh} disabled={isGenerating}>
                    Générer une analyse
                  </Button>
                </Card>
              ) : (
                <HeatmapGrid assessments={assessments} orgId={orgId} />
              )}
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <ManagerActionsHistory 
                actions={actions || []} 
                onComplete={completeAction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}