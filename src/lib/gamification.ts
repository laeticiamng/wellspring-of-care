// Système de gamification et récompenses

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
};

export type Collection = {
  id: string;
  name: string;
  items: CollectionItem[];
  totalItems: number;
  unlockedCount: number;
};

export type CollectionItem = {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
};

// Collections par module
export const COLLECTIONS = {
  cocons: {
    id: 'cocons',
    name: 'Cocons Calmes',
    items: [
      { id: 'cristal', name: 'Cocon Cristal', emoji: '💎', rarity: 'rare' as const },
      { id: 'cosmos', name: 'Cocon Cosmos', emoji: '🌌', rarity: 'epic' as const },
      { id: 'nature', name: 'Cocon Nature', emoji: '🌿', rarity: 'common' as const },
      { id: 'ocean', name: 'Cocon Océan', emoji: '🌊', rarity: 'rare' as const },
      { id: 'aurore', name: 'Cocon Aurore', emoji: '✨', rarity: 'legendary' as const }
    ]
  },
  constellations: {
    id: 'constellations',
    name: 'Constellations Émotionnelles',
    items: [
      { id: 'paix', name: 'Constellation de la Paix', emoji: '☮️', rarity: 'common' as const },
      { id: 'force', name: 'Constellation de Force', emoji: '💪', rarity: 'rare' as const },
      { id: 'joie', name: 'Constellation de Joie', emoji: '😊', rarity: 'rare' as const },
      { id: 'sagesse', name: 'Constellation de Sagesse', emoji: '🦉', rarity: 'epic' as const },
      { id: 'harmonie', name: 'Constellation Harmonique', emoji: '🎵', rarity: 'legendary' as const }
    ]
  },
  mantras: {
    id: 'mantras',
    name: 'Mur des Mantras',
    items: [
      { id: 'vient', name: 'Ça vient', emoji: '🌱', rarity: 'common' as const },
      { id: 'passe', name: 'Ça passe', emoji: '🌊', rarity: 'common' as const },
      { id: 'souffle', name: 'Respire', emoji: '💨', rarity: 'common' as const },
      { id: 'ok', name: 'C\'est OK', emoji: '✅', rarity: 'rare' as const },
      { id: 'present', name: 'Je suis présent·e', emoji: '🧘', rarity: 'epic' as const }
    ]
  },
  bulles: {
    id: 'bulles',
    name: 'Bulles Rares',
    items: [
      { id: 'rose', name: 'Bulle Rose', emoji: '🎀', rarity: 'common' as const },
      { id: 'dorée', name: 'Bulle Dorée', emoji: '✨', rarity: 'rare' as const },
      { id: 'arc_en_ciel', name: 'Bulle Arc-en-ciel', emoji: '🌈', rarity: 'epic' as const },
      { id: 'galaxie', name: 'Bulle Galaxie', emoji: '🌌', rarity: 'legendary' as const }
    ]
  },
  fragments: {
    id: 'fragments',
    name: 'Fragments Mélodiques',
    items: [
      { id: 'flute', name: 'Fragment Flûte', emoji: '🎵', rarity: 'common' as const },
      { id: 'piano', name: 'Fragment Piano', emoji: '🎹', rarity: 'rare' as const },
      { id: 'harpe', name: 'Fragment Harpe', emoji: '🎺', rarity: 'rare' as const },
      { id: 'cristal', name: 'Fragment Cristal', emoji: '💎', rarity: 'epic' as const },
      { id: 'celeste', name: 'Fragment Céleste', emoji: '✨', rarity: 'legendary' as const }
    ]
  },
  haikus: {
    id: 'haikus',
    name: 'Haïkus Éphémères',
    items: [
      { id: 'nuage', name: 'Haïku du Nuage', emoji: '☁️', rarity: 'common' as const },
      { id: 'pluie', name: 'Haïku de la Pluie', emoji: '🌧️', rarity: 'rare' as const },
      { id: 'lune', name: 'Haïku Lunaire', emoji: '🌙', rarity: 'epic' as const },
      { id: 'aurore', name: 'Haïku de l\'Aurore', emoji: '🌅', rarity: 'legendary' as const }
    ]
  },
  pages: {
    id: 'pages',
    name: 'Pages Brillantes',
    items: [
      { id: 'doree', name: 'Page Dorée', emoji: '📄', rarity: 'common' as const },
      { id: 'argentee', name: 'Page Argentée', emoji: '📃', rarity: 'rare' as const },
      { id: 'cristal', name: 'Page Cristal', emoji: '💎', rarity: 'epic' as const },
      { id: 'arc_en_ciel', name: 'Page Arc-en-ciel', emoji: '🌈', rarity: 'legendary' as const }
    ]
  },
  badges_resp: {
    id: 'badges_resp',
    name: 'Badges Respiratoires',
    items: [
      { id: 'expire', name: 'Maître de l\'Expire', emoji: '💨', rarity: 'rare' as const },
      { id: 'vagues', name: 'Maître des Vagues', emoji: '🌊', rarity: 'epic' as const },
      { id: 'sommeil', name: 'Gardien du Sommeil', emoji: '🌙', rarity: 'legendary' as const }
    ]
  },
  stickers_ar: {
    id: 'stickers_ar',
    name: 'Stickers AR Évolués',
    items: [
      { id: 'etoile', name: 'Sticker Étoile', emoji: '⭐', rarity: 'common' as const },
      { id: 'pluie', name: 'Sticker Pluie d\'Étoiles', emoji: '✨', rarity: 'rare' as const },
      { id: 'aurore', name: 'Sticker Aurore', emoji: '🌌', rarity: 'epic' as const },
      { id: 'cosmos', name: 'Sticker Cosmique', emoji: '🪐', rarity: 'legendary' as const }
    ]
  },
  artefacts: {
    id: 'artefacts',
    name: 'Artefacts d\'Ambition',
    items: [
      { id: 'boussole', name: 'Boussole d\'Objectif', emoji: '🧭', rarity: 'rare' as const },
      { id: 'hourglass', name: 'Sablier Motivant', emoji: '⏳', rarity: 'rare' as const },
      { id: 'trophy', name: 'Trophée d\'Excellence', emoji: '🏆', rarity: 'epic' as const },
      { id: 'crown', name: 'Couronne de Persévérance', emoji: '👑', rarity: 'legendary' as const }
    ]
  },
  contes: {
    id: 'contes',
    name: 'Bibliothèque de Contes',
    items: [
      { id: 'foret', name: 'Conte de la Forêt', emoji: '🌲', rarity: 'common' as const },
      { id: 'ocean', name: 'Conte de l\'Océan', emoji: '🌊', rarity: 'rare' as const },
      { id: 'montagne', name: 'Conte de la Montagne', emoji: '⛰️', rarity: 'epic' as const },
      { id: 'cosmos', name: 'Conte Cosmique', emoji: '🌌', rarity: 'legendary' as const }
    ]
  },
  plantes: {
    id: 'plantes',
    name: 'Jardin Émotionnel',
    items: [
      { id: 'rose', name: 'Rose de Joie', emoji: '🌹', rarity: 'common' as const },
      { id: 'lotus', name: 'Lotus de Paix', emoji: '🪷', rarity: 'rare' as const },
      { id: 'orchidee', name: 'Orchidée d\'Équilibre', emoji: '🌺', rarity: 'epic' as const },
      { id: 'arbre', name: 'Arbre de Sagesse', emoji: '🌳', rarity: 'legendary' as const }
    ]
  }
};

