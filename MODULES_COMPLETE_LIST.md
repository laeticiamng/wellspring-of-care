# 📱 Liste Complète des Modules - EmotionsCare

## Date: 2025-01-XX
## Total: 30+ modules identifiés

---

## 🎯 MODULES PRINCIPAUX (Core Features)

### 1. 🫧 **Nyvée** - Évaluation Rapide Anxiété
- **Fichier**: `src/pages/Nyvee.tsx`
- **Type**: Assessment / STAI-6
- **Durée**: 2 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Instrument**: STAI-6 (6 questions)
- **Route**: `/nyvee`

### 2. 📝 **Journal Émotionnel**
- **Fichier**: `src/pages/Journal.tsx`
- **Type**: Daily tracking
- **Durée**: 5-10 minutes
- **Backend**: ❌ localStorage (`journal_progress`)
- **Features**: Texte, tags, sentiment analysis
- **Route**: `/journal`

### 3. 🎭 **Scan Émotionnel (SAM)**
- **Fichier**: `src/pages/EmotionalScan.tsx`
- **Type**: Valence-Arousal Assessment
- **Durée**: 1 minute
- **Backend**: ❌ localStorage (`emotional_scan_progress`)
- **Instrument**: SAM (Self-Assessment Manikin)
- **Features**: Génération de masques émotionnels
- **Route**: `/emotional-scan`

### 4. 🧠 **Scan Émotionnel Hume AI**
- **Fichier**: `src/pages/HumeEmotionalScan.tsx`
- **Type**: AI-powered emotion detection
- **Durée**: Variable
- **Backend**: Edge function `hume-emotion-detect`
- **Features**: Texte ou voix
- **Route**: `/hume-emotional-scan`

---

## 🎵 MODULES MUSICAUX

### 5. 🌳 **Music Therapy**
- **Fichier**: `src/pages/MusicTherapy.tsx`
- **Type**: Forêts sonores
- **Durée**: 5-15 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 8 forêts, génération musicale
- **Route**: `/music-therapy`

### 6. 📚 **Music Library**
- **Fichier**: `src/pages/MusicLibrary.tsx`
- **Type**: Collection de musiques
- **Durée**: N/A
- **Backend**: Supabase storage
- **Route**: `/music-library`

### 7. 🎧 **Mood Mixer (DJ)**
- **Fichier**: `src/pages/MoodMixer.tsx`
- **Type**: Mix émotionnel interactif
- **Durée**: 3-10 minutes
- **Backend**: ❌ localStorage (`mood_mixer_progress`)
- **Features**: Valence/Arousal sliders, génération mix
- **Route**: `/mood-mixer`

---

## 🧘 MODULES MÉDITATION & RESPIRATION

### 8. 🧘‍♀️ **Méditation**
- **Fichier**: `src/pages/Meditation.tsx`
- **Type**: Sessions guidées
- **Durée**: 10-40 minutes
- **Backend**: ❌ localStorage (`meditation_xp`, `meditation_level`, `meditation_completed`, `meditation_total_time`)
- **Sessions**: 9 méditations différentes
- **Route**: `/meditation`

### 9. 🫁 **Breathwork**
- **Fichier**: `src/pages/Breathwork.tsx`
- **Type**: Techniques respiratoires
- **Durée**: 5-20 minutes
- **Backend**: ❌ localStorage (`breathwork_xp`, `breathwork_level`, `breathwork_completed`)
- **Patterns**: 6 techniques (Phénix, Lotus, Cube, Glacier, etc.)
- **Route**: `/breathwork`

### 10. 🏛️ **VR Breath**
- **Fichier**: `src/pages/VRBreath.tsx`
- **Type**: Respiration immersive
- **Durée**: 5-15 minutes
- **Backend**: ❌ localStorage (`vr_breath_progress`)
- **Features**: 3 environnements (Temple, Forêt, Cosmos)
- **Route**: `/vr-breath`

---

## 🎮 MODULES GAMIFIÉS

### 11. 🎯 **Ambition Arcade**
- **Fichier**: `src/pages/AmbitionArcade.tsx`
- **Type**: Objectifs gamifiés
- **Durée**: Variable
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Quêtes, missions, XP
- **Route**: `/ambition-arcade`

### 12. 💪 **Boss Grit**
- **Fichier**: `src/pages/BossGrit.tsx`
- **Type**: Défis de résilience
- **Durée**: 10-30 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 3 difficultés, trophées
- **Route**: `/boss-grit`

### 13. 🫧 **Bubble Beat**
- **Fichier**: `src/pages/BubbleBeat.tsx`
- **Type**: Rythme et émotions
- **Durée**: 3-5 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Gameplay musical, high scores
- **Route**: `/bubble-beat`

### 14. 🏆 **Leaderboard**
- **Fichier**: `src/pages/Leaderboard.tsx`
- **Type**: Classements
- **Durée**: N/A
- **Backend**: Supabase (gamification tables)
- **Route**: `/leaderboard`

