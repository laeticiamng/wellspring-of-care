# 📱 Liste Complète des Modules - EmotionsCare

## Date: 2025-01-04  
## Total: 47 modules identifiés

---

## 🎯 MODULES PRINCIPAUX (Core Features)

### 1. 🫧 **Nyvée** - Évaluation Rapide Anxiété
- **Fichier**: `src/pages/Nyvee.tsx`
- **Type**: Assessment / STAI-6
- **Durée**: 2 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Instrument**: STAI-6 (6 questions)
- **Route**: `/nyvee`
- **Hooks utilisés**: 
  - `useNyveeSession` (backend session management)
  - `useModuleProgress('nyvee')` (XP/progression)
  - `useCardCollection` (cocoon collection)
  - `useImplicitTracking` (analytics)
- **Composants**: 
  - `BreathingBubble` (animation visuelle)
  - `BadgeReveal` (révélation résultats)
  - `CocoonGallery` (collection cocons rares)
  - `Header` (navigation)
- **Features**:
  - 6 questions STAI-6 (échelle 1-4)
  - Exercice de respiration guidée (30-180s)
  - Calcul réduction % anxiété
  - Attribution badge coloré
  - Déblocage cocons rares (10% chance)
  - Système XP: +50 par session complète
  - Edge function: `nyvee-assess` (start/submit)
- **Tables DB**: `assessment_sessions`, `module_progress`, `user_collections`

### 2. 📝 **Journal Émotionnel**
- **Fichier**: `src/pages/Journal.tsx`
- **Type**: Daily tracking
- **Durée**: 5-10 minutes
- **Backend**: ❌ localStorage (`journal_progress`)
- **Features**: Texte, tags, sentiment analysis
- **Route**: `/journal`
- **Hooks utilisés**:
  - `useMoodEntries` (CRUD entrées)
  - `useEmotionalScan` (détection émotions)
  - `useImplicitTracking` (analytics)
  - localStorage pour XP/niveau (à migrer)
- **Composants**:
  - `EmotionWheel` (sélection émotion principale)
  - `MoodBadge` (affichage humeur)
  - `FloatingCard` (entrées récentes)
  - `Header`, `Button`, `Textarea`
- **Features**:
  - Saisie texte libre (journal)
  - Saisie vocale (speech-to-text)
  - Détection automatique sentiment
  - Tags émotions multiples
  - Historique entrées (calendrier)
  - Graphiques évolution humeur
  - Streak tracking (jours consécutifs)
  - Export PDF/JSON
  - Système XP: +25 par entrée
  - Niveaux: 1000 XP/niveau (à normaliser à 500)
- **Tables DB**: `mood_entries`, `journal_text_entries`, `journal_voice_entries`
- **⚠️ PRIORITÉ 1 MIGRATION**: Usage quotidien, forte valeur utilisateur

### 3. 🎭 **Scan Émotionnel (SAM)**
- **Fichier**: `src/pages/EmotionalScan.tsx`
- **Type**: Valence-Arousal Assessment
- **Durée**: 1 minute
- **Backend**: ❌ localStorage (`emotional_scan_progress`)
- **Instrument**: SAM (Self-Assessment Manikin)
- **Features**: Génération de masques émotionnels
- **Route**: `/emotional-scan`
- **Hooks utilisés**:
  - `useEmotionalScan` (scan logic)
  - localStorage pour XP/masques (à migrer)
- **Composants**:
  - `InteractiveMask` (sélection thème/geste)
  - `MaskFusion` (animation création)
  - `BadgeReveal` (révélation masque)
  - `UserMaskCollection` (galerie)
  - `Header`
- **Features**:
  - 5 phases: welcome → scan → fusion → reveal → collection
  - Sélection thème visuel (5 choix)
  - Sélection geste émotionnel (5 choix)
  - Génération masque unique (25 combinaisons)
  - Système de rareté: Common, Rare, Epic, Legendary
  - Collection masques permanente
  - Fusion masques (3 common → 1 rare)
  - Système XP: +20 par scan, +50 Epic, +100 Legendary
  - Niveaux: 500 XP/niveau
  - Déblocage niveaux: Rare à niveau 5, Epic à 10, Legendary à 15
- **Tables à créer**: `emotional_masks`, `mask_collection`
- **⚠️ PRIORITÉ 8 MIGRATION**: Assessment core, données valeur

### 4. 🧠 **Scan Émotionnel Hume AI**
- **Fichier**: `src/pages/HumeEmotionalScan.tsx`
- **Type**: AI-powered emotion detection
- **Durée**: Variable
- **Backend**: Edge function `hume-emotion-detect`
- **Features**: Texte ou voix
- **Route**: `/hume-emotional-scan`
- **Hooks utilisés**:
  - `useHumeEmotionalScan` (API Hume AI)
  - `useMicrophone` (enregistrement audio)
  - `useImplicitTracking` (analytics)
- **Composants**:
  - `EmotionWheel` (visualisation résultats)
  - `Button`, `Textarea`, `Card`
  - `Header`
- **Features**:
  - 2 modes: Texte ou Voix
  - Mode Texte: Analyse sentiment texte saisi
  - Mode Voix: Enregistrement 10-60s + analyse prosodique
  - Détection 48 émotions (Hume AI)
  - Top 5 émotions avec scores confidence
  - Visualisation radar chart
  - Historique scans (derniers 10)
  - Recommandations basées sur émotions
  - Export résultats JSON
- **Edge Function**: `hume-emotion-detect`
  - Input: text OU audio_base64
  - API: Hume AI Batch API
  - Output: emotions[] avec scores
- **Tables DB**: `emotional_scans_ai`
- **Secret requis**: `HUME_API_KEY`

---

## 🎵 MODULES MUSICAUX

### 5. 🌳 **Music Therapy**
- **Fichier**: `src/pages/MusicTherapy.tsx`
- **Type**: Forêts sonores
- **Durée**: 5-15 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 8 forêts, génération musicale
- **Route**: `/music-therapy`
- **Hooks utilisés**:
  - `useMusicTherapy` (session management)
  - `useModuleProgress('music-therapy')` (XP/progression)
  - `useMusicGeneration` (génération musique AI)
  - `useImplicitTracking` (analytics)
- **Composants**:
  - `ForestScene` (visualisation 8 forêts)
  - `MusicPlayer` (lecteur audio)
  - `MoodSlider` (valence/arousal avant/après)
  - `FragmentCard` (fragments débloqués)
  - `Header`
- **Features**:
  - 8 forêts thématiques:
    1. Forêt Apaisante (calme)
    2. Forêt Énergique (motivation)
    3. Forêt Mystique (concentration)
    4. Forêt Nocturne (sommeil)
    5. Forêt Tropicale (créativité)
    6. Forêt Hivernale (résilience)
    7. Forêt Lumineuse (joie)
    8. Forêt Profonde (introspection)
  - Sélection humeur pré-session (valence/arousal)
  - Session 5-15 min avec musique générative
  - Sélection humeur post-session
  - Calcul amélioration % humeur
  - Déblocage fragments musicaux rares (15% chance)
  - Collection fragments permanente
  - Système XP: +30 par session, +50 si amélioration >20%
  - Niveaux: 500 XP/niveau
  - Déblocage forêts progressif par niveau
- **Edge Function**: `music-therapy-start`, `music-therapy-submit`
- **Tables DB**: `music_therapy_sessions`, `module_progress`, `music_fragments`

