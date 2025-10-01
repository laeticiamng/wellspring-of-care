import { useState, useEffect } from 'react';
import { 
  saveCollection, 
  loadCollectionsData, 
  isCollectionItemUnlocked,
  getCollectionProgress,
  COLLECTIONS,
  type Collection,
  type CollectionItem
} from '@/lib/gamification';

export function useCollections() {
  const [collections, setCollections] = useState<Record<string, Collection>>({});

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    const data = loadCollectionsData();
    const collectionsMap: Record<string, Collection> = {};

    Object.entries(COLLECTIONS).forEach(([key, collection]) => {
      const progress = getCollectionProgress(collection.id);
      const items: CollectionItem[] = collection.items.map(item => ({
        ...item,
        unlocked: isCollectionItemUnlocked(collection.id, item.id),
        unlockedAt: data[`${collection.id}_unlocked_at_${item.id}`] || undefined
      }));

      collectionsMap[key] = {
        ...collection,
        items,
        totalItems: collection.items.length,
        unlockedCount: progress.unlocked
      };
    });

    setCollections(collectionsMap);
  };

  const unlockItem = (collectionId: string, itemId: string) => {
    saveCollection(collectionId, itemId);
    loadCollections();
  };

  return { collections, unlockItem, loadCollections };
}
