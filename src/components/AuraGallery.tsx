import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AuraHistory } from '@/hooks/useAuras';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuraGalleryProps {
  history: AuraHistory[];
}

export function AuraGallery({ history }: AuraGalleryProps) {
  if (history.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Galerie des Auras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Ton historique d'auras apparaîtra ici chaque semaine ✨
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Galerie des Auras
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ton nuancier émotionnel hebdomadaire
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Aura snapshot */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-background to-secondary/20 border border-border/50">
                {/* Glow effect */}
                <div
                  className="absolute inset-0 blur-xl"
                  style={{
                    background: `hsl(${entry.color_hue}, 70%, ${entry.luminosity}%)`,
                    opacity: 0.3,
                  }}
                />
                
                {/* Core orb */}
                <div
                  className="absolute inset-[20%] rounded-full"
                  style={{
                    background: `radial-gradient(circle, hsl(${entry.color_hue}, 70%, ${entry.luminosity}%) 0%, hsl(${entry.color_hue}, 60%, ${entry.luminosity - 10}%) 100%)`,
                    boxShadow: `0 0 30px hsl(${entry.color_hue}, 70%, ${entry.luminosity}%)`,
                  }}
                >
                  <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] rounded-full bg-white/20 blur-sm" />
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <p className="text-xs font-semibold text-center mb-1">
                    {format(new Date(entry.week_start), 'd MMM', { locale: fr })} - {format(new Date(entry.week_end), 'd MMM', { locale: fr })}
                  </p>
                  <p className="text-xs text-center">
                    {entry.who5_badge || 'Semaine archivée'}
                  </p>
                  {entry.snapshot_data?.is_rare && (
                    <div className="mt-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      Rare ✨
                    </div>
                  )}
                </div>
              </div>
              
              {/* Week label */}
              <p className="text-xs text-center mt-2 text-muted-foreground">
                {format(new Date(entry.week_start), 'd MMM', { locale: fr })}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
