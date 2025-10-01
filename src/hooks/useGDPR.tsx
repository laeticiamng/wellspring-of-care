import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrivacyPreferences {
  id?: string;
  user_id: string;
  analytics_opt_in: boolean;
  consent_version: string;
  retention_days: number;
  pseudonymized_user_id: string;
  created_at: string;
  updated_at: string;
}

export function useGDPR() {
  const [preferences, setPreferences] = useState<PrivacyPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch privacy preferences
  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_privacy_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data as any);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update privacy preferences
  const updatePreferences = async (updates: Partial<PrivacyPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_privacy_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data as any);

      toast({
        title: 'Préférences mises à jour',
        description: 'Vos préférences de confidentialité ont été enregistrées',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Export user data (GDPR right to data portability)
  const exportUserData = async () => {
    try {
      setExporting(true);
      
      const { data, error } = await supabase.functions.invoke('export-user-data');
      
      if (error) throw error;

      // Download the data as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été exportées avec succès',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur d\'export',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setExporting(false);
    }
  };

  // Delete user account (GDPR right to erasure)
  const deleteAccount = async () => {
    try {
      setDeleting(true);

      const { error } = await supabase.functions.invoke('delete-user-data');
      
      if (error) throw error;

      toast({
        title: 'Compte supprimé',
        description: 'Votre compte et toutes vos données ont été supprimés',
      });

      // Sign out after deletion
      await supabase.auth.signOut();

      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur de suppression',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    loading,
    exporting,
    deleting,
    updatePreferences,
    exportUserData,
    deleteAccount,
    fetchPreferences,
  };
}
