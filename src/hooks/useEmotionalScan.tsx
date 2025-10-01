import { useState, useCallback } from 'react';
import { useImplicitTracking } from './useImplicitTracking';
import { useToast } from '@/hooks/use-toast';

export interface MaskData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  rarity: 'common' | 'rare' | 'legendary';
  unlocked_at: string;
}

interface ScanResult {
  badge: string;
  badgeEmoji: string;
  valence: string;
  arousal: string;
  maskGenerated: MaskData;
}

export function useEmotionalScan() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { track } = useImplicitTracking();
  const { toast } = useToast();

  const startScan = useCallback(() => {
    setScanning(true);
    setResult(null);
    track({
      instrument: 'SAM',
      item_id: 'scan_start',
      proxy: 'event',
      value: 'started'
    });
  }, [track]);

  const submitScan = useCallback((valence: string, arousal: string, gestureTime: number) => {
    // Track valence
    track({
      instrument: 'SAM',
      item_id: 'valence',
      proxy: 'choice',
      value: valence
    });

    // Track arousal
    track({
      instrument: 'SAM',
      item_id: 'arousal',
      proxy: 'choice',
      value: arousal
    });

    // Track gesture duration
    track({
      instrument: 'SAM',
      item_id: 'interaction',
      proxy: 'duration',
      value: gestureTime
    });

    // Generate mask based on valence + arousal
    const maskResult = generateMask(valence, arousal);
    
    setResult(maskResult);
    setScanning(false);

    // Show rare mask notification
    if (maskResult.maskGenerated.rarity === 'legendary') {
      toast({
        title: '✨ Masque Légendaire Débloqué!',
        description: `${maskResult.maskGenerated.name} - Collection rare`,
        duration: 5000,
      });
    }

    // Publish mood.updated event (would be Supabase Realtime in production)
    publishMoodUpdate(valence, arousal);

    return maskResult;
  }, [track, toast]);

  const reset = useCallback(() => {
    setScanning(false);
    setResult(null);
  }, []);

  return {
    scanning,
    result,
    startScan,
    submitScan,
    reset
  };
}

function generateMask(valence: string, arousal: string): ScanResult {
  const masks = {
    // High valence (positive) + High arousal (excited)
    'warm-shake': {
      name: 'Flamme Dansante',
      emoji: '🔥',
      color: '#ff4444',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      badge: 'Énergie haute',
      badgeEmoji: '🔥'
    },
    'warm-breathe': {
      name: 'Soleil Vibrant',
      emoji: '☀️',
      color: '#ffaa00',
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      badge: 'Chaleur intérieure',
      badgeEmoji: '☀️'
    },
    // High valence + Low arousal (calm positive)
    'cool-breathe': {
      name: 'Lune Sereine',
      emoji: '🌙',
      color: '#6699ff',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      badge: 'Posé',
      badgeEmoji: '🌊'
    },
    'cool-shake': {
      name: 'Cristal Apaisant',
      emoji: '💎',
      color: '#44bbff',
      gradient: 'from-cyan-400 via-blue-400 to-indigo-400',
      badge: 'Calme profond',
      badgeEmoji: '💎'
    },
    // Low valence (negative) + High arousal (anxious)
    'nature-shake': {
      name: 'Orage Intérieur',
      emoji: '⚡',
      color: '#9944ff',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
      badge: 'Tension électrique',
      badgeEmoji: '⚡'
    },
    'nature-breathe': {
      name: 'Forêt Brumeuse',
      emoji: '🌿',
      color: '#44aa66',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      badge: 'Ancrage nature',
      badgeEmoji: '🌿'
    },
    // Low valence + Low arousal (sad/tired)
    'cosmos-breathe': {
      name: 'Nuit Étoilée',
      emoji: '✨',
      color: '#8844ff',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      badge: 'Fatigue douce',
      badgeEmoji: '🌙'
    },
    'cosmos-shake': {
      name: 'Galaxie Lointaine',
      emoji: '🌌',
      color: '#aa44ff',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      badge: 'Voyage intérieur',
      badgeEmoji: '🌌'
    }
  };

  const key = `${valence}-${arousal}` as keyof typeof masks;
  const maskData = masks[key] || masks['cool-breathe'];

  // Random rarity (90% common, 8% rare, 2% legendary)
  const rand = Math.random();
  let rarity: 'common' | 'rare' | 'legendary' = 'common';
  if (rand > 0.98) rarity = 'legendary';
  else if (rand > 0.90) rarity = 'rare';

  return {
    badge: maskData.badge,
    badgeEmoji: maskData.badgeEmoji,
    valence,
    arousal,
    maskGenerated: {
      id: `mask-${Date.now()}`,
      name: maskData.name,
      emoji: maskData.emoji,
      color: maskData.color,
      gradient: maskData.gradient,
      rarity,
      unlocked_at: new Date().toISOString()
    }
  };
}

function publishMoodUpdate(valence: string, arousal: string) {
  // In production, this would use Supabase Realtime
  const moodEvent = {
    type: 'mood.updated',
    valence,
    arousal,
    timestamp: Date.now()
  };
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('mood.updated', { 
    detail: moodEvent 
  }));
  
  console.log('📢 Mood updated:', moodEvent);
}
