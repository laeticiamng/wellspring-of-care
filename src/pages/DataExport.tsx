import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDataExport } from '@/hooks/useDataExport';
import { Download, FileText, Database, Calendar } from 'lucide-react';

export default function DataExport() {
  const { isExporting, exportPDFReport, exportJSON, exportCSV } = useDataExport();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExportPDF = (reportType: 'weekly' | 'monthly' | 'custom') => {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();
    exportPDFReport(reportType, start, end);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Export de données</h1>
        <p className="text-muted-foreground">
          Téléchargez vos données et rapports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* PDF Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rapports PDF
            </CardTitle>
            <CardDescription>
              Générez des rapports détaillés de votre activité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Période personnalisée</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Date de début</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Date de fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handleExportPDF('weekly')}
                disabled={isExporting}
                className="w-full"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapport hebdomadaire
              </Button>
              <Button
                onClick={() => handleExportPDF('monthly')}
                disabled={isExporting}
                className="w-full"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapport mensuel
              </Button>
              <Button
                onClick={() => handleExportPDF('custom')}
                disabled={isExporting || !startDate || !endDate}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapport personnalisé
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Exports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Export de données
            </CardTitle>
            <CardDescription>
              Téléchargez vos données brutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Format JSON</Label>
              <Button
                onClick={exportJSON}
                disabled={isExporting}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export complet (JSON)
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Format CSV</Label>
              <div className="space-y-2">
                <Button
                  onClick={() => exportCSV('activities')}
                  disabled={isExporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Activités (CSV)
                </Button>
                <Button
                  onClick={() => exportCSV('scans')}
                  disabled={isExporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Scans émotionnels (CSV)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Intégration calendrier
            </CardTitle>
            <CardDescription>
              Synchronisez vos sessions avec votre calendrier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Exportez vos sessions programmées vers Google Calendar, Outlook ou iCal
            </p>
            <div className="space-y-2">
              <Button
                disabled
                className="w-full"
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Google Calendar
              </Button>
              <Button
                disabled
                className="w-full"
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Outlook
              </Button>
              <Button
                disabled
                className="w-full"
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                iCal / Apple Calendar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Fonctionnalité à venir prochainement
            </p>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <Card>
          <CardHeader>
            <CardTitle>🔒 Confidentialité</CardTitle>
            <CardDescription>
              Vos données en sécurité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Toutes vos données sont chiffrées et sécurisées. Les exports sont générés localement 
              et ne transitent pas par des serveurs tiers. Vous gardez le contrôle total de vos informations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
