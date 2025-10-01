export interface PlantAsset {
  name: string;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  description: string;
  emoji: string;
}

export const PLANT_ASSETS: Record<number, PlantAsset> = {
  1: {
    name: 'Pousse tendre',
    rarity: 'common',
    color: '#90EE90',
    description: 'Une petite pousse pleine de promesses',
    emoji: '🌱'
  },
  2: {
    name: 'Buisson fleuri',
    rarity: 'common',
    color: '#98FB98',
    description: 'Un buisson qui grandit avec toi',
    emoji: '🌿'
  },
  3: {
    name: 'Arbre lumineux',
    rarity: 'rare',
    color: '#FFD700',
    description: 'Un arbre doré, signe de régularité',
    emoji: '✨🌳'
  },
  4: {
    name: 'Fleur arc-en-ciel',
    rarity: 'legendary',
    color: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
    description: 'Plante légendaire : 3 semaines consécutives',
    emoji: '🌈🌸'
  }
};

export function getPlantByRarity(rarity: number): PlantAsset {
  return PLANT_ASSETS[Math.min(rarity, 4)] || PLANT_ASSETS[1];
}

export function shouldShowRareDrop(rarity: number, weekStreak: number): boolean {
  // Legendary: 5% chance if 3+ week streak
  if (rarity >= 4 && weekStreak >= 3) {
    return Math.random() < 0.05;
  }
  // Rare: 15% chance if 2+ week streak
  if (rarity >= 3 && weekStreak >= 2) {
    return Math.random() < 0.15;
  }
  return false;
}