### 6. 📚 **Music Library**
- **Fichier**: `src/pages/MusicLibrary.tsx`
- **Type**: Collection de musiques
- **Durée**: N/A
- **Backend**: Supabase storage
- **Route**: `/music-library`
- **Hooks utilisés**:
  - `useQuery` (fetch library)
  - `useAudioSuno` (génération Suno AI)
  - `useMusicGeneration` (génération générique)
- **Composants**:
  - `MusicPlayer` (lecteur avec playlist)
  - `Card`, `Button`, `Badge`
  - `Header`
- **Features**:
  - Bibliothèque toutes musiques générées
  - Filtres: Par forêt, par humeur, par date
  - Tri: Plus récent, plus écouté, favori
  - Lecture en streaming
  - Playlist personnalisée
  - Favoris (likes)
  - Partage (copie lien)
  - Téléchargement MP3
  - Stats écoute (durée, nb lectures)
  - Génération nouvelle musique (quota mensuel)
  - Historique générations
- **Tables DB**: `generated_music`, `user_favorites`, `listening_history`
- **Storage**: Bucket `music-files`

### 7. 🎧 **Mood Mixer (DJ)**
- **Fichier**: `src/pages/MoodMixer.tsx`
- **Type**: Mix émotionnel interactif
- **Durée**: 3-10 minutes
- **Backend**: ❌ localStorage (`mood_mixer_progress`)
- **Features**: Valence/Arousal sliders, génération mix
- **Route**: `/mood-mixer`
- **Hooks utilisés**:
  - `useMoodEntries` (session persistence)
  - localStorage pour XP/mixes (à migrer)
  - `Howl` (sons DJ scratch/drop)
- **Composants**:
  - `DJStudio` (interface DJ complète)
  - `MoodSlider` (valence + arousal)
  - `MixVisualizer` (visualisation temps réel)
  - `MixGallery` (mixes sauvegardés)
  - `Header`
- **Features**:
  - 2 sliders: Valence (-100 à +100), Arousal (0 à 100)
  - Génération mix temps réel
  - 16 humeurs possibles (happy, energetic, calm, sad...)
  - Détection "rare mixes" (coins émotionnels)
  - Badges spéciaux pour mixes rares
  - Sauvegarde mixes permanente
  - Historique sessions DJ
  - Sons DJ: Scratch, Drop, Victory
  - Vibration haptic feedback
  - Combo system (mixes consécutifs)
  - Déblocage DJ sets par niveau
  - Système XP: +20 par mix, +50 rare, +100 perfect mix
  - Niveaux: 500 XP/niveau
  - DJ Sets progressifs: Starter → Pro → Master → Legend
- **Tables à créer**: `mood_mixes`, `dj_sessions`
- **⚠️ PRIORITÉ 4 MIGRATION**: Créatif, engagement fort

---

## 🧘 MODULES MÉDITATION & RESPIRATION

### 8. 🧘‍♀️ **Méditation**
- **Fichier**: `src/pages/Meditation.tsx`
- **Type**: Sessions guidées
- **Durée**: 10-40 minutes
- **Backend**: ❌ localStorage (`meditation_xp`, `meditation_level`, `meditation_completed`, `meditation_total_time`)
- **Sessions**: 9 méditations différentes
- **Route**: `/meditation`
- **Hooks utilisés**:
  - `useMeditation` (session logic)
  - localStorage pour XP/stats (à migrer)
  - `useCollections` (mantras)
- **Composants**:
  - `MeditationCard` (sélection session)
  - `Timer` (countdown)
  - `ProgressBar` (progression)
  - `Header`
- **Features**:
  - 9 sessions guidées:
    1. Respiration Consciente (10 min)
    2. Body Scan (15 min)
    3. Pleine Conscience (20 min)
    4. Compassion (15 min)
    5. Gratitude (10 min)
    6. Sommeil (30 min)
    7. Concentration (15 min)
    8. Stress Release (20 min)
    9. Méditation Profonde (40 min)
  - Audio guidé (voix AI ou préenregistré)
  - Musique d'ambiance
  - Timer configurable
  - Pause/Resume
  - Notifications de rappel
  - Streak tracking
  - Stats: Temps total, nombre sessions, session plus longue
  - Déblocage mantras rares (10% par session)
  - Collection mantras permanente
  - Système XP: +10 par min complété
  - Niveaux: 1000 XP/niveau (❌ à normaliser à 500)
  - Déblocage sessions progressif
- **Tables à créer**: `meditation_sessions`, `meditation_stats`
- **⚠️ PRIORITÉ 2 MIGRATION**: Usage régulier, thérapeutique

### 9. 🫁 **Breathwork**
- **Fichier**: `src/pages/Breathwork.tsx`
- **Type**: Techniques respiratoires
- **Durée**: 5-20 minutes
- **Backend**: ❌ localStorage (`breathwork_xp`, `breathwork_level`, `breathwork_completed`)
- **Patterns**: 6 techniques (Phénix, Lotus, Cube, Glacier, etc.)
- **Route**: `/breathwork`
- **Hooks utilisés**:
  - localStorage pour XP/stats (à migrer)
  - `useCollections` (auras)
- **Composants**:
  - `BreathingBubble` (animation respiration)
  - `PatternSelector` (choix technique)
  - `Timer`, `ProgressBar`
  - `AuraGallery` (auras débloquées)
  - `Header`
- **Features**:
  - 6 patterns respiratoires:
    1. Phénix (4-7-8): Stress release
    2. Lotus (égal): Équilibre
    3. Cube (carré): Concentration
    4. Glacier (long exhale): Calme profond
    5. Soleil (rapide): Énergie
    6. Vague (variable): Flexibilité
  - Animation visuelle synchro respiration
  - Audio guide (bip ou voix)
  - Configurable: Durée, ratio, rounds
  - Détection rythme cardiaque (si disponible)
  - Stats: Cohérence cardiaque, HRV
  - Tracking streak
  - Déblocage auras rares (12% chance)
  - Collection auras permanente (6 auras base + rares)
  - Système XP: +15 par cycle complet, bonus cohérence
  - Niveaux: 500 XP/niveau
  - Déblocage patterns progressif
- **Tables à créer**: `breathwork_sessions`, `breathwork_stats`, `aura_collection`
- **⚠️ PRIORITÉ 3 MIGRATION**: Thérapeutique, données HRV valeur

### 10. 🏛️ **VR Breath**
- **Fichier**: `src/pages/VRBreath.tsx`
- **Type**: Respiration immersive
- **Durée**: 5-15 minutes
- **Backend**: ❌ localStorage (`vr_breath_progress`)
- **Features**: 3 environnements (Temple, Forêt, Cosmos)
- **Route**: `/vr-breath`
- **Hooks utilisés**:
  - localStorage pour XP/environnements (à migrer)
  - `useCollections` (constellations)
- **Composants**:
  - `SkyScene` (environnement 3D)
  - `BreathingBubble` (orbe respiration)
  - `EnvironmentSelector` (choix lieu)
  - `ConstellationGallery` (collection)
  - `Header`
- **Features**:
  - 3 environnements immersifs:
    1. Temple Zen: Calm, focus
    2. Forêt Enchantée: Nature, grounding
    3. Cosmos Infini: Expansion, perspective
  - Animation 3D avec Three.js/R3F
  - Orbe respiration flottant
  - Audio spatial ambiance
  - Guidage respiration visuel + audio
  - Détection rythme (si capteur HRV)
  - Déblocage constellations rares (8% chance)
  - Collection constellations permanente
  - Système XP: +25 par session 5 min, +50 pour 15 min
  - Niveaux: 500 XP/niveau
  - Déblocage environnements: Temple (niv 1), Forêt (niv 5), Cosmos (niv 10)
