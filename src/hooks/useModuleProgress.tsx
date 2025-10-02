import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ModuleProgress {
  userLevel: number;
  totalXP: number;
  unlockedItems: string[];
  metadata: Record<string, any>;
}

interface UseModuleProgressReturn extends ModuleProgress {
  loading: boolean;
  addXP: (amount: number, itemId?: string) => Promise<void>;
  unlockItem: (itemId: string) => Promise<void>;
  setMetadata: (key: string, value: any) => Promise<void>;
}

const XP_PER_LEVEL = 500;

export function useModuleProgress(moduleName: string): UseModuleProgressReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [metadata, setMetadataState] = useState<Record<string, any>>({});

  // Load progress from Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadProgress();
  }, [user, moduleName]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserLevel(data.user_level);
        setTotalXP(data.total_xp);
        setUnlockedItems(Array.isArray(data.unlocked_items) ? data.unlocked_items as string[] : []);
        setMetadataState(typeof data.metadata === 'object' && data.metadata !== null ? data.metadata as Record<string, any> : {});
      } else {
        // Create initial progress
        await createInitialProgress();
      }
    } catch (error) {
      console.error('Error loading module progress:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre progression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInitialProgress = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('module_progress')
        .insert({
          user_id: user.id,
          module_name: moduleName,
          user_level: 1,
          total_xp: 0,
          unlocked_items: [],
          metadata: {},
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating initial progress:', error);
    }
  };

  const saveProgress = async (updates: Partial<ModuleProgress>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('module_progress')
        .upsert({
          user_id: user.id,
          module_name: moduleName,
          user_level: updates.userLevel ?? userLevel,
          total_xp: updates.totalXP ?? totalXP,
          unlocked_items: updates.unlockedItems ?? unlockedItems,
          metadata: updates.metadata ?? metadata,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre progression",
        variant: "destructive",
      });
    }
  };

  const addXP = async (amount: number, itemId?: string) => {
    const newTotalXP = totalXP + amount;
    const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > userLevel;

    setTotalXP(newTotalXP);
    setUserLevel(newLevel);

    // Unlock item if provided and not already unlocked
    let newUnlocked = unlockedItems;
    if (itemId && !unlockedItems.includes(itemId)) {
      newUnlocked = [...unlockedItems, itemId];
      setUnlockedItems(newUnlocked);
    }

    await saveProgress({
      totalXP: newTotalXP,
      userLevel: newLevel,
      unlockedItems: newUnlocked,
    });

    if (leveledUp) {
      toast({
        title: "🎉 Niveau supérieur !",
        description: `Vous êtes maintenant niveau ${newLevel} !`,
      });
    }
  };

  const unlockItem = async (itemId: string) => {
    if (unlockedItems.includes(itemId)) return;

    const newUnlocked = [...unlockedItems, itemId];
    setUnlockedItems(newUnlocked);
    await saveProgress({ unlockedItems: newUnlocked });
  };

  const setMetadata = async (key: string, value: any) => {
    const newMetadata = { ...metadata, [key]: value };
    setMetadataState(newMetadata);
    await saveProgress({ metadata: newMetadata });
  };

  return {
    loading,
    userLevel,
    totalXP,
    unlockedItems,
    metadata,
    addXP,
    unlockItem,
    setMetadata,
  };
}
