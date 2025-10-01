import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Smile, Sparkles } from "lucide-react";
import { useState } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const ARFilters = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [filterUses, setFilterUses] = useState<{[key: number]: number}>({});
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();

  const handleFilterSelect = (filterIdx: number) => {
    setSelectedFilter(filterIdx);
    
    // Track PANAS-PA with "like" proxy for comfort stickers
    track({
      instrument: "PANAS",
      item_id: "pa_up",
      proxy: "like",
      value: "comfort_sticker",
      context: { filter: String(filterIdx) }
    });

    // Track usage and unlock evolved stickers
    setFilterUses(prev => {
      const newUses = { ...prev, [filterIdx]: (prev[filterIdx] || 0) + 1 };
      if (newUses[filterIdx] >= 3 && collections.stickers_ar?.items[filterIdx]) {
        unlockItem('stickers_ar', collections.stickers_ar.items[filterIdx].id);
      }
      return newUses;
    });
  };
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Camera className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Chambre des Reflets
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Salle de miroirs magiques. Un clin d'œil déclenche une pluie d'étoiles, un sourire fait briller votre reflet.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🪞 Les stickers évoluent avec vous 🪞
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-6 w-6 text-primary" />
              <span>Filtres de bien-être</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                {!cameraActive ? (
                  <>
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Caméra désactivée</p>
                    <Button 
                      className="bg-gradient-primary text-primary-foreground"
                      onClick={() => setCameraActive(true)}
                    >
                      Activer la caméra
                    </Button>
                  </>
                ) : (
                  <>
                    <Smile className="h-24 w-24 text-primary mx-auto animate-float" />
                    <p className="text-lg font-medium text-primary">
                      {selectedFilter !== null ? `Filtre ${selectedFilter + 1} actif 🌟` : "Sélectionnez un filtre"}
                    </p>
                    <Button variant="outline" onClick={() => setCameraActive(false)}>
                      Désactiver
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card 
                  key={i} 
                  className={`border-0 transition-all cursor-pointer hover:scale-110 ${
                    selectedFilter === i
                      ? 'bg-gradient-primary/20 shadow-glow'
                      : 'bg-gradient-primary/5 hover:bg-gradient-primary/10'
                  }`}
                  onClick={() => cameraActive && handleFilterSelect(i)}
                >
                  <CardContent className="pt-6 text-center">
                    <Sparkles className={`h-8 w-8 mx-auto ${
                      selectedFilter === i ? 'text-primary animate-pulse' : 'text-primary/50'
                    }`} />
                    <p className="text-xs mt-2">Filtre {i + 1}</p>
                    {filterUses[i] && (
                      <p className="text-xs text-primary">×{filterUses[i]}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AR Stickers Collection */}
            {collections.stickers_ar && collections.stickers_ar.unlockedCount > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-healing/10 border border-accent/20">
                <div className="text-center space-y-3">
                  <p className="text-sm font-semibold text-accent">🪞 Stickers évolués</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {collections.stickers_ar.items.filter(item => item.unlocked).map(item => (
                      <div key={item.id} className="text-center">
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-primary">
                    {collections.stickers_ar.unlockedCount}/{collections.stickers_ar.totalItems} stickers évolués
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ARFilters;
