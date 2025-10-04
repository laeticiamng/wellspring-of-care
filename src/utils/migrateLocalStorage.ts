import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Script de migration pour transférer les données localStorage vers Supabase
 * À exécuter une seule fois par utilisateur
 */

interface LocalStorageProgress {
  userLevel?: number;
  totalXP?: number;
  [key: string]: any;
}

const MODULES_TO_MIGRATE = [
  { name: 'journal', key: 'journal_progress' },
  { name: 'meditation', keys: ['meditation_xp', 'meditation_level', 'meditation_completed', 'meditation_total_time'] },
  { name: 'breathwork', keys: ['breathwork_xp', 'breathwork_level', 'breathwork_completed'] },
  { name: 'mood-mixer', key: 'mood_mixer_progress' },
  { name: 'ar-filters', key: 'ar_filters_progress' },
  { name: 'vr-breath', key: 'vr_breath_progress' },
  { name: 'flashglow', key: 'flashglow_progress' },
  { name: 'emotional-scan', key: 'emotional_scan_progress' },
];

export async function migrateLocalStorageToBackend(userId: string): Promise<{
  success: boolean;
  migratedModules: string[];
  errors: string[];
}> {
  const migratedModules: string[] = [];
  const errors: string[] = [];

  for (const module of MODULES_TO_MIGRATE) {
    try {
      let progressData: LocalStorageProgress = {};
      
      if ('key' in module) {
        // Single key migration
        const saved = localStorage.getItem(module.key);
        if (saved) {
          progressData = JSON.parse(saved);
        }
      } else if ('keys' in module) {
        // Multiple keys migration (meditation)
        for (const key of module.keys) {
          const saved = localStorage.getItem(key);
          if (saved) {
            if (key === 'meditation_xp') progressData.totalXP = parseInt(saved);
            if (key === 'meditation_level') progressData.userLevel = parseInt(saved);
            if (key === 'meditation_completed') progressData.unlockedItems = JSON.parse(saved);
            if (key === 'meditation_total_time') progressData.meditationTime = parseInt(saved);
          }
        }
      }

      // Si des données existent, les migrer
      if (Object.keys(progressData).length > 0) {
        const { error } = await supabase
          .from('module_progress')
          .upsert({
            user_id: userId,
            module_name: module.name,
            user_level: progressData.userLevel || 1,
            total_xp: progressData.totalXP || 0,
            unlocked_items: progressData.unlockedItems || [],
            metadata: {
              migrated_from_localStorage: true,
              migration_date: new Date().toISOString(),
              ...('meditationTime' in progressData && { meditationTime: progressData.meditationTime }),
            },
          }, {
            onConflict: 'user_id,module_name',
            ignoreDuplicates: false,
          });

        if (error) {
          errors.push(`${module.name}: ${error.message}`);
        } else {
          migratedModules.push(module.name);
          
          // Nettoyer localStorage après migration réussie
          if ('key' in module) {
            localStorage.removeItem(module.key);
          } else if ('keys' in module) {
            module.keys.forEach(key => localStorage.removeItem(key));
          }
        }
      }
    } catch (error) {
      errors.push(`${module.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: errors.length === 0,
    migratedModules,
    errors,
  };
}

export async function checkMigrationStatus(): Promise<{
  needsMigration: boolean;
  modulesWithLocalData: string[];
}> {
  const modulesWithLocalData: string[] = [];

  for (const module of MODULES_TO_MIGRATE) {
    let hasLocalData = false;

    if ('key' in module) {
      hasLocalData = localStorage.getItem(module.key) !== null;
    } else if ('keys' in module) {
      hasLocalData = module.keys.some(key => localStorage.getItem(key) !== null);
    }

    if (hasLocalData) {
      modulesWithLocalData.push(module.name);
    }
  }

  return {
    needsMigration: modulesWithLocalData.length > 0,
    modulesWithLocalData,
  };
}
