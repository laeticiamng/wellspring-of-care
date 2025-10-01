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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export function DeleteAccountDialog({ open, onOpenChange, userEmail }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper SUPPRIMER pour confirmer');
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Call edge function to handle deletion
      const { error } = await supabase.functions.invoke('delete-user-data', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Sign out
      await supabase.auth.signOut();
      
      toast.success('Compte supprimé. Vos données seront effacées sous 30 jours.');
      navigate('/');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer définitivement mon compte
          </DialogTitle>
          <DialogDescription>
            Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Seront supprimés :</strong> profil, humeurs, évaluations, sessions, conversations, 
            badges, paramètres, et toutes vos données personnelles.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Votre email actuel</Label>
            <Input value={userEmail} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Tapez <strong>SUPPRIMER</strong> pour confirmer
            </Label>
            <Input
              id="confirm"
              placeholder="SUPPRIMER"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>📅 <strong>Délai de grâce :</strong> 30 jours avant suppression définitive</p>
            <p>💾 <strong>Récupération :</strong> Contactez support@emotionscare.com dans les 30 jours</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting || confirmText !== 'SUPPRIMER'}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer définitivement'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
