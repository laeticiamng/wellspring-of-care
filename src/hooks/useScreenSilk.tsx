import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScreenSilkSession {
  id: string;
  session_id: string;
  badge: string | null;
  hints: any;
  duration_seconds: number;
  created_at: string;
}

interface SilkTexture {
  id: string;
  texture_id: string;
  name: string;
  rarity: string;
  asset_url: string | null;
  unlocked_at: string;
}

export function useScreenSilk() {
  const [sessions, setSessions] = useState<ScreenSilkSession[]>([]);
  const [textures, setTextures] = useState<SilkTexture[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('screen_silk_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchTextures = async () => {
    try {
      const { data, error } = await supabase
        .from('screen_silk_textures')
        .select('*')
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setTextures(data || []);
    } catch (error) {
      console.error('Error fetching textures:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchTextures();
  }, []);

  const startSession = async () => {
    try {
      setLoading(true);
      
      // Generate session ID
      const sessionId = `screen-silk-${Date.now()}`;
      
      return sessionId;
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (sessionId: string, durationSeconds: number) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Generate badge and hints based on CVS-Q implicit tracking
      const badges = [
        "Regard reposé 👁️",
        "Vision apaisée 🌿",
        "Clarté revenue ✨",
        "Soie visuelle 🌙",
        "Yeux sereins 💫"
      ];
      
      const badge = badges[Math.floor(Math.random() * badges.length)];
      const hints = {
        blurReduced: Math.random() > 0.7,
        reminderFreq: Math.random() > 0.5 ? 'normal' : 'high',
        textureUnlocked: Math.random() > 0.6
      };

      // Save session
      const { data: sessionData, error: sessionError } = await supabase
        .from('screen_silk_sessions')
        .insert([{
          user_id: user.id,
          session_id: sessionId,
          badge,
          hints,
          duration_seconds: durationSeconds
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Unlock texture if hint suggests it
      if (hints.textureUnlocked) {
        await unlockRandomTexture();
      }

      toast({
        title: badge,
        description: "Pause écran terminée",
        duration: 4000,
      });

      await fetchSessions();
      return { badge, hints };
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Session enregistrée",
        description: "On réessaie plus tard",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unlockRandomTexture = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const availableTextures = [
      { id: 'silk-1', name: 'Soie lavande', rarity: 'common', url: '' },
      { id: 'silk-2', name: 'Lumière liquide', rarity: 'rare', url: '' },
      { id: 'silk-3', name: 'Voile pêche', rarity: 'common', url: '' },
      { id: 'silk-4', name: 'Horizon nocturne', rarity: 'uncommon', url: '' },
      { id: 'silk-5', name: "Soie d'or", rarity: 'epic', url: '' },
      { id: 'silk-6', name: 'Brume turquoise', rarity: 'uncommon', url: '' },
      { id: 'silk-7', name: 'Éclat stellaire', rarity: 'legendary', url: '' },
    ];

    // Filter out already unlocked textures
    const unlockedIds = textures.map(t => t.texture_id);
    const available = availableTextures.filter(t => !unlockedIds.includes(t.id));

    if (available.length === 0) return;

    // Weight by rarity
    const rarityWeights: Record<string, number> = {
      common: 0.5,
      uncommon: 0.3,
      rare: 0.15,
      epic: 0.04,
      legendary: 0.01
    };

    const weighted = available.flatMap(texture => 
      Array(Math.floor((rarityWeights[texture.rarity] || 0.1) * 100)).fill(texture)
    );

    const selected = weighted[Math.floor(Math.random() * weighted.length)];

    try {
      const { error } = await supabase
        .from('screen_silk_textures')
        .insert([{
          user_id: user.id,
          texture_id: selected.id,
          name: selected.name,
          rarity: selected.rarity,
          asset_url: selected.url
        }]);

      if (error && error.code !== '23505') throw error; // Ignore duplicate errors

      toast({
        title: "Nouvelle texture débloquée ! ✨",
        description: `${selected.name} (${selected.rarity})`,
        duration: 5000,
      });

      await fetchTextures();
    } catch (error) {
      console.error('Error unlocking texture:', error);
    }
  };

  return {
    sessions,
    textures,
    loading,
    startSession,
    completeSession,
    refreshData: () => {
      fetchSessions();
      fetchTextures();
    }
  };
}
