import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TheatreCurtain } from "@/components/TheatreCurtain";
import { ActChoiceCard } from "@/components/ActChoiceCard";
import { StoryNarration } from "@/components/StoryNarration";
import { FragmentCard } from "@/components/FragmentCard";
import { StoryAmbience } from "@/components/StoryAmbience";
import { useStorySession } from "@/hooks/useStorySession";
import { useAuth } from "@/contexts/AuthContext";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Play, ArrowRight, Grid3x3, Eye } from "lucide-react";
import { toast } from "sonner";

type StoryStage = 'welcome' | 'act-selection' | 'curtain-opening' | 'story-playing' | 'epilogue' | 'gallery';

const StorySynth = () => {
  const { user } = useAuth();
  const { 
    acts, 
    isLoadingActs,
    fragments,
    isLoadingFragments,
    createSession,
    recordChoice,
    completeSession,
    toggleFavorite,
    isCreatingSession,
  } = useStorySession();
  const { track } = useImplicitTracking();

  const [stage, setStage] = useState<StoryStage>('welcome');
  const [selectedAct, setSelectedAct] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [curtainOpen, setCurtainOpen] = useState(false);

  useEffect(() => {
    // Track page view
    track({
      instrument: 'navigation',
      item_id: 'story_synth',
      proxy: 'completion',
      value: 1,
      context: { surface: 'story-synth' }
    });
  }, []);

  const handleStartStory = (act: any) => {
    setSelectedAct(act);
    setStage('curtain-opening');
    setCurtainOpen(true);

    // Créer la session
    createSession({ actCode: act.act_code });

    // Track story start
    track({
      instrument: 'interaction',
      item_id: 'story_start',
      proxy: 'choice',
      value: act.act_code,
      context: { surface: 'story-synth', act: act.title }
    });
  };

  const handleCurtainOpened = () => {
    // Start first scene
    setStage('story-playing');
    setCurrentSceneIndex(0);
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (!selectedAct || !currentSession) return;
    
    setSelectedChoice(choiceId);

    // Record choice
    if (currentSession?.id) {
      recordChoice({
        sessionId: currentSession.id,
        sceneId: currentSceneIndex + 1,
        choiceId,
      });
    }

    // Track choice
    track({
      instrument: 'interaction',
      item_id: `scene_${currentSceneIndex + 1}_choice`,
      proxy: 'choice',
      value: choiceId,
      context: { surface: 'story-synth', act: selectedAct.act_code }
    });

    // Next scene after 2s
    setTimeout(() => {
      if (currentSceneIndex < selectedAct.scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
        setSelectedChoice(null);
      } else {
        // Story complete
        handleStoryComplete();
      }
    }, 2000);
  };

  const handleStoryComplete = () => {
    setStage('epilogue');

    // Générer badge verbal basé sur les choix (simulé pour l'instant)
    const badges = [
      'Tension relâchée 🌿',
      'Rythme plus doux 🌙',
      'Énergie revenue ✨',
      'Présence retrouvée 🕊️',
      'Calme intérieur 💙',
    ];
    const randomBadge = badges[Math.floor(Math.random() * badges.length)];

    // Fragments à débloquer basé sur l'acte
    const fragmentsToUnlock = selectedAct.act_code === 'lisiere' 
      ? ['lisiere_firefly', 'lisiere_stone']
      : selectedAct.act_code === 'crepuscule'
      ? ['crepuscule_lantern']
      : ['courage_summit'];

    if (currentSession?.id) {
      completeSession({
        sessionId: currentSession.id,
        badge: randomBadge,
        fragmentsToUnlock,
      });
    }

    // Track completion
    track({
      instrument: 'interaction',
      item_id: 'story_complete',
      proxy: 'completion',
      value: 1,
      context: { surface: 'story-synth', act: selectedAct.act_code, badge: randomBadge }
    });
  };

  const handleViewGallery = () => {
    setStage('gallery');
  };

  const handleBackToWelcome = () => {
    setStage('welcome');
    setSelectedAct(null);
    setCurrentSession(null);
    setCurrentSceneIndex(0);
    setSelectedChoice(null);
    setCurtainOpen(false);
  };

  // Scene actuelle
  const currentScene = selectedAct?.scenes?.[currentSceneIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a0a] via-[#2d1414] to-[#0a0a1a]">
      <Header />

      {/* Ambiance visuelle qui change selon l'acte */}
      {stage === 'story-playing' && selectedAct && (
        <StoryAmbience
          theme={selectedAct.theme}
          colorPrimary={selectedAct.visual_palette?.primary || '#666'}
          colorSecondary={selectedAct.visual_palette?.secondary || '#333'}
          particleType={selectedAct.visual_palette?.particles || 'fireflies'}
          intensity={60}
        />
      )}

      {/* Rideau */}
      {(stage === 'curtain-opening' || stage === 'story-playing') && (
        <TheatreCurtain 
          isOpen={curtainOpen} 
          onAnimationComplete={handleCurtainOpened}
        />
      )}

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Welcome */}
          {stage === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  className="flex items-center justify-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <BookOpen className="w-12 h-12 text-primary" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Le Théâtre des Histoires
                  </h1>
                  <Sparkles className="w-12 h-12 text-accent" />
                </motion.div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Prêt·e ? Le rideau se lève. Choisis ton acte et laisse la scène t'emporter.
                </p>
              </div>

              {/* Gallery button */}
              {fragments && fragments.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleViewGallery}
                    className="border-accent/20"
                  >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Mes Fragments ({fragments.length})
                  </Button>
                </div>
              )}

              {/* Acts Selection */}
              <div className="grid md:grid-cols-3 gap-6">
                {isLoadingActs ? (
                  <div className="col-span-3 text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent mx-auto"
                    />
                  </div>
                ) : (
                  acts?.map((act, index) => (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card 
                        className="relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                        onClick={() => setSelectedAct(act)}
                      >
                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `linear-gradient(135deg, ${act.visual_palette?.primary || '#666'}, ${act.visual_palette?.secondary || '#333'})`,
                          }}
                        />

                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{act.title}</span>
                            <span className="text-2xl">🎭</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {act.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{act.theme}</span>
                            <span>{act.duration_minutes} min</span>
                          </div>
                          
                          {selectedAct?.id === act.id && (
                            <Button
                              className="w-full bg-gradient-to-r from-primary to-accent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartStory(act);
                              }}
                              disabled={isCreatingSession}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Commencer l'histoire
                            </Button>
                          )}
                        </CardContent>

                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Act Selection Confirmation (hidden by curtain animation) */}
          {stage === 'act-selection' && (
            <motion.div
              key="act-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 py-16"
            >
              <h2 className="text-3xl font-bold">
                {selectedAct?.title}
              </h2>
              <p className="text-muted-foreground">
                {selectedAct?.description}
              </p>
            </motion.div>
          )}

          {/* Story Playing */}
          {stage === 'story-playing' && currentScene && (
            <motion.div
              key="story-playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 py-8"
            >
              {/* Scene title */}
              <motion.div
                className="text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-2">
                  {currentScene.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Acte {currentSceneIndex + 1} / {selectedAct.scenes.length}
                </p>
              </motion.div>

              {/* Choices */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {currentScene.choices.map((choice: any, index: number) => (
                  <ActChoiceCard
                    key={choice.id}
                    text={choice.text}
                    mood={choice.mood}
                    music={choice.music}
                    isSelected={selectedChoice === choice.id}
                    onSelect={() => handleChoiceSelect(choice.id)}
                    delay={index * 0.1}
                  />
                ))}
              </div>

              {/* Narration */}
              <StoryNarration
                text={`Acte ${currentSceneIndex + 1}: ${currentScene.title}. Fais ton choix...`}
                subtitlesEnabled={true}
              />
            </motion.div>
          )}

          {/* Epilogue */}
          {stage === 'epilogue' && (
            <motion.div
              key="epilogue"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 py-16"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-20 h-20 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">
                  Histoire terminée
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Merci d'avoir été là 🤍
                </p>
              </motion.div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleViewGallery}
                  className="border-accent/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir mes Fragments
                </Button>
                <Button
                  onClick={handleBackToWelcome}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Une autre histoire
                </Button>
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {stage === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Mes Fragments
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Ta collection de contes
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBackToWelcome}
                  className="border-primary/20"
                >
                  Retour
                </Button>
              </div>

              {isLoadingFragments ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent mx-auto"
                  />
                </div>
              ) : fragments && fragments.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fragments.map((fragment, index) => (
                    <FragmentCard
                      key={fragment.id}
                      title={fragment.title}
                      description={fragment.description}
                      rarity={fragment.rarity}
                      visualData={fragment.visual_asset}
                      isFavorite={fragment.is_favorite}
                      onToggleFavorite={() => toggleFavorite(fragment.id)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-primary/20">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Aucun fragment débloqué pour l'instant.
                      <br />
                      Termine une histoire pour commencer ta collection ✨
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StorySynth;