- **Tables à créer**: `vr_breath_sessions`, `constellation_collection`
- **⚠️ PRIORITÉ 6 MIGRATION**: Premium feature, immersif

---

## 🎮 MODULES GAMIFIÉS

### 11. 🎯 **Ambition Arcade**
- **Fichier**: `src/pages/AmbitionArcade.tsx`
- **Type**: Objectifs gamifiés
- **Durée**: Variable
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Quêtes, missions, XP
- **Route**: `/ambition-arcade`
- **Hooks utilisés**:
  - `useModuleProgress('ambition')` (XP/progression)
  - `useImplicitTracking` (analytics)
  - `useCollections` (artifacts)
- **Composants**:
  - `ActChoiceCard` (sélection objectif)
  - `Button`, `Card`, `Badge`
  - `Header`
- **Features**:
  - 6 objectifs principaux:
    1. Forme Physique
    2. Créativité
    3. Relations Sociales
    4. Carrière Pro
    5. Mindfulness
    6. Apprentissage
  - Chaque objectif a 5 micro-leviers progressifs
  - Système missions quotidiennes
  - Artefacts virtuels déblocables (30 uniques)
  - Système de rareté: Common, Rare, Epic, Mythic
  - Système XP: +10 par micro-levier, +50 objectif complet
  - Niveaux: 500 XP/niveau
  - Déblocage artefacts progressif
  - Notifications push pour rappels
  - Tableau progression visuel
- **Tables DB**: `ambition_runs`, `ambition_quests`, `ambition_artifacts`, `module_progress`

### 12. 💪 **Boss Grit**
- **Fichier**: `src/pages/BossGrit.tsx`
- **Type**: Défis de résilience
- **Durée**: 10-30 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 3 difficultés, trophées
- **Route**: `/boss-grit`
- **Hooks utilisés**:
  - `useModuleProgress('boss-grit')` (XP/progression)
  - Edge functions pour challenges
  - `useCollections` (trophées)
  - `Howl` (sons épiques)
- **Composants**:
  - `BossChallenge` (interface défi)
  - `ArenaScene` (environnement 3D)
  - `AuraEvolution` (visualisation progression)
  - `TrophyGallery` (collection trophées)
  - `BadgeReveal` (révélation victoire)
  - `Header`
- **Features**:
  - 9 boss challenges:
    1. Gardien de l'Anxiété (Easy)
    2. Seigneur du Stress (Easy)
    3. Maître du Doute (Medium)
    4. Baron de la Procrastination (Medium)
    5. Empereur de la Peur (Medium)
    6. Titan du Perfectionnisme (Hard)
    7. Dragon de la Colère (Hard)
    8. Spectre de la Solitude (Hard)
    9. Archétype de l'Ombre (Legendary)
  - Chaque boss a 3-5 rounds de questions
  - Timer par question
  - Score performance
  - Animation victoire/défaite
  - Sons épiques (victory, epic)
  - Trophées déblocables (18 uniques)
  - Système XP: +50 Easy, +100 Medium, +200 Hard, +500 Legendary
  - Niveaux: 500 XP/niveau
  - Déblocage boss progressif par niveau
  - Retry illimité mais pénalité XP
- **Edge Functions**: `boss-start`, `boss-submit`
- **Tables DB**: `boss_sessions`, `module_progress`, `trophies`

### 13. 🫧 **Bubble Beat**
- **Fichier**: `src/pages/BubbleBeat.tsx`
- **Type**: Rythme et émotions
- **Durée**: 3-5 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Gameplay musical, high scores
- **Route**: `/bubble-beat`
- **Hooks utilisés**:
  - `useModuleProgress('bubble-beat')` (XP/progression)
  - `useImplicitTracking` (analytics)
  - `Howl` (sons de bulles)
- **Composants**:
  - `InteractiveBubble` (bulles cliquables)
  - `BubbleLab` (environnement jeu)
  - `Timer`, `Score`
  - `Header`
- **Features**:
  - Gameplay: Éclater bulles émotionnelles en rythme
  - 4 modes de jeu:
    1. Zen (calme, lent)
    2. Flow (équilibré)
    3. Energetic (rapide)
    4. Challenge (très rapide + combos)
  - Bulles émotionnelles colorées par humeur
  - Système de combos (x2, x3, x5)
  - Bonus temporels
  - High scores globaux et personnels
  - Leaderboard intégré
  - Achievements spéciaux
  - Musique générative sync avec gameplay
  - Système XP: +5 par bulle, bonus combos
  - Niveaux: 500 XP/niveau
  - Déblocage modes progressif
  - Stats: Meilleur score, total bulles, combo max
- **Tables DB**: `bubble_sessions`, `high_scores`, `module_progress`

### 14. 🏆 **Leaderboard**
- **Fichier**: `src/pages/Leaderboard.tsx`
- **Type**: Classements
- **Durée**: N/A
- **Backend**: Supabase (gamification tables)
- **Route**: `/leaderboard`
- **Hooks utilisés**:
  - `useGamification` (scores/classements)
  - `useUserStats` (stats utilisateur)
- **Composants**:
  - `Card`, `Table`, `Avatar`, `Badge`
  - `Header`
- **Features**:
  - Classement global tous modules
  - Classement par module spécifique
  - Top 100 joueurs
  - Filtres: Hebdo, Mensuel, All-Time
  - Recherche joueur
  - Avatar + pseudo
  - Niveau + XP total
  - Badges acquis
  - Position utilisateur actuel
  - Stats comparatives
  - Anonymisation optionnelle
  - Partage social
- **Tables DB**: `leaderboard`, `user_stats`, `gamification`

---

## 🌌 MODULES IMMERSIFS

### 15. 🌌 **VR Galaxy**
- **Fichier**: `src/pages/VRGalaxy.tsx`
- **Type**: Exploration spatiale
- **Durée**: 10-20 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Nébuleuses, constellations
- **Route**: `/vr-galaxy`
- **Hooks utilisés**:
  - `useModuleProgress('vr-galaxy')` (XP/progression)
  - `useCollections` (galaxies)
  - `useImplicitTracking` (analytics)
- **Composants**:
  - `GalaxyScene` (environnement 3D WebGL)
  - `GalaxyConstellation` (constellations interactives)
  - `OceanScene` (alternative water theme)
  - `Header`
- **Features**:
  - Exploration immersive 3D galaxie
  - 12 nébuleuses uniques à découvrir
  - Constellations interactives
  - Méditation guidée spatiale
  - Musique ambiante générative
  - Mode VR/AR compatible
  - Navigation souris/tactile/gyroscope
  - Collection étoiles/planètes
  - Système XP: +40 par exploration, +60 nébuleuse rare
  - Niveaux: 500 XP/niveau
  - Déblocage nébuleuses progressif
- **Tables DB**: `vr_galaxy_sessions`, `galaxy_discoveries`, `module_progress`

### 16. 📖 **Story Synth**
- **Fichier**: `src/pages/StorySynth.tsx`
- **Type**: Histoires interactives
- **Durée**: 10-15 minutes
- **Backend**: `useStorySession` (pas de XP/niveau)
- **Features**: Choix narratifs, fragments
- **Route**: `/story-synth`
- **Hooks utilisés**:
  - `useStorySession` (session management)
  - `useCardCollection` (fragments histoire)
  - `useMusicGeneration` (musique narrative)