// Badges de progression
export const BADGES = [
  {
    id: 'maitre_vagues',
    name: 'Maître des Vagues',
    emoji: '🌊',
    description: 'Complété 10 sessions de breathwork'
  },
  {
    id: 'eclaireur',
    name: 'Éclaireur Empathique',
    emoji: '💫',
    description: 'Aidé 5 personnes dans la communauté'
  },
  {
    id: 'collectionneur',
    name: 'Collectionneur Cosmique',
    emoji: '🌌',
    description: 'Débloqué 10 objets de collection'
  },
  {
    id: 'perseverant',
    name: 'Persévérant',
    emoji: '⚔️',
    description: 'Vaincu 3 boss de persévérance'
  },
  {
    id: 'dj_emotions',
    name: 'DJ des Émotions',
    emoji: '🎛️',
    description: 'Créé 5 mixes émotionnels'
  }
];

// Mots-clés tendance pour la carte de la semaine (horoscope émotionnel)
export const WEEKLY_KEYWORDS = [
  { emoji: '✨', keyword: 'Posé' },
  { emoji: '🔥', keyword: 'Cap' },
  { emoji: '🌊', keyword: 'Douceur' },
  { emoji: '🌟', keyword: 'Brillant' },
  { emoji: '🌈', keyword: 'Coloré' },
  { emoji: '💫', keyword: 'Lumineux' },
  { emoji: '🎯', keyword: 'Focus' },
  { emoji: '🌸', keyword: 'Fleuri' },
  { emoji: '⚡', keyword: 'Vibe' },
  { emoji: '🎭', keyword: 'Expressif' }
];

// Générer le mot-clé de la semaine (pseudo-aléatoire basé sur la date)
export function getWeeklyKeyword(): { emoji: string; keyword: string } {
  const now = new Date();
  const weekNumber = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const index = weekNumber % WEEKLY_KEYWORDS.length;
  return WEEKLY_KEYWORDS[index];
}

// Sauvegarder/charger les collections (localStorage pour v1)
const STORAGE_KEY = 'emotionscare_collections';

export function saveCollection(collectionId: string, itemId: string) {
  const data = loadCollectionsData();
  if (!data[collectionId]) {
    data[collectionId] = [];
  }
  if (!data[collectionId].includes(itemId)) {
    data[collectionId].push(itemId);
    data[collectionId + '_unlocked_at_' + itemId] = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadCollectionsData(): Record<string, any> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function isCollectionItemUnlocked(collectionId: string, itemId: string): boolean {
  const data = loadCollectionsData();
  return data[collectionId]?.includes(itemId) || false;
}

export function getCollectionProgress(collectionId: string): { unlocked: number; total: number } {
  const collection = Object.values(COLLECTIONS).find(c => c.id === collectionId);
  if (!collection) return { unlocked: 0, total: 0 };
  
  const data = loadCollectionsData();
  const unlockedItems = data[collectionId] || [];
  
  return {
    unlocked: unlockedItems.length,
    total: collection.items.length
  };
}

// Animations et effets visuels
export function triggerConfetti() {
  // TODO: Implémenter avec une librairie de confettis
  console.log('🎉 Confetti!');
}

export function triggerGlowEffect(element: HTMLElement) {
  element.classList.add('animate-glow');
  setTimeout(() => element.classList.remove('animate-glow'), 1000);
}

export function playSuccessSound() {
  // TODO: Implémenter avec Web Audio API
  console.log('🔊 Success sound!');
}
