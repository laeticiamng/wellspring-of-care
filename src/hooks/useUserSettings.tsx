import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id: string;
  user_id: string;
  low_stim_mode: boolean;
  tts_enabled: boolean;
  high_contrast: boolean;
  haptics_enabled: boolean;
  nyvee_reminders: boolean;
  screen_silk_reminders: boolean;
  journal_reminders: boolean;
  reminder_frequency: string;
  theme_palette: string;
  consent_who5: boolean;
  consent_panas: boolean;
  consent_swemwbs: boolean;
  consent_cbi: boolean;
  consent_uwes: boolean;
  consent_cvsq: boolean;
  consent_anonymous_aggregation: boolean;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Create settings if they don't exist
      if (!data) {
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      
      toast({
        title: "Préférences sauvegardées 🌱",
        duration: 2000,
      });

      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "On réessaie plus tard",
        description: "Les paramètres n'ont pas pu être sauvegardés",
        variant: "destructive",
      });
      return null;
    }
  };

  const completeOnboarding = async () => {
    return updateSettings({
      onboarding_completed: true,
      onboarding_step: 999
    });
  };

  return {
    settings,
    loading,
    updateSettings,
    completeOnboarding,
    refreshSettings: fetchSettings
  };
}