- **Composants**:
  - `StoryTheatreCurtain` (rideau théâtre)
  - `StoryNarration` (texte narratif)
  - `StoryAmbience` (ambiance sonore)
  - `ActChoiceCard` (choix utilisateur)
  - `FragmentGallery` (collection fragments)
  - `Header`
- **Features**:
  - 8 histoires interactives:
    1. Le Jardin des Émotions
    2. La Montagne de la Confiance
    3. L'Océan de la Sérénité
    4. La Forêt des Souvenirs
    5. Le Désert de la Patience
    6. La Ville des Rêves
    7. Le Labyrinthe Intérieur
    8. L'Île du Renouveau
  - Choix narratifs (3-5 par acte)
  - Conséquences durables
  - 3 actes par histoire
  - Musique adaptive au contexte
  - Narration audio (TTS)
  - Collection fragments (cartes narratives)
  - Fins multiples (3-4 par histoire)
  - Pas de système XP (à ajouter ?)
  - Rejouabilité forte
- **Edge Functions**: `story-music-generate`
- **Tables DB**: `story_sessions`, `story_fragments`
- **⚠️ À CONSIDÉRER**: Ajouter système XP/progression

### 17. 🪞 **AR Filters**
- **Fichier**: `src/pages/ARFilters.tsx`
- **Type**: Miroirs émotionnels
- **Durée**: 3-5 minutes
- **Backend**: ❌ localStorage (`ar_filters_progress`)
- **Features**: 8 filtres, rareté
- **Route**: `/ar-filters`
- **Hooks utilisés**:
  - localStorage pour XP/filtres (à migrer)
  - `useCollections` (filtres)
  - Webcam API
- **Composants**:
  - `InteractiveMask` (overlay filtre)
  - `FilterGallery` (galerie 8 filtres)
  - `MirrorRoom` (interface miroir)
  - `Header`
- **Features**:
  - 8 filtres émotionnels AR:
    1. Aura de Joie (golden glow)
    2. Masque de Sérénité (blue calm)
    3. Flamme de Courage (red fire)
    4. Cristal de Clarté (crystal clear)
    5. Brume de Mystère (purple mist)
    6. Arc-en-ciel d'Espoir (rainbow)
    7. Étoile de Créativité (starry)
    8. Vague d'Harmonie (water flow)
  - Capture photo avec filtre
  - Enregistrement vidéo 15s
  - Partage social
  - Collection filtres déblocables
  - Système rareté: Starter, Rare, Epic, Legendary
  - Système XP: +15 par photo, +30 vidéo, +50 filtre rare
  - Niveaux: 500 XP/niveau
  - Déblocage filtres progressif par niveau
- **Tables à créer**: `ar_filter_sessions`, `ar_captures`
- **⚠️ PRIORITÉ 5 MIGRATION**: Social, engagement fort

### 18. 🎨 **Screen Silk (Pause Active)**
- **Fichier**: `src/pages/ScreenSilk.tsx`
- **Type**: Micro-pauses productives
- **Durée**: 2-5 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 6 types de soie, textures
- **Route**: `/screen-silk`
- **Hooks utilisés**:
  - `useScreenSilk` (session management)
  - `useModuleProgress('screen-silk')` (XP/progression)
  - `useImplicitTracking` (analytics)
- **Composants**:
  - `ScreenSilkScene` (canvas interactif)
  - `SilkBadge` (badge résultat)
  - `TextureGallery` (collection textures)
  - `Header`
- **Features**:
  - 6 types de soie:
    1. Soie Apaisante (smooth, slow)
    2. Soie Énergique (dynamic, fast)
    3. Soie Créative (chaotic, colorful)
    4. Soie Focale (geometric, precise)
    5. Soie Méditative (flowing, zen)
    6. Soie Ludique (playful, bouncy)
  - Canvas HTML5 interactif
  - Dessin au doigt/souris
  - Effets visuels temps réel
  - Audio réactif
  - Génération texture unique
  - Collection textures rares (8% chance)
  - Export image PNG
  - Galerie permanente
  - Système XP: +20 par session, +40 texture rare
  - Niveaux: 500 XP/niveau
  - Déblocage types soie progressif
  - Hints personnalisés
- **Tables DB**: `screen_silk_sessions`, `silk_textures`, `module_progress`

---

## ⚡ MODULES RAPIDES

### 19. ⚡ **Flash Glow**
- **Fichier**: `src/pages/FlashGlow.tsx`
- **Type**: Intervention flash (détresse)
- **Durée**: 30-90 secondes
- **Backend**: ❌ localStorage (`flashglow_progress`)
- **Instrument**: SUDS (Subjective Units of Distress)
- **Features**: 5 intensités
- **Route**: `/flash-glow`
- **Hooks utilisés**:
  - localStorage pour XP/mantras (à migrer)
  - `useCollections` (mantras)
  - `useImplicitTracking` (analytics critical)
- **Composants**:
  - Effet pulsation lumière centrale
  - `Slider` (intensité)
  - `Button` (start/stop)
  - `Header`
- **Features**:
  - Intervention rapide crise anxiété/détresse
  - SUDS: Scale 0-10 (détresse subjective)
  - 5 intensités lumière:
    1. Douce (low stress)
    2. Moyenne (medium stress)
    3. Forte (high stress)
    4. Intense (very high stress)
    5. Maximale (crisis)
  - Pulsation lumière synchronisée respiration
  - Durée configurable 30s, 60s, 90s
  - Audio guide respiration
  - Vibration tactile option
  - Tracking pré/post SUDS
  - Calcul réduction % détresse
  - Déblocage mantras rares (15% chance)
  - Historique interventions
  - Stats: Nb utilisations, réduction moyenne
  - Système XP: +10 par session, bonus si réduction >30%
  - Niveaux: 500 XP/niveau
  - Déblocage intensités progressif
  - **CRITIQUE**: Notifications si usage > 3x/jour
- **Tables à créer**: `flash_glow_sessions`, `suds_tracking`
- **⚠️ PRIORITÉ 7 MIGRATION**: Critique, intervention crise

---

## 📊 MODULES SUIVI & ANALYTICS

### 20. 📊 **Weekly Bars**
- **Fichier**: `src/pages/WeeklyBars.tsx`
- **Type**: Synthèse hebdomadaire
- **Durée**: N/A (consultation)
- **Backend**: Supabase (mood_entries, assessments)
- **Features**: WHO-5, graphiques
- **Route**: `/weekly-bars`
- **Hooks utilisés**:
  - `useWeekly` (données hebdo)
  - `useWHO5Calculator` (score WHO-5)
  - `useMoodEvolution` (tendances)
- **Composants**:
  - `WeeksCarousel` (sélection semaine)
  - `WeeklyCardDeck` (cartes semaine)
  - `WeeklyCardReveal` (révélation carte)
  - `HeatmapGrid` (visualisation activité)
  - `WeeklyBars` (graphiques barres)
  - `Header`
- **Features**:
  - Visualisation synthèse hebdomadaire
  - Calcul WHO-5 automatique (0-25)
  - Attribution badge semaine basé sur WHO-5:
    - 0-5: 🌧️ Difficile
    - 6-12: ⛅ Nuageux
    - 13-18: 🌤️ Mitigé
    - 19-22: ☀️ Ensoleillé
    - 23-25: 🌟 Radieux
  - Graphiques mood par jour
  - Heatmap activités (7x24)
  - Stats: Moyenne humeur, cohérence, streak
  - Comparaison semaines précédentes
  - Export PDF rapport hebdo
  - Collection cartes semaines passées
  - Insights IA personnalisés
