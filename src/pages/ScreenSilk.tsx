import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSilk } from '@/hooks/useScreenSilk';
import { PauseSequence } from '@/components/PauseSequence';
import { TextureGallery } from '@/components/TextureGallery';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScreenSilk() {
  const navigate = useNavigate();
  const [isInSession, setIsInSession] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { sessions, textures, loading, startSession, completeSession, refreshData } = useScreenSilk();
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [totalPauses, setTotalPauses] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedSilks, setUnlockedSilks] = useState<string[]>([]);

  const silkTypes = [
    { id: 'silk1', name: '🌊 Soie Océan', unlockLevel: 1, xp: 30 },
    { id: 'silk2', name: '🌸 Soie Florale', unlockLevel: 3, xp: 60 },
    { id: 'silk3', name: '💫 Soie Céleste', unlockLevel: 5, xp: 100 },
    { id: 'silk4', name: '✨ Soie Diamant', unlockLevel: 8, xp: 150 },
  ];

  useState(() => {
    const saved = localStorage.getItem('screensilk_progress');
    if (saved) {
      const { level, xp, pauses, silks } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setTotalPauses(pauses || 0);
      setUnlockedSilks(silks || []);
    }
  });

  const handleStartPause = async () => {
    const sessionId = await startSession();
    if (sessionId) {
      setCurrentSessionId(sessionId);
      setIsInSession(true);
    }
  };

  const handleCompleteSession = async (durationSeconds: number) => {
    if (currentSessionId) {
      await completeSession(currentSessionId, durationSeconds);
      
      // Calculate XP
      const baseXP = 25;
      const durationBonus = Math.floor(durationSeconds / 10) * 5;
      const totalXPGain = baseXP + durationBonus;

      const newXP = totalXP + totalXPGain;
      const newLevel = Math.floor(newXP / 500) + 1;
      const newPauseCount = totalPauses + 1;
      const leveledUp = newLevel > userLevel;

      // Check for silk unlocks
      const newUnlocks = silkTypes.filter(st => 
        st.unlockLevel <= newLevel && !unlockedSilks.includes(st.id)
      ).map(st => st.id);

      if (leveledUp) {
        setUserLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      if (newUnlocks.length > 0) {
        setUnlockedSilks([...unlockedSilks, ...newUnlocks]);
      }

      setTotalXP(newXP);
      setTotalPauses(newPauseCount);

      localStorage.setItem('screensilk_progress', JSON.stringify({
        level: newLevel,
        xp: newXP,
        pauses: newPauseCount,
        silks: [...unlockedSilks, ...newUnlocks]
      }));
      
      setIsInSession(false);
      setCurrentSessionId(null);
      refreshData();
    }
  };

  const handleSkip = () => {
    setIsInSession(false);
    setCurrentSessionId(null);
  };

  if (isInSession) {
    return (
      <PauseSequence 
        onComplete={handleCompleteSession}
        onSkip={handleSkip}
      />
    );
  }

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in rounded-lg p-8 text-center space-y-4">
            <div className="text-6xl animate-bounce">🌊</div>
            <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
            <p className="text-muted-foreground">Nouvelle soie débloquée</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 text-primary" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-light">Screen Silk</h1>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
              <div className="max-w-md space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalPauses} pauses</span>
                  <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Une pause sensorielle pour tes yeux fatigués
          </p>
          
          {/* Soies débloquées */}
          <div className="flex gap-2 flex-wrap mt-4">
            {silkTypes.map(silk => (
              <div
                key={silk.id}
                className={`px-3 py-1 rounded-full text-xs ${
                  unlockedSilks.includes(silk.id)
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : userLevel >= silk.unlockLevel
                    ? 'bg-accent/20 text-accent border border-accent/40 animate-pulse'
                    : 'bg-muted/50 text-muted-foreground opacity-50'
                }`}
              >
                {silk.name}
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <Card className="relative overflow-hidden mb-8">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative p-8 text-center space-y-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-12 h-12 mx-auto text-primary" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-light mb-2">Prêt·e pour une pause ?</h2>
              <p className="text-muted-foreground">
                Une séquence douce de 30 secondes pour reposer ta vision
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleStartPause}
              disabled={loading}
              className="text-lg px-8"
            >
              <Eye className="w-5 h-5 mr-2" />
              Commencer la pause
            </Button>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>30s - 2min</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Textures rares</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <Card className="mb-8 p-6">
            <h3 className="text-xl font-light mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pauses récentes
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {session.badge && (
                      <span className="text-lg">{session.badge}</span>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(session.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.duration_seconds}s
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Texture collection */}
        <Card className="p-6">
          <TextureGallery textures={textures} />
        </Card>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-light mb-3">💡 Conseils</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Fais une pause toutes les 20-30 minutes d'écran</li>
            <li>• Cligne régulièrement pour éviter la sécheresse oculaire</li>
            <li>• Ajuste la luminosité de ton écran selon l'éclairage ambiant</li>
            <li>• Regarde au loin (6+ mètres) régulièrement pour reposer tes yeux</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