---

## 🌌 MODULES IMMERSIFS

### 15. 🌌 **VR Galaxy**
- **Fichier**: `src/pages/VRGalaxy.tsx`
- **Type**: Exploration spatiale
- **Durée**: 10-20 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: Nébuleuses, constellations
- **Route**: `/vr-galaxy`

### 16. 📖 **Story Synth**
- **Fichier**: `src/pages/StorySynth.tsx`
- **Type**: Histoires interactives
- **Durée**: 10-15 minutes
- **Backend**: `useStorySession` (pas de XP/niveau)
- **Features**: Choix narratifs, fragments
- **Route**: `/story-synth`

### 17. 🪞 **AR Filters**
- **Fichier**: `src/pages/ARFilters.tsx`
- **Type**: Miroirs émotionnels
- **Durée**: 3-5 minutes
- **Backend**: ❌ localStorage (`ar_filters_progress`)
- **Features**: 8 filtres, rareté
- **Route**: `/ar-filters`

### 18. 🎨 **Screen Silk (Pause Active)**
- **Fichier**: `src/pages/ScreenSilk.tsx`
- **Type**: Micro-pauses productives
- **Durée**: 2-5 minutes
- **Backend**: ✅ Intégré (`useModuleProgress`)
- **Features**: 6 types de soie, textures
- **Route**: `/screen-silk`

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

---

## 📊 MODULES SUIVI & ANALYTICS

### 20. 📊 **Weekly Bars**
- **Fichier**: `src/pages/WeeklyBars.tsx`
- **Type**: Synthèse hebdomadaire
- **Durée**: N/A (consultation)
- **Backend**: Supabase (mood_entries, assessments)
- **Features**: WHO-5, graphiques
- **Route**: `/weekly-bars`

### 21. 📈 **Activity**
- **Fichier**: `src/pages/Activity.tsx`
- **Type**: Vue d'activité globale
- **Durée**: N/A
- **Backend**: `useWeekly` hook
- **Route**: `/activity`

### 22. 📉 **Analytics**
- **Fichier**: `src/pages/Analytics.tsx`
- **Type**: Analytics détaillées
- **Durée**: N/A
- **Backend**: `useAnalytics` hook
- **Route**: `/analytics`

### 23. 🏠 **Dashboard**
- **Fichier**: `src/pages/Dashboard.tsx`
- **Type**: Vue d'ensemble personnalisée
- **Durée**: N/A
- **Backend**: Agrégation de données
- **Features**: WHO-5, mood trends, recommandations
- **Route**: `/dashboard`

---

## 🤝 MODULES SOCIAUX & SUPPORT

### 24. 👥 **Community**
- **Fichier**: `src/pages/Community.tsx`
- **Type**: Réseau social interne
- **Durée**: Variable
- **Backend**: Supabase (social_feed, support_groups)
- **Features**: Posts, groupes, likes
- **Route**: `/community`

### 25. 🤝 **Social Hub**
- **Fichier**: `src/pages/SocialHub.tsx`
- **Type**: Hub social
- **Durée**: Variable
- **Backend**: Social features
- **Route**: `/social`

### 26. 💬 **Coach IA**
- **Fichier**: `src/pages/Coach.tsx`
- **Type**: Chat IA thérapeutique
- **Durée**: Variable
- **Backend**: Edge function `coach-ai-assist`
- **Features**: Conversation, recommandations
- **Route**: `/coach`

### 27. 🤖 **AI Chat**
- **Fichier**: `src/pages/AIChat.tsx`
- **Type**: Chat IA généraliste
- **Durée**: Variable
- **Backend**: Edge function `ai-chat`
- **Route**: `/ai-chat`

### 28. 💬 **Therapy**
- **Fichier**: `src/pages/Therapy.tsx`
- **Type**: Module thérapie
- **Durée**: Variable
- **Backend**: Therapy sessions
- **Route**: `/therapy`

### 29. ❓ **Help & Support**
- **Fichier**: `src/pages/Help.tsx`
- **Type**: Centre d'aide
- **Durée**: N/A
- **Features**: FAQ, contact
- **Route**: `/help`

---

## 🏢 MODULES B2B / ENTREPRISE

### 30. 🏢 **B2B Landing**
- **Fichier**: `src/pages/B2BLanding.tsx`
- **Type**: Page d'accueil B2B
- **Route**: `/b2b`

### 31. 🏢 **B2B Portal**
- **Fichier**: `src/pages/B2BPortal.tsx`
- **Type**: Portail entreprise
- **Route**: `/b2b-portal`

### 32. 🏢 **B2B Enterprise**
- **Fichier**: `src/pages/B2BEnterprise.tsx`
- **Type**: Features entreprise
- **Route**: `/enterprise`