- **Tables DB**: `mood_entries`, `assessments`, `weekly_summaries`

### 21. 📈 **Activity**
- **Fichier**: `src/pages/Activity.tsx`
- **Type**: Vue d'activité globale
- **Durée**: N/A
- **Backend**: `useWeekly` hook
- **Route**: `/activity`
- **Hooks utilisés**:
  - `useRecentActivities` (activités récentes)
  - `useUserStats` (statistiques)
  - `useWeekly` (tendances)
- **Composants**:
  - `Card`, `Timeline`, `Badge`
  - `ActivityFeed`
  - `Header`
- **Features**:
  - Timeline toutes activités utilisateur
  - Filtres par module/type/date
  - Stats activité: Sessions, temps total, streak
  - Badges débloqués récents
  - Progressions niveau par module
  - Achievements récents
  - Graphique activité 30 jours
  - Export activités CSV
- **Tables DB**: `activity_log`, `user_stats`

### 22. 📉 **Analytics**
- **Fichier**: `src/pages/Analytics.tsx`
- **Type**: Analytics détaillées
- **Durée**: N/A
- **Backend**: `useAnalytics` hook
- **Route**: `/analytics`
- **Hooks utilisés**:
  - `useAnalytics` (analytics data)
  - `useUserStats` (stats utilisateur)
  - `useMoodEvolution` (évolution)
- **Composants**:
  - Charts (Recharts): Line, Bar, Pie, Radar
  - `Card`, `Tabs`
  - `Header`
- **Features**:
  - Dashboard analytics complet
  - 6 onglets:
    1. Vue d'ensemble (overview)
    2. Humeur & Émotions (mood trends)
    3. Modules & Engagement (usage)
    4. Santé Mentale (WHO-5, STAI-6)
    5. Progression & Niveaux (gamification)
    6. Insights IA (recommendations)
  - Graphiques interactifs:
    - Évolution humeur 30/90/365 jours
    - Distribution émotions (pie chart)
    - Usage modules (bar chart)
    - Scores santé mentale (line chart)
    - Radar compétences émotionnelles
  - KPIs: Streak, sessions, temps total, XP
  - Comparaisons périodes
  - Export rapports PDF/CSV
  - Prédictions tendances IA
- **Tables DB**: Toutes tables analytics

### 23. 🏠 **Dashboard**
- **Fichier**: `src/pages/Dashboard.tsx`
- **Type**: Vue d'ensemble personnalisée
- **Durée**: N/A
- **Backend**: Agrégation de données
- **Features**: WHO-5, mood trends, recommandations
- **Route**: `/dashboard`
- **Hooks utilisés**:
  - `useUserStats` (stats)
  - `useMoodEntries` (humeurs)
  - `usePersonalizedRecommendations` (IA)
  - `useUpcomingSessions` (calendrier)
  - `useGamification` (badges/XP)
- **Composants**:
  - `DashboardStats` (KPIs)
  - `HeatmapGrid` (activité)
  - `MoodBadge` (humeur du jour)
  - `GamificationPanel` (XP/badges)
  - `PersonalizedRecommendations` (IA)
  - `RecommendationsWidget` (modules suggérés)
  - `InsightsPanel` (insights)
  - `Header`, `Button`, `Card`
- **Features**:
  - Dashboard personnalisé utilisateur
  - KPIs principaux:
    - WHO-5 actuel
    - Streak jours consécutifs
    - XP total tous modules
    - Niveau global
    - Badges count
  - Humeur du jour (quick log)
  - Heatmap activité semaine
  - Modules récents (last 5)
  - Recommandations IA personnalisées
  - Sessions à venir (reminders)
  - Challenges actifs
  - Progression objectifs
  - Quick access modules favoris
  - Notifications importantes
- **Tables DB**: Agrégation toutes tables

---

## 🤝 MODULES SOCIAUX & SUPPORT

### 24. 👥 **Community**
- **Fichier**: `src/pages/Community.tsx`
- **Type**: Réseau social interne
- **Durée**: Variable
- **Backend**: Supabase (social_feed, support_groups)
- **Features**: Posts, groupes, likes
- **Route**: `/community`
- **Hooks utilisés**:
  - `useCommunity` (feed social)
  - `useSocialFeed` (posts)
  - `useSupportGroups` (groupes)
- **Composants**:
  - `CommunityFeed` (fil actualité)
  - `ComposeCard` (créer post)
  - `SupportGroupsList` (groupes)
  - `VillageFeed` (feed)
  - `Header`
- **Features**:
  - Fil actualité communauté
  - Posts texte/image
  - Likes/Comments
  - Anonymat optionnel
  - Groupes de soutien thématiques:
    - Anxiété
    - Dépression
    - Stress travail
    - Relations
    - Parents
    - Addictions
    - etc.
  - Modération automatique (IA)
  - Signalement contenu
  - Messagerie privée
  - Événements communautaires
  - Leaderboard social
  - Badges sociaux
- **Tables DB**: `social_feed`, `support_groups`, `community_members`, `posts`, `comments`

### 25. 🤝 **Social Hub**
- **Fichier**: `src/pages/SocialHub.tsx`
- **Type**: Hub social
- **Durée**: Variable
- **Backend**: Social features
- **Route**: `/social`
- **Hooks utilisés**:
  - `useSocialFeed` (feed)
  - `useCommunity` (communauté)
  - `useBuddies` (buddies system)
- **Composants**:
  - Similar to Community
  - `BuddyMatcher` (matching)
  - `Header`
- **Features**:
  - Alternative interface social
  - Système buddies (matching)
  - Chat 1-to-1
  - Groupes privés
  - Événements calendrier
  - Partage achievements
- **Tables DB**: `buddies`, `social_feed`

### 26. 💬 **Coach IA**
- **Fichier**: `src/pages/Coach.tsx`
- **Type**: Chat IA thérapeutique
- **Durée**: Variable
- **Backend**: Edge function `coach-ai-assist`
- **Features**: Conversation, recommandations
- **Route**: `/coach`
- **Hooks utilisés**:
  - `useAIChat` (chat logic)
  - `useCoachAssess` (évaluation continue)
  - `useTherapy` (techniques thérapeutiques)
- **Composants**:
  - `ChatInterface` (conversation)
  - `Message` (bulles chat)
  - `Input` (saisie)
  - `Header`
- **Features**:
  - Chat IA spécialisé thérapeutique
  - Personnalités coach:
    - Empathique (écoute)
    - Motivant (encourageant)
    - Analytique (CBT)
    - Créatif (ACT)
  - Techniques thérapeutiques intégrées:
    - CBT (Cognitive Behavioral Therapy)
    - ACT (Acceptance Commitment Therapy)
    - DBT (Dialectical Behavior Therapy)
    - Mindfulness
  - Détection détresse automatique
  - Suggestions exercices contextuels
  - Historique conversations
  - Résumés sessions
  - Export transcripts
  - Suivi progression thérapeutique
- **Edge Function**: `coach-ai-assist`
  - Input: message, context, history
  - API: OpenAI GPT-4 fine-tuned
  - Output: response, techniques, suggestions
- **Tables DB**: `ai_coach_sessions`, `chat_messages`
- **Secret requis**: `OPENAI_API_KEY`

### 27. 🤖 **AI Chat**
- **Fichier**: `src/pages/AIChat.tsx`
- **Type**: Chat IA généraliste
- **Durée**: Variable
- **Backend**: Edge function `ai-chat`
- **Route**: `/ai-chat`
- **Hooks utilisés**:
  - `useAIChat` (chat logic)
  - `useImplicitTracking` (analytics)
