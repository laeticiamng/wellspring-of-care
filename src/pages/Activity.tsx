import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useWeekly } from '@/hooks/useWeekly';
import { SeasonGarden } from '@/components/SeasonGarden';
import { HelpsList } from '@/components/HelpsList';
import { WeeksCarousel } from '@/components/WeeksCarousel';
import { RarePlantReveal } from '@/components/RarePlantReveal';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlantByRarity } from '@/utils/gardenAssets';

export default function Activity() {
  const { currentSummary, weeklySummaries, weeklyGardens, isLoadingSummary, isLoadingHistory } = useWeekly();
  const [showRarePlant, setShowRarePlant] = useState(false);
  const [rarePlant, setRarePlant] = useState<any>(null);

  const currentGarden = weeklyGardens?.[0];
  const rarity = currentGarden?.rarity || 1;

  useEffect(() => {
    // Show rare plant reveal if rarity >= 3 and not shown before
    if (rarity >= 3 && currentGarden) {
      const hasShown = sessionStorage.getItem(`rare-plant-${currentGarden.id}`);
      if (!hasShown) {
        setRarePlant(getPlantByRarity(rarity));
        setShowRarePlant(true);
        sessionStorage.setItem(`rare-plant-${currentGarden.id}`, 'true');
      }
    }
  }, [rarity, currentGarden]);

  if (isLoadingSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const season = (currentSummary?.season as 'spring' | 'summer' | 'autumn' | 'winter') || 'spring';
  const helps = currentSummary?.helps || [];

  return (
    <>
      <Helmet>
        <title>Jardin des Saisons | EmotionsCare</title>
        <meta name="description" content="Découvre ta semaine en douceur avec ton jardin personnel" />
      </Helmet>

      {/* Rare plant reveal */}
      {showRarePlant && rarePlant && (
        <RarePlantReveal
          plant={rarePlant}
          onComplete={() => setShowRarePlant(false)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <div className="max-w-6xl mx-auto p-6 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 
              className="text-4xl font-bold text-foreground"
              tabIndex={0}
            >
              Ta semaine, en douceur
            </h1>
            <p className="text-muted-foreground">
              Le jardin se transforme à ton rythme
            </p>
            {rarity >= 3 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-primary font-medium"
                role="status"
                aria-live="polite"
              >
                ✨ {rarity >= 4 ? 'Plante légendaire' : 'Plante rare'} débloquée !
              </motion.p>
            )}
          </motion.div>

          {/* Garden Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
          >
            <SeasonGarden 
              season={season}
              rarity={rarity}
              lowStim={false}
            />
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Helps List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <HelpsList helps={helps} />
            </motion.div>

            {/* Weekly Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold text-foreground">
                Cette semaine
              </h3>
              <div className="space-y-3">
                {(currentSummary?.verbal_week || []).map((verbal: string) => (
                  <div
                    key={verbal}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium capitalize">{verbal}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Weeks History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            {isLoadingHistory ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : (
              <WeeksCarousel weeks={weeklySummaries || []} />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
