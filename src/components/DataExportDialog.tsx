import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Loader2, FileJson, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataExportDialog({ open, onOpenChange }: DataExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportUserData = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Fetch all user data from various tables
      const [
        { data: profile },
        { data: moodEntries },
        { data: assessments },
        { data: musicSessions },
        { data: chatConversations },
        { data: badges },
        { data: userSettings },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('mood_entries').select('*').eq('user_id', user.id),
        supabase.from('assessments').select('*').eq('user_id', user.id),
        supabase.from('music_therapy_sessions').select('*').eq('user_id', user.id),
        supabase.from('chat_conversations').select('*').eq('user_id', user.id),
        supabase.from('badges').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        profile,
        moodEntries: moodEntries || [],
        assessments: assessments || [],
        musicTherapySessions: musicSessions || [],
        chatConversations: chatConversations || [],
        badges: badges || [],
        settings: userSettings,
        metadata: {
          version: '1.0',
          format: 'JSON',
          dataTypes: [
            'profile',
            'mood_entries',
            'assessments',
            'music_therapy_sessions',
            'chat_conversations',
            'badges',
            'settings',
          ],
        },
      };

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Exporter mes données
          </DialogTitle>
          <DialogDescription>
            Téléchargez une copie complète de vos données personnelles au format JSON (RGPD Article 20).
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Le fichier contiendra toutes vos données : profil, humeurs, évaluations, sessions, 
            conversations IA, badges et paramètres.
          </AlertDescription>
        </Alert>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Format :</strong> JSON (lisible par n'importe quel éditeur de texte)
          </p>
          <p>
            <strong>Taille estimée :</strong> 50 KB - 2 MB selon votre activité
          </p>
          <p>
            <strong>Contenu :</strong> Données personnelles uniquement (pas de contenus générés par IA)
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Annuler
          </Button>
          <Button onClick={exportUserData} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
