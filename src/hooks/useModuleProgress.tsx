import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
const SAVE_DEBOUNCE_MS = 1000; // Debounce saves by 1 second

export function useModuleProgress(moduleName: string): UseModuleProgressReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state for optimistic updates
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [metadata, setMetadataState] = useState<Record<string, any>>({});

  // Debounce save timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<ModuleProgress> | null>(null);

  // Query key
  const queryKey = ['module-progress', user?.id, moduleName];

  // Fetch progress from Supabase with React Query cache
  const { data: progressData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Create initial progress mutation
  const createProgressMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Save progress mutation with optimistic updates
  const saveProgressMutation = useMutation({
    mutationFn: async (updates: Partial<ModuleProgress>) => {
      if (!user) return;

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error('Error saving progress:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre progression",
        variant: "destructive",
      });
    },
  });

  // Initialize state from query data
  useEffect(() => {
    if (progressData) {
      setUserLevel(progressData.user_level);
      setTotalXP(progressData.total_xp);
      setUnlockedItems(Array.isArray(progressData.unlocked_items) ? progressData.unlocked_items as string[] : []);
      setMetadataState(typeof progressData.metadata === 'object' && progressData.metadata !== null ? progressData.metadata as Record<string, any> : {});
    } else if (user && !isLoading && progressData === null) {
      // Create initial progress if none exists
      createProgressMutation.mutate();
    }
  }, [progressData, user, isLoading]);

  // Debounced save function
  const debouncedSave = useCallback((updates: Partial<ModuleProgress>) => {
    // Merge with pending updates
    pendingUpdatesRef.current = {
      ...pendingUpdatesRef.current,
      ...updates,
    };

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      if (pendingUpdatesRef.current) {
        saveProgressMutation.mutate(pendingUpdatesRef.current);
        pendingUpdatesRef.current = null;
      }
    }, SAVE_DEBOUNCE_MS);
  }, [saveProgressMutation]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Save immediately on unmount if there are pending updates
        if (pendingUpdatesRef.current) {
          saveProgressMutation.mutate(pendingUpdatesRef.current);
        }
      }
    };
  }, []);

  const addXP = async (amount: number, itemId?: string) => {
    const newTotalXP = totalXP + amount;
    const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > userLevel;

    // Optimistic update
    setTotalXP(newTotalXP);
    setUserLevel(newLevel);

    // Unlock item if provided and not already unlocked
    let newUnlocked = unlockedItems;
    if (itemId && !unlockedItems.includes(itemId)) {
      newUnlocked = [...unlockedItems, itemId];
      setUnlockedItems(newUnlocked);
    }

    // Debounced save
    debouncedSave({
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
    
    // Debounced save
    debouncedSave({ unlockedItems: newUnlocked });
  };

  const setMetadata = async (key: string, value: any) => {
    const newMetadata = { ...metadata, [key]: value };
    setMetadataState(newMetadata);
    
    // Debounced save
    debouncedSave({ metadata: newMetadata });
  };

  return {
    loading: isLoading,
    userLevel,
    totalXP,
    unlockedItems,
    metadata,
    addXP,
    unlockItem,
    setMetadata,
  };
}
