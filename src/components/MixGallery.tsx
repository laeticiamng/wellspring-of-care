import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Music, Clock } from "lucide-react";

interface Mix {
  id: number;
  mood: string;
  color: string;
  tempo: number;
  valence: number;
  arousal: number;
  savedAt: string;
}

interface MixGalleryProps {
  mixes: Mix[];
}

export const MixGallery = ({ mixes }: MixGalleryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-6xl mx-auto border-0 shadow-soft p-6 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ta Playlist Émotionnelle
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mixes.map((mix, index) => (
            <motion.div
              key={mix.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <Card 
                className="p-4 border-2 relative overflow-hidden group cursor-pointer"
                style={{ borderColor: mix.color }}
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: mix.color }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative z-10 space-y-3">
                  {/* Mood indicator */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: mix.color }}
                    >
                      {mix.mood.split(' ')[1] || '🎵'}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(mix.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-lg" style={{ color: mix.color }}>
                      {mix.mood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(mix.tempo)} BPM
                    </p>
                  </div>

                  {/* Mini visualization */}
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => {
                      const height = Math.random() * 60 + 40;
                      return (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t"
                          style={{
                            backgroundColor: mix.color,
                            opacity: 0.6
                          }}
                          animate={{
                            height: `${height}%`
                          }}
                          transition={{
                            duration: 0.5 + Math.random() * 0.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {mixes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucun mix sauvegardé pour l'instant</p>
            <p className="text-sm">Mix ton mood et sauvegarde-le ! 🎛️</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
