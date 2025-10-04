import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkMigrationStatus, migrateLocalStorageToBackend } from '@/utils/migrateLocalStorage';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function MigrationPrompt() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [modulesWithLocalData, setModulesWithLocalData] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (user) {
      checkForMigration();
    }
  }, [user]);

  const checkForMigration = async () => {
    const status = await checkMigrationStatus();
    if (status.needsMigration) {
      setModulesWithLocalData(status.modulesWithLocalData);
      setShowDialog(true);
    }
  };

  const handleMigrate = async () => {
    if (!user) return;

    setIsMigrating(true);
    try {
      const result = await migrateLocalStorageToBackend(user.id);

      if (result.success) {
        toast({
          title: "Migration réussie !",
          description: `${result.migratedModules.length} modules ont été migrés vers le backend.`,
        });
      } else {
        toast({
          title: "Migration partiellement réussie",
          description: `${result.migratedModules.length} modules migrés, ${result.errors.length} erreurs.`,
          variant: "destructive",
        });
      }

      setShowDialog(false);
    } catch (error) {
      toast({
        title: "Erreur de migration",
        description: "Impossible de migrer vos données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSkip = () => {
    // Marquer comme "déjà proposé" pour ne plus afficher
    localStorage.setItem('migration_prompt_dismissed', 'true');
    setShowDialog(false);
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Migration de vos données</AlertDialogTitle>
          <AlertDialogDescription>
            Nous avons détecté des données locales pour {modulesWithLocalData.length} module(s) :
            <ul className="list-disc pl-6 mt-2">
              {modulesWithLocalData.map(module => (
                <li key={module} className="capitalize">{module.replace('-', ' ')}</li>
              ))}
            </ul>
            <p className="mt-3">
              Voulez-vous migrer ces données vers le backend pour les sauvegarder de manière permanente et les synchroniser sur tous vos appareils ?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleSkip}>
            Plus tard
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleMigrate} disabled={isMigrating}>
            {isMigrating ? 'Migration...' : 'Migrer maintenant'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