- **Composants**:
  - Similar to Coach
  - `ChatInterface`
  - `Header`
- **Features**:
  - Chat IA généraliste (moins thérapeutique)
  - Questions générales santé mentale
  - Informations ressources
  - Orientation vers modules appropriés
  - Conversations persistées
  - Multi-langues
- **Edge Function**: `ai-chat`
- **Tables DB**: `chat_conversations`, `ai_chat_messages`

### 28. 💬 **Therapy**
- **Fichier**: `src/pages/Therapy.tsx`
- **Type**: Module thérapie
- **Durée**: Variable
- **Backend**: Therapy sessions
- **Route**: `/therapy`
- **Hooks utilisés**:
  - `useTherapy` (sessions)
  - `useUpcomingSessions` (calendrier)
  - `useNotifications` (rappels)
- **Composants**:
  - `SessionCard` (sessions)
  - `TherapistProfile` (profil thérapeute)
  - `Calendar`, `Button`
  - `Header`
- **Features**:
  - Réservation sessions téléconsultation
  - Calendrier rendez-vous
  - Profils thérapeutes
  - Notes pré-session
  - Suivi post-session
  - Historique sessions
  - Rappels automatiques
  - Intégration vidéo (future)
- **Tables DB**: `therapy_sessions`, `therapists`, `appointments`

### 29. ❓ **Help & Support**
- **Fichier**: `src/pages/Help.tsx`
- **Type**: Centre d'aide
- **Durée**: N/A
- **Features**: FAQ, contact
- **Route**: `/help`
- **Composants**:
  - `HelpsList` (articles)
  - `Accordion` (FAQ)
  - `ContactForm` (support)
  - `Header`
- **Features**:
  - FAQ complète (30+ questions)
  - Articles aide par module
  - Tutoriels vidéo
  - Recherche articles
  - Contact support
  - Chat support live
  - Tickets support
  - Ressources externes
  - Numéros urgence
- **Tables DB**: `help_articles`, `support_tickets`

---

## 🏢 MODULES B2B / ENTREPRISE

### 30. 🏢 **B2B Landing**
- **Fichier**: `src/pages/B2BLanding.tsx`
- **Type**: Page d'accueil B2B
- **Route**: `/b2b`
- **Composants**:
  - `HeroSection` (hero)
  - `FeatureGrid` (features)
  - `PricingTable` (tarifs)
  - `Testimonials` (témoignages)
  - `CTASection` (appel action)
  - `Header`, `Footer`
- **Features**:
  - Landing page entreprises
  - Présentation solution B2B
  - Features entreprise
  - Tarifs entreprise
  - Études de cas
  - Formulaire contact commercial
  - Demande démo
  - ROI calculator
  - SEO optimisé

### 31. 🏢 **B2B Portal**
- **Fichier**: `src/pages/B2BPortal.tsx`
- **Type**: Portail entreprise
- **Route**: `/b2b-portal`
- **Hooks utilisés**:
  - `useUserRole` (permissions)
  - `useOrganization` (org data)
- **Composants**:
  - `OrgDashboard`
  - `TeamManagement`
  - `BillingSettings`
  - `Header`
- **Features**:
  - Portail admin entreprise
  - Dashboard agrégé équipe
  - Gestion membres
  - Invitations équipe
  - Gestion licences
  - Facturation
  - Rapports entreprise
  - SSO configuration
- **Tables DB**: `organizations`, `org_memberships`, `subscriptions`

### 32. 🏢 **B2B Enterprise**
- **Fichier**: `src/pages/B2BEnterprise.tsx`
- **Type**: Features entreprise
- **Route**: `/enterprise`
- **Hooks utilisés**:
  - `useOrganization` (org)
  - `useB2BSwitch` (mode B2B)
- **Composants**:
  - `B2BSwitch` (toggle B2B/B2C)
  - `EnterpriseFeatures`
  - `Header`
- **Features**:
  - Features entreprise avancées
  - White-label option
  - API entreprise
  - Data residency
  - SLA garantis
  - Support dédié
  - Formation équipes
  - Intégrations (Slack, Teams, etc.)

### 33. 👔 **RH Dashboard**
- **Fichier**: `src/pages/RHDashboard.tsx`
- **Type**: Tableau de bord RH
- **Backend**: Team aggregation
- **Route**: `/rh`
- **Hooks utilisés**:
  - `useTeamAggregate` (données équipe anonymisées)
  - `useOrganization` (org)
  - `useMonitoring` (alertes)
- **Composants**:
  - `DashboardStats` (KPIs équipe)
  - `TeamHeatmap` (visualisation)
  - `AlertsPanel` (alertes)
  - `TrendsChart` (tendances)
  - `ManagerActions` (actions RH)
  - `ManagerActionsHistory` (historique)
  - `Header`
- **Features**:
  - Dashboard RH anonymisé
  - KPIs équipe:
    - WHO-5 moyen équipe
    - Taux engagement
    - Risques burnout
    - Absentéisme prédit
  - Heatmap santé mentale équipe
  - Alertes automatiques:
    - Détérioration team mood
    - Détection risque individuel
    - Baisse engagement
  - Recommandations RH IA:
    - Actions préventives
    - Interventions ciblées
    - Ressources à déployer
  - Rapports mensuels automatiques
  - Conformité RGPD/anonymisation
  - Export rapports sécurisés
  - Historique actions RH
- **Edge Functions**: `team-aggregate-b2b`, `team-notifications`
- **Tables DB**: `team_emotion_summary`, `rh_actions`, `organization_metrics`
- **⚠️ CRITIQUE**: Anonymisation obligatoire données individuelles

### 34. 🏢 **Organizations**
- **Fichier**: `src/pages/Organizations.tsx`
- **Type**: Gestion organisations
- **Backend**: Supabase (organizations, org_memberships)
- **Route**: `/organizations`
- **Hooks utilisés**:
  - `useOrganization` (CRUD org)
  - `useUserRole` (permissions)
- **Composants**:
  - `OrganizationCard`
  - `MembersList`
  - `InviteForm`
  - `Header`
- **Features**:
  - Liste organisations utilisateur
  - Création organisation
  - Paramètres organisation
  - Gestion membres
  - Rôles: Admin, Manager, Member
  - Invitations par email
  - Acceptation invitations
  - Suppression membres
  - Transfert ownership
- **Tables DB**: `organizations`, `org_memberships`, `invitations`

---

## ⚙️ MODULES SYSTÈME

### 35. 🏠 **Index / Home**
- **Fichier**: `src/pages/Index.tsx`
- **Type**: Page d'accueil
- **Route**: `/`
- **Composants**:
  - `HeroSection`
  - `FeatureGrid`
  - `HowItWorks`
  - `Testimonials`
  - `CTA`
  - `Header`, `Footer`
- **Features**:
  - Landing page publique
  - Présentation app
  - Features principales
  - Témoignages
  - CTA inscription
  - SEO optimisé
  - Responsive

### 36. 🔐 **Auth**
- **Fichier**: `src/pages/Auth.tsx`
- **Type**: Authentification
- **Route**: `/auth`
- **Hooks utilisés**:
  - `useAuth` (AuthContext)
  - Supabase Auth
- **Composants**:
  - `LoginForm`
  - `SignupForm`
  - `PasswordReset`
  - `Button`, `Input`
- **Features**:
  - Login email/password
  - Signup nouveau compte
  - OAuth: Google, Apple (future)
  - Reset password
  - Email verification
  - Magic link login
  - Session persistence
  - Redirect après login

