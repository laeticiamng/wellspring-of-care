import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Export PDF report
  const exportPDFReport = async (
    reportType: 'weekly' | 'monthly' | 'custom',
    startDate: string,
    endDate: string
  ) => {
    try {
      setIsExporting(true);

      const { data, error } = await supabase.functions.invoke('export-pdf-report', {
        body: {
          reportType,
          startDate,
          endDate,
        },
      });

      if (error) throw error;

      // Create a blob from the HTML response and download it
      const blob = new Blob([data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${reportType}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Rapport généré',
        description: 'Votre rapport a été téléchargé avec succès',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le rapport',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export data as JSON
  const exportJSON = async () => {
    try {
      setIsExporting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all user data
      const [activities, scans, insights] = await Promise.all([
        supabase.from('user_activities').select('*').eq('user_id', user.id),
        supabase.from('emotional_scans').select('*').eq('user_id', user.id),
        supabase.from('user_insights').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        activities: activities.data || [],
        emotional_scans: scans.data || [],
        insights: insights.data || [],
      };

      // Download as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-donnees-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été exportées en JSON',
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter les données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export data as CSV
  const exportCSV = async (dataType: 'activities' | 'scans') => {
    try {
      setIsExporting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let data: any[] = [];
      let headers: string[] = [];

      if (dataType === 'activities') {
        const result = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id);
        
        data = result.data || [];
        headers = ['id', 'activity_type', 'created_at', 'duration_seconds'];
      } else {
        const result = await supabase
          .from('emotional_scans')
          .select('*')
          .eq('user_id', user.id);
        
        data = result.data || [];
        headers = ['id', 'top_emotion', 'confidence_score', 'created_at'];
      }

      // Convert to CSV
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        ),
      ].join('\n');

      // Download as CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${dataType}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export réussi',
        description: `Vos ${dataType === 'activities' ? 'activités' : 'scans émotionnels'} ont été exportés en CSV`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter les données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportPDFReport,
    exportJSON,
    exportCSV,
  };
}