### 33. 👔 **RH Dashboard**
- **Fichier**: `src/pages/RHDashboard.tsx`
- **Type**: Tableau de bord RH
- **Backend**: Team aggregation
- **Route**: `/rh`

### 34. 🏢 **Organizations**
- **Fichier**: `src/pages/Organizations.tsx`
- **Type**: Gestion organisations
- **Backend**: Supabase (organizations, org_memberships)
- **Route**: `/organizations`

---

## ⚙️ MODULES SYSTÈME

### 35. 🏠 **Index / Home**
- **Fichier**: `src/pages/Index.tsx`
- **Type**: Page d'accueil
- **Route**: `/`

### 36. 🔐 **Auth**
- **Fichier**: `src/pages/Auth.tsx`
- **Type**: Authentification
- **Route**: `/auth`

### 37. 🎓 **Onboarding**
- **Fichier**: `src/pages/Onboarding.tsx`
- **Type**: Parcours d'accueil
- **Route**: `/onboarding`

### 38. ⚙️ **Settings**
- **Fichier**: `src/pages/Settings.tsx`
- **Type**: Paramètres utilisateur
- **Features**: Profil, notifications, préférences
- **Route**: `/settings`

### 39. 🔒 **Security Settings**
- **Fichier**: `src/pages/SecuritySettings.tsx`
- **Type**: Paramètres de sécurité
- **Features**: 2FA, sessions, encryption
- **Route**: `/security`

### 40. 📦 **Data Export**
- **Fichier**: `src/pages/DataExport.tsx`
- **Type**: Export RGPD
- **Features**: PDF, JSON, CSV
- **Route**: `/data-export`

### 41. 💰 **Pricing**
- **Fichier**: `src/pages/Pricing.tsx`
- **Type**: Plans et tarifs
- **Backend**: Stripe integration
- **Route**: `/pricing`

### 42. 📄 **Terms**
- **Fichier**: `src/pages/Terms.tsx`
- **Type**: CGU
- **Route**: `/terms`

### 43. 🔒 **Privacy**
- **Fichier**: `src/pages/Privacy.tsx`
- **Type**: Politique de confidentialité
- **Route**: `/privacy`

### 44. 🔗 **Accept Invitation**
- **Fichier**: `src/pages/AcceptInvitation.tsx`
- **Type**: Acceptation invitations
- **Route**: `/accept-invitation`

### 45. 📝 **Journal New**
- **Fichier**: `src/pages/JournalNew.tsx`
- **Type**: Alternative journal (v2)
- **Route**: `/journal-new`

### 46. 🛠️ **Admin Dashboard**
- **Fichier**: `src/pages/AdminDashboard.tsx`
- **Type**: Administration système
- **Route**: `/admin`

### 47. ❌ **Not Found**
- **Fichier**: `src/pages/NotFound.tsx`
- **Type**: Erreur 404
- **Route**: `*`

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

| État | Nombre | % |
|------|--------|---|
| ✅ Backend intégré (`useModuleProgress`) | 5 | 11% |
| ❌ localStorage | 8 | 17% |
| 🔄 Autre backend (hooks spécifiques) | 10 | 21% |
| 📄 Pages statiques/système | 24 | 51% |
| **TOTAL** | **47** | **100%** |

---

## 🎯 MODULES PRIORITAIRES POUR MIGRATION

### Ordre de Priorité (Usage Estimé)

1. 🥇 **Journal** - Quotidien, forte valeur
2. 🥈 **Méditation** - Régulier, engagement élevé
3. 🥉 **Breathwork** - Régulier, thérapeutique
4. 4️⃣ **Mood Mixer** - Créatif, fun
5. 5️⃣ **AR Filters** - Social, engagement
6. 6️⃣ **VR Breath** - Immersif, premium
7. 7️⃣ **Flash Glow** - Critique, intervention
8. 8️⃣ **Emotional Scan** - Assessment, data

---

## 🔗 Routes Principales

```typescript
// Core features
/nyvee
/journal
/emotional-scan
/hume-emotional-scan

// Musical
/music-therapy
/music-library
/mood-mixer

// Meditation & Breathing
/meditation
/breathwork
/vr-breath

// Gamification
/ambition-arcade
/boss-grit
/bubble-beat
/leaderboard

// Immersive
/vr-galaxy
/story-synth
/ar-filters
/screen-silk

// Quick
/flash-glow

// Analytics
/weekly-bars
/activity
/analytics
/dashboard

// Social
/community
/social
/coach
/ai-chat
/therapy
/help

// B2B
/b2b
/b2b-portal
/enterprise
/rh
/organizations

// System
/
/auth
/onboarding
/settings
/security
/data-export
/pricing
/terms
/privacy
/admin
```

---

**Dernière mise à jour**: 2025-01-XX  
**Total de modules**: 47  
**Modules actifs**: ~25  
**Modules système**: ~22