### 37. 🎓 **Onboarding**
- **Fichier**: `src/pages/Onboarding.tsx`
- **Type**: Parcours d'accueil
- **Route**: `/onboarding`
- **Hooks utilisés**:
  - `useOnboarding` (progression)
  - `useUserSettings` (préférences initiales)
- **Composants**:
  - `OnboardingFlow` (wizard)
  - `ProgressBar`
  - `Header`
- **Features**:
  - Wizard 5 étapes:
    1. Bienvenue + prénom
    2. Objectifs principaux
    3. Préférences notifications
    4. Modules favoris à explorer
    5. Premier assessment (STAI-6 ou WHO-5)
  - Tutoriel guidé
  - Skip option
  - Sauvegarde progression
  - Redirect dashboard after

### 38. ⚙️ **Settings**
- **Fichier**: `src/pages/Settings.tsx`
- **Type**: Paramètres utilisateur
- **Features**: Profil, notifications, préférences
- **Route**: `/settings`
- **Hooks utilisés**:
  - `useSettings` (CRUD settings)
  - `useUserSettings` (user prefs)
  - `useNotifications` (notif settings)
  - `useGDPR` (privacy)
- **Composants**:
  - `Tabs` (6 onglets)
  - `ProfileForm`
  - `NotificationSettings`
  - `PrivacySettings`
  - `Header`
- **Features**:
  - 6 onglets paramètres:
    1. **Profil**: Nom, email, avatar, bio
    2. **Notifications**: Push, email, SMS, préférences
    3. **Préférences**: Langue, theme, sons
    4. **Confidentialité**: RGPD, anonymat social
    5. **Données**: Export, suppression compte
    6. **Abonnement**: Plan actuel, upgrade
  - Upload avatar
  - Change password
  - Email preferences
  - Notification channels config
  - Theme: Light/Dark/Auto
  - Language: FR/EN
  - Sounds on/off
  - RGPD: Opt-in/out analytics
  - Data retention config
  - Delete account (avec confirmation)
  - Export toutes données

### 39. 🔒 **Security Settings**
- **Fichier**: `src/pages/SecuritySettings.tsx`
- **Type**: Paramètres de sécurité
- **Features**: 2FA, sessions, encryption
- **Route**: `/security`
- **Hooks utilisés**:
  - `useSecurity` (security features)
  - `useUserSettings` (settings)
- **Composants**:
  - `TwoFactorSetup`
  - `SessionsList`
  - `EncryptionStatus`
  - `Header`
- **Features**:
  - Configuration 2FA (TOTP)
  - QR code 2FA
  - Backup codes
  - Sessions actives liste
  - Révocation sessions
  - Historique connexions
  - Alertes connexions suspectes
  - Chiffrement données at-rest
  - Conformité RGPD
  - Audit trail accès
- **Tables DB**: `user_sessions`, `security_events`, `encryption_keys`

### 40. 📦 **Data Export**
- **Fichier**: `src/pages/DataExport.tsx`
- **Type**: Export RGPD
- **Features**: PDF, JSON, CSV
- **Route**: `/data-export`
- **Hooks utilisés**:
  - `useDataExport` (export logic)
  - `useGDPR` (RGPD compliance)
- **Composants**:
  - `DataExportDialog`
  - `ExportOptions`
  - `DownloadButton`
  - `Header`
- **Features**:
  - Export complet données RGPD
  - 3 formats: PDF, JSON, CSV
  - Sélection données:
    - Profil
    - Humeurs
    - Assessments
    - Sessions modules
    - Badges/XP
    - Social (posts/comments)
    - Messages chat
  - Export partiel ou total
  - Génération asynchrone
  - Notification email prêt
  - Download sécurisé (lien expirant)
  - Historique exports
  - Suppression données option
- **Edge Functions**: `export-user-data`, `export-pdf-report`
- **Tables DB**: `data_exports`

### 41. 💰 **Pricing**
- **Fichier**: `src/pages/Pricing.tsx`
- **Type**: Plans et tarifs
- **Backend**: Stripe integration
- **Route**: `/pricing`
- **Hooks utilisés**:
  - `useStripeCheckout` (payment)
  - `useAuth` (user)
- **Composants**:
  - `PricingCard` (3 plans)
  - `FeatureComparison`
  - `FAQSection`
  - `Header`
- **Features**:
  - 3 plans:
    1. **Free**: Limité, 5 sessions/mois
    2. **Premium**: 9.99€/mois, illimité
    3. **Enterprise**: Sur devis, B2B
  - Tableau comparaison features
  - FAQ tarifs
  - Stripe Checkout integration
  - Gestion abonnement
  - Cancel/Resume subscription
  - Billing history
  - Invoices download
- **Edge Functions**: `stripe-checkout`, `stripe-webhook`
- **Tables DB**: `subscriptions`, `payments`
- **Secret requis**: `STRIPE_SECRET_KEY`

### 42. 📄 **Terms**
- **Fichier**: `src/pages/Terms.tsx`
- **Type**: CGU
- **Route**: `/terms`
- **Features**:
  - Conditions Générales d'Utilisation
  - Version FR/EN
  - Dernière mise à jour
  - Conformité légale

### 43. 🔒 **Privacy**
- **Fichier**: `src/pages/Privacy.tsx`
- **Type**: Politique de confidentialité
- **Route**: `/privacy`
- **Features**:
  - Politique de confidentialité RGPD
  - Cookies policy
  - Data retention
  - User rights
  - Contact DPO
  - Version FR/EN

### 44. 🔗 **Accept Invitation**
- **Fichier**: `src/pages/AcceptInvitation.tsx`
- **Type**: Acceptation invitations
- **Route**: `/accept-invitation`
- **Hooks utilisés**:
  - `useAuth` (user)
  - Query params (token)
- **Features**:
  - Acceptation invitation organisation
  - Validation token
  - Création compte si nouveau
  - Join organisation automatique
  - Redirect vers org après

### 45. 📝 **Journal New**
- **Fichier**: `src/pages/JournalNew.tsx`
- **Type**: Alternative journal (v2)
- **Route**: `/journal-new`
- **Features**:
  - Version alternative Journal
  - Interface différente
  - Features similaires
  - Test A/B variant

### 46. 🛠️ **Admin Dashboard**
- **Fichier**: `src/pages/AdminDashboard.tsx`
- **Type**: Administration système
- **Route**: `/admin`
- **Hooks utilisés**:
  - `useUserRole` (admin check)
  - `useAdminStats` (system stats)
- **Features**:
  - Dashboard admin système
  - Stats globales:
    - Utilisateurs total
    - Sessions actives
    - Usage modules
    - Revenus
  - Gestion utilisateurs
  - Modération contenu
  - Logs système
  - Analytics avancées
  - Configuration système
  - Database admin tools
- **⚠️ ACCÈS**: Admins seulement (RLS)

### 47. ❌ **Not Found**
- **Fichier**: `src/pages/NotFound.tsx`
- **Type**: Erreur 404
- **Route**: `*`
- **Features**:
  - Page 404 personnalisée
  - Recherche intégrée
  - Suggestions pages
  - Lien retour accueil
  - Fun animation

---

## 📊 STATISTIQUES GLOBALES

### Par Catégorie

