import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export interface UserPrefs {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const useSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          id: data.id,
          full_name: (data as any).full_name || null,
          avatar_url: (data as any).avatar_url || null,
          bio: (data as any).bio || null,
          preferences: (data as any).preferences || {},
          created_at: data.created_at || new Date().toISOString(),
          updated_at: (data as any).updated_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        // Create default preferences if they don't exist
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            theme: 'light',
            language: 'fr',
            notifications_enabled: true,
            email_notifications: true,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newPrefs) {
          setPreferences({
            id: newPrefs.id,
            user_id: newPrefs.user_id,
            theme: (newPrefs as any).theme || 'light',
            language: (newPrefs as any).language || 'fr',
            notifications_enabled: (newPrefs as any).notifications_enabled ?? true,
            email_notifications: (newPrefs as any).email_notifications ?? true,
            created_at: newPrefs.created_at || new Date().toISOString(),
            updated_at: (newPrefs as any).updated_at || new Date().toISOString(),
          });
        }
      } else if (data) {
        setPreferences({
          id: data.id,
          user_id: data.user_id,
          theme: (data as any).theme || 'light',
          language: (data as any).language || 'fr',
          notifications_enabled: (data as any).notifications_enabled ?? true,
          email_notifications: (data as any).email_notifications ?? true,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: (data as any).updated_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
        });

      if (error) throw error;

      toast.success('Profil mis à jour !');
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updatePreferences = async (updates: Partial<UserPrefs>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Préférences mises à jour !');
      await fetchPreferences();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return {
    profile,
    preferences,
    loading,
    updateProfile,
    updatePreferences,
    refetch: () => {
      fetchProfile();
      fetchPreferences();
    },
  };
};
