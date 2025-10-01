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

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-3xl md:text-4xl font-light">Screen Silk</h1>
          </div>
          <p className="text-muted-foreground">
            Une pause sensorielle pour tes yeux fatigués
          </p>
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