| Catégorie | Nombre | % |
|-----------|--------|---|
| 🎯 Core Assessment | 4 | 9% |
| 🎵 Musical | 3 | 6% |
| 🧘 Méditation/Respiration | 3 | 6% |
| 🎮 Gamification | 4 | 9% |
| 🌌 Immersif | 4 | 9% |
| ⚡ Rapide | 1 | 2% |
| 📊 Analytics | 4 | 9% |
| 🤝 Social | 6 | 13% |
| 🏢 B2B | 5 | 11% |
| ⚙️ Système | 13 | 28% |
| **TOTAL** | **47** | **100%** |

### Par État Backend

| État | Nombre | % | Modules |
|------|--------|---|---------|
| ✅ Backend intégré (`useModuleProgress`) | 6 | 13% | Nyvee, AmbitionArcade, BossGrit, MusicTherapy, BubbleBeat, ScreenSilk |
| ❌ localStorage **(À MIGRER)** | 8 | 17% | Journal, EmotionalScan, MoodMixer, Meditation, Breathwork, VRBreath, ARFilters, FlashGlow |
| 🔄 Autre backend (hooks spécifiques) | 9 | 19% | HumeEmotionalScan, MusicLibrary, VRGalaxy, StorySynth, Coach, AIChat, Therapy, RHDashboard, Organizations |
| 📄 Pages statiques/système | 24 | 51% | Tous les autres |
| **TOTAL** | **47** | **100%** | |

---

## 🎯 PRIORITÉS MIGRATION localStorage → Supabase

### Ordre de Priorité (Impact Utilisateur)

| # | Module | Priorité | Raison | XP/Niveau | Collections |
|---|--------|----------|--------|-----------|-------------|
| 1 | 📝 **Journal** | 🔴 CRITIQUE | Usage quotidien, forte valeur | ✅ (1000 XP/niv → 500) | N/A |
| 2 | 🧘‍♀️ **Meditation** | 🔴 CRITIQUE | Régulier, thérapeutique | ✅ (1000 XP/niv → 500) | ✅ Mantras |
| 3 | 🫁 **Breathwork** | 🔴 CRITIQUE | Thérapeutique, données HRV | ✅ (500 XP/niv) | ✅ Auras |
| 4 | 🎧 **Mood Mixer** | 🟠 HAUTE | Créatif, engagement | ✅ (500 XP/niv) | ✅ Mixes |
| 5 | 🪞 **AR Filters** | 🟠 HAUTE | Social, engagement | ✅ (500 XP/niv) | ✅ Filtres |
| 6 | 🏛️ **VR Breath** | 🟡 MOYENNE | Premium, immersif | ✅ (500 XP/niv) | ✅ Constellations |
| 7 | ⚡ **Flash Glow** | 🟡 MOYENNE | Critique intervention | ✅ (500 XP/niv) | ✅ Mantras |
| 8 | 🎭 **Emotional Scan** | 🟢 BASSE | Assessment, data | ✅ (500 XP/niv) | ✅ Masques |

### Actions Post-Migration

1. **Normalisation XP**: Passer tous les modules à 500 XP/niveau
2. **Migration Data**: Script migration localStorage → Supabase pour utilisateurs existants
3. **Cleanup**: Supprimer code localStorage après migration
4. **Tests**: Tests complets migration et rollback
5. **Communication**: Informer utilisateurs migration

---

## 🔗 Routes Complètes

```typescript
// Core features
/nyvee              // STAI-6 assessment
/journal            // Daily mood journal
/journal-new        // Journal v2
/emotional-scan     // SAM assessment
/hume-emotional-scan // AI emotion detection

// Musical
/music-therapy      // Forest soundscapes
/music-library      // Music collection
/mood-mixer         // DJ mood mixing

// Meditation & Breathing
/meditation         // Guided meditations
/breathwork         // Breathing techniques
/vr-breath          // Immersive breathing

// Gamification
/ambition-arcade    // Goal quests
/boss-grit          // Resilience challenges
/bubble-beat        // Rhythm gameplay
/leaderboard        // Global rankings

// Immersive
/vr-galaxy          // Space exploration
/story-synth        // Interactive stories
/ar-filters         // Emotional filters
/screen-silk        // Productive pauses

// Quick
/flash-glow         // Crisis intervention

// Analytics
/weekly-bars        // Weekly WHO-5
/activity           // Activity timeline
/analytics          // Detailed analytics
/dashboard          // Main dashboard

// Social
/community          // Social feed
/social             // Social hub
/coach              // AI therapy coach
/ai-chat            // AI general chat
/therapy            // Therapy sessions
/help               // Help center

// B2B
/b2b                // B2B landing
/b2b-portal         // B2B portal
/enterprise         // Enterprise features
/rh                 // HR dashboard
/organizations      // Org management

// System
/                   // Home landing
/auth               // Authentication
/onboarding         // User onboarding
/settings           // User settings
/security           // Security settings
/data-export        // GDPR export
/pricing            // Pricing plans
/terms              // Terms of service
/privacy            // Privacy policy
/accept-invitation  // Org invitations
/admin              // Admin dashboard
/*                  // 404 Not Found
```

---

## 📋 TABLES SUPABASE UTILISÉES

### Tables Core
- `users` (auth.users)
- `profiles`
- `user_settings`
- `user_quotas`
- `module_progress` ⭐
- `user_collections` ⭐

### Tables Assessments
- `assessment_sessions`
- `assessments`
- `mood_entries`
- `journal_text_entries`
- `journal_voice_entries`
- `emotional_scans_ai`

### Tables Modules
- `music_therapy_sessions`
- `music_fragments`
- `generated_music`
- `meditation_sessions` (à créer)
- `breathwork_sessions` (à créer)
- `vr_breath_sessions` (à créer)
- `vr_galaxy_sessions`
- `story_sessions`
- `story_fragments`
- `ar_filter_sessions` (à créer)
- `screen_silk_sessions`
- `silk_textures`
- `flash_glow_sessions` (à créer)
- `boss_sessions`
- `trophies`
- `bubble_sessions`
- `ambition_runs`
- `ambition_quests`
- `ambition_artifacts`

### Tables Social
- `social_feed`
- `posts`
- `comments`
- `likes`
- `support_groups`
- `community_members`
- `buddies`
- `chat_conversations`
- `ai_chat_messages`
- `ai_coach_sessions`

### Tables B2B
- `organizations`
- `org_memberships`
- `invitations`
- `subscriptions`
- `team_emotion_summary`
- `rh_actions`

### Tables Analytics
- `weekly_summaries`
- `activity_log`
- `user_stats`
- `leaderboard`

### Tables Système
- `badges`
- `achievements`
- `challenges`
- `notifications`
- `data_exports`
- `security_events`
- `user_sessions`
- `encryption_keys`

---

## 🚀 ACTIONS PRIORITAIRES

### Phase 1: Migration localStorage (2-3 semaines)
1. ✅ Créer tables DB manquantes
2. ✅ Implémenter `useModuleProgress` pour 8 modules
3. ✅ Script migration données existantes
4. ✅ Tests complets
5. ✅ Rollout progressif

### Phase 2: Normalisation XP (1 semaine)
1. ✅ Normaliser tous modules à 500 XP/niveau
2. ✅ Recalculer niveaux utilisateurs existants
3. ✅ Constantes partagées XP

### Phase 3: Optimisations (2 semaines)
1. ✅ Refactoring code dupliqué
2. ✅ Composants partagés progression
3. ✅ Performance optimizations
4. ✅ Analytics améliorées

---

**Dernière mise à jour**: 2025-01-04  
**Total modules**: 47  
**Modules actifs**: ~25  
**Modules système**: ~22  
**Migration prioritaire**: 8 modules  
**État**: ✅ Audit complet terminé
