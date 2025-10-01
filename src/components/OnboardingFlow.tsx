import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Sparkles, Bell, Shield, Eye, Heart } from 'lucide-react';

interface ConsentOption {
  id: keyof ReturnType<typeof useUserSettings>['settings'];
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultValue: boolean;
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { settings, updateSettings, completeOnboarding } = useUserSettings();
  const [step, setStep] = useState(0);
  const [consents, setConsents] = useState({
    consent_who5: true,
    consent_panas: true,
    consent_swemwbs: true,
    consent_cbi: true,
    consent_uwes: true,
    consent_cvsq: true,
    consent_anonymous_aggregation: true,
    nyvee_reminders: true,
    screen_silk_reminders: true,
    journal_reminders: true,
  });

  const consentOptions: ConsentOption[] = [
    {
      id: 'nyvee_reminders' as any,
      title: 'Rappels doux 🌙',
      description: 'Reçois des suggestions bienveillantes pour prendre soin de toi',
      icon: <Bell className="w-6 h-6 text-primary" />,
      defaultValue: true
    },
    {
      id: 'consent_anonymous_aggregation' as any,
      title: 'Partage anonyme 🔒',
      description: 'Tes micro-sessions sont agrégées de façon anonyme pour améliorer l\'expérience',
      icon: <Shield className="w-6 h-6 text-primary" />,
      defaultValue: true
    },
    {
      id: 'screen_silk_reminders' as any,
      title: 'Pauses visuelles 👁️',
      description: 'Des rappels pour reposer tes yeux après l\'écran',
      icon: <Eye className="w-6 h-6 text-primary" />,
      defaultValue: true
    },
  ];

  const handleConsent = (key: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = async () => {
    await updateSettings(consents);
    await completeOnboarding();
    navigate('/dashboard');
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Silk curtain animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent"
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-16 h-16 mx-auto text-primary" />
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light">
                  Bienvenue dans ton voyage émotionnel ✨
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Un espace où chaque émotion trouve sa place, sans jugement, avec douceur
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setStep(1)}
                className="text-lg px-8 mt-8"
              >
                <Heart className="w-5 h-5 mr-2" />
                Commencer
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="consents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-light">Personnalise ton expérience</h2>
                <p className="text-muted-foreground">
                  Choisis ce qui te convient, tu pourras toujours changer d'avis plus tard
                </p>
              </div>

              <div className="grid gap-4 md:gap-6">
                {consentOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">{option.icon}</div>
                          <div className="space-y-1 flex-1">
                            <h3 className="font-medium text-lg">{option.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={consents[option.id as keyof typeof consents]}
                          onCheckedChange={(checked) => handleConsent(option.id as string, checked)}
                          className="mt-1"
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                <Button
                  variant="ghost"
                  onClick={() => setStep(0)}
                >
                  Retour
                </Button>
                <Button
                  size="lg"
                  onClick={handleFinish}
                  className="px-8"
                >
                  C'est parti ! ✨
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
